'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { signup } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError(null);
    }
  };

  const validateForm = () => {
    if (
      !formData.email ||
      !formData.password ||
      !formData.fullName
    ) {
      setError('All fields are required');
      return false;
    }

    if (formData.password.length < 8) {
      setError(
        'Password must be at least 8 characters long'
      );
      return false;
    }

    if (
      formData.password !== formData.confirmPassword
    ) {
      setError('Passwords do not match');
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setError(
        'Please enter a valid email address'
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
      });

      setSuccess(true);

      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
      });

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.detail ||
            'Registration failed. Please try again.'
        );
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">
            Create an account
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-sky-600 hover:text-sky-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        {success ? (
          <div className="rounded-md border border-green-300 bg-green-50 p-4 text-green-700">
            <p className="font-semibold">Success!</p>
            <p>
              Your account has been created.
              Redirecting to chat...
            </p>
          </div>
        ) : (
          <form
            className="mt-8 space-y-5"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-700">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Alex Rivers"
              required
              autoComplete="name"
            />

            <Input
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@example.com"
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading
                ? 'Creating account...'
                : 'Create account'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}