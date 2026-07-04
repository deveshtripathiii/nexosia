import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Calendar, 
  Star, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  Menu, 
  X, 
  Play, 
  Phone, 
  Shield, 
  Clock, 
  Sparkles, 
  Globe, 
  Users, 
  Mail, 
  ArrowUpRight, 
  ChevronDown,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  ThumbsUp,
  Award
} from 'lucide-react';
import logoImg from './assets/logo.png';

// FAQ items
const FAQ_ITEMS = [
  {
    question: "Do I need to pay anything upfront for the trial?",
    answer: "No. Our 14-day free trial allows you to see the website and WhatsApp automation system live for your business without paying anything upfront. You only pay after you see the results and decide to go live."
  },
  {
    question: "How long does it take to build my website and connect the bot?",
    answer: "We deliver your custom, premium website and fully functional WhatsApp booking bot within 3 to 5 business days. We handle everything from copy, design, to technical integrations."
  },
  {
    question: "Do I need my own WhatsApp Business API account?",
    answer: "We handle the entire setup. We connect your business to the official WhatsApp API ecosystem so you don't have to deal with complex developer configurations. You'll manage everything through a simple dashboard."
  },
  {
    question: "Can I customize the booking bot's questions?",
    answer: "Absolutely! The bot is completely customizable to match your clinic, salon, or retail store's workflow. We configure it to ask for name, service, date, time, or custom info, and sync it directly with Google Calendar or your existing CRM."
  },
  {
    question: "What happens after the setup? Are there ongoing fees?",
    answer: "Yes, we charge a low, flat monthly subscription of ₹999 (or $15) to cover secure cloud hosting, WhatsApp server costs, automated reminders, review generation, and 24/7 support. There are zero hidden fees."
  }
];

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [currency, setCurrency] = useState('INR'); // 'INR' or 'USD'
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' or 'yearly'
  
  // Modals state
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [modalFormSubmitted, setModalFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', businessName: '', email: '', phone: '', niche: 'clinic' });

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // WhatsApp Simulator State
  const [simStep, setSimStep] = useState(0);
  const [simMessages, setSimMessages] = useState([
    { sender: 'bot', text: "Hi there! 👋 Welcome to Apex Health Clinic. I can help you book an appointment in 30 seconds. Which day works best for you?", time: "10:00 AM" }
  ]);
  const [isSimTyping, setIsSimTyping] = useState(false);
  const [simNameInput, setSimNameInput] = useState('');
  const chatEndRef = useRef(null);

  // Scroll simulator to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [simMessages, isSimTyping]);

  const handleSimOptionClick = (optionText, nextStep) => {
    // Add user message
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSimMessages(prev => [...prev, { sender: 'user', text: optionText, time: userTime }]);
    setSimStep(nextStep);
    setIsSimTyping(true);

    setTimeout(() => {
      setIsSimTyping(false);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let botText = '';

      if (nextStep === 1) {
        botText = `Great! 📅 ${optionText} is selected. Which time slot would you prefer? \n\n⏰ A) 10:00 AM\n⏰ B) 2:30 PM\n⏰ C) 4:15 PM`;
      } else if (nextStep === 2) {
        botText = `Got it! ⏰ ${optionText}. Lastly, please enter your Full Name to confirm your appointment.`;
      }

      setSimMessages(prev => [...prev, { sender: 'bot', text: botText, time: botTime }]);
    }, 1000);
  };

  const handleSimNameSubmit = (e) => {
    e.preventDefault();
    if (!simNameInput.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSimMessages(prev => [...prev, { sender: 'user', text: simNameInput, time: userTime }]);
    setSimStep(3);
    setIsSimTyping(true);

    const name = simNameInput.trim();
    setSimNameInput('');

    setTimeout(() => {
      setIsSimTyping(false);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const botText = `🎉 Appointment Confirmed, ${name}!\n\n🏥 Clinic: Apex Health Clinic\n📅 Date: Monday, July 6\n⏰ Time: 10:00 AM\n👨‍⚕️ Specialist: Dr. Sarah Jenkins\n\nWe have saved your slot. A WhatsApp reminder will be sent to you 2 hours before your session. See you there!`;
      
      setSimMessages(prev => [...prev, { sender: 'bot', text: botText, time: botTime }]);
    }, 1200);
  };

  const resetSimulator = () => {
    setSimStep(0);
    setSimNameInput('');
    setIsSimTyping(false);
    setSimMessages([
      { sender: 'bot', text: "Hi there! 👋 Welcome to Apex Health Clinic. I can help you book an appointment in 30 seconds. Which day works best for you?", time: "10:00 AM" }
    ]);
  };

  // Form Submissions
  const handleModalSubmit = (e) => {
    e.preventDefault();
    // Simulate API Call
    setModalFormSubmitted(true);
    setTimeout(() => {
      setIsDemoModalOpen(false);
      setIsTrialModalOpen(false);
      setModalFormSubmitted(false);
      alert(`Success! Thank you ${formData.name}. We will reach out to you on WhatsApp within 15 minutes at ${formData.phone}.`);
      setFormData({ name: '', businessName: '', email: '', phone: '', niche: 'clinic' });
    }, 1500);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 3000);
  };

  // Pricing calculations
  const setupFee = currency === 'INR' ? '₹15,000' : '$200';
  const monthlyRetainer = currency === 'INR' 
    ? (billingPeriod === 'monthly' ? '₹999' : '₹799') 
    : (billingPeriod === 'monthly' ? '$15' : '$12');
  const billPeriodLabel = billingPeriod === 'monthly' ? '/mo' : '/mo';
  const billingCycleLabel = billingPeriod === 'monthly' ? 'Billed monthly' : 'Billed annually (Save 20%)';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-cyan-accent selection:text-white">
      
      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <img src={logoImg} alt="Nexosia Logo" className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-midnight transition-colors duration-200">Features</a>
            <a href="#how-it-works" className="hover:text-midnight transition-colors duration-200">How It Works</a>
            <a href="#pricing" className="hover:text-midnight transition-colors duration-200">Pricing</a>
            <a href="#faq" className="hover:text-midnight transition-colors duration-200">FAQ</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="text-slate-600 hover:text-midnight text-sm font-semibold transition-colors duration-200 px-4 py-2"
            >
              Login
            </button>
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="bg-cyan-accent hover:bg-cyan-accent-dark text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-300 shadow-lg shadow-cyan-accent/20 hover:shadow-cyan-accent/40 hover:-translate-y-0.5 cyan-glow-button"
            >
              Get a Free Demo
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-600 hover:text-midnight focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 absolute top-16 left-0 w-full p-6 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-5 duration-250">
            <nav className="flex flex-col gap-4 text-base font-semibold text-slate-700">
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-cyan-accent py-2 border-b border-slate-100">Features</a>
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-cyan-accent py-2 border-b border-slate-100">How It Works</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-cyan-accent py-2 border-b border-slate-100">Pricing</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-cyan-accent py-2 border-b border-slate-100">FAQ</a>
            </nav>
            <div className="flex flex-col gap-3 pt-4">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setIsDemoModalOpen(true); }}
                className="w-full text-center text-slate-600 hover:text-midnight py-2 font-bold"
              >
                Login
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setIsDemoModalOpen(true); }}
                className="w-full bg-cyan-accent hover:bg-cyan-accent-dark text-white text-center font-bold py-3 rounded-xl transition-all duration-300"
              >
                Get a Free Demo
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section (Weave-Style High Impact) */}
      <section className="relative pt-12 pb-24 md:py-32 overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-50">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #CBD5E1 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-8">
              
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 bg-slate-200/60 backdrop-blur-sm border border-slate-300/50 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold text-slate-700">
                <Sparkles className="h-4 w-4 text-cyan-accent animate-pulse" />
                <span>Modern Web Design & WhatsApp AI Automation</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-midnight font-heading tracking-tight leading-tight">
                Automate Your Local Business. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-accent to-cyan-accent-dark">Turn Visitors into Bookings</span> via WhatsApp.
              </h1>

              {/* Sub-headline */}
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
                Get a premium website and an automated booking system that works 24/7. Built specifically for independent clinics, salons, and local stores. Let customers book appointments instantly in seconds.
              </p>

              {/* CTA Area */}
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <button 
                  onClick={() => setIsTrialModalOpen(true)}
                  className="bg-cyan-accent hover:bg-cyan-accent-dark text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-xl shadow-cyan-accent/25 hover:shadow-cyan-accent/40 hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 cyan-glow-button"
                >
                  Start Your Free 14-Day Trial
                  <ArrowRight className="h-5 w-5" />
                </button>
                <a 
                  href="#demo"
                  className="flex items-center justify-center gap-2 text-slate-700 hover:text-midnight font-semibold py-3 px-6 rounded-full transition-all duration-200 border border-slate-300 hover:bg-slate-100 text-center"
                >
                  <Play className="h-4 w-4 fill-slate-700 text-slate-700" />
                  See How It Works
                </a>
              </div>

              {/* Highlight points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/80 w-full">
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>No credit card required for trial</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>Ready in 3-5 business days</span>
                </div>
              </div>

            </div>

            {/* Right Visual Column (Side-by-side Mockup) */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              {/* Gradient Aura behind mockups */}
              <div className="absolute w-72 h-72 rounded-full bg-cyan-accent/20 blur-3xl -top-10 -right-10 pointer-events-none"></div>
              <div className="absolute w-72 h-72 rounded-full bg-slate-300/30 blur-3xl -bottom-10 -left-10 pointer-events-none"></div>

              {/* Side-by-side Layout Wrapper */}
              <div className="flex items-end gap-4 max-w-full relative">
                
                {/* Mockup 1: Mobile Web Interface (Left overlay) */}
                <div className="relative w-48 sm:w-56 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col select-none -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 z-10">
                  {/* Website Browser Header */}
                  <div className="bg-slate-100 px-3 py-2 flex items-center gap-1.5 border-b border-slate-200">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    <div className="bg-white text-[9px] text-slate-400 rounded px-2 py-0.5 ml-2 truncate w-full flex-grow text-center">
                      apexhealth.com
                    </div>
                  </div>
                  {/* Website content */}
                  <div className="p-4 space-y-4">
                    {/* Clinic Logo */}
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">A</div>
                      <span className="font-bold text-[10px] text-midnight font-heading">Apex Health</span>
                    </div>
                    {/* Header Image */}
                    <div className="h-20 bg-indigo-50 rounded-lg flex items-center justify-center p-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-cyan-50"></div>
                      <span className="text-[10px] text-indigo-700 font-bold text-center z-10">Modern Clinic Website</span>
                    </div>
                    {/* Intro text */}
                    <div className="space-y-1.5">
                      <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                      <div className="h-1.5 w-full bg-slate-100 rounded"></div>
                      <div className="h-1.5 w-5/6 bg-slate-100 rounded"></div>
                    </div>
                    {/* Services */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="p-2 border border-slate-100 rounded-lg flex flex-col items-center">
                        <span className="text-[8px] font-bold text-slate-700">General Consultation</span>
                        <span className="text-[6px] text-slate-400">30 Mins</span>
                      </div>
                      <div className="p-2 border border-slate-100 rounded-lg flex flex-col items-center">
                        <span className="text-[8px] font-bold text-slate-700">Dental Checkup</span>
                        <span className="text-[6px] text-slate-400">45 Mins</span>
                      </div>
                    </div>
                    {/* Interactive Button */}
                    <button 
                      onClick={() => {
                        const target = document.getElementById('demo');
                        if (target) target.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full bg-[#25d366] hover:bg-[#128c7e] text-white text-[10px] font-extrabold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer"
                    >
                      <MessageSquare className="h-3 w-3 fill-white" />
                      Book via WhatsApp
                    </button>
                  </div>
                </div>

                {/* Mockup 2: WhatsApp Chat (Right overlay) */}
                <div className="relative w-52 sm:w-60 bg-[#e5ddd5] rounded-3xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col h-[320px] sm:h-[360px] rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500">
                  {/* WhatsApp Header */}
                  <div className="bg-[#075e54] text-white px-3 py-2 pt-4 pb-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[#075e54] font-bold text-[10px]">A</div>
                      <div>
                        <h4 className="text-[10px] font-bold leading-tight">Apex Health Bot</h4>
                        <span className="text-[7px] opacity-80 block">Online</span>
                      </div>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                  </div>
                  {/* Chat messages */}
                  <div className="flex-grow p-2.5 space-y-2 overflow-y-auto flex flex-col justify-end">
                    
                    {/* Message 1: User */}
                    <div className="bg-[#dcf8c6] text-slate-800 text-[9px] rounded-lg p-1.5 max-w-[85%] self-end shadow-sm">
                      Hi, I want to book a dentist appointment.
                    </div>

                    {/* Message 2: Bot */}
                    <div className="bg-white text-slate-800 text-[9px] rounded-lg p-1.5 max-w-[85%] self-start shadow-sm leading-normal">
                      Hello! Welcome to Apex Health. I can schedule your visit. Which day would you prefer?
                      <div className="mt-1 border-t border-slate-100 pt-1 font-bold text-[#075e54]">
                        July 6 (Monday)
                      </div>
                    </div>

                    {/* Message 3: User */}
                    <div className="bg-[#dcf8c6] text-slate-800 text-[9px] rounded-lg p-1.5 max-w-[85%] self-end shadow-sm">
                      July 6 (Monday)
                    </div>

                    {/* Message 4: Bot (Booking Confirmation) */}
                    <div className="bg-white text-slate-800 text-[9px] rounded-lg p-1.5 max-w-[85%] self-start shadow-sm leading-normal border-l-4 border-emerald-500">
                      🎉 **Booking Confirmed!**
                      <br />
                      📅 **Date:** Monday, July 6
                      <br />
                      ⏰ **Time:** 10:00 AM
                      <br />
                      🩺 **Consultant:** Dr. Sarah Jenkins
                      <br />
                      <span className="text-[7px] text-slate-400 mt-1 block">A Google Calendar link has been synced.</span>
                    </div>

                  </div>
                  {/* Chat footer */}
                  <div className="bg-[#f0f0f0] p-1.5 flex items-center border-t border-slate-200">
                    <div className="bg-white rounded-full flex-grow px-2 py-0.5 text-[8px] text-slate-400 truncate">
                      Type message...
                    </div>
                    <div className="ml-1.5 w-5 h-5 rounded-full bg-[#075e54] flex items-center justify-center text-white">
                      <Check className="h-3 w-3" />
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

      </section>

      {/* Social Proof Section (GoHighLevel Style) */}
      <section className="bg-slate-100 py-10 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase mb-8">
            Trusted by 500+ local clinics, salons, and retail businesses globally
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-60">
            {/* Placeholder Brand 1 */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold font-heading text-xs">M</div>
              <span className="font-extrabold text-slate-800 text-sm font-heading tracking-tight">MedCare Clinic</span>
            </div>
            {/* Placeholder Brand 2 */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold font-heading text-xs">U</div>
              <span className="font-extrabold text-slate-800 text-sm font-heading tracking-tight">UrbanStyle</span>
            </div>
            {/* Placeholder Brand 3 */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold font-heading text-xs">P</div>
              <span className="font-extrabold text-slate-800 text-sm font-heading tracking-tight">PetHaven</span>
            </div>
            {/* Placeholder Brand 4 */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-slate-800 text-white flex items-center justify-center font-bold font-heading text-xs">B</div>
              <span className="font-extrabold text-slate-800 text-sm font-heading tracking-tight">BrightDent</span>
            </div>
            {/* Placeholder Brand 5 */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold font-heading text-xs">G</div>
              <span className="font-extrabold text-slate-800 text-sm font-heading tracking-tight">GreenGrocer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid ("All-in-One" Value Grid) */}
      <section id="features" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-accent font-heading">Complete Automation Stack</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-midnight font-heading tracking-tight">
              One Unified System to Fill Your Calendar & Explode Sales
            </p>
            <p className="text-lg text-slate-600">
              Stop juggling expensive tools, slow developers, and complex APIs. Nexosia handles your web and appointment pipeline from end to end.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="group bg-slate-50 hover:bg-slate-900 border border-slate-200 hover:border-slate-800 rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between items-start hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-accent/5">
              <div className="space-y-6">
                <div className="bg-cyan-accent/10 group-hover:bg-cyan-accent/20 w-14 h-14 rounded-2xl flex items-center justify-center text-cyan-accent-dark group-hover:text-cyan-electric transition-colors duration-300">
                  <Phone className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold font-heading text-midnight group-hover:text-white transition-colors duration-200">
                  Web-to-WhatsApp Sync
                </h3>
                <p className="text-slate-600 group-hover:text-slate-300 transition-colors duration-200 text-sm leading-relaxed">
                  Never miss a potential client. Instantly route website visitors directly to your business WhatsApp with beautiful chat triggers, initiating instant automated discussions.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-cyan-accent-dark group-hover:text-cyan-electric transition-all duration-200">
                <span>Direct Lead Capture</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group bg-slate-50 hover:bg-slate-900 border border-slate-200 hover:border-slate-800 rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between items-start hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-accent/5">
              <div className="space-y-6">
                <div className="bg-cyan-accent/10 group-hover:bg-cyan-accent/20 w-14 h-14 rounded-2xl flex items-center justify-center text-cyan-accent-dark group-hover:text-cyan-electric transition-colors duration-300">
                  <Calendar className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold font-heading text-midnight group-hover:text-white transition-colors duration-200">
                  Automated Appointments
                </h3>
                <p className="text-slate-600 group-hover:text-slate-300 transition-colors duration-200 text-sm leading-relaxed">
                  A smart booking bot answers patient or customer questions in real-time, displays open slots, saves appointments, and sends reminder messages to eliminate no-shows by 85%.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-cyan-accent-dark group-hover:text-cyan-electric transition-all duration-200">
                <span>Reduce Empty Slots</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group bg-slate-50 hover:bg-slate-900 border border-slate-200 hover:border-slate-800 rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between items-start hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-accent/5">
              <div className="space-y-6">
                <div className="bg-cyan-accent/10 group-hover:bg-cyan-accent/20 w-14 h-14 rounded-2xl flex items-center justify-center text-cyan-accent-dark group-hover:text-cyan-electric transition-colors duration-300">
                  <Star className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold font-heading text-midnight group-hover:text-white transition-colors duration-200">
                  Auto-Review Generation
                </h3>
                <p className="text-slate-600 group-hover:text-slate-300 transition-colors duration-200 text-sm leading-relaxed">
                  Automatically message customers after a visit, ask for feedback, and route happy customers directly to your Google business profile to scale 5-star reviews on autopilot.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-cyan-accent-dark group-hover:text-cyan-electric transition-all duration-200">
                <span>Boost Local SEO</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Interactive WhatsApp Simulator Showcase ("WOW" Interactive Element) */}
      <section id="demo" className="py-24 bg-gradient-to-b from-slate-50 to-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Content column */}
            <div className="lg:col-span-6 text-left space-y-6">
              <div className="inline-flex items-center gap-1 bg-cyan-accent/10 border border-cyan-accent/20 rounded-full px-3 py-1 text-xs font-bold text-cyan-accent-dark">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Try It Yourself</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-midnight font-heading tracking-tight">
                Simulate a Real WhatsApp Booking Chat
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Click on the options inside the mobile screen simulator on the right. See how effortlessly our automated assistant processes client bookings, updates schedules, and sends custom booking receipts.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold mt-1">1</div>
                  <div>
                    <h4 className="font-bold text-midnight">Instant 24/7 Response</h4>
                    <p className="text-sm text-slate-500">The booking bot operates immediately, even at midnight when your office is closed.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold mt-1">2</div>
                  <div>
                    <h4 className="font-bold text-midnight">No Jargon or Setup Required</h4>
                    <p className="text-sm text-slate-500">We configure the system completely and link it with your website. Zero technical knowledge needed on your end.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={resetSimulator}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition-all text-sm flex items-center gap-2"
                >
                  Restart Simulation
                </button>
              </div>
            </div>

            {/* Right Simulator column */}
            <div className="lg:col-span-6 flex justify-center">
              
              {/* Phone Mockup */}
              <div className="relative border-[12px] border-slate-900 rounded-[2.5rem] shadow-2xl h-[560px] w-[340px] max-w-full bg-[#e5ddd5] overflow-hidden flex flex-col">
                
                {/* iPhone Notch Speaker/Camera Area */}
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-950 flex justify-center items-center z-30">
                  <div className="w-24 h-4 bg-slate-950 rounded-b-xl flex justify-center items-start">
                    <div className="w-10 h-1 bg-slate-800 rounded-full mt-1.5"></div>
                  </div>
                </div>

                {/* WhatsApp Chat Header */}
                <div className="bg-[#075e54] text-white p-3 pt-8 pb-3 flex items-center justify-between shrink-0 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-slate-200/90 flex items-center justify-center text-[#075e54] font-bold text-sm">
                      AH
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-tight">Apex Health Clinic</h4>
                      <span className="text-[9px] text-emerald-300 flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                        online assistant
                      </span>
                    </div>
                  </div>
                  <div className="opacity-80 text-[10px]">
                    24/7 Booking
                  </div>
                </div>

                {/* Chat message history Area */}
                <div className="flex-grow p-4 overflow-y-auto space-y-3 flex flex-col">
                  {simMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`text-xs rounded-xl p-3 shadow-sm max-w-[85%] leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-[#dcf8c6] text-slate-800 self-end rounded-tr-none animate-in slide-in-from-right-3 duration-200' 
                          : 'bg-white text-slate-800 self-start rounded-tl-none animate-in slide-in-from-left-3 duration-200'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <span className="text-[8px] text-slate-400 block text-right mt-1">{msg.time}</span>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isSimTyping && (
                    <div className="bg-white text-slate-800 self-start text-xs rounded-xl rounded-tl-none p-3 shadow-sm flex items-center gap-1.5 animate-pulse max-w-[60%]">
                      <span className="text-slate-500 font-medium">typing...</span>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>

                {/* Interactive Options Footer */}
                <div className="bg-white p-3 border-t border-slate-200 shrink-0">
                  
                  {/* Step 0: Choose Day */}
                  {simStep === 0 && !isSimTyping && (
                    <div className="space-y-2 animate-in fade-in duration-300">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center mb-1">Select a Day to Respond:</p>
                      <div className="grid grid-cols-1 gap-1.5">
                        <button 
                          onClick={() => handleSimOptionClick("Monday, July 6", 1)}
                          className="w-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 text-xs py-2 px-3 rounded-lg text-left transition-all"
                        >
                          📅 Monday, July 6
                        </button>
                        <button 
                          onClick={() => handleSimOptionClick("Tuesday, July 7", 1)}
                          className="w-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 text-xs py-2 px-3 rounded-lg text-left transition-all"
                        >
                          📅 Tuesday, July 7
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 1: Choose Time */}
                  {simStep === 1 && !isSimTyping && (
                    <div className="space-y-2 animate-in fade-in duration-300">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center mb-1">Select a Time Slot:</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button 
                          onClick={() => handleSimOptionClick("10:00 AM", 2)}
                          className="bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 text-xs py-2 px-1 rounded-lg text-center transition-all font-semibold"
                        >
                          10:00 AM
                        </button>
                        <button 
                          onClick={() => handleSimOptionClick("2:30 PM", 2)}
                          className="bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 text-xs py-2 px-1 rounded-lg text-center transition-all font-semibold"
                        >
                          2:30 PM
                        </button>
                        <button 
                          onClick={() => handleSimOptionClick("4:15 PM", 2)}
                          className="bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 text-xs py-2 px-1 rounded-lg text-center transition-all font-semibold"
                        >
                          4:15 PM
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Name Input */}
                  {simStep === 2 && !isSimTyping && (
                    <form onSubmit={handleSimNameSubmit} className="flex gap-2 items-center animate-in fade-in duration-300">
                      <input 
                        type="text" 
                        placeholder="Enter your Full Name" 
                        value={simNameInput}
                        onChange={(e) => setSimNameInput(e.target.value)}
                        className="flex-grow border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 bg-slate-50"
                        required
                        autoFocus
                      />
                      <button 
                        type="submit"
                        className="bg-[#075e54] hover:bg-[#128c7e] text-white px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
                      >
                        Send
                      </button>
                    </form>
                  )}

                  {/* Step 3: Finished */}
                  {simStep === 3 && !isSimTyping && (
                    <div className="text-center py-2 animate-in fade-in duration-300">
                      <p className="text-xs text-emerald-600 font-bold flex items-center justify-center gap-1 mb-1">
                        <CheckCircle2 className="h-4 w-4" /> Booking Successful!
                      </p>
                      <button 
                        onClick={resetSimulator}
                        className="text-[10px] text-cyan-accent-dark hover:underline font-semibold"
                      >
                        Test simulation again
                      </button>
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* How It Works (3 Simple Steps) */}
      <section id="how-it-works" className="py-24 md:py-32 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
        
        {/* Curved visual background grid */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-accent font-heading">Frictionless Integration</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-midnight font-heading tracking-tight">
              We Do 100% of the Work. You Get the Bookings.
            </p>
            <p className="text-slate-600 text-base">
              Set up your modern website and WhatsApp ecosystem in three simple phases. No coding, no API configuration, and no technical headaches.
            </p>
          </div>

          {/* Timeline Cards Container */}
          <div className="relative">
            {/* Visual connector line for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-accent/20 via-cyan-accent to-cyan-accent/20 -translate-y-12"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
              
              {/* Step 1 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 relative flex flex-col justify-between items-center text-center shadow-lg shadow-slate-100 hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-6 bg-slate-900 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg font-heading shadow-md">
                  1
                </div>
                <div className="space-y-4 pt-4">
                  <h3 className="text-xl font-bold font-heading text-midnight">We Build Your Premium Site</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Our professional design team codes a blazing fast, SEO-optimized mobile-responsive website tailored to your business, featuring custom images, reviews, and interactive forms.
                  </p>
                </div>
                <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  <span>Custom Crafted For You</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 relative flex flex-col justify-between items-center text-center shadow-lg shadow-slate-100 hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-6 bg-slate-900 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg font-heading shadow-md">
                  2
                </div>
                <div className="space-y-4 pt-4">
                  <h3 className="text-xl font-bold font-heading text-midnight">We Connect the WhatsApp AI Bot</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    We link your official WhatsApp Business account to our automation bot. The bot is custom configured to answer your customers, confirm times, and save details.
                  </p>
                </div>
                <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  <span>Official API Ecosystem</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 relative flex flex-col justify-between items-center text-center shadow-lg shadow-slate-100 hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-6 bg-slate-900 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg font-heading shadow-md">
                  3
                </div>
                <div className="space-y-4 pt-4">
                  <h3 className="text-xl font-bold font-heading text-midnight">You Watch Bookings Roll In</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    New clients schedule automatically while you sleep. You receive scheduling notifications directly on your phone and dashboard. Watch your business grow.
                  </p>
                </div>
                <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  <span>High ROI & Growth</span>
                </div>
              </div>

            </div>
          </div>

          {/* Simple CTA underneath steps */}
          <div className="text-center mt-16">
            <button 
              onClick={() => setIsTrialModalOpen(true)}
              className="bg-midnight hover:bg-slate-800 text-white font-bold text-base px-8 py-3.5 rounded-full transition-all duration-300 shadow-xl inline-flex items-center gap-2"
            >
              Get Started Risk Free
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>

        </div>
      </section>

      {/* Pricing Section (Transparent & Simple) */}
      <section id="pricing" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-accent font-heading">Transparent Pricing</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-midnight font-heading tracking-tight">
              One Package. Everything Included.
            </p>
            <p className="text-slate-600 text-base">
              Flat, low upfront fee for custom website development and chatbot configuration, followed by a minor SaaS retainer to maintain hosting and bot infrastructure.
            </p>

            {/* Toggles container */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              
              {/* Currency Toggle */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full border border-slate-200">
                <button 
                  onClick={() => setCurrency('INR')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    currency === 'INR' ? 'bg-white text-midnight shadow-md' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  🇮🇳 INR (₹)
                </button>
                <button 
                  onClick={() => setCurrency('USD')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    currency === 'USD' ? 'bg-white text-midnight shadow-md' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  🇺🇸 USD ($)
                </button>
              </div>

              {/* Billing Period Toggle */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full border border-slate-200">
                <button 
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    billingPeriod === 'monthly' ? 'bg-white text-midnight shadow-md' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    billingPeriod === 'yearly' ? 'bg-white text-midnight shadow-md' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Yearly (Save 20%)
                </button>
              </div>

            </div>

          </div>

          {/* Pricing Card */}
          <div className="max-w-xl mx-auto">
            <div className="bg-slate-900 text-white rounded-3xl shadow-2xl overflow-hidden border border-slate-800 relative hover:scale-[1.01] transition-transform duration-300">
              
              {/* Popularity Badge */}
              <div className="absolute top-0 right-0 bg-cyan-accent text-slate-950 font-bold text-xs px-5 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                Full-Service Setup
              </div>

              <div className="p-8 sm:p-10 space-y-6 text-left">
                
                {/* Title */}
                <div>
                  <h3 className="text-2xl font-bold font-heading text-cyan-electric">The Growth Package</h3>
                  <p className="text-slate-400 text-sm mt-1">Perfect for clinics, salons, spas, and boutique retail stores.</p>
                </div>

                {/* Price block */}
                <div className="border-y border-slate-800 py-6 space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold font-heading text-white">{setupFee}</span>
                    <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">One-time setup fee</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <span>+</span>
                    <span className="text-2xl font-bold font-heading text-white">{monthlyRetainer}</span>
                    <span className="text-slate-400 text-sm">{billPeriodLabel} retainer</span>
                  </div>
                  <p className="text-[10px] text-cyan-electric/80 font-bold uppercase tracking-wider">
                    {billingCycleLabel}
                  </p>
                </div>

                {/* Package Features List */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">What's Included:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-slate-300 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-cyan-accent flex-shrink-0" />
                      <span>Custom Website Design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-cyan-accent flex-shrink-0" />
                      <span>WhatsApp Bot Setup</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-cyan-accent flex-shrink-0" />
                      <span>Official API Connection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-cyan-accent flex-shrink-0" />
                      <span>Calendar Integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-cyan-accent flex-shrink-0" />
                      <span>Analytics Dashboard</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-cyan-accent flex-shrink-0" />
                      <span>Secure Web Hosting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-cyan-accent flex-shrink-0" />
                      <span>Free SSL Certificate</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-cyan-accent flex-shrink-0" />
                      <span>24/7 Priority Support</span>
                    </li>
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <button 
                    onClick={() => setIsTrialModalOpen(true)}
                    className="w-full bg-cyan-accent hover:bg-cyan-accent-dark text-slate-950 hover:text-white font-extrabold text-base py-4 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-accent/15 cursor-pointer text-center"
                  >
                    Claim Your Setup Now
                  </button>
                  <p className="text-center text-[10px] text-slate-500 mt-3 font-semibold">
                    100% Risk Free. Cancel anytime. 14-day trial applies to the retainer.
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 md:py-32 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-accent font-heading">Got Questions?</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-midnight font-heading tracking-tight">
              Frequently Asked Questions
            </p>
            <p className="text-slate-600 text-sm sm:text-base">
              Everything you need to know about our websites, WhatsApp bots, billing, and trial options.
            </p>
          </div>

          {/* Accordion list */}
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button 
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-6 flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-bold text-midnight text-base sm:text-lg font-heading leading-tight">{faq.question}</span>
                    {isOpen ? <ChevronDown className="h-5 w-5 text-cyan-accent shrink-0" /> : <ChevronRight className="h-5 w-5 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0b1329] text-white pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-800">
            
            {/* Column 1: Brand Info */}
            <div className="md:col-span-5 space-y-6">
              <a href="#" className="flex items-center gap-2">
                <img src={logoImg} alt="Nexosia Logo" className="h-10 w-auto object-contain brightness-0 invert" />
              </a>
              <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                Nexosia is a premium digital ecosystem helping local clinics, salons, stores, and small businesses automate customer capture and booking pipelines via WhatsApp.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>📍 Global Presence</span>
                <span>•</span>
                <span>🇮🇳 India</span>
                <span>•</span>
                <span>🇸🇬 SEA</span>
                <span>•</span>
                <span>🇦🇪 MENA</span>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-bold font-heading text-cyan-electric text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Package</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Column 3: Newsletter signup block */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-bold font-heading text-cyan-electric text-sm uppercase tracking-wider">Stay Updated</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Join our newsletter list to receive modern automation tips, case studies, and business growth strategies.
              </p>
              
              {newsletterSubmitted ? (
                <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-xl text-xs font-bold text-cyan-electric flex items-center gap-2 animate-in fade-in duration-300">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                  <span>Subscribed! Check your inbox soon.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter email address" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-accent focus:bg-slate-950 transition-all"
                    required
                  />
                  <button 
                    type="submit"
                    className="bg-cyan-accent hover:bg-cyan-accent-dark text-slate-950 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Legal / Copyright Info */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} Nexosia. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Contact Support</a>
            </div>
          </div>

        </div>
      </footer>

      {/* Demo Modal ("Get a Free Demo" Popup) */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            
            {/* Close button */}
            <button 
              onClick={() => setIsDemoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Header */}
            <div className="space-y-2 text-left mb-6">
              <h3 className="text-2xl font-bold font-heading text-midnight">Get a Live Free Demo</h3>
              <p className="text-slate-500 text-sm">Fill in your details and our automation expert will demonstrate how Nexosia can increase your business bookings.</p>
            </div>

            {/* Form */}
            {modalFormSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>
                <h4 className="text-lg font-bold text-midnight">Submitting Details...</h4>
                <p className="text-xs text-slate-400">Connecting to automated onboarding desk.</p>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-accent focus:bg-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Business Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Apex Dental Clinic"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-accent focus:bg-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">WhatsApp Mobile Number</label>
                  <input 
                    type="tel" 
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-accent focus:bg-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Business Niche</label>
                  <select 
                    value={formData.niche}
                    onChange={(e) => setFormData({...formData, niche: e.target.value})}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-accent focus:bg-white transition-all"
                  >
                    <option value="clinic">🏥 Clinic / Medical Office</option>
                    <option value="salon">✂️ Hair Salon / Spa</option>
                    <option value="store">🛍️ Retail Store / Shop</option>
                    <option value="other">💼 Other SMB / Services</option>
                  </select>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-cyan-accent hover:bg-cyan-accent-dark text-white font-extrabold text-base py-3.5 rounded-xl transition-all shadow-md shadow-cyan-accent/15 cursor-pointer text-center"
                >
                  Send Demo Request
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Trial Modal ("Start Your Free 14-Day Trial" Popup) */}
      {isTrialModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            
            {/* Close button */}
            <button 
              onClick={() => setIsTrialModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Header */}
            <div className="space-y-2 text-left mb-6">
              <h3 className="text-2xl font-bold font-heading text-midnight">Start Your Free 14-Day Trial</h3>
              <p className="text-slate-500 text-sm">Zero upfront charges. Let's create your website preview and connect the WhatsApp booking bot for your store or clinic.</p>
            </div>

            {/* Form */}
            {modalFormSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>
                <h4 className="text-lg font-bold text-midnight">Setting Up Account...</h4>
                <p className="text-xs text-slate-400">Loading trial components.</p>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-accent focus:bg-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Business Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Apex Health Clinic"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-accent focus:bg-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">WhatsApp Number</label>
                  <input 
                    type="tel" 
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-accent focus:bg-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. contact@business.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-accent focus:bg-white transition-all"
                    required
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-[#25d366] hover:bg-[#128c7e] text-white font-extrabold text-base py-3.5 rounded-xl transition-all shadow-md shadow-emerald-500/15 cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5 fill-white" />
                  Connect & Claim Free Setup
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
