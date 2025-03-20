// src/app/register/page.js
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#fafafa] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-black">SportReserve</h1>
          <p className="text-gray-600">Créez votre compte</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}