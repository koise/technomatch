<?php
use Inertia\Inertia;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestMailTestController;
use App\Http\Controllers\Auth\UserAccountController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\UserEmailVerification;

use App\Http\Controllers\User\UserStatsController;



Route::get('/', function () { return Inertia::render('Home');});



//ASSETS
Route::get('/avatar/{filename}', fn($filename) => file_exists($path = public_path("images/UserDefaultProfile/$filename")) ? response()->file($path) : abort(404));

//INTERTIA
Route::get('/dashboard', function () { return Inertia::render('Users/Dashboard');});
Route::get('/code-arena', function () { return Inertia::render('Users/CodeArena'); });
Route::get('/competitive-editor', function () { return Inertia::render('Users/CompetitiveCodingPage');})->name('competitive.editor');
Route::get('/code-arena', function () {return Inertia::render('Users/CodeArena');});
Route::get('/users/editor', function () { return Inertia::render('Users/');});
Route::get('/login', function () { return Inertia::render('Auth/Login');});
Route::get('/signup', function () { return Inertia::render('Auth/Signup');});
Route::get('/verify', function () { return Inertia::render('Auth/VerifyUser');});

//ACCOUNT CONTROLLER
Route::post('/check-username', [UserAccountController::class, 'checkUsernameExist']);
Route::post('/login', [UserAccountController::class, 'login'])->name('login');
Route::post('/register', [UserAccountController::class, 'store']);
Route::post('/check-email', [UserAccountController::class, 'checkEmail']);
Route::get('/logout', [UserAccountController::class, 'logout'])->name('logout');
Route::post('/user/profile', [UserAccountController::class, 'creatingProfiles']);

//USER ACCOUNT PREFERENCE
Route::get('/fetch-user', [UserStatsController::class, 'fetchUser'])->name('fetchUser');
Route::post('/update-user-status', [UserStatsController::class, 'updateUserStatus']);
Route::post('/update-user-preference', [UserStatsController::class, 'updateUserPreference']);

//EMAIL
Route::get('/send-mail', [EmailVerificationPromptController::class, 'send']);
Route::post('/send-verification-code', [UserEmailVerification::class, 'sendVerificationCode']);
Route::post('/verify-code', [UserEmailVerification::class, 'verifyCode']);
