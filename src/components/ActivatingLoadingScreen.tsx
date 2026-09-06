import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { GoogleSheetsLogo, Inbox2DataBrand } from './Logos';

interface ActivatingLoadingScreenProps {
  automationName: string;
  destinationSheet: string;
  onComplete: () => void;
}

export function ActivatingLoadingScreen({
  automationName,
  destinationSheet,
  onComplete
}: ActivatingLoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Validating extraction schema and field data types...",
    "Registering Gmail webhook and search filter rule...",
    `Binding to Google Sheet: "${destinationSheet}"...`,
    "Deploying real-time inbox listener and activating sync..."
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 600);
    const timer2 = setTimeout(() => setCurrentStep(2), 1300);
    const timer3 = setTimeout(() => setCurrentStep(3), 2000);
    const timer4 = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#000000] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        {/* Floating Card */}
        <div
          className="bg-white rounded-3xl p-8 border border-[#e5e7eb] shadow-sm flex flex-col items-center text-center space-y-6"
          style={{
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 2px 4px 0px"
          }}
        >
          {/* Animated Glowing Icon */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 animate-pulse">
              <GoogleSheetsLogo className="w-8 h-8" />
            </div>
            <div className="absolute -inset-1 rounded-2xl border border-emerald-500/30 animate-ping opacity-25 pointer-events-none" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 mb-2">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Final Step • Activation</span>
            </div>
            <h2 className="text-xl sm:text-2xl text-[#000000] font-normal tracking-tight">
              Activating Your Automation
            </h2>
            <p className="text-xs text-[#5b6882] mt-1 font-medium max-w-xs mx-auto truncate">
              {automationName}
            </p>
          </div>

          {/* Stepper Display */}
          <div className="w-full space-y-3 pt-2">
            {steps.map((step, idx) => {
              const isDone = idx < currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 p-2.5 rounded-xl text-left text-xs transition-all duration-300 ${
                    isCurrent
                      ? "bg-[#cfe9fd]/30 text-[#006dc8] font-medium border border-[#cfe9fd]"
                      : isDone
                      ? "text-[#000000] font-medium"
                      : "text-[#808080] opacity-50"
                  }`}
                >
                  <div className="shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 stroke-[2.2]" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 border-2 border-[#009afc] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[#d1d1d1]" />
                    )}
                  </div>
                  <span className="flex-1 line-clamp-2">{step}</span>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-[#808080] pt-2">
            Connecting inbox2data worker to Google Drive & Gmail API...
          </div>
        </div>
      </div>
    </div>
  );
}
