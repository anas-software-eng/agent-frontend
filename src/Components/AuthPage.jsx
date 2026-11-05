import { useState } from 'react'
import api from '../api'



const AuthPage = ({ mode }) => {
  const isSignup = mode === 'signup'
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const payload = isSignup
        ? formData
        : { email: formData.email, password: formData.password }

      await api.post(isSignup ? '/register' : '/login', payload)
      window.location.assign(isSignup ? '/login' : '/dashboard')
    } catch (error) {
      const responseMessage = error.response?.data
      setErrorMessage(
        typeof responseMessage === 'string'
          ? responseMessage
          : responseMessage?.message || 'Unable to complete your request. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
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
                value={formData.name}
                onChange={handleChange}
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
              value={formData.email}
               onChange={handleChange}
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
              value={formData.password}
               onChange={handleChange}
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

          <button className="auth-submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Please wait...' : isSignup ? 'Create account' : 'Log in'}
          </button>

          {errorMessage && (
            <p className="auth-notice" role="alert">
              {errorMessage}
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
