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
});

