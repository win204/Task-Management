import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { AuthService } from '@/features/auth/api/AuthService';
import { forgotPasswordSchema, type ForgotPasswordSchemaType } from '@/features/auth/validations/authSchema';
import { ROUTES } from '@/utils/constants';
import { Loader2, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * ForgotPasswordPage Component.
 * Collects email, calls forgot password service, and transitions into confirmation view.
 */
export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await AuthService.forgotPassword(data);
      setIsSubmitted(true);
    } catch (err: unknown) {
      console.error('Forgot password submission failed:', err);
      const errorResponse = err as { response?: { data?: { message?: string } }; message?: string };
      const message = errorResponse.response?.data?.message || errorResponse.message || 'Failed to send recovery email. Please try again.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full text-center py-6 animate-in zoom-in-95 duration-200">
        <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900">Check your email</h2>
        <p className="text-sm text-slate-500 mt-4 leading-relaxed max-w-sm mx-auto">
          We have sent a password reset link to your registered email address. Please follow the instructions to secure your account.
        </p>
        <div className="mt-8">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Forgot password?</h2>
        <p className="text-sm text-slate-500 mt-2">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      {/* API Error alert box */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-in fade-in duration-200">
          <AlertCircle className="h-5 w-5 flex-none mt-0.5 text-red-500" />
          <div className="text-sm">
            <span className="font-semibold">Error:</span> {apiError}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-5 w-5" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="admin@gmail.com"
              disabled={isLoading}
              {...register('email')}
              className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all outline-none bg-white ${
                errors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50/10'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              {errors.email.message}
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
              Sending recovery link...
            </>
          ) : (
            'Send Recovery Link'
          )}
        </button>

        {/* Return to Login link */}
        <div className="text-center mt-6">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
