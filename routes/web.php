<?php
use Inertia\Inertia;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestMailTestController;


use App\Http\Controllers\Auth\UserLoginController;


Route::get('/', function () { return Inertia::render('Home');});

Route::get('/avatar/{filename}', fn($filename) => file_exists($path = public_path("images/UserDefaultProfile/$filename")) ? response()->file($path) : abort(404));

Route::get('/competitive-editor', function () { return Inertia::render('Users/CompetitiveCodingPage');})->name('competitive.editor');
Route::get('/code-arena', function () {return Inertia::render('Users/CodeArena');});
Route::get('/users/editor', function () { return Inertia::render('Users/');});
Route::get('/login', function () { return Inertia::render('Auth/Login');});
Route::get('/signup', function () { return Inertia::render('Auth/Signup');});
Route::post('/login', [UserLoginController::class, 'login'])->name('login');

Route::get('/dashboard', function () { return Inertia::render('Users/Dashboard');});
Route::get('/code-arena', function () { return Inertia::render('Users/CodeArena'); });



Route::post('/check-username', [UserLoginController::class, 'checkUsernameExist']);
Route::post('/login', [UserLoginController::class, 'login'])->name('login');
Route::post('/register', [UserLoginController::class, 'store']);