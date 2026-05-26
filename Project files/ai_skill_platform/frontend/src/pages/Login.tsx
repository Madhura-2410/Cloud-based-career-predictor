import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiPhone, FiArrowRight } from 'react-icons/fi';
import { useUser } from '../context/UserContext';

interface LoginProps {
  setIsAuthenticated?: (val: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    contact: ''
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { updateUserProfile } = useUser();

  const validateEmail = (email: string) => {
    if (!email) return 'Email is required';
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      return 'Email must be a valid @gmail.com address';
    }
    return '';
  };

  const validatePassword = (pass: string) => {
    if (!pass) return 'Password is required';
    if (pass.length < 6) return 'Password must be at least 6 characters';
    if (!/[A-Z]/.test(pass)) return 'Password must contain at least 1 uppercase letter';
    if (!/[a-z]/.test(pass)) return 'Password must contain at least 1 lowercase letter';
    if (!/[0-9]/.test(pass)) return 'Password must contain at least 1 number';
    if (!/[^A-Za-z0-9]/.test(pass)) return 'Password must contain at least 1 special character';
    return '';
  };

  const validateField = (name: string, value: string) => {
    if (isLogin) {
      if (name === 'username') {
        if (!value) return 'Username or Email is required';
        if (value.includes('@') && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
          return 'If entering an email, it must be a @gmail.com address';
        }
      }
      if (name === 'password') {
        return validatePassword(value);
      }
      return '';
    } else {
      if (name === 'name' && !value.trim()) return 'Name is required';
      if (name === 'email') return validateEmail(value);
      if (name === 'contact') {
        if (!value) return 'Contact number is required';
        if (!/^\+?[0-9]{8,15}$/.test(value)) return 'Invalid contact number format';
      }
      if (name === 'password') return validatePassword(value);
      return '';
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (isLogin) {
      const uErr = validateField('username', formData.username);
      const pErr = validateField('password', formData.password);
      if (uErr) newErrors.username = uErr;
      if (pErr) newErrors.password = pErr;
    } else {
      const nErr = validateField('name', formData.name);
      const eErr = validateField('email', formData.email);
      const cErr = validateField('contact', formData.contact);
      const pErr = validateField('password', formData.password);
      if (nErr) newErrors.name = nErr;
      if (eErr) newErrors.email = eErr;
      if (cErr) newErrors.contact = cErr;
      if (pErr) newErrors.password = pErr;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((k) => { allTouched[k] = true; });
    setTouched(allTouched);

    if (validate()) {
      const displayName = isLogin
        ? formData.name || formData.username.split('@')[0] || 'Guest User'
        : formData.name;
      
      const emailVal = isLogin 
        ? (formData.username.includes('@') ? formData.username : `${formData.username.toLowerCase()}@gmail.com`) 
        : formData.email;
      
      updateUserProfile({ 
        name: displayName,
        password: formData.password,
        email: emailVal,
        contactNumber: isLogin ? '1234567890' : formData.contact,
      });
      if (setIsAuthenticated) setIsAuthenticated(true);
      navigate('/input');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErr = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldErr }));
  };

  const getInputClass = (name: string) => {
    const base = "w-full bg-white border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900 shadow-sm ";
    if (!touched[name]) return base + "border-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500";
    if (errors[name]) return base + "border-red-500 ring-2 ring-red-500/20 focus:ring-2 focus:ring-red-500/50 focus:border-red-500";
    return base + "border-green-500 ring-2 ring-green-500/10 focus:ring-2 focus:ring-green-500/50 focus:border-green-500";
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px]"></div>

      <div className="z-10 text-center mb-10 max-w-3xl">
        <h1 className="text-2xl md:text-4xl font-black mb-4 tracking-tight leading-tight uppercase text-slate-900">
          Cloud based career longevity and <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            skill obsolescence predictor
          </span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Future-proof your career path. Leverage AI to anticipate market shifts, 
          track skill decay, and navigate your professional evolution.
        </p>
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-2xl overflow-hidden p-8">
          {/* Toggle Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 border border-slate-200">
            <button
              onClick={() => { setIsLogin(true); setErrors({}); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                isLogin ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setErrors({}); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                !isLogin ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign up
            </button>
          </div>

          <form autoComplete="off" onSubmit={handleContinue} className="space-y-5">
            {!isLogin && (
              <>
                <div className="space-y-1">
                  <div className="relative group">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      autoComplete="off"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={getInputClass('name')}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs pl-1 font-bold">{errors.name}</p>}
                </div>

                <div className="space-y-1">
                  <div className="relative group">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="email"
                      autoComplete="off"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={getInputClass('email')}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs pl-1 font-bold">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <div className="relative group">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="tel"
                      autoComplete="off"
                      name="contact"
                      placeholder="Contact Number"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className={getInputClass('contact')}
                    />
                  </div>
                  {errors.contact && <p className="text-red-500 text-xs pl-1 font-bold">{errors.contact}</p>}
                </div>
              </>
            )}

            {isLogin && (
              <div className="space-y-1">
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username or Email"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={getInputClass('username')}
                  />
                </div>
                {errors.username && <p className="text-red-500 text-xs pl-1 font-bold">{errors.username}</p>}
              </div>
            )}

            <div className="space-y-1">
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  autoComplete="off"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={getInputClass('password')}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs pl-1 font-bold">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
            >
              Continue
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              {isLogin ? "New to the platform?" : "Already have an account?"}{" "}
              <button
                onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
                className="text-blue-600 font-bold hover:text-blue-800 transition-colors"
              >
                {isLogin ? "Sign up now" : "Login here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
