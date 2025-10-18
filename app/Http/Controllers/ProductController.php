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
                    'images' => $product->getMedia('product_images')->map(fn($m) => $m->getUrl()),
                    'user_id' => $product->user_id,
                    'seller_id' => $product->user_id,
                ];
            });

        // Fetch seller info
        $seller = User::find($sellerId);
        $sellerName = $seller?->name ?? 'Unknown Seller';
        $itemsCount = Product::where('user_id', $sellerId)->count();
        $sellerRating = round((float) Review::where('reviewee_id', $sellerId)->avg('rating'), 1);
        $sellerJoined = $seller?->created_at?->format('d M Y') ?? '';

        return Inertia::render('SellerProductPage', [
            'products' => $products,
            'role' => 'Seller',
            'seller' => [
                'id' => $sellerId,
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
                'images' => $product->getMedia('product_images')->map(fn($m) => $m->getUrl()),
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

public function edit(Product $product)
{
    // $this->authorize('update', $product); opsional, jika pakai policy

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
            'images' => $product->getMedia('product_images')->map(fn($m) => $m->getUrl()),
        ],
    ]);
}


    // Simpan product baru
    public function store(Request $request)
{
    try {
        // dd($request->all());
        $request->validate([
            'product_name'    => 'required|string|max:255',
            'product_price'   => 'required|numeric|min:1',
            'description'     => 'required|string',
            'shipping_method' => 'required|array|min:1',
            'location'        => 'required|string',
            'category'        => 'required|string',
            'images.*' => 'required|image|max:10240'
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

    // Upload dan attach image
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $file) {
            if ($file->isValid()) {
                try {
                    // Try S3 first, fallback to public if fails
                    $media = MediaUploader::fromSource($file)
                        ->toDisk('s3')              // simpan di AWS S3
                        ->toDirectory('products')   // folder di bucket
                        ->upload();
                } catch (\Exception $e) {
                    // Fallback to public storage if S3 fails
                    Log::warning('S3 upload failed, using public storage: ' . $e->getMessage());
                    $media = MediaUploader::fromSource($file)
                        ->toDisk('public')          // fallback ke local storage
                        ->toDirectory('products')   // folder di storage/app/public
                        ->upload();
                }

                $product->attachMedia($media, 'product_images');
            }
        }
    }
        Log::info('Files received:', [
        'has_images' => $request->hasFile('images'),
        'image_count' => $request->hasFile('images') ? count($request->file('images')) : 0,
    ]);

        return to_route('SellerProduct')->with('success', 'Product created successfully!');
        
    } catch (\Illuminate\Validation\ValidationException $e) {
        Log::error('Validation error:', $e->errors());
        return back()->withErrors($e->errors())->withInput();
    } catch (\Exception $e) {
        Log::error('Error creating product:', ['error' => $e->getMessage()]);
        return back()->with('error', 'Failed to create product. Please try again.')->withInput();
    }
}

// Update product
public function update(Request $request, Product $product)
{
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

    // 1️⃣ Hapus gambar lama yang dihapus user
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

    // 2️⃣ Upload gambar baru
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

    return to_route('SellerProductDetail', ['id' => $product->id])
        ->with('success', 'Product updated successfully!');
}


    // Show single product
// In ProductController.php inside the show() method

public function show($id)
{
    $product = Product::with('media', 'user')->findOrFail($id);

    // Get images or set a default
    $images = $product->getMedia('product_images');
    $imageUrls = $images->isNotEmpty()
        ? $images->map(fn($m) => $m->getUrl())
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
                'images' => $p->getMedia('product_images')->map(fn($m) => $m->getUrl()),
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
    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('SellerProduct')->with('success', 'Product deleted successfully!');
    }
}
