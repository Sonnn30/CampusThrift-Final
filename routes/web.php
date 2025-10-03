<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('login');
// })->name('login');

Route::get('/' ,function(){
    return Inertia::render('home');
})-> name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::get('/SignUp', function(){
    return Inertia::render('SignUp');
})->name('SignUp');

Route::get('/login', function(){
    return Inertia::render('login');
})->name('login');


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
    Route::get('/product', function(){
        return Inertia::render('SellerProduct');
    })->name('SellerProduct');
    Route::get('/product/add', function(){
        return Inertia::render('SellerProductAdd');
    })->name('SellerProductAdd');
    Route::get('/product/edit', function(){
        return Inertia::render('SellerProductEdit');
    })->name('SellerProductEdit');
    Route::get('/MySchedule', function(){
        return Inertia::render('MySchedule');
    })->name('SellerMySchedule');
    Route::get('/TransactionDetail', function(){
        return Inertia::render('TransactionDetail', [
            'role' => 'Seller'
        ]);
    })->name("SellerTransactionDetail");
    Route::get('/chat', function(){
        return Inertia::render('chat');
    })->name('SellerChat');
    Route::get('/review', function(){
        return Inertia::render('review');
    })->name('SellerReview');
});

Route::prefix('/Buyer')->group(function(){
    Route::get('/MySchedule', function(){
        return Inertia::render('MySchedule');
    })->name('BuyerMySchedule');
    Route::get('/TransactionDetail', function(){
        return Inertia::render('TransactionDetail', [
            'role' => 'Buyer'
        ]);
    })->name('BuyerTransactionDetail');
    Route::get('/chat', function(){
        return Inertia::render('chat');
    })->name("BuyerChat");
    Route::get('/review', function(){
        return Inertia::render('review');
    })->name('BuyerReview');
});

