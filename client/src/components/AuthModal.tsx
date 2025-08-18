import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { X, Mail, Lock, User, HelpCircle, Eye, EyeOff } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { GoogleSetupGuide } from './GoogleSetupGuide'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showGoogleGuide, setShowGoogleGuide] = useState(false)
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { signIn, signUp, signInWithGoogle, user } = useAuth()
  const { toast } = useToast()

  // Close modal after successful sign-in, but show inline success briefly first
  useEffect(() => {
    if (user && isOpen) {
      if (!successMessage) setSuccessMessage("You're signed in. Redirecting...")
      const t = setTimeout(() => {
        onClose()
      }, 800)
      return () => clearTimeout(t)
    }
  }, [user, isOpen, successMessage, onClose])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Inline validation
    if (!email || !password || (isSignUp && (!username || password.length < 6))) {
      toast({
        title: 'Incomplete form',
        description: isSignUp ? 'Please enter a valid email, username, and a password with 6+ characters.' : 'Please enter your email and password.',
        variant: 'destructive',
      })
      setFormError(isSignUp ? 'Please complete all fields (password 6+ characters).' : 'Please enter your email and password.')
      return
    }
    setLoading(true)
    setFormError('')
    setSuccessMessage('')

    try {
      if (isSignUp) {
        const { data, error } = await signUp(email, password, username)
        if (error) throw error
        toast({
          title: 'Account Created!',
          description: 'Please check your email to confirm your account before signing in.',
        })
        setIsSignUp(false)
        setPassword('')
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        // Immediate success toast
        setTimeout(() => {
          toast({ title: 'Welcome back!', description: "You've been successfully signed in." })
        }, 0)
        setSuccessMessage("You're signed in. Redirecting...")
      }
    } catch (error: any) {
      // Map errors to friendly message
      let errorMessage = error?.message || 'Sign in failed. Please try again.'
      if (
        error?.code === 'invalid_credentials' ||
        /Invalid login credentials/i.test(errorMessage)
      ) {
        errorMessage = '❌ Invalid email or password. Please check your credentials and try again.'
      } else if (/Email not confirmed/i.test(errorMessage)) {
        errorMessage = '📧 Please confirm your email before signing in.'
      } else if (/Too many requests/i.test(errorMessage)) {
        errorMessage = '⏰ Too many attempts. Please wait a few minutes and try again.'
      }
      setFormError(errorMessage)
      setTimeout(() => {
        toast({ title: 'Authentication Error', description: errorMessage, variant: 'destructive' })
        // Also add a log to confirm dispatch in production
        console.warn('Toast shown:', errorMessage)
      }, 0)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) throw error
    } catch (error: any) {
      if (/popup/i.test(error?.message)) {
        toast({ title: 'Popup Blocked', description: 'Allow popups for this site and try again, or use email sign-in.', variant: 'destructive' })
      } else if (/redirect_uri|refused to connect/i.test(error?.message)) {
        setShowGoogleGuide(true)
        toast({ title: 'Google Setup Required', description: 'Add your domain to Google Console. Click the help button for instructions.', variant: 'destructive' })
      } else {
        toast({ title: 'Google Sign-In Error', description: error?.message || 'Please try using email sign-in instead.', variant: 'destructive' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-auto shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{isSignUp ? 'Create Account' : 'Sign In'}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-2">{successMessage}</div>
          )}
          {formError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">{formError}</div>
          )}

          {isSignUp && (
            <div>
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="pl-10" placeholder="Enter your username" required />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" placeholder="Enter your email" required />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password {isSignUp && (<span className="text-xs text-gray-500">(minimum 6 characters)</span>)}</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" placeholder={isSignUp ? 'Create a password (6+ characters)' : 'Enter your password'} required minLength={6} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {isSignUp && password.length > 0 && password.length < 6 && (
                <p className="text-xs text-red-500 mt-1">Password must be at least 6 characters</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading || (isSignUp && password.length < 6)}>
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="relative">
              <Button type="button" onClick={handleGoogleSignIn} variant="outline" className="w-full flex items-center justify-center space-x-2 py-3 hover:bg-blue-50 border-gray-300" disabled={loading}>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </Button>
              <Button type="button" onClick={() => setShowGoogleGuide(true)} variant="ghost" size="sm" className="absolute -right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" title="Google setup help">
                <HelpCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <GoogleSetupGuide isOpen={showGoogleGuide} onClose={() => setShowGoogleGuide(false)} />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="ml-1 text-purple-600 hover:text-purple-500 font-medium">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

