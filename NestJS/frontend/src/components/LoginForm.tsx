import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
//login form component
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>(''); // Error message state
  const [isLoading, setIsLoading] = useState(false); // Loading state to show spinner while waiting for response

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Show loading spinner
    setError(''); // Reset previous error message

    axios
      .post('http://localhost:3001/auth/login', { email, password })
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Login failed: Invalid credentials');
        }

        // Optionally, store the token and redirect
        localStorage.setItem('auth_token', response.data.access_token);
        window.location.href = '/dashboard'; // Redirect to dashboard page
      })
      .catch((error) => {
        setIsLoading(false); // Hide loading spinner after request is done

        // Type assertion: cast 'error' to AxiosError to access 'response'
        if (error instanceof AxiosError) {
          if (error.response) {
            // Now TypeScript knows that 'error.response' is defined
            const errorMessage =
              error.response?.data?.message || 'An error occurred';
            setError(errorMessage); // Update the error state with error message
            toast.error(errorMessage); // Show error toast notification
          } else if (error.request) {
            // Request was made, but no response was received (network issues)
            setError('Network error: Unable to reach the server.');
            toast.error('Network error: Unable to reach the server.');
          } else {
            // General Axios error (e.g., invalid configuration)
            setError('An error occurred while processing your request.');
            toast.error('An error occurred while processing your request.');
          }
        } else if (error instanceof Error) {
          // General JavaScript errors
          setError(error.message);
          toast.error(error.message);
        } else {
          setError('Unexpected error occurred.');
          toast.error('Unexpected error occurred.');
        }
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-transparent p-6 rounded-lg shadow-md w-full max-w-md mx-auto"
    >
      {/* Email Input */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          id="email"
          className="w-full p-3 mt-1 border border-[#3D7068] text-[12px] placeholder-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D7068] text-white"
        />
      </div>

      {/* Password Input */}
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-300"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          id="password"
          className="w-full p-3 mt-1 border border-[#3D7068] text-[12px] placeholder-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D7068] text-white"
        />
      </div>
      {/* Display error message */}
      {error && <p className="text-gray-400 text-sm mb-4">{error}</p>}
      {/* Submit Button */}
      <div className="mb-4">
        <button
          type="submit"
          disabled={isLoading} // Disable button while loading
          className="w-full py-3 px-4 bg-[#3D7068] text-white font-bold rounded-md hover:bg-[#2f5e54] focus:outline-none focus:ring-2 focus:ring-[#3D7068] disabled:bg-gray-300"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-[#3D7068] hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
