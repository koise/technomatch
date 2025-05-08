<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = fake()->randomElement(['Male', 'Female', 'Other']);
        
        return [
            'first_name' => fake()->firstName($gender === 'Male' ? 'male' : ($gender === 'Female' ? 'female' : null)),
            'last_name' => fake()->lastName(),
            'gender' => $gender,
            'role' => 'user',
            'email' => fake()->unique()->safeEmail(),
            'email_verified' => true,
            'email_verified_at' => now(),
            'username' => fake()->unique()->userName(),
            'password' => static::$password ??= Hash::make('password'),
            'school' => fake()->randomElement(['MIT', 'Stanford', 'Harvard', 'Caltech', 'Princeton', 'Oxford']),
            'programming_language' => fake()->randomElement(['PHP', 'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go']),
            'bio' => fake()->paragraph(2),
            'display_title_id' => null,
            'active_contest_key_id' => null,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified' => false,
            'email_verified_at' => null,
        ]);
    }
}
