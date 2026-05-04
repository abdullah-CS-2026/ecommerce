import React, { useState, useContext, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const VerifyEmail = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const { verifyEmail, resendOtp } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Allow pasting
    if (value.length > 1) {
       const pasted = value.slice(0, 6).split('');
       for(let i=0; i<pasted.length; i++) {
         newOtp[i] = pasted[i];
       }
       setOtp(newOtp);
       const nextIndex = Math.min(pasted.length, 5);
       inputRefs.current[nextIndex].focus();
       return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Auto focus to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    const result = await verifyEmail(email, otpValue);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setError(null);
    setMessage(null);
    
    const result = await resendOtp(email);
    if (result.success) {
      setMessage(result.message);
      setResendCooldown(60); // 60 seconds cooldown
    } else {
      setError(result.error);
    }
  };

  if (!email) return null; // Prevent showing empty page before redirect

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100 text-center">
          
          <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
             <ShieldCheck size={32} />
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Verify your email</h2>
          <p className="text-sm text-slate-500 mb-8">
            We've sent a 6-digit confirmation code to <br/>
            <span className="font-semibold text-slate-800">{email}</span>
          </p>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-md p-4 text-sm flex items-start animate-fade-in-up">
              <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
              <span className="text-left">{error}</span>
            </div>
          )}
          
          {message && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-md p-4 text-sm flex items-start animate-fade-in-up">
              <ShieldCheck className="w-5 h-5 mr-3 shrink-0" />
              <span className="text-left">{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center gap-2 sm:gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-10 h-12 sm:w-12 sm:h-14 bg-slate-50 border border-slate-300 text-center text-xl font-semibold text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 shadow-md transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                <>
                  Verify Account
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-sm text-slate-500">
             Didn't receive the code?{' '}
             <button 
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="font-semibold text-primary hover:text-blue-700 transition-colors disabled:text-slate-400 disabled:cursor-not-allowed"
             >
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
