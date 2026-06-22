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
    clearError();
    return () => {
      clearError();
    };
  }, [clearError]);

  // Determine redirect page
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.DASHBOARD;

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
    try {
      await login(data);
      toast.success('Successfully logged in!');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      console.error('[LoginPage] Submission handler caught error:', err);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">Welcome back</h2>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-2">
          Sign in to your account to manage your projects
        </p>
      </div>

      {/* Error alert box */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-start gap-3 text-red-700 dark:text-red-400">
          <AlertCircle className="h-5 w-5 flex-none mt-0.5 text-red-500 dark:text-red-400" />
          <div className="text-sm">
            <span className="font-semibold">Authentication Error:</span> {error}
          </div>
        </div>
      )}

      {/* Login form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username field */}
        <div>
          <label htmlFor="username" className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400 dark:text-surface-500">
              <UserIcon className="h-5 w-5" />
            </div>
            <input
              id="username"
              type="text"
              placeholder="admin"
              disabled={isLoading}
              {...register('username')}
              className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all outline-none bg-white dark:bg-surface-800 dark:text-surface-100 ${
                errors.username
                  ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/10'
                  : 'border-surface-200 dark:border-surface-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-500/10'
              }`}
            />
          </div>
          {errors.username && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password field */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="password" className="block text-sm font-semibold text-surface-700 dark:text-surface-300">
              Password
            </label>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400 dark:text-surface-500">
              <KeyRound className="h-5 w-5" />
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              {...register('password')}
              className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all outline-none bg-white dark:bg-surface-800 dark:text-surface-100 ${
                errors.password
                  ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/10'
                  : 'border-surface-200 dark:border-surface-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-500/10'
              }`}
            />
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 active:scale-[0.98] flex items-center justify-center gap-2"
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
