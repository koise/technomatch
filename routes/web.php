<?php
use Inertia\Inertia;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\UserLoginController;
use App\Http\Controllers\TestMailTestController;



Route::get('/', function () { return Inertia::render('Home');});


Route::get('/competitive-editor', function () { return Inertia::render('Users/CompetitiveCodingPage');})->name('competitive.editor');
Route::get('/code-arena', function () {return Inertia::render('Users/CodeArena');});
Route::get('/users/editor', function () { return Inertia::render('Users/');});
Route::get('/login', function () { return Inertia::render('Auth/Login');});
Route::get('/signup', function () { return Inertia::render('Auth/Signup');});
Route::get('/signup', function () { return Inertia::render('Auth/Signup');});

Route::post('/login', [UserLoginController::class, 'login'])->name('login');

Route::get('/dashboard', function () { return Inertia::render('Users/Dashboard');});
Route::get('/code-arena', function () { return Inertia::render('Users/CodeArena'); });


/*
Route::middleware(['auth', 'guest'])->group(function () {
});
Route::middleware(['auth', 'student'])->group(function () {
});
Route::middleware(['auth', 'instructor'])->group(function () {
});
Route::middleware(['auth', 'admin'])->group(function () {
});
*/