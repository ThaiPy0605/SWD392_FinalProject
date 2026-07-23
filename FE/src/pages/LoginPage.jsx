import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    login(email, password);

    if (email.toLowerCase().includes('admin')) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  // Client-side Mock Google Authentication Handler
  const handleGoogleSignIn = () => {
    const googleUserProfile = {
      name: 'Tuan Phan',
      email: 'tuanpt2109@gmail.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt-adpYatyvcvUgp1Mg-Hqzl0OHcf3bO68bPNNwh40gMqZzcR9RAEUu0CFpgmcJm17oMAcrdY14-jcwncBiqq1uks4gdNnWOf3oCMdR7BtZFQRk7tO95Ag0mu58NksCiJHIUbBAQ7D925I70hMwdEpYmZ7E9UALoxeFTnpALisH3mZlptx6My45BGa0g7MiRTqYjk_tZV2CLlBjBGAdgVBwovgqUEWrrXvsE-KkxmKt7jxC4gAh8njpLv_pfgQzllRH4FHcFeCLMU'
    };

    if (loginWithGoogle) {
      loginWithGoogle(googleUserProfile);
      navigate('/');
    }
  };

  const handleMicrosoftMockLogin = () => {
    login('admin@ohstem.edu', '123456');
    navigate('/admin');
  };

  return (
    <main className="flex min-h-screen w-full flex-col md:flex-row bg-surface relative">
      {/* Return to shop / guest floating arrow */}
      <Link 
        to="/" 
        className="absolute top-4 left-4 z-50 flex items-center gap-1 text-label-md text-on-surface-variant hover:text-primary transition-colors font-semibold"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Return to Shop
      </Link>

      {/* Left Panel: Brand & Imagery (Hidden on mobile) */}
      <section className="hidden md:flex flex-col flex-1 relative overflow-hidden bg-gradient-to-br from-secondary to-primary-container p-lg items-center justify-between">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="z-10 w-full max-w-md flex flex-col items-center mt-xl">
          <img 
            alt="OhStem Logo" 
            className="h-16 w-auto mb-lg shadow-sm rounded-lg mix-blend-screen" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6x6nbERRja5bopU99-ELncsBxFfMhrrJUUv8SUjkyEemBq9yhDEfVxfY9F8tB4WoObNb5j6aivTBlzx-4m94xYgTe04-SV10pz2hRvj2iAJVs4XRGzgEkyDs5IzSABw2H9X5DYoDoWmkfbnr4PXPw_8R9hF63JgaPYK5BrLHi3dJ5ZcZ6yfblG72RQHjDDtym_ILBnFtz7J9U7ZRID8qPM6vy3XMyVQ9ZBas5-BlG_DDVkk8J3qQ2n6pg9obDDl0Ql1E4iAhXswU"
          />
          <h1 className="font-display-lg text-display-lg text-on-primary text-center leading-tight mb-sm drop-shadow-md">
            Welcome to<br />OhStem Education
          </h1>
          <p className="font-body-lg text-body-lg text-inverse-on-surface text-center opacity-90 max-w-sm">
            Empowering the next generation of innovators through interactive STEM learning.
          </p>
        </div>
        <div className="z-10 w-full max-w-lg mt-auto mb-xl relative">
          <div className="absolute -inset-4 bg-white/10 rounded-full blur-3xl opacity-50"></div>
          <img 
            alt="3D Robotics Illustration" 
            className="w-full h-auto object-contain drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500 ease-in-out cursor-pointer" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYeD2_Mk96I7i6BmwxxEBGdauqgZgBzl3h-OtgOVGNaj_90K7DwODCFNde3IzFkSHVhMwsKo-KCLaUF8qGYcMjiLnPF9XQGlY5VB7RhXQp4lU-pmJ64uYATrWVpoRWf64YYlyVFwKhPhsTuLcWe25Zyi29zP-l_JGOFl4iyod1E1jBpirxSZ9mgOnZLYQ49VSFY5HFONUpYZG3dNK6qzuOJGhWW0Qltp_m3dwSh96PT7aRot9MlUw4BAXQgYZ-a46GxgRSt-lE4sQ"
          />
        </div>
      </section>

      {/* Right Panel: Authentication Form */}
      <section className="flex flex-1 flex-col justify-center items-center p-md md:p-lg bg-surface-container-lowest">
        <div className="md:hidden flex items-center justify-center mb-lg">
          <img 
            alt="OhStem Logo" 
            className="h-12 w-auto bg-primary rounded-lg p-2" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6x6nbERRja5bopU99-ELncsBxFfMhrrJUUv8SUjkyEemBq9yhDEfVxfY9F8tB4WoObNb5j6aivTBlzx-4m94xYgTe04-SV10pz2hRvj2iAJVs4XRGzgEkyDs5IzSABw2H9X5DYoDoWmkfbnr4PXPw_8R9hF63JgaPYK5BrLHi3dJ5ZcZ6yfblG72RQHjDDtym_ILBnFtz7J9U7ZRID8qPM6vy3XMyVQ9ZBas5-BlG_DDVkk8J3qQ2n6pg9obDDl0Ql1E4iAhXswU"
          />
        </div>
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-outline-variant/30 p-lg hover:shadow-md transition-shadow duration-300">
          {/* Form Header */}
          <div className="mb-lg text-center md:text-left">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs font-bold">Sign In to OhStem</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Continue your learning journey.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error-container/50 border border-error/20 rounded-lg text-error text-label-md flex items-center gap-2">
              <span className="material-symbols-outlined text-base font-bold">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-sm">
            {/* Email Field */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-base" htmlFor="email">Email Address</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">mail</span>
                </div>
                <input 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface font-body-md focus:outline-none transition-all duration-200" 
                  id="email" 
                  name="email" 
                  placeholder="student@ohstem.edu or admin@ohstem.edu" 
                  type="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-base" htmlFor="password">Password</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">lock</span>
                </div>
                <input 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input block w-full pl-10 pr-10 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface font-body-md focus:outline-none transition-all duration-200" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  type={showPassword ? 'text' : 'password'}
                />
                <button 
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label="Toggle password visibility" 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface-variant focus:outline-none" 
                  type="button"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-xs pb-sm">
              <div className="flex items-center">
                <input 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-secondary border-outline-variant rounded transition-colors duration-200 cursor-pointer" 
                  id="remember-me" 
                  name="remember-me" 
                  type="checkbox"
                />
                <label className="ml-2 block font-label-md text-label-md text-on-surface-variant cursor-pointer" htmlFor="remember-me">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a className="font-label-md text-label-md text-secondary hover:text-secondary-container transition-colors duration-200" href="#">
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Primary Sign In Button */}
            <div>
              <button 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-on-primary bg-primary-container hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container transition-colors duration-200 font-bold" 
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-lg relative">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/50"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white font-label-sm text-label-sm text-on-surface-variant">Or continue with</span>
            </div>
          </div>

          {/* Social Logins / Quick Access */}
          <div className="mt-lg flex flex-col gap-sm">
            {/* Styled Google Sign In Button */}
            <button 
              onClick={handleGoogleSignIn}
              className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-outline-variant rounded-lg shadow-sm bg-white font-label-md text-label-md text-on-surface hover:bg-surface-container-low focus:outline-none transition-all duration-200 group cursor-pointer font-semibold" 
              type="button"
            >
              <svg className="h-5 w-5 mr-2.5 group-hover:scale-105 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Sign in with Google
            </button>

            {/* Microsoft Admin Quick Access */}
            <button 
              onClick={handleMicrosoftMockLogin}
              className="w-full inline-flex justify-center items-center py-2 px-4 border border-outline-variant rounded-lg shadow-sm bg-white font-label-md text-label-md text-on-surface hover:bg-surface-container-low focus:outline-none transition-colors group" 
              type="button"
            >
              <svg className="h-5 w-5 mr-2 group-hover:scale-105 transition-transform" fill="currentColor" viewBox="0 0 21 21">
                <path d="M10 0H0v10h10V0z" fill="#f25022"></path>
                <path d="M21 0H11v10h10V0z" fill="#7fba00"></path>
                <path d="M10 11H0v10h10V11z" fill="#00a4ef"></path>
                <path d="M21 11H11v10h10V11z" fill="#ffb900"></path>
              </svg>
              Quick Admin Login (Microsoft)
            </button>
          </div>

          {/* Continue as Guest Button */}
          <div className="mt-4">
            <Link 
              to="/" 
              className="w-full flex justify-center py-2 px-4 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface bg-surface-container-low hover:bg-surface-container transition-colors text-center font-bold"
            >
              Continue as Guest
            </Link>
          </div>

          {/* Sign Up Link */}
          <div className="mt-lg pt-sm border-t border-outline-variant/30 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Don't have an account?{' '}
              <a className="font-label-md text-label-md text-primary hover:text-primary-container font-semibold transition-colors duration-200" href="#">
                Sign Up
              </a>
            </p>
          </div>
        </div>
        
        {/* Simple Footer */}
        <div className="mt-xl text-center">
          <p className="font-label-sm text-label-sm text-outline">
            © 2024 OhStem Education. Empowering future innovators.
          </p>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
