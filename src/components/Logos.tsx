import React from 'react';

export function GoogleLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function GmailLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4caf50" d="M45,16.2l-5,2.75l-0.5,4.72L45,40V16.2z"/>
      <path fill="#1e88e5" d="M3,16.2l5,2.75l0.5,4.72L3,40V16.2z"/>
      <path fill="#e53935" d="M45,16.2V11c0-2.209-1.791-4-4-4H33l-9,7.5L15,7H7C4.791,7,3,8.791,3,11v5.2l21,14.8L45,16.2z"/>
      <path fill="#c62828" d="M33,7H15L7,13.5l17,12.5l17-12.5L33,7z"/>
      <path fill="#fbc02d" d="M41,41h-6.5V26.5L45,18.5V37C45,39.209,43.209,41,41,41z"/>
      <path fill="#1565c0" d="M7,41h6.5V26.5L3,18.5V37C3,39.209,4.791,41,7,41z"/>
    </svg>
  );
}

export function GoogleSheetsLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      {/* Google Sheets Green Document with folded corner */}
      <path fill="#0F9D58" d="M37 42H11c-2.2 0-4-1.8-4-4V10c0-2.2 1.8-4 4-4h18l12 12v20c0 2.2-1.8 4-4 4z"/>
      <path fill="#87CEAC" d="M29 6v12h12z"/>
      {/* Official Google Sheets White Grid (Table Cells) */}
      <path fill="#FFFFFF" d="M14 20h20v16H14z"/>
      <path fill="#0F9D58" d="M14 25h20v1.5H14zm0 5.5h20v1.5H14zm6.5-10.5h1.5v16h-1.5z"/>
    </svg>
  );
}

export function StripeLogo({ className = "w-12 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M59.64 14.28c0-4.57-2.23-7.94-6.49-7.94-4.28 0-6.94 3.37-6.94 7.9 0 5.4 3.2 7.9 7.51 7.9 2.1 0 3.68-.46 4.88-1.12v-3.37c-1.2.62-2.5 1-4.24 1-1.68 0-3.15-.65-3.35-2.61h9.54c0-.2.09-.85.09-1.76zm-8.62-1.57c0-1.77.9-2.52 2.13-2.52 1.18 0 2.08.75 2.08 2.52h-4.21zm-7.66-6.37c-1.3 0-2.22.61-2.73 1.05l-.18-.84h-3.95v19.49l4.8-1.02.01-4.83c.53.38 1.34.88 2.5.88 2.65 0 5.25-2.09 5.25-7.39.01-5.01-2.66-7.34-5.7-7.34zm-1.13 11.23c-.77 0-1.23-.27-1.57-.64l-.03-6.19c.39-.42.89-.66 1.6-.66 1.25 0 2.13 1.35 2.13 3.73 0 2.45-.87 3.76-2.13 3.76zm-9.74-13.43l-4.8 1.02v3.74h-2.37v3.66h2.37v6.62c0 3.24 1.63 4.96 4.67 4.96 1.15 0 2.05-.18 2.54-.42v-3.48c-.42.15-2.68.8-2.68-1.7v-5.98h3.32v-3.66h-3.32l.27-4.76zm-10.4 2.37c0-1.42-1.15-2.03-2.55-2.03-1.56 0-2.87.67-3.63 1.22l-1.07-3.32c1.04-.64 2.87-1.28 5.16-1.28 4.22 0 6.9 2.1 6.9 5.86v13.62h-4.81v-1.43c-.85 1.01-2.04 1.76-3.8 1.76-2.92 0-4.9-1.92-4.9-4.7 0-3.96 3.63-5.26 7.42-5.26.47 0 .91.02 1.28.08v-.52zm-3.67 9.87c.85 0 1.55-.37 2.07-.93l.02-2.73c-.38-.07-.79-.1-1.23-.1-1.63 0-3.31.54-3.31 2.15 0 1.07.78 1.61 2.45 1.61zM4.77 11.45c-1.87-.5-2.48-.9-2.48-1.67 0-.71.74-1.24 2.08-1.24 1.83 0 3.4.67 4.31 1.25l1.37-3.42c-1.19-.68-3.15-1.25-5.69-1.25C1.61 5.12 0 6.93 0 9.88c0 3.52 2.89 4.67 5.76 5.34 2.07.49 2.55.99 2.55 1.75 0 .84-.87 1.34-2.28 1.34-2.07 0-4-.82-5.1-1.61L-.3 20.08c1.37.95 3.73 1.63 6.42 1.63 3.05 0 6.36-1.61 6.36-5.06 0-3.49-2.75-4.63-5.71-5.2z"/>
    </svg>
  );
}

export function Inbox2DataBrand({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const isLg = size === "lg";
  const isSm = size === "sm";

  return (
    <div className="flex items-center gap-2 select-none group cursor-pointer">
      <div
        className={`relative flex items-center justify-center rounded-xl bg-[#009afc] text-white shadow-sm transition-transform duration-200 group-hover:scale-105 ${
          isLg ? "w-10 h-10" : isSm ? "w-7 h-7" : "w-8 h-8"
        }`}
        style={{
          boxShadow: "rgb(0, 109, 200) 0px -2px 0px 0px inset, rgba(0, 0, 0, 0.08) 0px 2px 4px 0px"
        }}
      >
        <svg
          className={isLg ? "w-5 h-5" : isSm ? "w-3.5 h-3.5" : "w-4 h-4"}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Inbox tray with arrow flowing into structured grid */}
          <path
            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 13h-4.5c-.8 0-1.5.7-1.5 1.5 0 1.4-1.1 2.5-2.5 2.5h-3c-1.4 0-2.5-1.1-2.5-2.5 0-.8-.7-1.5-1.5-1.5H2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 8l-4 4-4-4"
            stroke="#cfe9fd"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex items-baseline">
        <span
          className={`font-semibold tracking-tight text-[#000000] ${
            isLg ? "text-xl" : isSm ? "text-sm" : "text-base"
          }`}
        >
          inbox<span className="text-[#009afc]">2</span>data
        </span>
      </div>
    </div>
  );
}
