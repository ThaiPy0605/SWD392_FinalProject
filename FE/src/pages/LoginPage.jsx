import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [registerError, setRegisterError] = useState('');

  const isRegister = mode === 'register';

  const switchMode = (nextMode) => {
    setError('');
    setRegisterError('');
    setMode(nextMode);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!email.trim()) return setError('Please enter your email address.');
    if (password.length < 6) return setError('Password must contain at least 6 characters.');

    try {
      const result = await login(email, password);
      if (!result?.success) {
        setError(result?.message || 'Invalid email or password.');
        return;
      }
      const userRole = result.user.role;
      if (userRole === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    }
  };

  const handleRegister = (event) => {
    event.preventDefault();
    setRegisterError('');

    if (!registerForm.fullName.trim() || !registerForm.email.trim()) {
      setRegisterError('Please enter your name and email address.');
      return;
    }
    if (!/^\d{8,10}$/.test(registerForm.phone)) {
      setRegisterError('Please enter a valid Vietnamese phone number.');
      return;
    }
    if (registerForm.password.length < 6) {
      setRegisterError('Password must contain at least 6 characters.');
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('The confirmation password does not match.');
      return;
    }

    setRegisterError('Registration is not available yet because the backend does not provide a registration API.');
  };

  const updateRegisterField = (field, value) => {
    setRegisterForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <main className={`login-page ${isRegister ? 'login-page--register' : 'login-page--signin'}`}>
      <section className="login-story" aria-label={isRegister ? 'Welcome to OhStem' : 'About OhStem'}>
        <Link to="/" className="login-back">
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          Back to catalog
        </Link>

        <div className="login-story__brand">
          <span className="landing-brand__mark" aria-hidden="true">O</span>
          <strong>OhStem</strong>
        </div>

        <div className="login-story__copy" key={mode}>
          <span className="hero-kicker">
            <span className="material-symbols-outlined" aria-hidden="true">
              {isRegister ? 'waving_hand' : 'science'}
            </span>
            {isRegister ? 'Welcome to OhStem' : 'Learn by making'}
          </span>
          <h1>
            {isRegister
              ? 'Good to see you again, maker.'
              : 'Where young ideas become real inventions.'}
          </h1>
          <p>
            {isRegister
              ? 'Sign in to continue building, track your learning kits, and manage every new idea.'
              : 'Build robots, explore IoT, and grow the confidence to solve tomorrow’s problems.'}
          </p>
        </div>

        {isRegister ? (
          <div className="login-story__switch">
            <span>Already have an account?</span>
            <button type="button" onClick={() => switchMode('login')}>
              Sign in
              <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </button>
          </div>
        ) : (
          <div className="login-story__visual" aria-hidden="true">
            <div className="login-story__orb" />
            <span className="material-symbols-outlined">precision_manufacturing</span>
            <div className="login-story__fact">
              <strong>50+</strong>
              <span>hands-on projects</span>
            </div>
          </div>
        )}
      </section>

      <section className="login-panel">
        <Link to="/" className="login-back login-back--mobile">
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          Back
        </Link>

        <div className={`login-card ${isRegister ? 'login-card--register' : ''}`}>
          <div className="login-card__heading">
            <span className="eyebrow">{isRegister ? 'Create your profile' : 'Welcome back'}</span>
            <h2>{isRegister ? 'Join OhStem' : 'Sign in to OhStem'}</h2>
            <p>
              {isRegister
                ? 'Start learning, building, and managing your STEM kits.'
                : 'Continue your learning and manage your orders.'}
            </p>
          </div>

          {isRegister ? (
            <>
              {registerError && (
                <div className="login-error" role="alert">
                  <span className="material-symbols-outlined" aria-hidden="true">error</span>
                  {registerError}
                </div>
              )}
              <form onSubmit={handleRegister} className="register-form">
                <label className="register-form__wide">
                  <span>Full name</span>
                  <div className="login-input">
                    <span className="material-symbols-outlined" aria-hidden="true">person</span>
                    <input
                      type="text"
                      value={registerForm.fullName}
                      onChange={(event) => updateRegisterField('fullName', event.target.value)}
                      placeholder="Nguyen Van A"
                      autoComplete="name"
                    />
                  </div>
                </label>
                <label className="register-form__wide">
                  <span>Email address</span>
                  <div className="login-input">
                    <span className="material-symbols-outlined" aria-hidden="true">mail</span>
                    <input
                      type="email"
                      value={registerForm.email}
                      onChange={(event) => updateRegisterField('email', event.target.value)}
                      placeholder="maker@example.com"
                      autoComplete="email"
                    />
                  </div>
                </label>
                <label className="register-form__wide">
                  <span>Phone number</span>
                  <div className="register-phone">
                    <span className="register-phone__prefix" aria-label="Vietnam country code">🇻🇳 +84</span>
                    <input
                      type="tel"
                      value={registerForm.phone}
                      onChange={(event) => updateRegisterField('phone', event.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="912 345 678"
                      autoComplete="tel"
                    />
                  </div>
                </label>
                <label>
                  <span>Password</span>
                  <div className="login-input">
                    <span className="material-symbols-outlined" aria-hidden="true">lock</span>
                    <input
                      type="password"
                      value={registerForm.password}
                      onChange={(event) => updateRegisterField('password', event.target.value)}
                      placeholder="6+ characters"
                      autoComplete="new-password"
                    />
                  </div>
                </label>
                <label>
                  <span>Confirm password</span>
                  <div className="login-input">
                    <span className="material-symbols-outlined" aria-hidden="true">verified_user</span>
                    <input
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={(event) => updateRegisterField('confirmPassword', event.target.value)}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                    />
                  </div>
                </label>
                <label className="register-terms register-form__wide">
                  <input type="checkbox" required />
                  <span>I agree to the Terms of Service and Privacy Policy.</span>
                </label>
                <button type="submit" className="login-submit register-form__wide">
                  Create account
                  <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
                </button>
              </form>
              <p className="login-card__footer login-card__footer--mobile">
                Already registered? <button type="button" onClick={() => switchMode('login')}>Sign in</button>
              </p>
            </>
          ) : (
            <>
              {error && (
                <div className="login-error" role="alert">
                  <span className="material-symbols-outlined" aria-hidden="true">error</span>
                  {error}
                </div>
              )}
              <form onSubmit={handleLogin} className="login-form">
                <label>
                  <span>Email address</span>
                  <div className="login-input">
                    <span className="material-symbols-outlined" aria-hidden="true">mail</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="student@ohstem.edu"
                      autoComplete="email"
                    />
                  </div>
                </label>
                <label>
                  <span>Password</span>
                  <div className="login-input">
                    <span className="material-symbols-outlined" aria-hidden="true">lock</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 6 characters"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </label>
                <div className="login-form__options">
                  <label className="login-checkbox">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#forgot-password">Forgot password?</a>
                </div>
                <button type="submit" className="login-submit">
                  Sign in
                  <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
                </button>
              </form>

              <p className="login-card__footer">
                New to OhStem?{' '}
                <button type="button" onClick={() => switchMode('register')}>Create an account</button>
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
