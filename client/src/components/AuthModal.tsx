import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { X, Mail, Lock, User, HelpCircle, Eye, EyeOff } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
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
  const { signIn, signUp, signInWithGoogle, user } = useAuth()
  const { toast } = useToast()

  // Auto-close modal when user signs in successfully
  useEffect(() => {
    if (user && isOpen) {
      console.log('🔐 User authenticated, auto-closing modal')
      onClose()
    }
  }, [user, isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Basic inline validation
    if (!email || !password || (isSignUp && (!username || password.length < 6))) {
      toast({
        title: 'Incomplete form',
        description: isSignUp ? 'Please enter a valid email, username, and a password with 6+ characters.' : 'Please enter your email and password.',
        variant: 'destructive'
      })
      return
    }
    setLoading(true)

    console.log('Auth form submitted:', { isSignUp, email, username })

    try {
      if (isSignUp) {
        console.log('Attempting sign-up...')
        const { data, error } = await signUp(email, password, username)
        console.log('Sign-up result:', { data, error })
        
        if (error) {
          console.error('Sign-up error:', error)
          throw error
        }
        
        console.log('Sign-up successful, user needs to verify email')
        toast({
          title: "Account Created!",
          description: "Please check your email to confirm your account before signing in.",
        })
        // Switch to sign-in mode after successful signup
        setIsSignUp(false)
        setPassword('')
      } else {
        console.log('Attempting sign-in...')
        const { data, error } = await signIn(email, password)
        console.log('Sign-in result:', { data, error })
        
        if (error) {
          console.error('Sign-in error:', error)
          throw error
        }
        
        console.log('Sign-in successful')
        // The useEffect will handle closing the modal when user state updates
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      console.log('Error details - code:', error.code, 'message:', error.message)
      
      let errorMessage = error.message
      
      // Provide helpful error messages based on error code and message
      if (error.code === 'invalid_credentials' || error.message?.includes('Invalid login credentials') || error.message?.includes('Invalid login credentials')) {
        errorMessage = "❌ Invalid email or password. Please check your credentials and try again."
      } else if (error.code === 'invalid_grant' || error.message?.includes('Invalid login credentials')) {
        errorMessage = "❌ Wrong password. Please check your password and try again."
      } else if (error.message?.includes('Email not confirmed') || error.code === 'email_not_confirmed') {
        errorMessage = "📧 Please check your email and click the confirmation link before signing in."
      } else if (error.message?.includes('Password should be at least') || error.code === 'weak_password') {
        errorMessage = "🔒 Password must be at least 6 characters long."
      } else if (error.message?.includes('Unable to validate email address') || error.code === 'invalid_email') {
        errorMessage = "📧 Please enter a valid email address."
      } else if (error.message?.includes('User already registered') || error.code === 'user_already_exists') {
        errorMessage = "👤 An account with this email already exists. Try signing in instead."
        setIsSignUp(false) // Switch to sign-in mode
      } else if (error.code === 'signup_disabled') {
        errorMessage = "🚫 New user registration is currently disabled. Please contact support."
      } else if (error.code === 'email_address_invalid') {
        errorMessage = "📧 Please enter a valid email address."
      } else if (error.message?.includes('Too many requests') || error.code === 'too_many_requests') {
        errorMessage = "⏰ Too many login attempts. Please wait a few minutes before trying again."
      } else if (!errorMessage || errorMessage === 'AuthApiError') {
        // Fallback for generic or unclear errors
        errorMessage = isSignUp ? 
          "❌ Unable to create account. Please check your information and try again." :
          "❌ Sign in failed. Please check your email and password."
      }
      
      // Defer toast to next tick to avoid any mount race conditions
      setTimeout(() => {
        toast({
          title: "Authentication Error",
          description: errorMessage,
          variant: "destructive",
        })
        console.warn('Toast shown:', errorMessage)
      }, 0)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const { data, error } = await signInWithGoogle()
      if (error) {
        console.error('Google sign-in error:', error)
        throw error
      }
      
      console.log('Google sign-in initiated:', data)
      
      // For OAuth, the user will be redirected to Google and back
      // The page will refresh and auth state will be updated automatically
      // No need to handle success here as the redirect handles it
      
    } catch (error: any) {
      console.error('Google sign-in failed:', error)
      
      // Common OAuth issues
      if (error.message?.includes('popup') || error.message?.includes('blocked')) {
        toast({
          title: "Popup Blocked",
          description: "Please allow popups for this site and try again, or use email sign-in instead.",
          variant: "destructive",
        })
      } else if (error.message?.includes('refused to connect') || error.message?.includes('redirect_uri')) {
        setShowGoogleGuide(true)
        toast({
          title: "Google Setup Required",
          description: "Your domain needs to be added to Google Console. Click the help button for instructions.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Google Sign-In Error", 
          description: error.message || "Please try using email sign-in instead.",
          variant: "destructive",
        })
      }
      setLoading(false)
    }
  }



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-auto shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password {isSignUp && <span className="text-xs text-gray-500">(minimum 6 characters)</span>}
            </Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                placeholder={isSignUp ? "Create a password (6+ characters)" : "Enter your password"}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {isSignUp && password.length > 0 && password.length < 6 && (
                <p className="text-xs text-red-500 mt-1">Password must be at least 6 characters</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={loading || (isSignUp && password.length < 6)}
          >
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
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2 py-3 hover:bg-blue-50 border-gray-300"
                disabled={loading}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </Button>
              <Button
                type="button"
                onClick={() => setShowGoogleGuide(true)}
                variant="ghost"
                size="sm"
                className="absolute -right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Google setup help"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <GoogleSetupGuide 
          isOpen={showGoogleGuide} 
          onClose={() => setShowGoogleGuide(false)} 
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-1 text-purple-600 hover:text-purple-500 font-medium"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}