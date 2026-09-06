import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Inbox2DataBrand } from './Logos';

interface ParsingLoadingScreenProps {
  onComplete: () => void;
  promptText: string;
}

export function ParsingLoadingScreen({ onComplete, promptText }: ParsingLoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Reading plain English instructions...",
    "Synthesizing trigger condition for matching emails...",
    "Extracting column schema and validating data types...",
    "Constructing Google Sheets column mappings..."
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 500);
    const timer2 = setTimeout(() => setCurrentStep(2), 1100);
    const timer3 = setTimeout(() => setCurrentStep(3), 1700);
    const timer4 = setTimeout(() => {
      onComplete();
    }, 2300);

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
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px"
          }}
        >
          {/* Animated Glowing Icon */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-[#cfe9fd]/40 flex items-center justify-center text-[#009afc] animate-pulse">
              <Sparkles className="w-8 h-8 stroke-[1.8]" />
            </div>
            <div className="absolute -inset-1 rounded-2xl border border-[#009afc]/30 animate-ping opacity-25 pointer-events-none" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl text-[#000000] font-normal tracking-tight">
              Interpreting Your Automation
            </h2>
            <p className="text-xs text-[#5b6882] mt-1 line-clamp-1 italic max-w-xs mx-auto">
              "{promptText}"
            </p>
          </div>

          {/* Stepper Display */}
          <div className="w-full space-y-3 pt-2">
            {steps.map((step, idx) => {
              const isDone = idx < currentStep;
              const isCurrent = idx === currentStep;
              const isPending = idx > currentStep;

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
                  <span className="flex-1">{step}</span>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-[#808080] pt-2">
            Translating natural language into schema-safe Google Sheets sync...
          </div>
        </div>
      </div>
    </div>
  );
}
