import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Loader2, ArrowLeft, Mail, Lock, Stethoscope, Eye, EyeOff, ShieldCheck, X } from 'lucide-react';
import logoNiepmd from '../assets/logo_niepmd.jpg';

export default function DoctorLogin() {
  const navigate = useNavigate();
  const { loginUser, registerUser } = useAuth();

  const [email, setEmail] = useState('clinician@cat.com');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Registration Modal States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
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
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regFullName || !regEmail || !regPassword || !regConfirmPassword) {
      setRegisterError('All fields are required.');
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
      const res = await registerUser({
        fullName: regFullName,
        email: regEmail,
        password: regPassword,
        role: 'therapist',
      });

      if (res.success) {
        setIsRegisterOpen(false);
        navigate('/dashboard');
      } else {
        setRegisterError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setRegisterError('Registration failed. Email might already be in use.');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-white flex items-center justify-center p-4 md:p-8 font-sans selection:bg-[#FFE600] selection:text-black">
      <div className="bg-[#121218] rounded-2xl border border-[#27273A] shadow-2xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: NIEPMD Branding */}
        <div className="hidden md:flex flex-col justify-between bg-[#1A1A24] p-10 relative border-r border-[#27273A]">
          <div className="flex items-center gap-3">
            <img src={logoNiepmd} alt="NIEPMD" className="w-10 h-10 object-contain rounded bg-white p-0.5" />
            <span className="font-extrabold text-white text-lg tracking-tight">CAT Clinician Portal</span>
          </div>

          <div className="my-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-[#FFE600]/10 border border-[#FFE600]/30 text-[#FFE600] flex items-center justify-center mx-auto">
              <Stethoscope className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">Clinical Assessment System</h3>
            <p className="text-xs text-gray-300 leading-relaxed max-w-xs mx-auto">
              Access standardized 4-scale evaluations, review parent video submissions, and generate Gemini AI speech-language report summaries.
            </p>
          </div>

          <div className="text-[11px] text-gray-400 text-center">
            NIEPMD Official Communication Assessment Tool
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="p-8 md:p-10 flex flex-col justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#FFE600] transition-colors font-semibold mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Role Selection</span>
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-1.5 text-[#FFE600] font-bold text-xs uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-[#FFE600]" />
                <span>Therapist Portal</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">Clinician Sign In</h2>
              <p className="text-xs text-gray-400 mt-1">Please enter your credentials to access patient data</p>
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
                    placeholder="clinician@cat.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#1A1A24] border border-[#27273A] focus:border-[#FFE600] rounded-xl text-xs text-white outline-none"
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
                    className="w-full pl-10 pr-10 py-3 bg-[#1A1A24] border border-[#27273A] focus:border-[#FFE600] rounded-xl text-xs text-white outline-none"
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
                className="w-full py-3.5 mt-2 bg-[#FFE600] hover:bg-[#FACC15] text-black font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
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
              <span>New Clinician? </span>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterOpen(true);
                  setRegisterError(null);
                }}
                className="font-bold text-[#FFE600] hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#27273A] text-center text-[11px] text-gray-400">
            <span className="font-semibold text-gray-300">Default Demo Credentials:</span>
            <div className="mt-1 font-mono text-[#FFE600]">clinician@cat.com • Password123!</div>
          </div>
        </div>

      </div>

      {/* Registration Modal */}
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
              <h3 className="text-lg font-extrabold text-white">Create Therapist Account</h3>
              <p className="text-xs text-gray-400 mt-1">Register for clinician workspace access</p>
            </div>

            {registerError && (
              <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>{registerError}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Dr. Jane Doe"
                  className="w-full px-3 py-2.5 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-[#FFE600]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@hospital.com"
                  className="w-full px-3 py-2.5 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-[#FFE600]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-[#FFE600]"
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
                  className="w-full px-3 py-2.5 bg-[#1A1A24] border border-[#27273A] rounded-xl text-white outline-none focus:border-[#FFE600]"
                />
              </div>

              <button
                type="submit"
                disabled={registerLoading}
                className="w-full py-3 bg-[#FFE600] text-black font-extrabold rounded-xl hover:bg-[#FACC15] cursor-pointer disabled:opacity-50 mt-2"
              >
                {registerLoading ? 'Creating Account...' : 'Register Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
