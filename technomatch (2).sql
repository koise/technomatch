-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 08, 2025 at 07:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `technomatch`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `certificate_type` enum('class_completion','rank_achievement','specialization','season') NOT NULL,
  `issuer` varchar(100) DEFAULT 'TechnoMatch',
  `difficulty_level` int(11) DEFAULT NULL,
  `requirements` text NOT NULL,
  `image_template` varchar(255) DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,
  `rank_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `display_titles`
--

CREATE TABLE `display_titles` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `minimum_level` int(11) DEFAULT NULL,
  `minimum_points` int(11) DEFAULT NULL,
  `category` enum('progressive','ranked','achievement','special') DEFAULT 'progressive',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_verifications`
--

CREATE TABLE `email_verifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `verification_code` varchar(6) NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `verified_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `attempts` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email_verifications`
--

INSERT INTO `email_verifications` (`id`, `user_id`, `email`, `verification_code`, `is_verified`, `sent_at`, `verified_at`, `expires_at`, `attempts`, `created_at`, `updated_at`) VALUES
(12, 28, 'piratangmanlalayag@gmail.com', '465885', 0, '2025-04-29 09:57:24', NULL, '2025-04-29 18:27:24', 0, '2025-04-29 09:57:24', '2025-04-29 09:57:24'),
(14, 47, 'bgedades0290ant@student.fatima.edu.ph', '589054', 1, '2025-04-29 10:54:16', '2025-04-29 10:54:34', '2025-04-29 19:24:16', 1, '2025-04-29 10:29:57', '2025-04-29 10:54:34');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`id`, `user_id`, `friend_id`, `created_at`, `updated_at`) VALUES
(1, 47, 48, '2025-05-07 23:35:57', '2025-05-07 23:35:57'),
(2, 47, 49, '2025-05-07 23:35:57', '2025-05-07 23:35:57'),
(3, 48, 47, '2025-05-07 23:36:02', '2025-05-07 23:36:02'),
(4, 49, 47, '2025-05-07 23:36:02', '2025-05-07 23:36:02');

-- --------------------------------------------------------

--
-- Table structure for table `friend_requests`
--

CREATE TABLE `friend_requests` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `game_modes`
--

CREATE TABLE `game_modes` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `game_modes`
--

INSERT INTO `game_modes` (`id`, `name`, `description`, `icon`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'progressive', 'Level up by completing challenges', 'FiTrendingUp', 1, '2025-04-23 19:15:27', '2025-04-23 19:15:27'),
(2, 'blitz', 'Competing with small amount of time', 'FiZap', 1, '2025-04-23 19:15:27', '2025-04-23 19:15:27'),
(3, 'ranked', 'Compete against others to climb leaderboards', 'FiAward', 1, '2025-04-23 19:15:27', '2025-04-23 19:15:27'),
(4, 'contest', 'Scheduled competitive events', 'FiClock', 1, '2025-04-23 19:15:27', '2025-04-23 19:15:27');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `level_up_values`
--

CREATE TABLE `level_up_values` (
  `level` int(11) NOT NULL,
  `value` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `level_up_values`
--

INSERT INTO `level_up_values` (`level`, `value`) VALUES
(1, 20),
(2, 40),
(3, 60),
(4, 100),
(5, 140),
(6, 200),
(7, 280),
(8, 380),
(9, 500),
(10, 650),
(11, 850),
(12, 1100),
(13, 1400),
(14, 1800),
(15, 2300);

-- --------------------------------------------------------

--
-- Table structure for table `matches`
--

CREATE TABLE `matches` (
  `id` int(11) NOT NULL,
  `game_mode_id` int(11) NOT NULL,
  `match_status` enum('queued','active','completed','cancelled') DEFAULT 'queued',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `started_at` timestamp NULL DEFAULT NULL,
  `ended_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `match_participants`
--

CREATE TABLE `match_participants` (
  `id` int(11) NOT NULL,
  `match_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `result` enum('win','loss','draw','forfeit','incomplete') DEFAULT 'incomplete',
  `points_earned` int(11) DEFAULT 0,
  `xp_earned` int(11) DEFAULT 0,
  `performance_score` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_04_14_184035_create_personal_access_tokens_table', 2),
(5, '2025_04_14_184300_add_role_to_users_table', 3);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT 0,
  `action_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth_token', 'fae8b3d6f254bcf257f64a34ca689f4fecc2fc65d948e4de3c047daedb9cbc01', '[\"*\"]', NULL, NULL, '2025-04-18 13:00:35', '2025-04-18 13:00:35'),
(2, 'App\\Models\\User', 1, 'auth_token', '08ae5c270dcd3c5191e34f41914944af4eabcaa5ebae585173fccb98d744ca31', '[\"*\"]', NULL, NULL, '2025-04-18 13:02:38', '2025-04-18 13:02:38'),
(3, 'App\\Models\\User', 1, 'auth_token', 'edf781c90543205c5cdb0a870e534d048eb0e60228e98f8d87262a3e7cc76660', '[\"*\"]', NULL, NULL, '2025-04-18 13:02:39', '2025-04-18 13:02:39'),
(4, 'App\\Models\\User', 1, 'auth_token', 'de09c6df37977d2360794d01712fa002cf752d023f941d1a56dd08f74d57854a', '[\"*\"]', NULL, NULL, '2025-04-18 13:05:33', '2025-04-18 13:05:33'),
(5, 'App\\Models\\User', 1, 'auth_token', 'd22bd83b90340057604f7d6b55ecc7126c988a998cac05358557aee00d83a776', '[\"*\"]', NULL, NULL, '2025-04-18 13:06:03', '2025-04-18 13:06:03'),
(6, 'App\\Models\\User', 1, 'remember_token', 'a4d30b1e56aaed56e744c8240c8ecaef5200bb329f2cc34e95cae3878d263676', '[\"*\"]', NULL, NULL, '2025-04-18 13:06:34', '2025-04-18 13:06:34'),
(7, 'App\\Models\\User', 1, 'remember_token', '72db18149696034c3050af261e65888d63a4aa6cab8060c187d0fc40b850c605', '[\"*\"]', NULL, NULL, '2025-04-18 13:06:49', '2025-04-18 13:06:49'),
(8, 'App\\Models\\User', 1, 'remember_token', '83924cd801632e5bd389167c77d91423b81c182bfb1f0079aaf8f9b62090d1a7', '[\"*\"]', NULL, NULL, '2025-04-18 13:07:02', '2025-04-18 13:07:02'),
(9, 'App\\Models\\User', 1, 'remember_token', '1769131c745758ace72e5c93360cb01820b90e4076768e147db851b185ec7d6f', '[\"*\"]', NULL, NULL, '2025-04-18 13:13:32', '2025-04-18 13:13:32'),
(10, 'App\\Models\\User', 1, 'remember_token', '81528cdc96dafccfdce9b3e56138ba34fc0cc816825d05339642eb093f45cc10', '[\"*\"]', NULL, NULL, '2025-04-18 13:13:46', '2025-04-18 13:13:46'),
(11, 'App\\Models\\User', 1, 'auth_token', '8e404bcefecae151f868d91280d27c58be4c5950b06ae84c73cd83c06b45d8aa', '[\"*\"]', NULL, NULL, '2025-04-18 13:13:52', '2025-04-18 13:13:52'),
(12, 'App\\Models\\User', 1, 'auth_token', '523b30a1719022c4ca05157f2a058c1728903e0424554bf0688a5c5922b1a6ea', '[\"*\"]', NULL, NULL, '2025-04-18 13:13:54', '2025-04-18 13:13:54'),
(13, 'App\\Models\\User', 1, 'remember_token', 'f7c7bb75e6bc25597a7d8b50a8b1cfb6692c34d3cf9d51ca46c93cec1f9422aa', '[\"*\"]', NULL, NULL, '2025-04-18 13:15:12', '2025-04-18 13:15:12'),
(14, 'App\\Models\\User', 1, 'remember_token', '21e2d30e0159d805f5f1e8cdd71a946000a30cc94446c7d52d9d35f074ff4152', '[\"*\"]', NULL, NULL, '2025-04-18 13:16:11', '2025-04-18 13:16:11'),
(15, 'App\\Models\\User', 1, 'remember_token', '928252379776310763870b333ff823a74a0382c41f3ad51280fe579e1031a5cd', '[\"*\"]', NULL, NULL, '2025-04-18 13:16:29', '2025-04-18 13:16:29'),
(16, 'App\\Models\\User', 1, 'remember_token', '511cf66d5e88fa47466fc016d2a0659ee9a4ee5bc623d694c33fd8f7b0b8da98', '[\"*\"]', NULL, NULL, '2025-04-19 05:33:15', '2025-04-19 05:33:15');

-- --------------------------------------------------------

--
-- Table structure for table `ranks`
--

CREATE TABLE `ranks` (
  `id` int(11) NOT NULL,
  `name` enum('Novice','Apprentice','Master','TechnoCrat') NOT NULL,
  `tier` int(11) NOT NULL,
  `display_name` varchar(100) NOT NULL,
  `rank_order` int(11) NOT NULL,
  `points_threshold` int(11) NOT NULL,
  `badge_url` varchar(255) DEFAULT NULL,
  `badge_color` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ranks`
--

INSERT INTO `ranks` (`id`, `name`, `tier`, `display_name`, `rank_order`, `points_threshold`, `badge_url`, `badge_color`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Novice', 1, 'Novice I', 2, 100, '/assets/badges/novice-1.svg', '#6B7280', 'Beginning your journey', '2025-04-19 16:12:43', '2025-04-23 18:55:07'),
(2, 'Novice', 2, 'Novice II', 3, 300, '/assets/badges/novice-2.svg', '#6B7280', 'Taking your first steps', '2025-04-19 16:12:43', '2025-04-23 18:53:28'),
(3, 'Novice', 3, 'Novice III', 4, 600, '/assets/badges/novice-3.svg', '#6B7280', 'Ready to advance', '2025-04-19 16:12:43', '2025-04-23 18:53:28'),
(4, 'Apprentice', 1, 'Apprentice I', 5, 900, '/assets/badges/apprentice-1.svg', '#60A5FA', 'Showing potential', '2025-04-19 16:12:43', '2025-04-23 18:55:07'),
(5, 'Apprentice', 2, 'Apprentice II', 6, 1200, '/assets/badges/apprentice-2.svg', '#60A5FA', 'Building skills', '2025-04-19 16:12:43', '2025-04-23 18:55:07'),
(6, 'Apprentice', 3, 'Apprentice III', 7, 1600, '/assets/badges/apprentice-3.svg', '#60A5FA', 'Approaching mastery', '2025-04-19 16:12:43', '2025-04-23 18:55:07'),
(7, 'Master', 1, 'Master I', 8, 2200, '/assets/badges/master-1.svg', '#7C3AED', 'Skilled programmer', '2025-04-19 16:12:43', '2025-04-23 18:55:07'),
(8, 'Master', 2, 'Master II', 9, 3000, '/assets/badges/master-2.svg', '#7C3AED', 'Advanced expertise', '2025-04-19 16:12:43', '2025-04-23 18:55:07'),
(9, 'Master', 3, 'Master III', 10, 4000, '/assets/badges/master-3.svg', '#7C3AED', 'Elite programmer', '2025-04-19 16:12:43', '2025-04-23 18:55:07'),
(10, 'TechnoCrat', 1, 'TechnoCrat', 11, 5500, '/assets/badges/technocrat.svg', '#DC2626', 'Prestigious rank of exceptional skill', '2025-04-19 16:12:43', '2025-04-23 18:55:07'),
(11, '', 0, 'Calibrating', 1, 0, '/assets/badges/calibrating.svg', '#F59E0B', 'Finding your true skill level', '2025-04-23 18:53:19', '2025-04-23 18:53:19');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('fMeYPdZ04ZzN48W8EZVfQYJiPrpV849V8O7EqAnt', 47, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0', 'YTo2OntzOjY6Il90b2tlbiI7czo0MDoicUwwcjgyT2l1UzAwNUNkRTBXenprU0ZpaXllaVVaWVh3c2I4S3RvWiI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czoyMToiaHR0cDovLzEyNy4wLjAuMTo4MDAwIjt9czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9kYXNoYm9hcmQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aTo0NztzOjc6InVzZXJfaWQiO2k6NDc7fQ==', 1746724585);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'Student',
  `email` varchar(255) DEFAULT NULL,
  `email_verified` int(11) DEFAULT 0,
  `verify_at` datetime DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `school` varchar(255) DEFAULT NULL,
  `programming_language` varchar(100) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `status` varchar(255) DEFAULT 'active',
  `display_title_id` int(11) DEFAULT NULL,
  `active_contest_key_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `gender`, `role`, `email`, `email_verified`, `verify_at`, `username`, `password`, `school`, `programming_language`, `bio`, `status`, `display_title_id`, `active_contest_key_id`, `created_at`, `updated_at`) VALUES
(1, 'Bart', 'Edades', NULL, 'student', 'bgedades@student.fatima.edu.ph', 0, '2025-04-24 01:50:38', 'koise', '$2y$12$m20e.Bn4mInsTT.wfMfwE.gBFyVxjcO2jAmh463HFBWKoOyPYO5WW', 'Our Lady of Fatima University', 'Python', 'Aspiring full-stack dev & coding warrior.', 'active', 1, NULL, '2025-04-23 17:50:38', '2025-04-23 20:10:28'),
(28, 'Bart Jason', 'Edades', 'Male', 'Student', 'piratangmanlalayag@gmail.com', 1, '2025-04-28 18:04:22', 'koise01', '$2y$12$m20e.Bn4mInsTT.wfMfwE.gBFyVxjcO2jAmh463HFBWKoOyPYO5WW', NULL, NULL, NULL, 'active', NULL, NULL, '2025-04-28 10:03:55', '2025-04-28 19:02:35'),
(47, 'laravel', 'Imnida', 'Male', 'Student', 'bgedades0290ant@student.fatima.edu.ph', 1, '2025-04-29 18:54:34', 'koise001', '$2y$12$odfdzoDFzWdafju.qR2Cxe4z3/1pdy2D/PQanceTwYyZW1kd6pOxq', NULL, 'Java', NULL, 'active', NULL, NULL, '2025-04-29 10:29:55', '2025-04-29 10:54:40'),
(48, 'Alice', 'Smith', 'Female', 'Student', 'alice@example.com', 1, '2025-05-08 07:35:52', 'alice47', 'password123', 'Tech University', 'Python', 'Competitive coder', 'active', NULL, NULL, '2025-05-07 23:35:52', '2025-05-07 23:35:52'),
(49, 'Bob', 'Johnson', 'Male', 'Student', 'bob@example.com', 1, '2025-05-08 07:35:52', 'bobby', 'password123', 'Code Academy', 'Java', 'Love algorithms', 'active', NULL, NULL, '2025-05-07 23:35:52', '2025-05-07 23:35:52');

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `avatar_path` varchar(255) DEFAULT '/avatar/default-7.svg',
  `rank_title` varchar(100) DEFAULT 'Novice',
  `online_status` enum('online','queuing','playing','post-match','offline') DEFAULT 'offline',
  `last_active` timestamp NULL DEFAULT NULL,
  `preferred_font` varchar(50) DEFAULT 'var(--font-sans)',
  `dark_mode` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`id`, `user_id`, `avatar_path`, `rank_title`, `online_status`, `last_active`, `preferred_font`, `dark_mode`, `created_at`, `updated_at`) VALUES
(11, 47, '/avatar/default-6.svg', 'None', 'online', '2025-05-08 08:07:18', 'var(--font-sans)', 1, '2025-04-29 10:30:37', '2025-05-08 09:16:08');

-- --------------------------------------------------------

--
-- Table structure for table `user_progressive_stats`
--

CREATE TABLE `user_progressive_stats` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `level` int(11) DEFAULT 1,
  `xp` int(11) DEFAULT 0,
  `next_level_xp` int(11) DEFAULT 1000,
  `completed_challenges` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_progressive_stats`
--

INSERT INTO `user_progressive_stats` (`id`, `user_id`, `level`, `xp`, `next_level_xp`, `completed_challenges`, `created_at`, `updated_at`) VALUES
(10, 47, 1, 0, 20, 0, '2025-04-29 10:30:37', '2025-05-02 20:39:23');

-- --------------------------------------------------------

--
-- Table structure for table `user_ranked_stats`
--

CREATE TABLE `user_ranked_stats` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tier` varchar(50) DEFAULT 'Bronze',
  `points` int(11) DEFAULT 0,
  `mmr` int(11) NOT NULL DEFAULT 1000,
  `position` int(11) DEFAULT NULL,
  `wins` int(11) DEFAULT 0,
  `losses` int(11) DEFAULT 0,
  `draws` int(11) DEFAULT 0,
  `win_streak` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_ranked_stats`
--

INSERT INTO `user_ranked_stats` (`id`, `user_id`, `tier`, `points`, `mmr`, `position`, `wins`, `losses`, `draws`, `win_streak`, `created_at`, `updated_at`) VALUES
(6, 47, 'Calibrating', 0, 1000, 0, 0, 0, 0, 0, '2025-04-29 10:30:37', '2025-04-29 10:30:37');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `display_titles`
--
ALTER TABLE `display_titles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `email_verifications`
--
ALTER TABLE `email_verifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user` (`user_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `friend_id` (`friend_id`);

--
-- Indexes for table `friend_requests`
--
ALTER TABLE `friend_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `game_modes`
--
ALTER TABLE `game_modes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name_unique` (`name`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `level_up_values`
--
ALTER TABLE `level_up_values`
  ADD PRIMARY KEY (`level`);

--
-- Indexes for table `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_match_status` (`match_status`),
  ADD KEY `idx_match_mode` (`game_mode_id`);

--
-- Indexes for table `match_participants`
--
ALTER TABLE `match_participants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `match_user_unique` (`match_id`,`user_id`),
  ADD KEY `idx_participant_match` (`match_id`),
  ADD KEY `idx_participant_user` (`user_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notification_user` (`user_id`),
  ADD KEY `idx_notification_read` (`is_read`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `ranks`
--
ALTER TABLE `ranks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_rank_tier` (`name`,`tier`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id_unique` (`user_id`);

--
-- Indexes for table `user_progressive_stats`
--
ALTER TABLE `user_progressive_stats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id_unique` (`user_id`);

--
-- Indexes for table `user_ranked_stats`
--
ALTER TABLE `user_ranked_stats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id_unique` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `display_titles`
--
ALTER TABLE `display_titles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_verifications`
--
ALTER TABLE `email_verifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `friend_requests`
--
ALTER TABLE `friend_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `game_modes`
--
ALTER TABLE `game_modes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `matches`
--
ALTER TABLE `matches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `match_participants`
--
ALTER TABLE `match_participants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `ranks`
--
ALTER TABLE `ranks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user_progressive_stats`
--
ALTER TABLE `user_progressive_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user_ranked_stats`
--
ALTER TABLE `user_ranked_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `email_verifications`
--
ALTER TABLE `email_verifications`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `friend_requests`
--
ALTER TABLE `friend_requests`
  ADD CONSTRAINT `friend_requests_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friend_requests_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `matches`
--
ALTER TABLE `matches`
  ADD CONSTRAINT `fk_match_mode_id` FOREIGN KEY (`game_mode_id`) REFERENCES `game_modes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `match_participants`
--
ALTER TABLE `match_participants`
  ADD CONSTRAINT `fk_participant_match_id` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_participant_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notification_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `fk_profiles_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_progressive_stats`
--
ALTER TABLE `user_progressive_stats`
  ADD CONSTRAINT `fk_prog_stats_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_ranked_stats`
--
ALTER TABLE `user_ranked_stats`
  ADD CONSTRAINT `fk_ranked_stats_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
