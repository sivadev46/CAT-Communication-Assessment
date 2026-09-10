import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Loader2, ArrowLeft, Mail, Lock, Heart, Eye, EyeOff, X, UserCheck } from 'lucide-react';
import { catSupabaseService } from '../services/catSupabase';
import logoNiepmd from '../assets/logo_niepmd.jpg';

export default function ParentLogin() {
  const navigate = useNavigate();
  const { loginUser, registerUser } = useAuth();

  const [email, setEmail] = useState('parent@cat.com');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Parent Registration States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regPatientIdCode, setRegPatientIdCode] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await loginUser({ email, password });
      if (res.success) {
        if (res.data?.user?.role === 'parent') {
          navigate('/parent-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(res.message || 'Authentication failed. Please verify credentials.');
        setPassword('');
      }
    } catch (err) {
      setError('Login failed. Please verify your credentials.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleParentRegister = async (e) => {
    e.preventDefault();

    if (!regFullName || !regEmail || !regPassword || !regConfirmPassword || !regPatientIdCode) {
      setRegisterError('All fields including Ward / Patient ID are required.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegisterError('Passwords do not match.');
      return;
    }

    if (regPassword.length < 6) {
      setRegisterError('Password must be at least 6 characters.');
      return;
    }

    setRegisterLoading(true);
    setRegisterError(null);

    try {
      // 1. First register parent user account
      const res = await registerUser({
        fullName: regFullName,
        email: regEmail,
        password: regPassword,
        role: 'parent',
      });

      if (!res.success) {
        setRegisterError(res.message || 'Parent account creation failed.');
        setRegisterLoading(false);
        return;
      }

      const parentProfileId = res.data?.user?.id;

      // 2. Validate Patient ID code against Supabase & link parent
      const linkRes = await catSupabaseService.linkParentToPatientByCode(
        parentProfileId,
        regPatientIdCode
      );

      if (!linkRes.success) {
        setRegisterError(linkRes.message || 'Patient ID not found. Please verify the ID provided by your therapist.');
        setRegisterLoading(false);
        return;
      }

      setIsRegisterOpen(false);
      navigate('/parent-dashboard');
    } catch (err) {
      setRegisterError('Registration failed. Email might already be in use.');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-white flex items-center justify-center p-4 md:p-8 font-sans selection:bg-emerald-500 selection:text-black">
      <div className="bg-[#121218] rounded-2xl border border-[#27273A] shadow-2xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: NIEPMD Branding */}
        <div className="hidden md:flex flex-col justify-between bg-[#1A1A24] p-10 relative border-r border-[#27273A]">
          <div className="flex items-center gap-3">
            <img src={logoNiepmd} alt="NIEPMD" className="w-10 h-10 object-contain rounded bg-white p-0.5" />
            <span className="font-extrabold text-white text-lg tracking-tight">CAT Family Portal</span>
          </div>

          <div className="my-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <Heart className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">Caregiver Portal</h3>
            <p className="text-xs text-gray-300 leading-relaxed max-w-xs mx-auto">
              Track your child’s speech progress, participate in standardized assessment sessions, record videos for therapist review, and view child reports.
            </p>
          </div>

          <div className="text-[11px] text-gray-400 text-center">
            NIEPMD Official Parent & Caregiver Portal
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="p-8 md:p-10 flex flex-col justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-400 transition-colors font-semibold mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Role Selection</span>
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>Parent Access</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">Parent Sign In</h2>
              <p className="text-xs text-gray-400 mt-1">Access your linked child's developmental assessment</p>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-red-950/60 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@cat.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#1A1A24] border border-[#27273A] focus:border-emerald-500 rounded-xl text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-[#1A1A24] border border-[#27273A] focus:border-emerald-500 rounded-xl text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-gray-400">
              <span>New Parent? </span>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterOpen(true);
                  setRegisterError(null);
                }}
                className="font-bold text-emerald-400 hover:underline cursor-pointer"
              >
                Create Account with Patient ID
              </button>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#27273A] text-center text-[11px] text-gray-400">
            <span className="font-semibold text-gray-300">Default Demo Credentials:</span>
            <div className="mt-1 font-mono text-emerald-400">parent@cat.com • Password123!</div>
          </div>
        </div>

      </div>

      {/* Parent Registration Modal with Patient ID Verification */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#121218] border border-[#27273A] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative p-6 space-y-4">
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h3 className="text-lg font-extrabold text-white">Parent Account Registration</h3>
              <p className="text-xs text-gray-400 mt-1">
                Enter your details and the Ward / Patient ID provided by your therapist.
              </p>
            </div>

            {registerError && (
              <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{registerError}</span>
              </div>
            )}

            <form onSubmit={handleParentRegister} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Parent Full Name</label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-3 py-2.5 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full px-3 py-2.5 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-emerald-500"
                />
              </div>

              {/* Ward / Patient ID Field */}
              <div>
                <label className="block text-emerald-400 font-extrabold mb-1 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Ward / Patient ID Code (from Therapist)</span>
                </label>
                <input
                  type="text"
                  required
                  value={regPatientIdCode}
                  onChange={(e) => setRegPatientIdCode(e.target.value.toUpperCase())}
                  placeholder="e.g. CAT-2026-00124"
                  className="w-full px-3 py-2.5 bg-[#1A1A24] border-2 border-emerald-500/50 rounded-xl text-white font-mono font-bold outline-none focus:border-emerald-400 uppercase"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Therapist generates this ID upon creating your child's record.
                </p>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={registerLoading}
                className="w-full py-3 bg-emerald-500 text-white font-extrabold rounded-xl hover:bg-emerald-600 cursor-pointer disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                {registerLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Patient ID...</span>
                  </>
                ) : (
                  <span>Register & Link Child</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
