import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "shadow-md rounded-lg border border-gray-200"
          }
        }}
      />
    </div>
  );
} 