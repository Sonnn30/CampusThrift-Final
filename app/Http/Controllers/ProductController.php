<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Review;
use Plank\Mediable\Facades\MediaUploader;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ProductController extends Controller
{
     use AuthorizesRequests;
    // Tampilkan semua product milik user
    public function index(Request $request)
    {
        // Allow optional ?user_id= to view products for a specific seller.
        // If not provided, default to the authenticated seller's products.
        $sellerId = (int) $request->query('user_id') ?: Auth::id();

        $products = Product::with('media')
            ->where('user_id', $sellerId)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'product_name' => $product->product_name,
                    'product_price' => $product->product_price,
                    'description' => $product->description,
                    'category' => is_string($product->category) ? strtolower($product->category) : ($product->category ?? null),
                    'images' => $product->getMedia('product_images')->map(function($m) {
                        // Get URL based on disk
                        $disk = $m->disk;
                        if ($disk === 'public') {
                            // For public storage, use getUrl() and ensure it's absolute
                            $url = $m->getUrl();
                            if (!filter_var($url, FILTER_VALIDATE_URL)) {
                                // Ensure /storage prefix for public storage
                                if (!str_starts_with($url, '/storage')) {
                                    $url = '/storage/' . ltrim($url, '/');
                                }
                                return url($url);
                            }
                            return $url;
                        } else {
                            // For S3 or other disks, use getUrl() directly
                            $url = $m->getUrl();
                            if (!filter_var($url, FILTER_VALIDATE_URL)) {
                                return url($url);
                            }
                            return $url;
                        }
                    })->filter()->values()->all(),
                    'user_id' => $product->user_id,
                    'seller_id' => $product->user_id,
                ];
            });

        // Fetch seller info
        $seller = User::find($sellerId);
        if (!$seller) {
            $locale = $request->route('locale') ?? 'id';
            return redirect()->route('home', ['locale' => $locale])->with('error', 'Seller not found');
        }

        $sellerName = $seller->name ?? 'Unknown Seller';
        $itemsCount = Product::where('user_id', $sellerId)->count();
        $sellerRating = round((float) Review::where('reviewee_id', $sellerId)->avg('rating'), 1);
        $sellerJoined = $seller->created_at?->format('d M Y') ?? '';

        return Inertia::render('SellerProductPage', [
            'products' => $products,
            'role' => Auth::user()?->role ?? 'Guest',
            'user' => Auth::user(),
            'seller' => [
                'id' => $sellerId, // Always set - this is the shop owner's ID
                'name' => $sellerName,
                'itemsCount' => $itemsCount,
                'rating' => $sellerRating,
                'joinedAt' => $sellerJoined,
                'status' => 'Online',
            ],
        ]);
    }
    public function publicCatalog()
{
    $products = Product::with('media', 'user', 'appointments')
        ->get()
        ->map(function ($product) {
            // Hitung penjualan: jumlah appointment dengan status 'completed'
            $salesCount = $product->appointments->where('status', 'completed')->count();
            return [
                'id' => $product->id,
                'product_name' => $product->product_name,
                'product_price' => $product->product_price,
                'description' => $product->description,
                'category' => is_string($product->category) ? strtolower($product->category) : ($product->category ?? null),
                'seller_name' => $product->user->name ?? 'Unknown Seller',
                'images' => $product->getMedia('product_images')->map(function($m) {
                    // Get URL based on disk
                    $disk = $m->disk;
                    $url = $m->getUrl();

                    // If URL is not absolute, make it absolute
                    if (!filter_var($url, FILTER_VALIDATE_URL)) {
                        // For public storage, prepend /storage if needed
                        if ($disk === 'public' && !str_starts_with($url, '/storage')) {
                            $url = '/storage/' . ltrim($url, '/');
                        }
                        return url($url);
                    }
                    return $url;
                })->filter()->values()->all(),
                'sales_count' => $salesCount,
                'user_id' => $product->user_id,
                'seller_id' => $product->user_id,
            ];
        });

    return Inertia::render('ProductCatalog', [
        'products' => $products,
        'role' => Auth::user()->role ?? 'Guest',
    ]);
}



    // Halaman tambah product
    public function create()
    {
        return Inertia::render('SellerProductAdd', [
            'role' => 'Seller',
        ]);
    }

public function edit($locale, $product)
{
    $product = Product::with('media')->findOrFail($product);

    // CRITICAL: Authorization check - Only allow product owner to edit
    $currentUserId = Auth::id();
    if (!$currentUserId) {
        Log::warning('Unauthenticated product edit attempt', [
            'product_id' => $product->id,
            'ip' => request()->ip(),
        ]);
        $locale = request()->route('locale') ?? 'id';
        return redirect()->route('home', ['locale' => $locale])->with('error', 'You must be logged in to edit products');
    }

    if ($product->user_id !== $currentUserId) {
        Log::warning('Unauthorized product edit attempt', [
            'product_id' => $product->id,
            'product_owner_id' => $product->user_id,
            'current_user_id' => $currentUserId,
            'ip' => request()->ip(),
        ]);
        $locale = request()->route('locale') ?? 'id';
        return redirect()->route('home', ['locale' => $locale])->with('error', 'You can only edit your own products');
    }

    return Inertia::render('SellerProductEdit', [
        'role' => 'Seller',
        'product' => [
            'id' => $product->id,
            'product_name' => $product->product_name,
            'product_price' => $product->product_price,
            'description' => $product->description,
            'shipping_method' => is_array($product->shipping_method)
                ? $product->shipping_method
                : json_decode($product->shipping_method ?? '[]', true),
            'location' => $product->location,
            'category' => $product->category,
            'images' => $product->getMedia('product_images')->map(function($m) {
                // Get URL based on disk
                $disk = $m->disk;
                $url = $m->getUrl();

                // If URL is not absolute, make it absolute
                if (!filter_var($url, FILTER_VALIDATE_URL)) {
                    // For public storage, prepend /storage if needed
                    if ($disk === 'public' && !str_starts_with($url, '/storage')) {
                        $url = '/storage/' . ltrim($url, '/');
                    }
                    return url($url);
                }
                return $url;
            })->filter()->values()->all(),
        ],
    ]);
}


    // Simpan product baru
    public function store(Request $request)
{
    try {
        Log::info('Product store request received', [
            'has_images' => $request->hasFile('images'),
            'image_count' => $request->hasFile('images') ? count($request->file('images')) : 0,
            'product_name' => $request->product_name,
            'all_data' => $request->except(['images']),
        ]);

        // Validate non-file fields first
        $validated = $request->validate([
            'product_name'    => 'required|string|max:255',
            'product_price'   => 'required|numeric|min:1',
            'description'     => 'required|string',
            'shipping_method' => 'required|array|min:1',
            'location'        => 'required|string',
            'category'        => 'required|string',
        ]);

        // Validate images separately
        if (!$request->hasFile('images') || count($request->file('images')) === 0) {
            return back()->withErrors(['images' => 'Please upload at least one image.'])->withInput();
        }

        $request->validate([
            'images.*' => 'required|image|mimes:jpeg,jpg,png,gif,webp|max:10240'
        ]);

        Log::info('Validation passed', [
            'product_name' => $validated['product_name'],
            'images_count' => count($request->file('images'))
        ]);

        $product = Product::create([
            'user_id'         => Auth::id(),
            'product_name'    => $request->product_name,
            'product_price'   => $request->product_price,
            'description'     => $request->description,
            'shipping_method' => $request->shipping_method,
            'location'        => $request->location,
            'category'        => $request->category,
        ]);

        Log::info('Product created', ['product_id' => $product->id]);

        // Upload dan attach image
        $uploadedCount = 0;
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                if ($file->isValid()) {
                    try {
                        // Try S3 first, fallback to public if fails
                        $media = MediaUploader::fromSource($file)
                            ->toDisk('s3')              // simpan di AWS S3
                            ->toDirectory('products')   // folder di bucket
                            ->upload();
                        Log::info('Image uploaded to S3', ['media_id' => $media->id]);
                    } catch (\Exception $e) {
                        // Fallback to public storage if S3 fails
                        Log::warning('S3 upload failed, using public storage: ' . $e->getMessage());
                        try {
                            $media = MediaUploader::fromSource($file)
                                ->toDisk('public')          // fallback ke local storage
                                ->toDirectory('products')   // folder di storage/app/public
                                ->upload();
                            Log::info('Image uploaded to public storage', ['media_id' => $media->id]);
                        } catch (\Exception $e2) {
                            Log::error('Image upload failed completely', ['error' => $e2->getMessage()]);
                            continue; // Skip this file and continue with next
                        }
                    }

                    $product->attachMedia($media, 'product_images');
                    $uploadedCount++;
                } else {
                    Log::warning('Invalid file detected', ['file_name' => $file->getClientOriginalName()]);
                }
            }
        }

        Log::info('Product creation completed', [
            'product_id' => $product->id,
            'images_uploaded' => $uploadedCount,
        ]);

        $locale = $request->route('locale') ?? 'id';

        // Use Inertia redirect for proper SPA navigation
        return redirect()->route('SellerProduct', ['locale' => $locale])
            ->with('success', 'Product created successfully!');

    } catch (\Illuminate\Validation\ValidationException $e) {
        Log::error('Validation error:', $e->errors());
        return back()->withErrors($e->errors())->withInput();
    } catch (\Exception $e) {
        Log::error('Error creating product:', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        return back()->with('error', 'Failed to create product: ' . $e->getMessage())->withInput();
    }
}

// Update product
public function update(Request $request, $locale, $product)
{
    $product = Product::with('media')->findOrFail($product);

    // CRITICAL: Authorization check - Only allow product owner to update
    $currentUserId = Auth::id();
    if (!$currentUserId) {
        Log::warning('Unauthenticated product update attempt', [
            'product_id' => $product->id,
            'ip' => request()->ip(),
        ]);
        $locale = request()->route('locale') ?? 'id';
        return redirect()->route('home', ['locale' => $locale])->with('error', 'You must be logged in to update products');
    }

    if ($product->user_id !== $currentUserId) {
        Log::warning('Unauthorized product update attempt', [
            'product_id' => $product->id,
            'product_owner_id' => $product->user_id,
            'current_user_id' => $currentUserId,
            'ip' => request()->ip(),
        ]);
        $locale = request()->route('locale') ?? 'id';
        return redirect()->route('home', ['locale' => $locale])->with('error', 'You can only update your own products');
    }

    $request->validate([
        'product_name'    => 'required|string|max:255',
        'product_price'   => 'required|numeric',
        'description'     => 'nullable|string',
        'shipping_method' => 'nullable|array',
        'location'        => 'nullable|string',
        'category'        => 'nullable|string',
        'images.*'        => 'nullable|image|max:10240',
    ]);

    $shipping = $request->shipping_method;
    if (!is_array($shipping)) {
        $shipping = json_decode($shipping, true) ?? [];
    }

    $product->update([
        'product_name'    => $request->product_name,
        'product_price'   => $request->product_price,
        'description'     => $request->description,
        'shipping_method' => $shipping,
        'location'        => $request->location,
        'category'        => $request->category,
    ]);

    // Hapus gambar lama yang dihapus user
    if ($request->filled('removed_images')) {
        foreach ($request->removed_images as $url) {
            $media = $product->getMedia('product_images')->first(function ($m) use ($url) {
                return $m->getUrl() === $url;
            });
            if ($media) {
                $media->delete();
            }
        }
    }

    // Upload gambar baru
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $file) {
            if ($file->isValid()) {
                try {
                    // Try S3 first, fallback to public if fails
                    $media = MediaUploader::fromSource($file)
                        ->toDisk('s3')
                        ->toDirectory('products')
                        ->upload();
                } catch (\Exception $e) {
                    // Fallback to public storage if S3 fails
                    Log::warning('S3 upload failed, using public storage: ' . $e->getMessage());
                    $media = MediaUploader::fromSource($file)
                        ->toDisk('public')
                        ->toDirectory('products')
                        ->upload();
                }

                $product->attachMedia($media, 'product_images');
            }
        }
    }

    $locale = $request->route('locale') ?? 'id';
    return redirect()->route('SellerProductDetail', ['locale' => $locale, 'id' => $product->id])
        ->with('success', 'Product updated successfully!');
}


    // Show single product
// In ProductController.php inside the show() method

public function show(Request $request)
{
    $productId = $request->route('id');
    Log::info('Product detail requested', ['id' => $productId, 'url' => $request->fullUrl()]);
    try {
        $product = Product::with('media', 'user')->findOrFail($productId);
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        Log::warning('Product not found for detail page', ['id' => $productId]);
        $locale = $request->route('locale') ?? 'id';
        return redirect()->route('home', ['locale' => $locale])->with('error', 'Product not found');
    }

    // Get images or set a default
    $images = $product->getMedia('product_images');
    $imageUrls = $images->isNotEmpty()
        ? $images->map(function($m) {
            // Get URL based on disk
            $disk = $m->disk;
            $url = $m->getUrl();

            // If URL is not absolute, make it absolute
            if (!filter_var($url, FILTER_VALIDATE_URL)) {
                // For public storage, prepend /storage if needed
                if ($disk === 'public' && !str_starts_with($url, '/storage')) {
                    $url = '/storage/' . ltrim($url, '/');
                }
                return url($url);
            }
            return $url;
        })->filter()->values()->all()
        : [asset('placeholder-2.png')];

    // Fetch other products from the same seller (exclude current product)
    $otherProducts = Product::with('media')
        ->where('user_id', $product->user_id)
        ->where('id', '!=', $product->id)
        ->latest()
        ->take(8)
        ->get()
        ->map(function ($p) {
            return [
                'id' => $p->id,
                'product_name' => $p->product_name,
                'product_price' => $p->product_price,
                'images' => $p->getMedia('product_images')->map(function($m) {
                    // Get URL based on disk
                    $disk = $m->disk;
                    $url = $m->getUrl();

                    // If URL is not absolute, make it absolute
                    if (!filter_var($url, FILTER_VALIDATE_URL)) {
                        // For public storage, prepend /storage if needed
                        if ($disk === 'public' && !str_starts_with($url, '/storage')) {
                            $url = '/storage/' . ltrim($url, '/');
                        }
                        return url($url);
                    }
                    return $url;
                })->filter()->values()->all(),
            ];
        });

    // Compute seller rating (average) and total number of reviews
    $sellerId = $product->user_id;
    $ratingAvg = round((float) Review::where('reviewee_id', $sellerId)->avg('rating'), 1);
    $ratingCount = (int) Review::where('reviewee_id', $sellerId)->count('id');

    // Ambil semua review terkait produk ini melalui relasi appointment
    // (pastikan kita menampilkan review yang terkait dengan appointment dari produk ini)
    $reviews = Review::whereHas('appointment', function ($q) use ($product) {
            $q->where('product_id', $product->id);
        })
        ->with('reviewer')
        ->latest()
        ->get()
        ->map(function ($rev) {
            return [
                'buyer' => $rev->reviewer->name ?? 'Unknown',
                'date' => $rev->created_at ? $rev->created_at->format('d M Y') : '',
                'text' => $rev->comment ?? '',
                'rating' => $rev->rating ?? 0,
            ];
        });

    return Inertia::render('ProductDetail', [
        'role' => Auth::user()->role ?? 'Guest',
        'product' => [
            'id' => $product->id,
            'name' => $product->product_name,
            'price' => $product->product_price,
            'description' => explode("\n", $product->description ?? ''),
            'images' => $imageUrls,
            'seller_id' => $product->user_id,
            'shipping' => [
                'method' => is_array($product->shipping_method)
                    ? $product->shipping_method
                    : explode(',', $product->shipping_method ?? ''),
                'seller' => $product->user->name ?? 'Unknown Seller',
                'location' => $product->location ?? 'Unknown Location',
                'reviews' => $ratingCount,
                'ratings' => $ratingAvg,
            ],
            'reviews' => $reviews,
        ],
        'otherProducts' => $otherProducts,
    ]);
}


    // Hapus product
    public function destroy(Request $request, $locale, $product)
    {
        $product = Product::findOrFail($product);

        // CRITICAL: Authorization check - Only allow product owner to delete
        $currentUserId = Auth::id();
        if (!$currentUserId) {
            Log::warning('Unauthenticated product delete attempt', [
                'product_id' => $product->id,
                'ip' => request()->ip(),
            ]);
            $locale = request()->route('locale') ?? 'id';
            return redirect()->route('home', ['locale' => $locale])->with('error', 'You must be logged in to delete products');
        }

        if ($product->user_id !== $currentUserId) {
            Log::warning('Unauthorized product delete attempt', [
                'product_id' => $product->id,
                'product_owner_id' => $product->user_id,
                'current_user_id' => $currentUserId,
                'ip' => request()->ip(),
            ]);
            $locale = request()->route('locale') ?? 'id';
            return redirect()->route('home', ['locale' => $locale])->with('error', 'You can only delete your own products');
        }

        $product->delete();
        $locale = $request->route('locale') ?? 'id';
        return redirect()->route('SellerProduct', ['locale' => $locale])->with('success', 'Product deleted successfully!');
    }
}
