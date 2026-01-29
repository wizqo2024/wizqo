import React from 'react';
import { Button } from './ui/button';
import { Share2, Mail, MessageCircle, Pin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialShareProps {
    url: string;
    title: string;
    media?: string; // Image URL for Pinterest
    className?: string;
}

export function SocialShare({ url, title, media, className = "" }: SocialShareProps) {
    const { toast } = useToast();
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedMedia = media ? encodeURIComponent(media) : "";

    const shareLinks = {
        pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedMedia}&description=${encodedTitle}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
        email: `mailto:?subject=${encodedTitle}&body=Check out this awesome worksheet generator: ${encodedUrl}`
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        toast({
            title: "Link Copied!",
            description: "Share it with your friends or colleagues.",
        });
    };

    return (
        <div className={`flex flex-wrap items-center gap-3 ${className}`}>
            <span className="text-sm font-medium text-slate-500 mr-1 flex items-center gap-1">
                <Share2 className="w-4 h-4" /> Share:
            </span>

            {/* Pinterest */}
            <a
                href={shareLinks.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-[#E60023] px-3 text-white hover:bg-[#ad001a] transition-colors"
                title="Share on Pinterest"
            >
                <Pin className="w-4 h-4 mr-2" />
                <span className="text-xs font-bold">Pin it</span>
            </a>

            {/* WhatsApp */}
            <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-[#25D366] px-3 text-white hover:bg-[#128C7E] transition-colors"
                title="Share on WhatsApp"
            >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span className="text-xs font-bold">WhatsApp</span>
            </a>

            {/* Email */}
            <a
                href={shareLinks.email}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-800 px-3 text-white hover:bg-slate-900 transition-colors"
                title="Share via Email"
            >
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-xs font-bold">Email</span>
            </a>

            {/* Copy Link */}
            <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="h-9 border-slate-200 text-slate-600 hover:bg-slate-50"
            >
                <span className="text-xs font-bold text-nowrap">Copy Link</span>
            </Button>
        </div>
    );
}
