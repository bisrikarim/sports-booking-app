// frontend/src/app/login/page.js
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#fafafa] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-black">SportReserve</h1>
          <p className="text-gray-600">Connectez-vous à votre compte</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}