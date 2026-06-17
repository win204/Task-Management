import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { loginSchema, type LoginSchemaType } from '../../validations/authSchema';
import { ROUTES } from '../../utils/constants';
import { AlertCircle, Loader2, KeyRound, User as UserIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * LoginPage Component.
 * Implements react-hook-form, zod validation, loading states, and redirect logic.
 */
export default function LoginPage() {
  const { login, error, isLoading, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Clear previous errors when visiting/leaving the login page
  useEffect(() => {
    console.log('[LoginPage] Mounted. Cleaning active store error logs...');
    clearError();
    return () => {
      console.log('[LoginPage] Unmounting. Cleaning active store error logs...');
      clearError();
    };
  }, [clearError]);

  // Determine redirect page (e.g. page they were trying to access before redirect)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.DASHBOARD;
  console.log('[LoginPage] Evaluation of referrer path: redirect target will be ->', from);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    console.log('[LoginPage] Form submit event captured. Payload:', { username: data.username, password: '***' });
    try {
      console.log('[LoginPage] Dispatching login request to Zustand AuthStore...');
      await login(data);
      
      console.log('[LoginPage] AuthStore login resolved successfully. Triggering navigation to:', from);
      toast.success('Successfully logged in!');
      
      navigate(from, { replace: true });
      console.log('[LoginPage] React Router navigate() triggered.');
    } catch (err: unknown) {
      console.error('[LoginPage] Submission handler caught error:', err);
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-200">
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
        <p className="text-sm text-slate-500 mt-2">
          Sign in to your account to manage your projects
        </p>
      </div>

      {/* Error alert box */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-in fade-in duration-200">
          <AlertCircle className="h-5 w-5 flex-none mt-0.5 text-red-500" />
          <div className="text-sm">
            <span className="font-semibold">Authentication Error:</span> {error}
          </div>
        </div>
      )}

      {/* Login form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username field */}
        <div>
          <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <UserIcon className="h-5 w-5" />
            </div>
            <input
              id="username"
              type="text"
              placeholder="admin"
              disabled={isLoading}
              {...register('username')}
              className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all outline-none bg-white ${
                errors.username
                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50/10'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.username && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password field */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
              Password
            </label>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              {...register('password')}
              className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all outline-none bg-white ${
                errors.password
                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50/10'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/60 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-995 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </div>
  );
}
