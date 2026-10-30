import { useState } from 'react'

const AuthPage = ({ mode }) => {
  const isSignup = mode === 'signup'
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <a className="auth-brand" href="/" aria-label="A.T.O.M home">
          <span className="logo-mark">A</span>
          <span className="logo-text">A.T.O.M</span>
        </a>

        <div className="auth-heading">
          <span className="eyebrow">{isSignup ? 'Start for free' : 'Welcome back'}</span>
          <h1 id="auth-title">{isSignup ? 'Create your account' : 'Sign in to A.T.O.M'}</h1>
          <p>
            {isSignup
              ? 'Create an account to find your next favorite product.'
              : 'Enter your details to continue to your account.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <label>
              Full name
              <input
                autoComplete="name"
                name="name"
                placeholder="Your name"
                required
                type="text"
              />
            </label>
          )}

          <label>
            Email address
            <input
              autoComplete="email"
              name="email"
              placeholder="you@example.com"
              required
              type="email"
            />
          </label>

          <label>
            Password
            <input
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              minLength={isSignup ? 8 : undefined}
              name="password"
              placeholder={isSignup ? 'At least 8 characters' : 'Enter your password'}
              required
              type="password"
            />
          </label>

          {isSignup && (
            <label className="terms-field">
              <input name="terms" required type="checkbox" />
              <span>I agree to the terms of service and privacy policy.</span>
            </label>
          )}

          {!isSignup && (
            <p className="auth-help">Need help signing in? Contact your administrator.</p>
          )}

          <button className="auth-submit" type="submit">
            {isSignup ? 'Create account' : 'Log in'}
          </button>

          {submitted && (
            <p className="auth-notice" role="status">
              Authentication is not connected yet. Please contact your administrator to enable access.
            </p>
          )}
        </form>

        <p className="auth-switch">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <a href={isSignup ? '/login' : '/signup'}>
            {isSignup ? 'Log in' : 'Sign up'}
          </a>
        </p>
      </section>
    </main>
  )
}

export default AuthPage
