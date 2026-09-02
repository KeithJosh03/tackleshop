import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0E0F] text-white p-4 font-sans">
      <h1 className="text-8xl font-bold text-red-500 mb-4">403</h1>
      <h2 className="text-3xl font-semibold mb-6">Forbidden</h2>
      <p className="text-gray-400 mb-8 text-center max-w-md text-lg">
        Access Denied. Admin privileges are required to view this section of the application.
      </p>
      <Link
        href="/"
        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors text-white"
      >
        Return to Homepage
      </Link>
    </div>
  );
}
