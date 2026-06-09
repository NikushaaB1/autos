import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Lock, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const { login, error, clearError, isLoading, isAuthenticated } = useAuthStore();
  const { showToast } = useToastStore();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear store errors on unmount or input change
  useEffect(() => {
    clearError();
  }, [emailInput, passwordInput, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Client-side validations
    if (!emailInput.trim()) {
      setValidationError('ელფოსტა აუცილებელია');
      return;
    }
    if (!passwordInput) {
      setValidationError('პაროლი აუცილებელია');
      return;
    }

    const success = await login(emailInput, passwordInput);
    if (success) {
      showToast('ავტორიზაცია წარმატებით გაიარა!', 'success');
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#04060b] flex items-center justify-center p-4 overflow-hidden">
      
      {/* Luxury Background Glow Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-gold-500/5 rounded-full blur-[90px] pointer-events-none"></div>
      
      {/* Sleek metallic linear bars in the background */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold-500/20 to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-blue-500/20 to-transparent"></div>

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Animated Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" className="mb-2" />
        </div>

        {/* Glassmorphic Login Form container */}
        <div className="glass-gold p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          {/* Subtle gold line on top of form */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-brand-gold-400/40 to-transparent"></div>
          
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold font-heading text-slate-100 flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-gold-400" />
              სისტემაში შესვლა
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              მხოლოდ ერთი ადმინისტრატორისთვის
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email Field */}
            <Input
              label="ელ-ფოსტა"
              type="email"
              placeholder="example@gmail.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              autoComplete="email"
            />

            {/* Password Field */}
            <Input
              label="პაროლი"
              type="password"
              placeholder="••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              autoComplete="current-password"
            />

            {/* Validation & Auth Error display */}
            {(validationError || error) && (
              <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-semibold font-sans flex items-center gap-2 animate-fadeIn">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                <span>{validationError || error}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 font-bold font-sans tracking-wide"
              isLoading={isLoading}
            >
              შესვლა
            </Button>
          </form>
        </div>

        {/* Brand Copyright watermark */}
        <div className="mt-8 text-center text-[10px] text-slate-500/60 font-sans font-medium">
          © {new Date().getFullYear()} TS-AUTO. ყველა უფლება დაცულია.
        </div>
      </div>
    </div>
  );
};
export default Login;
