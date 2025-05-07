<?php
use Inertia\Inertia;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestMailTestController;
use App\Http\Controllers\Auth\UserAccountController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\UserEmailVerification;
use App\Http\Controllers\Auth\RedirectController;
use App\Http\Controllers\User\UserStatsController;
use App\Http\Controllers\MailDiagnosticController;

// Auth check route - use this to debug authentication status
Route::get('/auth-check', [UserAccountController::class, 'authCheck']);

// Public routes - logged in users will be automatically redirected to dashboard
Route::middleware(['public.only'])->group(function () {
    Route::get('/', function () { return Inertia::render('Home'); })->name('home');
    Route::get('/login', function () { return Inertia::render('Auth/Login'); })->name('login');
    Route::get('/signup', function () { return Inertia::render('Auth/Signup'); })->name('signup');
});

// Asset routes
Route::get('/avatar/{filename}', fn($filename) => file_exists($path = public_path("images/UserDefaultProfile/$filename")) ? response()->file($path) : abort(404));

// Define the dashboard route explicitly with authentication and verification middleware
Route::get('/dashboard', function () { 
    return Inertia::render('Users/Dashboard'); 
})->middleware(['requires.verification'])->name('dashboard');

// Other authenticated routes that don't require verification
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/sidebar', function () { return Inertia::render('Users/Sidebar'); });
});

// Routes that require authentication and email verification
Route::middleware(['requires.verification'])->group(function () {
    Route::get('/code-arena', function () { return Inertia::render('Users/CodeArena'); });
    Route::get('/competitive-editor', function () { return Inertia::render('Users/CompetitiveCodingPage'); })->name('competitive.editor');
    Route::get('/users/editor', function () { return Inertia::render('Users/'); });
    Route::get('/progressive', function () { return Inertia::render('Users/Game/Progressive'); });
    Route::get('/store', function () { return Inertia::render('Users/Store'); });
    Route::get('/leaderboard', function () { return Inertia::render('Users/Leaderboard'); });
    Route::get('/friends', function() { return Inertia::render('Users/Friends/Index'); })->name('friends.index');
    Route::get('/friends/requests', function() { return Inertia::render('Users/Friends/Requests'); })->name('friends.requests');
});

// Routes accessible to both authenticated and non-authenticated users
Route::get('/verify', [EmailVerificationPromptController::class, '__invoke'])->name('verification.notice');

// Account controller
Route::post('/check-username', [UserAccountController::class, 'checkUsernameExist']);
Route::post('/login', [UserAccountController::class, 'login'])->name('login.submit');
Route::post('/register', [UserAccountController::class, 'store'])->name('register.post');
Route::post('/check-email', [UserAccountController::class, 'checkEmail']);
Route::get('/logout', [UserAccountController::class, 'logout'])->name('logout');

// User management (authenticated only)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/user/profile', [UserAccountController::class, 'creatingProfiles']);
    
    // User account preference
    Route::get('/fetch-user', [UserStatsController::class, 'fetchUser'])->name('fetchUser');
    Route::post('/update-user-status', [UserStatsController::class, 'updateUserStatus']);
    Route::post('/update-user-preference', [UserStatsController::class, 'updateUserPreference']);
});

// Email verification
Route::get('/send-mail', [EmailVerificationPromptController::class, 'send']);
Route::post('/send-verification-code', [UserEmailVerification::class, 'sendVerificationCode']);
Route::post('/verify-code', [UserEmailVerification::class, 'verifyCode']);

// Mail diagnostics (only available in development environment)
Route::prefix('mail-diagnostic')->group(function () {
    Route::get('/test', [MailDiagnosticController::class, 'diagnose']);
    Route::post('/send-test', [MailDiagnosticController::class, 'sendTestEmail']);
});

// Fallback route for unauthorized access
Route::get('/unauthorized', [RedirectController::class, 'unauthorized'])->name('unauthorized');