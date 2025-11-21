<?php

// use Illuminate\Support\Facades\Route;
// use Inertia\Inertia;
// use App\Http\Controllers\AuthManager;
// use App\Http\Controllers\ProductController;
// use App\Http\Controllers\ProfileController;
// use App\Http\Controllers\CODController;
// use App\Http\Controllers\MyScheduleController;
// use App\Http\Controllers\TransactionDetailController;
// use App\Http\Controllers\ReviewController;
// use App\Http\Controllers\ChatController;

// Route::get('/', [AuthManager::class, 'UserDashboard'])->name('home');


// require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';

// Route::get('/SignUp',[AuthManager::class, 'SignUp'])->name('SignUp');
// Route::post('/SignUp', [AuthManager::class, 'SignUpPost'])->name('SignUp.post');

// Route::get('/login', [AuthManager::class, 'login'])->name('login');
// Route::post('/login', [AuthManager::class, 'loginPost'])->name('login.post');

// Route::middleware(['auth'])->group(function () {
//     Route::get('/Buyer', [AuthManager::class, 'UserDashboard'])->name('BuyerHome');
//     Route::get('/Seller', [AuthManager::class, 'UserDashboard'])->name('SellerHome');
// });

// Route::post('/logout', [AuthManager::class, 'logout'])->name('logout');


// Route::prefix('/COD')->group(function(){
//     Route::get('/date', function(){
//         return Inertia::render('CODDate');
//     })->name('CODDate');
//     Route::get('/time', function(){
//         return Inertia::render('CODTime');
//     })->name('CODTime');
//     Route::get('/location', function(){
//         return Inertia::render("CODLocation");
//     })->name("CODLocation");
// });

// Route::prefix('/COD')->middleware(['auth'])->group(function(){
//     Route::get('/date', [CODController::class, 'showDate'])->name('CODDate');
//     Route::post('/date', [CODController::class, 'storeDate'])->name('CODDate.store');
//     Route::get('/time', [CODController::class, 'showTime'])->name('CODTime');
//     Route::post('/time', [CODController::class, 'storeTime'])->name('CODTime.store');
//     Route::get('/location', [CODController::class, 'showLocation'])->name('CODLocation');
//     Route::get('/location-recommendation', [CODController::class, 'showLocationRecommendation'])->name('CODLocationRecommendation');
//     Route::post('/location', [CODController::class, 'storeLocation'])->name('CODLocation.store');
//     Route::get('/appointment/{appointment}', [CODController::class, 'show'])->name('CODAppointment.show');
//     Route::patch('/appointment/{appointment}/status', [CODController::class, 'updateStatus'])->name('CODAppointment.updateStatus');
// });

// Route::prefix('/Seller')->middleware(['auth', 'seller'])->group(function(){
//     Route::get('/MySchedule', [MyScheduleController::class, 'index'])->name('SellerMySchedule');
//     Route::patch('/appointment/{appointment}/status', [MyScheduleController::class, 'updateStatus'])->name('SellerAppointment.updateStatus');
//     Route::get('/appointment/{appointment}', [MyScheduleController::class, 'show'])->name('SellerAppointment.show');

//     Route::get('/TransactionDetail', [TransactionDetailController::class, 'index'])->name('SellerTransactionDetail');
//     Route::post('/TransactionDetail/deal', [TransactionDetailController::class, 'dealSeller'])->name('SellerTransactionDeal');

//     Route::get('/chatlist', [ChatController::class, 'index'])->name('SellerChatList');
//     Route::get('/chat/{recipientId}', [ChatController::class, 'show'])->name('SellerChat');

//     Route::get('/review', [ReviewController::class, 'show'])->name('SellerReview');
//     Route::post('/review', [ReviewController::class, 'store'])->name('SellerReview.store');

//     Route::get('/ConfirmPage', [TransactionDetailController::class, 'confirm'])
//         ->name('ConfirmPage');

//     });

// Route::get("/UploadEvidence", [App\Http\Controllers\EvidenceController::class, 'show'])->name("UploadEvidence");
// Route::post("/UploadEvidence", [App\Http\Controllers\EvidenceController::class, 'store'])->name("UploadEvidence.store");


// Route::prefix('/Seller')->middleware(['auth'])->group(function() {
//     Route::get('/product', [ProductController::class, 'index'])->name('SellerProduct');
//     Route::get('/product/add', [ProductController::class, 'create'])->name('SellerProductAdd');
//     Route::post('/product/add', [ProductController::class, 'store'])->name('SellerProductStore');
//     Route::get('/product/edit/{product}', [ProductController::class, 'edit'])->name('SellerProductEdit');
//     Route::put('/ProductDetail/{product}', [ProductController::class, 'update'])->name('SellerProductUpdate');
//     Route::delete('/ProductDetail/{product}', [ProductController::class, 'destroy'])->name('SellerProductDelete');
// });



// Route::get('/Seller/ProductDetail/{id}', [ProductController::class, 'show'])
//     ->name('SellerProductDetail');

// Route::get('/Buyer/ProductDetail/{id}', [ProductController::class, 'show'])
//     ->name('BuyerProductDetail');


// Route::middleware(['auth'])->group(function () {
//     Route::get('/Profile/{role}', [ProfileController::class, 'show']);
//     Route::post('/Profile/{role}', [ProfileController::class, 'storeOrUpdate']);
//     Route::delete('/Profile/{role}', [ProfileController::class, 'destroy']);
//     Route::post('/Profile/{role}/report', [ProfileController::class, 'submitReport'])->name('profile.submitReport');
// });



// Route::prefix('/Buyer')->middleware(['auth', 'buyer'])->group(function(){
//     Route::get('/product', function(){
//         return Inertia::render('SellerProductPage', [
//             "role" => "Buyer"
//         ]);
//     })->name('BuyerProduct');
//     Route::get('/MySchedule', [MyScheduleController::class, 'index'])->name('BuyerMySchedule');
//     Route::patch('/appointment/{appointment}/cancel', [MyScheduleController::class, 'cancelAppointment'])->name('BuyerAppointment.cancel');
//     Route::get('/appointment/{appointment}', [MyScheduleController::class, 'show'])->name('BuyerAppointment.show');

//     Route::get('/TransactionDetail', [TransactionDetailController::class, 'index'])->name('BuyerTransactionDetail');
//     Route::post('/TransactionDetail/deal', [TransactionDetailController::class, 'dealBuyer'])->name('BuyerTransactionDeal');
//     Route::get('/chatlist', [ChatController::class, 'index'])->name('BuyerChatList');
//     Route::get('/chat/{recipientId}', [ChatController::class, 'show'])->name("BuyerChat");
//     Route::get('/review', [ReviewController::class, 'show'])->name('BuyerReview');
//     Route::post('/review', [ReviewController::class, 'store'])->name('BuyerReview.store');
// });





// Route::get('/Buyer' ,function(){
//     return Inertia::render('ProductCatalog');
// })-> name('home');

// Route::get('/Seller' ,function(){
//     return Inertia::render('ProductCatalog');
// })-> name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });


use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\App;
use Inertia\Inertia;
use App\Http\Middleware\SetLocale; // Pastikan middleware ini sudah diimpor
use App\Http\Controllers\AuthManager;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CODController;
use App\Http\Controllers\MyScheduleController;
use App\Http\Controllers\TransactionDetailController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\EvidenceController; // Tambahkan jika belum ada (dari problem sebelumnya)


/*
|--------------------------------------------------------------------------
| Root & Default Redirects
|--------------------------------------------------------------------------
| Mengarahkan URL tanpa prefix bahasa ke locale default (/id)
*/
Route::get('/', function () {
    return redirect('/id');
})->name('root');

Route::get('/login', function () {
    return redirect('/id/login');
});

Route::post('/login', function () {
    return redirect('/id/login');
});

Route::get('/SignUp', function () {
    return redirect('/id/SignUp');
});

// require __DIR__.'/settings.php'; // Hapus/Pindahkan jika file ini berisi route
// require __DIR__.'/auth.php';     // Hapus/Pindahkan jika file ini berisi route

/*
|--------------------------------------------------------------------------
| Localized Web Routes
|--------------------------------------------------------------------------
| Semua route utama dibungkus di dalam prefix /{locale}
*/
Route::prefix('{locale}')
    ->where(['locale' => '[a-zA-Z]{2}']) // Hanya menerima 2 huruf (misal: id, en)
    ->middleware([SetLocale::class])      // Middleware untuk set App::setLocale()
    ->group(function () {

        // Route yang dipindahkan dari luar group
        Route::get('/', [AuthManager::class, 'UserDashboard'])->name('home');

        // Route Auth
        Route::get('/SignUp',[AuthManager::class, 'SignUp'])->name('SignUp');
        Route::post('/SignUp', [AuthManager::class, 'SignUpPost'])->name('SignUp.post');

        Route::get('/login', [AuthManager::class, 'login'])->name('login');
        Route::post('/login', [AuthManager::class, 'loginPost'])->name('login.post');

        Route::post('/logout', [AuthManager::class, 'logout'])->name('logout');


        Route::middleware(['auth'])->group(function () {
            // Buyer & Seller Home
            Route::get('/Buyer', [AuthManager::class, 'UserDashboard'])->name('BuyerHome');
            Route::get('/Seller', [AuthManager::class, 'UserDashboard'])->name('SellerHome');

            // Profile Routes - New format: /Profile/{role}/{userId} (must be defined first for proper matching)
            // Constraint ensures role is Buyer or Seller, and userId is numeric
            Route::get('/Profile/{role}/{userId}', [ProfileController::class, 'show'])
                ->where(['role' => 'Buyer|Seller', 'userId' => '[0-9]+'])
                ->name('profile.show');
            Route::post('/Profile/{role}/{userId}', [ProfileController::class, 'storeOrUpdate'])
                ->where(['role' => 'Buyer|Seller', 'userId' => '[0-9]+'])
                ->name('profile.update');
            Route::delete('/Profile/{role}/{userId}', [ProfileController::class, 'destroy'])
                ->where(['role' => 'Buyer|Seller', 'userId' => '[0-9]+'])
                ->name('profile.destroy');
            Route::post('/Profile/{role}/{userId}/report', [ProfileController::class, 'submitReport'])
                ->where(['role' => 'Buyer|Seller', 'userId' => '[0-9]+'])
                ->name('profile.submitReport');

            // Profile Routes - Backward compatibility: /Profile/{userId} (for numeric ID) or /Profile/{role} (for role string)
            // This route will match /Profile/123 (numeric) or /Profile/Buyer (string)
            Route::get('/Profile/{userId}', [ProfileController::class, 'show'])
                ->name('profile.show.legacy');
            Route::post('/Profile/{userId}', [ProfileController::class, 'storeOrUpdate'])
                ->name('profile.update.legacy');
            Route::delete('/Profile/{userId}', [ProfileController::class, 'destroy'])
                ->name('profile.destroy.legacy');
            Route::post('/Profile/{userId}/report', [ProfileController::class, 'submitReport'])
                ->name('profile.submitReport.legacy');
        });

        // COD Routes
        Route::prefix('/COD')->middleware(['auth'])->group(function(){
            Route::get('/date', [CODController::class, 'showDate'])->name('CODDate');
            Route::post('/date', [CODController::class, 'storeDate'])->name('CODDate.store');
            Route::get('/time', [CODController::class, 'showTime'])->name('CODTime');
            Route::post('/time', [CODController::class, 'storeTime'])->name('CODTime.store');
            Route::get('/location', [CODController::class, 'showLocation'])->name('CODLocation');
            Route::get('/location-recommendation', [CODController::class, 'showLocationRecommendation'])->name('CODLocationRecommendation');
            Route::post('/location', [CODController::class, 'storeLocation'])->name('CODLocation.store');
            Route::get('/appointment/{appointment}', [CODController::class, 'show'])->name('CODAppointment.show');
            Route::patch('/appointment/{appointment}/status', [CODController::class, 'updateStatus'])->name('CODAppointment.updateStatus');
        });

        // Seller Specific Routes
        Route::prefix('/Seller')->middleware(['auth', 'seller'])->group(function(){
            Route::get('/MySchedule', [MyScheduleController::class, 'index'])->name('SellerMySchedule');
            Route::patch('/appointment/{appointment}/status', [MyScheduleController::class, 'updateStatus'])->name('SellerAppointment.updateStatus');
            Route::get('/appointment/{appointment}', [MyScheduleController::class, 'show'])->name('SellerAppointment.show');

            Route::get('/TransactionDetail', [TransactionDetailController::class, 'index'])->name('SellerTransactionDetail');
            Route::post('/TransactionDetail/deal', [TransactionDetailController::class, 'dealSeller'])->name('SellerTransactionDeal');

            Route::get('/chatlist', [ChatController::class, 'index'])->name('SellerChatList');
            Route::get('/chat/{recipientId}', [ChatController::class, 'show'])->name('SellerChat');

            Route::get('/review', [ReviewController::class, 'show'])->name('SellerReview');
            Route::post('/review', [ReviewController::class, 'store'])->name('SellerReview.store');

            Route::get('/ConfirmPage', [TransactionDetailController::class, 'confirm'])->name('ConfirmPage');
        });

        // Upload Evidence (Disarankan menggunakan EvidenceController::class)
        Route::get("/UploadEvidence", [EvidenceController::class, 'show'])->name("UploadEvidence");
        Route::post("/UploadEvidence", [EvidenceController::class, 'store'])->name("UploadEvidence.store");


        // Seller Product Management Routes
        Route::prefix('/Seller')->middleware(['auth'])->group(function() {
            Route::get('/product', [ProductController::class, 'index'])->name('SellerProduct');
            Route::get('/product/add', [ProductController::class, 'create'])->name('SellerProductAdd');
            Route::post('/product/add', [ProductController::class, 'store'])->name('SellerProductStore');
            Route::get('/product/edit/{product}', [ProductController::class, 'edit'])->name('SellerProductEdit');
            Route::put('/ProductDetail/{product}', [ProductController::class, 'update'])->name('SellerProductUpdate');
            Route::delete('/ProductDetail/{product}', [ProductController::class, 'destroy'])->name('SellerProductDelete');
        });

        // Product Detail Public View
        Route::get('/Seller/ProductDetail/{id}', [ProductController::class, 'show'])->name('SellerProductDetail');
        Route::get('/Buyer/ProductDetail/{id}', [ProductController::class, 'show'])->name('BuyerProductDetail');


        // Buyer Specific Routes
        Route::prefix('/Buyer')->middleware(['auth', 'buyer'])->group(function(){
            Route::get('/product', function(){
                return Inertia::render('SellerProductPage', [
                    "role" => "Buyer"
                ]);
            })->name('BuyerProduct');

            Route::get('/MySchedule', [MyScheduleController::class, 'index'])->name('BuyerMySchedule');
            Route::patch('/appointment/{appointment}/cancel', [MyScheduleController::class, 'cancelAppointment'])->name('BuyerAppointment.cancel');
            Route::get('/appointment/{appointment}', [MyScheduleController::class, 'show'])->name('BuyerAppointment.show');

            Route::get('/TransactionDetail', [TransactionDetailController::class, 'index'])->name('BuyerTransactionDetail');
            Route::post('/TransactionDetail/deal', [TransactionDetailController::class, 'dealBuyer'])->name('BuyerTransactionDeal');
            Route::get('/chatlist', [ChatController::class, 'index'])->name('BuyerChatList');
            Route::get('/chat/{recipientId}', [ChatController::class, 'show'])->name("BuyerChat");
            Route::get('/review', [ReviewController::class, 'show'])->name('BuyerReview');
            Route::post('/review', [ReviewController::class, 'store'])->name('BuyerReview.store');
        });

});
