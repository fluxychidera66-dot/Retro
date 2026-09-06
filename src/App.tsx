import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { GoogleOAuthModal } from './components/GoogleOAuthModal';
import { DescribeAutomation } from './components/DescribeAutomation';
import { ChooseDestinationStep, DestinationConfig } from './components/ChooseDestinationStep';
import { ParsedAutomationView } from './components/ParsedAutomationView';
import { ActivatingLoadingScreen } from './components/ActivatingLoadingScreen';
import { Dashboard } from './components/Dashboard';
import { OnboardingFlow } from './components/OnboardingFlow';
import { LegalModal } from './components/LegalModals';
import { Automation, UserAccount } from './types';

export default function App() {
  // Authentication & User State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isOAuthModalOpen, setIsOAuthModalOpen] = useState(false);
  const [user, setUser] = useState<UserAccount>({
    name: "Chidera Ezeudu",
    email: "chideraezeudu2@gmail.com",
    avatarUrl: "",
    isConnected: true,
    connectedSheet: "inbox2data — Invoices & Expenses",
    plan: "Starter",
    usedEmails: 482,
    planLimit: 1000
  });

  // Flow State: 'landing' | 'onboarding' | 'describe' | 'destination' | 'parsed' | 'activating' | 'dashboard'
  const [currentView, setCurrentView] = useState<
    'landing' | 'onboarding' | 'describe' | 'destination' | 'parsed' | 'activating' | 'dashboard'
  >('onboarding');

  // Working Automation State during creation
  const [currentPrompt, setCurrentPrompt] = useState(
    "Whenever I get an invoice or receipt email, extract the vendor name, invoice date, due date, invoice number, and total amount."
  );

  const [destinationConfig, setDestinationConfig] = useState<DestinationConfig>({
    type: 'new',
    sheetName: 'SaaS & Vendor Invoices Sync — Sheetflow',
    tabName: 'Sheet1'
  });

  const [pendingAutomation, setPendingAutomation] = useState<Automation | null>(null);

  // Active Automations List
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: 'auto-1',
      name: 'SaaS & Vendor Invoices Sync',
      plainEnglishPrompt: 'Whenever I get an invoice or receipt email, extract vendor, amount, date, and due date.',
      triggerRule: "from:(*billing* OR *invoice* OR *receipt* OR *stripe*) has:attachment OR contains:('invoice' OR 'amount')",
      destinationSheet: 'inbox2data — Invoices & Expenses (Sheet1)',
      fields: [
        { id: '1', name: 'Vendor Name', type: 'TEXT', columnHeader: 'Vendor Name', exampleValue: 'Stripe, Inc.' },
        { id: '2', name: 'Invoice Date', type: 'DATE', columnHeader: 'Invoice Date', exampleValue: 'Sep 05, 2026' },
        { id: '3', name: 'Due Date', type: 'DATE', columnHeader: 'Due Date', exampleValue: 'Sep 19, 2026' },
        { id: '4', name: 'Invoice Number', type: 'TEXT', columnHeader: 'Invoice #', exampleValue: 'ST-8819' },
        { id: '5', name: 'Total Amount', type: 'CURRENCY', columnHeader: 'Amount', exampleValue: '$349.00' }
      ],
      status: 'active',
      processedCount: 482,
      needsReviewCount: 2,
      lastRunAt: '12 minutes ago',
      createdAt: 'Sep 01, 2026'
    }
  ]);

  // Legal Modal
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; type: 'terms' | 'privacy' }>({
    isOpen: false,
    type: 'terms'
  });

  // Handle Google OAuth Connect
  const handleAuthorize = (account: { email: string; name: string }) => {
    setUser(prev => ({
      ...prev,
      email: account.email,
      name: account.name,
      isConnected: true,
      connectedAt: new Date().toISOString()
    }));
    setIsAuthenticated(true);
    setIsOAuthModalOpen(false);
    setCurrentView('onboarding');
  };

  const handleOnboardingComplete = (destination: {
    sheetName: string;
    tabName: string;
    isNewSheet: boolean;
  }) => {
    setUser(prev => ({
      ...prev,
      connectedSheet: `${destination.sheetName} (${destination.tabName})`
    }));
    setDestinationConfig({
      type: destination.isNewSheet ? 'new' : 'existing',
      sheetName: destination.sheetName,
      tabName: destination.tabName
    });
    // Once onboarding is completed, proceed to write the first automation prompt!
    setCurrentView('describe');
  };

  const handleConnectFromLanding = () => {
    setIsOAuthModalOpen(true);
  };

  const handleDisconnect = () => {
    setIsAuthenticated(false);
    setUser(prev => ({ ...prev, isConnected: false }));
    setCurrentView('landing');
  };

  // Step 1 -> Step 2: User finishes writing prompt in DescribeAutomation
  const handlePromptSubmitted = (prompt: string) => {
    setCurrentPrompt(prompt);
    const isInvoice = prompt.toLowerCase().includes('invoice') || 
                      prompt.toLowerCase().includes('receipt') || 
                      prompt.toLowerCase().includes('vendor') ||
                      prompt.toLowerCase().includes('billing');
    
    setDestinationConfig({
      type: 'new',
      sheetName: isInvoice ? 'SaaS & Vendor Invoices Sync — Sheetflow' : 'inbox2data — Extracted Records',
      tabName: 'Sheet1'
    });
    setCurrentView('destination');
  };

  // Step 2 -> Step 3: User finishes choosing destination sheet
  const handleDestinationContinue = (config: DestinationConfig) => {
    setDestinationConfig(config);
    setCurrentView('parsed');
  };

  // Step 3 -> Step 4: User clicks "Activate Automation" in ParsedAutomationView
  const handleStartActivation = (newAuto: Automation) => {
    setPendingAutomation(newAuto);
    setCurrentView('activating');
  };

  // Step 4 Complete: Loading finishes, add automation and redirect to dashboard
  const handleActivationComplete = () => {
    if (pendingAutomation) {
      setAutomations(prev => [pendingAutomation, ...prev]);
    }
    setUser(prev => ({
      ...prev,
      connectedSheet: `${destinationConfig.sheetName} (${destinationConfig.tabName})`
    }));
    setPendingAutomation(null);
    setCurrentView('dashboard');
  };

  const handleToggleAutomationStatus = (id: string) => {
    setAutomations(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: a.status === 'active' ? 'paused' : 'active'
        };
      }
      return a;
    }));
  };

  const handleDeleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* 1. Landing View */}
      {currentView === 'landing' && (
        <LandingPage
          onConnectGmail={handleConnectFromLanding}
          onOpenTerms={() => setLegalModal({ isOpen: true, type: 'terms' })}
          onOpenPrivacy={() => setLegalModal({ isOpen: true, type: 'privacy' })}
        />
      )}

      {/* 2. Onboarding Destination Flow */}
      {currentView === 'onboarding' && (
        <OnboardingFlow
          user={user}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* 3. STEP 1: Describe Automation (Write Query) */}
      {currentView === 'describe' && (
        <DescribeAutomation
          initialPrompt={currentPrompt}
          onStartParsing={handlePromptSubmitted}
          onBack={() => setCurrentView('dashboard')}
          userEmail={user.email}
        />
      )}

      {/* 4. STEP 2: Choose Destination (Create new sheet or Pick existing) */}
      {currentView === 'destination' && (
        <ChooseDestinationStep
          promptText={currentPrompt}
          userEmail={user.email}
          initialConfig={destinationConfig}
          onContinue={handleDestinationContinue}
          onBack={() => setCurrentView('describe')}
        />
      )}

      {/* 5. STEP 3: Automation Review & Live Sheets Preview */}
      {currentView === 'parsed' && (
        <ParsedAutomationView
          promptText={currentPrompt}
          destinationConfig={destinationConfig}
          onActivate={handleStartActivation}
          onBackToDestination={() => setCurrentView('destination')}
          userEmail={user.email}
        />
      )}

      {/* 6. STEP 4: Final Activation Loading Screen */}
      {currentView === 'activating' && (
        <ActivatingLoadingScreen
          automationName={pendingAutomation?.name || "New Automation"}
          destinationSheet={destinationConfig.sheetName}
          onComplete={handleActivationComplete}
        />
      )}

      {/* 7. Main Dashboard */}
      {currentView === 'dashboard' && (
        <Dashboard
          user={user}
          automations={automations}
          onNewAutomation={() => setCurrentView('describe')}
          onStartParsing={(prompt: string) => handlePromptSubmitted(prompt)}
          onChangeDestination={() => setCurrentView('destination')}
          onToggleAutomationStatus={handleToggleAutomationStatus}
          onDeleteAutomation={handleDeleteAutomation}
          onDisconnect={handleDisconnect}
          onViewLanding={() => setCurrentView('landing')}
          onUpdateUserPlan={(newPlan, newLimit) => {
            setUser(prev => ({
              ...prev,
              plan: newPlan,
              planLimit: newLimit
            }));
          }}
        />
      )}

      {/* Google OAuth Modal */}
      <GoogleOAuthModal
        isOpen={isOAuthModalOpen}
        onClose={() => setIsOAuthModalOpen(false)}
        onAuthorize={handleAuthorize}
        defaultEmail={user.email}
      />

      {/* Legal Modal for Terms & Privacy */}
      <LegalModal
        isOpen={legalModal.isOpen}
        type={legalModal.type}
        onClose={() => setLegalModal({ isOpen: false, type: 'terms' })}
      />
    </div>
  );
}
