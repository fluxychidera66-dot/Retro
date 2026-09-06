import React from 'react';
import { X, Shield, FileText } from 'lucide-react';
import { Inbox2DataBrand } from './Logos';

interface LegalModalProps {
  isOpen: boolean;
  type: 'terms' | 'privacy';
  onClose: () => void;
}

export function LegalModal({ isOpen, type, onClose }: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-[#e5e7eb] flex flex-col max-h-[85vh] overflow-hidden"
        role="dialog"
      >
        <div className="p-5 border-b border-[#e5e7eb] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            {type === 'terms' ? (
              <FileText className="w-5 h-5 text-[#009afc]" />
            ) : (
              <Shield className="w-5 h-5 text-[#009afc]" />
            )}
            <h3 className="text-base font-semibold text-[#000000]">
              {type === 'terms' ? "Terms of Service" : "Privacy Policy"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#808080] hover:text-[#000000] hover:bg-[#f3f4f6]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#5b6882] leading-relaxed">
          {type === 'terms' ? (
            <>
              <div>
                <strong className="text-[#000000] block text-sm mb-1">1. Eligibility</strong>
                You must be at least 18 years old and able to form a binding contract to use inbox2data. By using the Service, you represent that you meet these requirements.
              </div>
              <div>
                <strong className="text-[#000000] block text-sm mb-1">2. The Service</strong>
                inbox2data connects to your Gmail account and, based on instructions you provide in natural plain English, uses artificial intelligence to identify and extract information from your emails and attachments, writing that information to Google Sheets. You are responsible for reviewing extracted data for accuracy.
              </div>
              <div>
                <strong className="text-[#000000] block text-sm mb-1">3. Google Account Access</strong>
                inbox2data requests access to your Gmail and Google Sheets accounts via Google's OAuth authorization. We access only the data necessary to provide the Service and only in the manner you configure. You may revoke this access at any time through your Google Account settings.
              </div>
              <div>
                <strong className="text-[#000000] block text-sm mb-1">4. Data Accuracy Disclaimer</strong>
                The Service uses AI to extract data from unstructured content. Extraction may contain errors. You are solely responsible for verifying the accuracy of any data before using it for financial, legal, or other business decisions.
              </div>
            </>
          ) : (
            <>
              <div>
                <strong className="text-[#000000] block text-sm mb-1">1. Information We Collect</strong>
                Account information (name, email address from Google Sign-In), Gmail data (email content and attachments authorized to run automations), and Google Sheets destination data.
              </div>
              <div>
                <strong className="text-[#000000] block text-sm mb-1">2. How We Use Information</strong>
                We use information solely to operate the Service: to match specified emails, extract requested fields, and write them to your designated Google Sheet.
              </div>
              <div>
                <strong className="text-[#000000] block text-sm mb-1">3. AI Processing & Google API Disclosure</strong>
                Email and attachment content is processed only to fulfill your extraction requests. It is never used to train public generative AI models and is never sold or shared with advertisers. inbox2data's use and transfer to any other app of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.
              </div>
              <div>
                <strong className="text-[#000000] block text-sm mb-1">4. Data Retention & Revocation</strong>
                You may disconnect your Gmail or Google Sheets access at any time via your Google Account settings or within inbox2data settings, and request permanent deletion of your data.
              </div>
            </>
          )}
        </div>

        <div className="p-4 bg-[#f9fafb] border-t border-[#e5e7eb] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium bg-[#000000] text-white rounded-full hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
