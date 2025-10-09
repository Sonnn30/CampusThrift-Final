<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthManager;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MyScheduleController;

Route::get('/', [AuthManager::class, 'UserDashboard'])->name('home');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::get('/SignUp',[AuthManager::class, 'SignUp'])->name('SignUp');
Route::post('/SignUp', [AuthManager::class, 'SignUpPost'])->name('SignUp.post');

Route::get('/login', [AuthManager::class, 'login'])->name('login');
Route::post('/login', [AuthManager::class, 'loginPost'])->name('login.post');

// Email verification via code
Route::get('/verify-email', [AuthManager::class, 'showVerifyEmail'])->name('verification.notice');
Route::post('/verify-email', [AuthManager::class, 'verifyEmailPost'])->name('verification.verify');
Route::post('/verify-email/resend', [AuthManager::class, 'resendVerification'])->name('verification.resend');

Route::middleware(['auth'])->group(function () {
    Route::get('/Buyer', [AuthManager::class, 'UserDashboard'])->name('BuyerHome');
    Route::get('/Seller', [AuthManager::class, 'UserDashboard'])->name('SellerHome');
});

Route::post('/logout', [AuthManager::class, 'logout'])->name('logout');


Route::prefix('/COD')->group(function(){
    Route::get('/date', function(){
        return Inertia::render('CODDate');
    })->name('CODDate');
    Route::get('/time', function(){
        return Inertia::render('CODTime');
    })->name('CODTime');
    Route::get('/location', function(){
        return Inertia::render("CODLocation");
    })->name("CODLocation");
});

Route::prefix('/Seller')->group(function(){


    Route::get('/MySchedule', [MyScheduleController::class, 'index'])->defaults('role', 'Seller')->name('SellerMySchedule');

    Route::get('/TransactionDetail', function(){
        return Inertia::render('TransactionDetail', [
            'role' => 'Seller'
        ]);
    })->name("SellerTransactionDetail");

    Route::get('/chat', function(){
        return Inertia::render('chat');
    })->name('SellerChat');

    Route::get('/review', function(){
        return Inertia::render('review', [
            "role" => "Seller"
        ]);
    })->name('SellerReview');

    Route::get("/ConfirmPage", function(){
        return Inertia::render("ConfirmPage");
    })->name("ConfirmPage");

    Route::get("/UploadEvidence", function(){
        return Inertia::render("UploadEvidence");
    })->name("UploadEvidence");
});



Route::prefix('/Seller')->middleware(['auth'])->group(function() {
    Route::get('/product', [ProductController::class, 'index'])->name('SellerProduct');
    Route::get('/product/add', [ProductController::class, 'create'])->name('SellerProductAdd');
    Route::post('/product/add', [ProductController::class, 'store'])->name('SellerProductStore');
    Route::get('/product/edit/{product}', [ProductController::class, 'edit'])->name('SellerProductEdit');
    Route::put('/ProductDetail/{product}', [ProductController::class, 'update'])->name('SellerProductUpdate');
    Route::delete('/ProductDetail/{product}', [ProductController::class, 'destroy'])->name('SellerProductDelete');
    // Appointment status updates
    Route::post('/appointments/{appointment}/confirm', [MyScheduleController::class, 'confirm'])->name('appointments.confirm');
    Route::post('/appointments/{appointment}/reject', [MyScheduleController::class, 'reject'])->name('appointments.reject');
});



Route::get('/Seller/ProductDetail/{id}', [ProductController::class, 'show'])
    ->name('SellerProductDetail');

Route::get('/Buyer/ProductDetail/{id}', [ProductController::class, 'show'])
    ->name('BuyerProductDetail');



Route::middleware(['auth'])->group(function () {
    Route::get('/Profile/{role}', [ProfileController::class, 'show']);
    Route::post('/Profile/{role}', [ProfileController::class, 'storeOrUpdate']);
    Route::delete('/Profile/{role}', [ProfileController::class, 'destroy']);
});



Route::prefix('/Buyer')->group(function(){
    Route::get('/product', function(){
        return Inertia::render('SellerProductPage', [
            "role" => "Buyer"
        ]);
    })->name('BuyerProduct');
    Route::get('/MySchedule', [MyScheduleController::class, 'index'])->defaults('role', 'Buyer')->name('BuyerMySchedule');

    Route::get('/TransactionDetail', function(){
        return Inertia::render('TransactionDetail', [
            'role' => 'Buyer'
        ]);
    })->name('BuyerTransactionDetail');
    Route::get('/chat', function(){
        return Inertia::render('chat');
    })->name("BuyerChat");
    Route::get('/review', function(){
        return Inertia::render('review', [
            "role" => "Buyer"
        ]);
    })->name('BuyerReview');
});





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
