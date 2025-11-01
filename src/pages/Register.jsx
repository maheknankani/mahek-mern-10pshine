import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    const result = await registerUser(data);
    if (result.success) {
      toast.success('Registration successful!');
      navigate('/', { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="floating-card p-8">
          <div>
            <div className="flex justify-center">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500">
                <FileText className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold gradient-text">
              Join NotesApp
            </h2>
            <p className="mt-2 text-center text-sm text-dark-600">
              Or{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                sign in to your existing account
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-dark-700">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                  placeholder="Enter your full name"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Name cannot exceed 50 characters',
                    },
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                  placeholder="Enter your email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-700">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                  placeholder="Confirm your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
