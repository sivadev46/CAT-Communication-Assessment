import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, Loader2, ArrowLeft, Mail, Lock, Heart, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function ParentLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('parent@cat.com');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    // Mock parent authentication flow to simulate backend readiness
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('cat_parent_authenticated', 'true');
      localStorage.setItem('cat_parent_email', email);
      navigate('/parent-dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-100 shadow-xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Illustration / Branding Section (Hidden on small screens) */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-emerald-600 to-teal-700 p-10 text-white relative">
          {/* Background shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl" />
          
          {/* Top Brand Branding */}
          <div className="flex items-center gap-2 z-10">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">CAT Family Portal</span>
          </div>

          {/* Central Child/Family Friendly Illustration */}
          <div className="my-8 flex justify-center z-10">
            <svg className="w-64 h-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Decorative elements */}
              <circle cx="100" cy="100" r="75" fill="white" fillOpacity="0.08" />
              
              {/* Smiling sun/stars */}
              <circle cx="150" cy="50" r="10" fill="#fef08a" />
              <circle cx="50" cy="140" r="6" fill="#ccfbf1" opacity="0.6" />
              
              {/* Parent and child silhouette representations */}
              {/* Parent */}
              <path d="M 85,90 A 18,18 0 0 1 103,108 L 103,135 A 4,4 0 0 1 99,139 L 71,139 A 4,4 0 0 1 67,135 L 67,108 A 18,18 0 0 1 85,90 Z" fill="white" fillOpacity="0.9" />
              <circle cx="85" cy="74" r="13" fill="white" />
              
              {/* Child */}
              <path d="M 125,110 A 14,14 0 0 1 139,124 L 139,135 A 4,4 0 0 1 135,139 L 111,139 A 4,4 0 0 1 107,135 L 107,124 A 14,14 0 0 1 125,110 Z" fill="white" fillOpacity="0.75" />
              <circle cx="125" cy="98" r="10" fill="white" />
              
              {/* Connected heart */}
              <path d="M 105,82 C 103,80 100,80 98,82 C 96,84 96,87 98,89 L 105,96 L 112,89 C 114,87 114,84 112,82 C 110,80 107,80 105,82 Z" fill="#f43f5e" />
            </svg>
          </div>

          {/* Description */}
          <div className="z-10">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-1.5">
              <span>Caregiver Portal</span>
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
              Keep track of your child's communication progress, access recommended speech-therapy activities at home, and view caregiver-friendly reports.
            </p>
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="p-8 md:p-10 flex flex-col justify-between">
          {/* Header & Back Button */}
          <div>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 transition-colors font-medium mb-6 cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Role Selection</span>
            </button>

            {/* Caregiver branding & Header */}
            <div className="mb-6">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                <Heart className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                <span>Caregiver Access</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Parent Sign In</h2>
              <p className="text-xs text-slate-500 mt-1">Access your child's developmental tracker</p>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-xs text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-xs text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me-parent"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-slate-300 rounded-sm focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="remember-me-parent" className="ml-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                  Remember my credentials
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md shadow-emerald-100 hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in securely...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Footer */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
            <span>Any credentials will successfully sign in during this developmental preview.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
