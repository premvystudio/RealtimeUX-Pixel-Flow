import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Welcome to your dashboard!</h2>
          <p className="text-gray-600">
            You have successfully signed in with Clerk. This is a protected page that
            only authenticated users can access.
          </p>
          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              The UserButton component in the top right corner allows you to manage your
              account or sign out.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 