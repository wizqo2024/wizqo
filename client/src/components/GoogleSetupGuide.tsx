import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, ExternalLink, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface GoogleSetupGuideProps {
  isOpen: boolean
  onClose: () => void
}

export function GoogleSetupGuide({ isOpen, onClose }: GoogleSetupGuideProps) {
  const { toast } = useToast()
  const currentDomain = window.location.origin
  const supabaseCallback = 'https://jerhbtrgwrlyoimhxqta.supabase.co/auth/v1/callback'

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Google OAuth Setup Instructions</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Quick Fix Required</h3>
            <p className="text-yellow-700 mb-2">
              Google OAuth needs authorized domains in Cloud Console OAuth consent screen.
            </p>
            <p className="text-sm text-yellow-600">
              This is a 5-minute setup that enables Google sign-in for all users.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Step 1: Add URLs to Google Cloud Console</h3>
            <p className="text-sm text-gray-600">
              Go to your Google Cloud Console → Credentials → Your OAuth 2.0 Client → Edit
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Current Replit Domain:</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 bg-gray-100 p-2 rounded text-sm break-all">
                    {currentDomain}
                  </code>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(currentDomain, "Domain")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Supabase Callback URL:</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 bg-gray-100 p-2 rounded text-sm break-all">
                    {supabaseCallback}
                  </code>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(supabaseCallback, "Callback URL")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Step 2: Update Authorized Redirect URIs</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="text-blue-600 hover:underline inline-flex items-center">Google Cloud Console <ExternalLink className="w-3 h-3 ml-1" /></a></li>
              <li>Find your OAuth 2.0 Client ID and click "Edit"</li>
              <li>In "Authorized redirect URIs", add both URLs above</li>
              <li>Click "Save"</li>
              <li>Wait 1-2 minutes for changes to take effect</li>
            </ol>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">After Setup</h3>
            <p className="text-green-700 text-sm">
              Once you've added the URLs to Google Console, the Google sign-in will work perfectly. 
              You can close this guide and try again in a minute or two.
            </p>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>
              Got it, I'll update Google Console
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}