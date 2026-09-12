import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Loader2, ArrowLeft, Mail, Lock, Eye, EyeOff, X } from 'lucide-react';
import DoctorScrubsAvatar from '../components/Common/DoctorScrubsAvatar';
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
    <div className="min-h-screen bg-[#ffffcc] text-slate-900 flex items-center justify-center p-4 md:p-8 font-sans selection:bg-purple-600 selection:text-white">
      <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-2xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: NIEPMD Branding & Doctor in Medical Scrubs Illustration */}
        <div className="hidden md:flex flex-col justify-between bg-purple-50/60 p-10 relative border-r-2 border-purple-100">
          <div className="flex items-center gap-3">
            <img src={logoNiepmd} alt="NIEPMD" className="w-10 h-10 object-contain rounded-xl bg-white p-0.5 border border-purple-200" />
            <span className="font-black text-purple-950 text-lg tracking-tight">CAT Clinician Portal</span>
          </div>

          <div className="my-8 text-center space-y-4">
            {/* Doctor in Medical Scrubs (NO STETHOSCOPE) */}
            <div className="w-24 h-24 rounded-3xl bg-purple-100/80 border-2 border-purple-200 flex items-center justify-center mx-auto shadow-sm overflow-hidden p-2">
              <DoctorScrubsAvatar className="w-20 h-20" />
            </div>
            <h3 className="text-xl font-extrabold text-purple-950">Clinical Assessment System</h3>
            <p className="text-xs text-purple-900 leading-relaxed max-w-xs mx-auto font-medium">
              Access standardized 4-scale evaluations, review parent video submissions, and generate Gemini AI speech-language report summaries.
            </p>
          </div>

          <div className="text-[11px] text-purple-800 text-center font-bold">
            NIEPMD Official Communication Assessment Tool
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="p-8 md:p-10 flex flex-col justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate('/role-selection')}
              className="inline-flex items-center gap-1.5 text-xs text-purple-900 hover:text-purple-700 transition-colors font-bold mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Role Selection</span>
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-2 text-purple-700 font-extrabold text-xs uppercase tracking-wider mb-1">
                <DoctorScrubsAvatar className="w-5 h-5 inline-block" />
                <span>Therapist Portal</span>
              </div>
              <h2 className="text-2xl font-black text-purple-950">Clinician Sign In</h2>
              <p className="text-xs text-purple-800 mt-1 font-medium">Please enter your credentials to access patient data</p>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-purple-950 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-purple-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="clinician@cat.com"
                    className="w-full pl-10 pr-4 py-3 bg-purple-50/40 border border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 rounded-xl text-xs text-purple-950 font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-950 mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-purple-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-purple-50/40 border border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 rounded-xl text-xs text-purple-950 font-medium outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-purple-400 hover:text-purple-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-purple-700 hover:bg-purple-800 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

            <div className="mt-6 text-center text-xs text-purple-900 font-medium">
              <span>New Clinician? </span>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterOpen(true);
                  setRegisterError(null);
                }}
                className="font-extrabold text-purple-700 hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-purple-100 text-center text-[11px] text-purple-800">
            <span className="font-semibold text-purple-950">Default Demo Credentials:</span>
            <div className="mt-1 font-mono text-purple-700 font-bold">clinician@cat.com • Password123!</div>
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
