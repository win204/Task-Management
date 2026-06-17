import { Outlet } from 'react-router-dom';
import { Shield, Zap, LayoutDashboard } from 'lucide-react';

/**
 * Split-screen layout for authentication pages.
 * Left Side: Aesthetic product pitch, feature listings, and enterprise-branding.
 * Right Side: Center-focused scrollable form viewport for child routes.
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 font-sans">
      {/* Left Pane - Marketing & Features (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-950 overflow-hidden select-none">
        {/* Dynamic Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-900" />
        
        {/* Subtle Decorative Geometric Shapes */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-40 right-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />

        {/* Content Panel */}
        <div className="relative w-full flex flex-col justify-between p-16 z-10">
          {/* Logo / Branding */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">TaskFlow Enterprise</span>
          </div>

          {/* Marketing Copy & Features list */}
          <div className="max-w-md my-auto">
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Manage your enterprise projects with absolute control.
            </h1>
            <p className="text-indigo-200 text-lg mb-8 leading-relaxed">
              Plan, execute, and monitor complex team workflows in a secure, role-based ecosystem.
            </p>

            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-none h-10 w-10 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Strict Role-Based Guards</h4>
                  <p className="text-indigo-200/80 text-sm">Secure workspaces with predefined Roles and strict JWT authentication access policies.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-none h-10 w-10 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Real-time Synchronization</h4>
                  <p className="text-indigo-200/80 text-sm">Axios Interceptors orchestrate silent Token Rotation ensuring zero interrupt logs.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Footer copyright */}
          <div className="text-indigo-300/60 text-xs">
            © {new Date().getFullYear()} Atlassian TaskFlow. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Pane - Form Viewport */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 md:px-12 py-12">
        <div className="w-full max-w-md flex flex-col">
          {/* Logo visible only on mobile/tablet */}
          <div className="flex items-center gap-2 lg:hidden mb-8 self-center">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-indigo-950">TaskFlow</span>
          </div>

          {/* Outlet renders public components LoginPage, ForgotPasswordPage, ResetPasswordPage */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
