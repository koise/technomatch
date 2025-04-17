<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () { return Inertia::render('Home');});


Route::get('/competitive-editor', function () { return Inertia::render('Users/CompetitiveCodingPage');})->name('competitive.editor');
Route::get('/code-arena', function () {return Inertia::render('Users/CodeArena');});
Route::get('/users/editor', function () { return Inertia::render('Users/');});
Route::get('/login', function () { return Inertia::render('Auth/Login');});
Route::get('/signup', function () { return Inertia::render('Auth/Signup');});


require __DIR__.'/auth.php';
