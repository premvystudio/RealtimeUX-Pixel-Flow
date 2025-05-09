import React from 'react';
import Link from 'next/link';
import BlobStorageTest from '../components/BlobStorageTest';
import AuthTest from '../components/AuthTest';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-6">Welcome to Pixel & Flow</h1>
        <p className="text-xl mb-8">
          A modern SaaS application for design and image generation
        </p>
        <div className="flex gap-4 mb-10">
          <Link
            href="/sign-in"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Sign Up
          </Link>
        </div>
        
        {/* Test component for auth */}
        <div className="w-full">
          <AuthTest />
        </div>
        
        {/* Test component for Vercel Blob Storage */}
        <div className="mt-10 w-full">
          <BlobStorageTest />
        </div>
      </div>
    </main>
  );
}
