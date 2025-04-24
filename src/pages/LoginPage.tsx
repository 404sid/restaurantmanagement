import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Coffee } from 'lucide-react';
import toast from 'react-hot-toast';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('manager@restaurant.com');
  const [password, setPassword] = useState('password');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  const from = locationState?.from?.pathname || '/';

  // If already authenticated, redirect
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      toast.success('Login successful');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Invalid credentials');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-4">
            <Coffee size={32} className="text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Manager</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full mb-4"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
          
          <div className="text-center text-sm text-gray-500">
            <p>Demo credentials are pre-filled</p>
            <p className="mt-1">This is a demonstration application</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;