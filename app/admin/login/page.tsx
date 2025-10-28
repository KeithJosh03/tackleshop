'use client'; // Ensure the component is client-side rendered
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';

import { worksans } from '@/types/fonts';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Added loading state for UX
  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);  // Start loading

    try {
      // Replace with your actual Laravel backend URL
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });

      // Store the token in localStorage
      localStorage.setItem('admin_token', response.data.token);

      // Redirect to the admin dashboard
      router.push('/admin/dashboard/');
    } catch (err: any) {
      // Check the error response and set appropriate error message
      setError(err?.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${worksans.className} flex items-center justify-center h-screen`}>
      <div className="bg-mainBackgroundColor border border-greyColor p-10 rounded-xl shadow-2xl w-96 max-w-sm text-tertiaryColor">
        <h2 className="text-4xl font-bold text-center text-primaryColor mb-6">LOGIN</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-base font-medium text-primaryColor">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-base font-medium text-primaryColor">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 font-extrabold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'button-view'}`} 
            disabled={loading}  // Disable button while loading
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
