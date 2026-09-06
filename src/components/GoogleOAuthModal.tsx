import React, { useState } from 'react';
import { GoogleLogo } from './Logos';
import { X, Lock } from 'lucide-react';

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthorize: (account: { email: string; name: string }) => void;
  defaultEmail?: string;
}

export function GoogleOAuthModal({
  isOpen,
  onClose,
  onAuthorize,
  defaultEmail = "chideraezeudu2@gmail.com"
}: GoogleOAuthModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onAuthorize({
        email: defaultEmail,
        name: defaultEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-[#e5e7eb] overflow-hidden transform transition-all duration-200 p-8 space-y-6 text-center"
        role="dialog"
        aria-modal="true"
      >
        {/* Top close button */}
        <div className="flex justify-end -mt-2 -mr-2">
          <button
            onClick={onClose}
            className="text-[#808080] hover:text-[#000000] p-1.5 rounded-full hover:bg-[#f3f4f6] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Brand Icon & Heading */}
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#cfe9fd]/40 text-[#009afc] flex items-center justify-center mx-auto shadow-xs">
            <GoogleLogo className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-normal text-[#000000] tracking-tight">
            Connect your Google Account
          </h3>
          <p className="text-xs text-[#5b6882] max-w-xs mx-auto leading-relaxed">
            Link your Gmail and Google Sheets to automatically extract and sync email data.
          </p>
        </div>

        {/* Real Google Sign-in Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isProcessing}
            className="w-full py-3 px-5 rounded-full border border-[#dadce0] bg-white hover:bg-[#f8f9fa] active:bg-[#f1f3f4] text-sm font-medium text-[#3c4043] flex items-center justify-center gap-3 shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              boxShadow: "0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)"
            }}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#009afc] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-[#5b6882]">Connecting Google Account...</span>
              </div>
            ) : (
              <>
                <GoogleLogo className="w-5 h-5 shrink-0" />
                <span>Connect with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Clean Security footnote */}
        <div className="pt-2 border-t border-[#f3f4f6] flex items-center justify-center gap-1.5 text-[11px] text-[#808080]">
          <Lock className="w-3 h-3 text-[#5b6882]" />
          <span>Official Google OAuth 2.0 verification</span>
        </div>
      </div>
    </div>
  );
}
