import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">PC</h1>
          <p className="text-gray-500 mt-1">Pedidos Colectivos</p>
        </div>
        <SignUp />
      </div>
    </div>
  );
}
