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
  Award,
  Sliders,
  DollarSign,
  Layers,
  ArrowRightLeft,
  ArrowRightCircle,
  HelpCircle,
  Lock,
  ChevronLeft,
  Building
} from 'lucide-react';
import logoImg from './assets/logo.png';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

// Testimonials Data
const TESTIMONIALS = [
  {
    name: "Dr. Rohan Malhotra",
    role: "Founder, Malhotra Dental & Maxillofacial Center",
    location: "New Delhi, India",
    quote: "Nexosia completely transformed our booking process. Patients love scheduling appointments via WhatsApp at night. Our appointment counts went up by 38% in the first month, and we didn't miss a single lead.",
    rating: 5,
    avatar: "RM",
    badge: "Healthcare"
  },
  {
    name: "Sarah Jenkins",
    role: "Founder, The Hair & Lash Studio",
    location: "Singapore",
    quote: "The automated reminders are a lifesaver. Our no-show rate fell from 20% to virtually zero. Plus, the auto-review bot has gotten us 45 new five-star reviews on Google on autopilot!",
    rating: 5,
    avatar: "SJ",
    badge: "Salon & Spa"
  },
  {
    name: "Omar Al-Mansoor",
    role: "Operations Director, Al-Mansoor Boutique",
    location: "Dubai, UAE",
    quote: "Simple, fast, and extremely effective. We had a custom mobile site up and WhatsApp bot running in just 4 days. It is the best investment we made for our local marketing this year.",
    rating: 5,
    avatar: "OA",
    badge: "Retail Boutique"
  }
];

// Comparison Data
const COMPARISON_ROWS = [
  { feature: "Setup Time", nexosia: "3 - 5 Days", agency: "4 - 8 Weeks", diy: "Weeks of trial & error" },
  { feature: "Upfront Cost", nexosia: "Flat ₹15,000 / $200", agency: "₹50,000 - ₹1,50,000+", diy: "Free setup, but your own time" },
  { feature: "WhatsApp Auto-Booking", nexosia: "Yes, pre-configured", agency: "Requires separate expensive API integration", diy: "Not supported natively" },
  { feature: "Google Review Automation", nexosia: "Included", agency: "Extra monthly charge", diy: "Requires manual plugins setup" },
  { feature: "Technical Knowledge Needed", nexosia: "Zero (We handle all setup)", agency: "Must manage developers", diy: "You have to configure everything yourself" },
  { feature: "Hosting & SSL Security", nexosia: "Included in retainer", agency: "₹5,000+ yearly hosting bills", diy: "₹1,200 - ₹3,000/mo subscription" },
  { feature: "Customer Support", nexosia: "24/7 Dedicated Support", agency: "Charges per maintenance ticket", diy: "Help docs & chat bots only" }
];

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [currency, setCurrency] = useState('INR'); // 'INR' or 'USD'
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' or 'yearly'
  
  // Modals state
  const [isWizardModalOpen, setIsWizardModalOpen] = useState(false);
  const [wizardType, setWizardType] = useState('demo'); // 'demo' or 'trial'
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardSubmitted, setWizardSubmitted] = useState(false);
  
  // Onboarding Wizard Form Data
  const [wizardData, setWizardData] = useState({
    businessType: '',
    headaches: [],
    name: '',
    businessName: '',
    email: '',
    phone: ''
  });

  // Hero Video Demo Modal
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Floating Chat Widget state
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'agent', text: "Hi there! 👋 Interested in automating bookings for your business? Ask me anything!" }
  ]);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Testimonial index
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // ROI Calculator State
  const [calcBookings, setCalcBookings] = useState(250);
  const [calcTicket, setCalcTicket] = useState(1000); // Default INR

  // Sync ticket value on currency switch
  useEffect(() => {
    if (currency === 'INR') {
      setCalcTicket(1200);
    } else {
      setCalcTicket(15);
    }
  }, [currency]);

  // Simulator tabs: 'widget' | 'bot' | 'reviews'
  const [simTab, setSimTab] = useState('bot');

  // WhatsApp Simulator State (Tab 2)
  const [simStep, setSimStep] = useState(0);
  const [simMessages, setSimMessages] = useState([
    { sender: 'bot', text: "Hi there! 👋 Welcome to Apex Health Clinic. I can help you book an appointment in 30 seconds. Which day works best for you?", time: "10:00 AM" }
  ]);
  const [isSimTyping, setIsSimTyping] = useState(false);
  const [simNameInput, setSimNameInput] = useState('');
  const chatEndRef = useRef(null);

  // Review Simulator State (Tab 3)
  const [reviewStep, setReviewStep] = useState(0);
  const [reviewMessages, setReviewMessages] = useState([
    { sender: 'bot', text: "Hi John! Thanks for visiting Apex Health Clinic today. 🩺 How would you rate your experience out of 5 stars?\n\n(Reply with a number 1 to 5)", time: "04:30 PM" }
  ]);
  const [reviewTyping, setReviewTyping] = useState(false);

  // Scroll simulator to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [simMessages, isSimTyping, reviewMessages, reviewTyping, simTab, chatMessages]);

  const handleSimOptionClick = (optionText, nextStep) => {
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

  // Review simulation
  const handleReviewRating = (rating) => {
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setReviewMessages(prev => [...prev, { sender: 'user', text: `⭐ ${rating} Stars`, time: userTime }]);
    setReviewStep(1);
    setReviewTyping(true);

    setTimeout(() => {
      setReviewTyping(false);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const botText = `Awesome! Thank you for the 5-star rating! 🥰 It helps our team tremendously.\n\nCould you please take 10 seconds to share your review on Google so other local patients can find us? It would mean the world to us:\n\n👉 https://g.page/apex-health/review`;
      
      setReviewMessages(prev => [...prev, { sender: 'bot', text: botText, time: botTime }]);
      setReviewStep(2);
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

  const resetReviewSimulator = () => {
    setReviewStep(0);
    setReviewTyping(false);
    setReviewMessages([
      { sender: 'bot', text: "Hi John! Thanks for visiting Apex Health Clinic today. 🩺 How would you rate your experience out of 5 stars?\n\n(Reply with a number 1 to 5)", time: "04:30 PM" }
    ]);
  };

  // Onboarding Wizard handlers
  const openWizard = (type) => {
    setWizardType(type);
    setWizardStep(1);
    setWizardSubmitted(false);
    setIsWizardModalOpen(true);
  };

  const handleNicheSelection = (niche) => {
    setWizardData(prev => ({ ...prev, businessType: niche }));
    setWizardStep(2);
  };

  const handleHeadacheToggle = (headache) => {
    setWizardData(prev => {
      const exists = prev.headaches.includes(headache);
      const list = exists 
        ? prev.headaches.filter(item => item !== headache)
        : [...prev.headaches, headache];
      return { ...prev, headaches: list };
    });
  };

  const handleWizardSubmit = async (e) => {
    e.preventDefault();
    setWizardSubmitted(true);

    try {
      const collectionName = wizardType === 'trial' ? 'trials' : 'leads';
      
      // Store complete onboarding data to Firestore
      await addDoc(collection(db, collectionName), {
        name: wizardData.name,
        businessName: wizardData.businessName,
        phone: wizardData.phone,
        email: wizardData.email,
        businessType: wizardData.businessType,
        headaches: wizardData.headaches,
        createdAt: serverTimestamp()
      });

      setTimeout(() => {
        setIsWizardModalOpen(false);
        setWizardSubmitted(false);
        alert(`Awesome! Thank you ${wizardData.name}. We will audit your answers and reach out to you on WhatsApp at ${wizardData.phone} in 15 minutes!`);
        setWizardData({ businessType: '', headaches: [], name: '', businessName: '', email: '', phone: '' });
      }, 1500);
    } catch (error) {
      console.error("Firestore Save Error: ", error);
      setWizardSubmitted(false);
      alert("Submission error. Please check your network and try again.");
    }
  };

  // Chat Widget actions
  const handleWidgetChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    // Simulated Chatbot responses matching pricing or bot questions
    setTimeout(() => {
      let replyText = "That's a great question! For custom WhatsApp integrations, Nexosia handles all setup. Would you like to schedule a quick 10-minute demo?";
      
      const textLower = userMsg.toLowerCase();
      if (textLower.includes('pricing') || textLower.includes('cost') || textLower.includes('package')) {
        replyText = `Our pricing is transparent. We have a flat setup fee of ${currency === 'INR' ? '₹15,000' : '$200'} one-time, and a retainer starting at ${currency === 'INR' ? '₹999/mo' : '$15/mo'}. No setup charges apply during your 14-day trial!`;
      } else if (textLower.includes('setup') || textLower.includes('how long')) {
        replyText = "We configure everything and deliver your premium website + WhatsApp booking API ready to use in just 3 to 5 business days!";
      }

      setChatMessages(prev => [...prev, { sender: 'agent', text: replyText }]);
    }, 1000);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    try {
      await addDoc(collection(db, 'newsletter'), {
        email: newsletterEmail,
        createdAt: serverTimestamp()
      });

      setNewsletterSubmitted(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    } catch (error) {
      console.error("Error subscribing to newsletter: ", error);
      alert("Subscription failed. Please check your connection.");
    }
  };

  // Pricing calculations
  const setupFee = currency === 'INR' ? '₹15,000' : '$200';
  const scaleSetupFee = currency === 'INR' ? '₹25,000' : '$350';
  
  const monthlyRetainer = currency === 'INR' 
    ? (billingPeriod === 'monthly' ? '₹999' : '₹799') 
    : (billingPeriod === 'monthly' ? '$15' : '$12');

  const scaleMonthlyRetainer = currency === 'INR'
    ? (billingPeriod === 'monthly' ? '₹1,999' : '₹1,599')
    : (billingPeriod === 'monthly' ? '$30' : '$24');

  const billPeriodLabel = '/mo';
  const billingCycleLabel = billingPeriod === 'monthly' ? 'Billed monthly' : 'Billed annually (Save 20%)';

  // ROI Calculator Calculations
  const timeSavedHours = Math.round((calcBookings * 8) / 60);
  const extraBookingsVal = Math.round(calcBookings * 0.25);
  const calculatedGain = extraBookingsVal * calcTicket;
  const formattedRevenue = currency === 'INR' 
    ? `₹${calculatedGain.toLocaleString('en-IN')}` 
    : `$${calculatedGain.toLocaleString('en-US')}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-cyan-accent selection:text-white">
      
      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <img src={logoImg} alt="Nexosia Logo" className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-midnight transition-colors duration-200">Features</a>
            <a href="#demo" className="hover:text-midnight transition-colors duration-200">Interactive Demo</a>
            <a href="#compare" className="hover:text-midnight transition-colors duration-200">Compare</a>
            <a href="#roi-calculator" className="hover:text-midnight transition-colors duration-200">ROI Calculator</a>
            <a href="#pricing" className="hover:text-midnight transition-colors duration-200">Pricing</a>
            <a href="#faq" className="hover:text-midnight transition-colors duration-200">FAQ</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => openWizard('demo')}
              className="text-slate-600 hover:text-midnight text-sm font-bold transition-colors duration-200 px-4 py-2"
            >
              Login
            </button>
            <button 
              onClick={() => openWizard('demo')}
              className="bg-cyan-accent hover:bg-cyan-accent-dark text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-300 shadow-lg shadow-cyan-accent/20 hover:shadow-cyan-accent/40 hover:-translate-y-0.5 cyan-glow-button cursor-pointer"
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
              <a href="#demo" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-cyan-accent py-2 border-b border-slate-100">Interactive Demo</a>
              <a href="#compare" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-cyan-accent py-2 border-b border-slate-100">Compare</a>
              <a href="#roi-calculator" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-cyan-accent py-2 border-b border-slate-100">ROI Calculator</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-cyan-accent py-2 border-b border-slate-100">Pricing</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-cyan-accent py-2 border-b border-slate-100">FAQ</a>
            </nav>
            <div className="flex flex-col gap-3 pt-4">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); openWizard('demo'); }}
                className="w-full text-center text-slate-600 hover:text-midnight py-2 font-bold"
              >
                Login
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); openWizard('demo'); }}
                className="w-full bg-cyan-accent hover:bg-cyan-accent-dark text-white text-center font-bold py-3 rounded-xl transition-all duration-300"
              >
                Get a Free Demo
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:py-32 overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-50">
        
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #CBD5E1 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-8">
              
              <div className="inline-flex items-center gap-2 bg-slate-200/60 backdrop-blur-sm border border-slate-300/50 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold text-slate-700">
                <Sparkles className="h-4 w-4 text-cyan-accent animate-pulse" />
                <span>Next-Gen Booking Automations for Clinics & Local Stores</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-midnight font-heading tracking-tight leading-tight">
                Automate Your Local Business. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-accent to-cyan-accent-dark">Turn Visitors into Bookings</span> via WhatsApp.
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
                Get a premium website and an automated booking system that works 24/7. Built specifically for independent clinics, local stores, and salons. Let customers book appointments in under 30 seconds.
              </p>

              {/* CTAs */}
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button 
                  onClick={() => openWizard('trial')}
                  className="bg-cyan-accent hover:bg-cyan-accent-dark text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-xl shadow-cyan-accent/25 hover:shadow-cyan-accent/40 hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 cyan-glow-button cursor-pointer"
                >
                  Start Your Free 14-Day Trial
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setIsVideoModalOpen(true)}
                  className="flex items-center justify-center gap-2 text-slate-700 hover:text-midnight font-semibold py-3 px-6 rounded-full transition-all duration-200 border border-slate-300 hover:bg-slate-100 text-center cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-slate-700 text-slate-700" />
                  See How It Works
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/80 w-full">
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>No credit card required for trial</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>Setup ready in 3-5 business days</span>
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="absolute w-72 h-72 rounded-full bg-cyan-accent/20 blur-3xl -top-10 -right-10 pointer-events-none"></div>
              <div className="absolute w-72 h-72 rounded-full bg-slate-300/30 blur-3xl -bottom-10 -left-10 pointer-events-none"></div>

              {/* Side-by-side Layout Wrapper */}
              <div className="flex items-end gap-4 max-w-full relative">
                
                {/* Mockup 1: Mobile Web Interface */}
                <div className="relative w-48 sm:w-56 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col select-none -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 z-10">
                  <div className="bg-slate-100 px-3 py-2 flex items-center gap-1.5 border-b border-slate-200">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    <div className="bg-white text-[9px] text-slate-400 rounded px-2 py-0.5 ml-2 truncate w-full flex-grow text-center">
                      apexhealth.com
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">A</div>
                      <span className="font-bold text-[10px] text-midnight font-heading">Apex Health</span>
                    </div>
                    <div className="h-20 bg-indigo-50 rounded-lg flex items-center justify-center p-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-cyan-50"></div>
                      <span className="text-[10px] text-indigo-700 font-bold text-center z-10">Modern Clinic Website</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                      <div className="h-1.5 w-full bg-slate-100 rounded"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="p-2 border border-slate-100 rounded-lg flex flex-col items-center">
                        <span className="text-[8px] font-bold text-slate-700">Consultation</span>
                        <span className="text-[6px] text-slate-400">30 Mins</span>
                      </div>
                      <div className="p-2 border border-slate-100 rounded-lg flex flex-col items-center">
                        <span className="text-[8px] font-bold text-slate-700">Dental Care</span>
                        <span className="text-[6px] text-slate-400">45 Mins</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setSimTab('widget');
                        const target = document.getElementById('demo');
                        if (target) target.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full bg-[#25d366] hover:bg-[#128c7e] text-white text-[10px] font-extrabold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <MessageSquare className="h-3 w-3 fill-white" />
                      Book via WhatsApp
                    </button>
                  </div>
                </div>

                {/* Mockup 2: WhatsApp Chat */}
                <div className="relative w-52 sm:w-60 bg-[#e5ddd5] rounded-3xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col h-[320px] sm:h-[360px] rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500">
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
                  <div className="flex-grow p-2.5 space-y-2 overflow-y-auto flex flex-col justify-end">
                    <div className="bg-[#dcf8c6] text-slate-800 text-[9px] rounded-lg p-1.5 max-w-[85%] self-end shadow-sm">
                      Hi, I want to book a dentist appointment.
                    </div>
                    <div className="bg-white text-slate-800 text-[9px] rounded-lg p-1.5 max-w-[85%] self-start shadow-sm leading-normal">
                      Hello! Welcome to Apex Health. I can schedule your visit. Which day would you prefer?
                    </div>
                    <div className="bg-[#dcf8c6] text-slate-800 text-[9px] rounded-lg p-1.5 max-w-[85%] self-end shadow-sm">
                      July 6 (Monday)
                    </div>
                    <div className="bg-white text-slate-800 text-[9px] rounded-lg p-1.5 max-w-[85%] self-start shadow-sm leading-normal border-l-4 border-emerald-500">
                      🎉 **Booking Confirmed!**
                      <br />
                      📅 **Date:** Monday, July 6
                      <br />
                      ⏰ **Time:** 10:00 AM
                    </div>
                  </div>
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

      {/* Social Proof Section */}
      <section className="bg-slate-100 py-10 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase mb-8">
            Trusted by 500+ local clinics, salons, and retail businesses globally
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold font-heading text-xs">M</div>
              <span className="font-extrabold text-slate-800 text-sm font-heading tracking-tight">MedCare Clinic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold font-heading text-xs">U</div>
              <span className="font-extrabold text-slate-800 text-sm font-heading tracking-tight">UrbanStyle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold font-heading text-xs">P</div>
              <span className="font-extrabold text-slate-800 text-sm font-heading tracking-tight">PetHaven</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-slate-800 text-white flex items-center justify-center font-bold font-heading text-xs">B</div>
              <span className="font-extrabold text-slate-800 text-sm font-heading tracking-tight">BrightDent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold font-heading text-xs">G</div>
              <span className="font-extrabold text-slate-800 text-sm font-heading tracking-tight">GreenGrocer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-accent font-heading">Complete Automation Stack</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-midnight font-heading tracking-tight">
              One Unified System to Fill Your Calendar & Explode Sales
            </p>
            <p className="text-slate-600">
              Stop juggling expensive tools, slow developers, and complex APIs. Nexosia handles your web and appointment pipeline from end to end.
            </p>
          </div>

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

      {/* Advanced Feature: Comparison Table */}
      <section id="compare" className="py-24 md:py-32 bg-slate-50 border-t border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-accent font-heading">Smart Comparison</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-midnight font-heading tracking-tight">
              Why Local Businesses Choose Nexosia
            </p>
            <p className="text-slate-600">
              See how we stack up against traditional development agencies and generic DIY website builders.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider font-bold">
                    <th className="p-6">Feature / Metric</th>
                    <th className="p-6 text-cyan-electric">🚀 Nexosia</th>
                    <th className="p-6 opacity-80">Traditional Agency</th>
                    <th className="p-6 opacity-80">DIY Builders (Wix/WPS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {COMPARISON_ROWS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-bold text-midnight">{row.feature}</td>
                      <td className="p-6 bg-cyan-accent/5 font-semibold text-cyan-accent-dark">{row.nexosia}</td>
                      <td className="p-6 text-slate-500">{row.agency}</td>
                      <td className="p-6 text-slate-500">{row.diy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Showcase & Chat Simulator */}
      <section id="demo" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Content column */}
            <div className="lg:col-span-6 text-left space-y-6">
              <div className="inline-flex items-center gap-1.5 bg-cyan-accent/10 border border-cyan-accent/20 rounded-full px-3.5 py-1.5 text-xs font-bold text-cyan-accent-dark">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Interactive Live Demo Simulator</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-midnight font-heading tracking-tight">
                Experience the Entire Booking & Feedback Ecosystem
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Click the tabs below to toggle between different modules of the system. Test how visitors transition from browsing to booking, and finally giving a 5-star Google review.
              </p>

              {/* Selector Tabs */}
              <div className="flex flex-col sm:flex-row gap-2.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                <button 
                  onClick={() => setSimTab('widget')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    simTab === 'widget' ? 'bg-white text-midnight shadow-md border-b-2 border-cyan-accent' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  1. Website Booking Widget
                </button>
                <button 
                  onClick={() => setSimTab('bot')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    simTab === 'bot' ? 'bg-white text-midnight shadow-md border-b-2 border-cyan-accent' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <MessageCircle className="h-4 w-4" />
                  2. WhatsApp Bot Flow
                </button>
                <button 
                  onClick={() => setSimTab('reviews')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    simTab === 'reviews' ? 'bg-white text-midnight shadow-md border-b-2 border-cyan-accent' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Star className="h-4 w-4" />
                  3. Auto-Review Request
                </button>
              </div>

              {/* Tab Description Cards */}
              <div className="bg-slate-100/50 rounded-2xl p-6 border border-slate-200">
                {simTab === 'widget' && (
                  <div className="space-y-2 text-sm">
                    <h4 className="font-extrabold text-midnight">Step 1: The Clean Web Trigger</h4>
                    <p className="text-slate-500">When visitors land on your website, a floating WhatsApp bubble prompts them to chat. Clicking the button automatically redirects them to WhatsApp with a pre-filled welcome text, achieving zero lead friction.</p>
                    <button 
                      onClick={() => setSimTab('bot')} 
                      className="mt-3 text-cyan-accent-dark font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Continue to Bot Flow <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {simTab === 'bot' && (
                  <div className="space-y-2 text-sm">
                    <h4 className="font-extrabold text-midnight">Step 2: AI Bot Consultation & Slot Lock</h4>
                    <p className="text-slate-500">The bot greets them instantly, presents open days and slots directly in WhatsApp, takes their name, books the session, and triggers calendar synching. Try booking an appointment on the simulator phone mockup!</p>
                  </div>
                )}
                {simTab === 'reviews' && (
                  <div className="space-y-2 text-sm">
                    <h4 className="font-extrabold text-midnight">Step 3: The Google Review Multiplier</h4>
                    <p className="text-slate-500">After appointments conclude, our script requests feedback via WhatsApp. Happy clients get direct links to write a 5-star Google review. Test it by clicking the rating buttons inside the simulator screen!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Simulator column */}
            <div className="lg:col-span-6 flex justify-center">
              
              {/* Phone Mockup Container */}
              <div className="relative border-[12px] border-slate-900 rounded-[2.5rem] shadow-2xl h-[560px] w-[340px] max-w-full bg-[#e5ddd5] overflow-hidden flex flex-col">
                
                {/* Notch */}
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-950 flex justify-center items-center z-30">
                  <div className="w-24 h-4 bg-slate-950 rounded-b-xl flex justify-center items-start">
                    <div className="w-10 h-1 bg-slate-800 rounded-full mt-1.5"></div>
                  </div>
                </div>

                {/* 1. Website Booking Widget Page */}
                {simTab === 'widget' && (
                  <div className="absolute inset-0 bg-white flex flex-col pt-6 z-10 select-none">
                    <div className="bg-slate-100 px-3 py-2 flex items-center gap-1.5 border-b border-slate-200">
                      <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                      <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <span className="text-[8px] text-slate-400 flex-grow text-center">apexhealth.com</span>
                    </div>
                    <div className="flex-grow p-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-extrabold text-[12px] text-indigo-700">🏥 Apex Health</span>
                          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold">☰</div>
                        </div>
                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 text-center space-y-2">
                          <h4 className="font-extrabold text-xs text-indigo-950 font-heading">Complete Family Medical Center</h4>
                          <p className="text-[9px] text-indigo-600">Secure top-tier care instantly with our expert doctor panel.</p>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-bold text-[10px] text-slate-700">Available Doctors:</h5>
                          <div className="flex items-center gap-2 p-2 border border-slate-100 rounded-xl bg-slate-50/50">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 font-heading">SJ</div>
                            <div>
                              <h6 className="text-[9px] font-bold text-slate-700">Dr. Sarah Jenkins</h6>
                              <p className="text-[7px] text-slate-400">Dentistry Specialist • 12 Yrs Exp</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-[8px] text-center text-slate-400 font-semibold">Ready to book your session?</p>
                        <button 
                          onClick={() => setSimTab('bot')}
                          className="w-full bg-[#25d366] hover:bg-[#128c7e] text-white text-xs font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                        >
                          <MessageSquare className="h-4 w-4 fill-white" />
                          Book via WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. WhatsApp Bot Flow Page */}
                {simTab === 'bot' && (
                  <div className="absolute inset-0 flex flex-col pt-6 z-10 bg-[#e5ddd5]">
                    
                    <div className="bg-[#075e54] text-white p-3 pb-2.5 flex items-center justify-between shrink-0 shadow-md">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200/90 flex items-center justify-center text-[#075e54] font-bold text-xs">AH</div>
                        <div>
                          <h4 className="text-xs font-bold leading-tight">Apex Health Clinic</h4>
                          <span className="text-[8px] text-emerald-300 flex items-center gap-1 font-medium">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>online assistant
                          </span>
                        </div>
                      </div>
                      <button onClick={resetSimulator} className="text-[8px] border border-white/20 bg-white/10 px-2 py-0.5 rounded text-white cursor-pointer">Reset</button>
                    </div>

                    <div className="flex-grow p-3.5 overflow-y-auto space-y-3.5 flex flex-col justify-end">
                      {simMessages.map((msg, idx) => (
                        <div 
                          key={idx} 
                          className={`text-[11px] rounded-xl p-3 shadow-sm max-w-[85%] leading-relaxed ${
                            msg.sender === 'user' 
                              ? 'bg-[#dcf8c6] text-slate-800 self-end rounded-tr-none' 
                              : 'bg-white text-slate-800 self-start rounded-tl-none'
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.text}</p>
                          <span className="text-[7px] text-slate-400 block text-right mt-1">{msg.time}</span>
                        </div>
                      ))}
                      {isSimTyping && (
                        <div className="bg-white text-slate-800 self-start text-[10px] rounded-xl rounded-tl-none p-2.5 shadow-sm flex items-center gap-1.5 animate-pulse max-w-[50%]">
                          <span className="text-slate-500">typing...</span>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    <div className="bg-white p-3 border-t border-slate-200 shrink-0">
                      {simStep === 0 && !isSimTyping && (
                        <div className="space-y-1.5">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider text-center mb-1">Choose an option:</p>
                          <button onClick={() => handleSimOptionClick("Monday, July 6", 1)} className="w-full bg-slate-55 hover:bg-emerald-50 text-slate-800 border border-slate-200 text-xs py-2 px-3 rounded-lg text-left transition-all cursor-pointer">📅 Monday, July 6</button>
                          <button onClick={() => handleSimOptionClick("Tuesday, July 7", 1)} className="w-full bg-slate-55 hover:bg-emerald-50 text-slate-800 border border-slate-200 text-xs py-2 px-3 rounded-lg text-left transition-all cursor-pointer">📅 Tuesday, July 7</button>
                        </div>
                      )}
                      {simStep === 1 && !isSimTyping && (
                        <div className="space-y-1.5">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider text-center mb-1">Choose a Time Slot:</p>
                          <div className="grid grid-cols-3 gap-1.5">
                            <button onClick={() => handleSimOptionClick("10:00 AM", 2)} className="bg-slate-100 text-xs py-2 rounded-lg text-center font-bold cursor-pointer">10:00 AM</button>
                            <button onClick={() => handleSimOptionClick("2:30 PM", 2)} className="bg-slate-100 text-xs py-2 rounded-lg text-center font-bold cursor-pointer">2:30 PM</button>
                            <button onClick={() => handleSimOptionClick("4:15 PM", 2)} className="bg-slate-100 text-xs py-2 rounded-lg text-center font-bold cursor-pointer">4:15 PM</button>
                          </div>
                        </div>
                      )}
                      {simStep === 2 && !isSimTyping && (
                        <form onSubmit={handleSimNameSubmit} className="flex gap-2 items-center font-sans">
                          <input 
                            type="text" 
                            placeholder="Enter your Full Name" 
                            value={simNameInput}
                            onChange={(e) => setSimNameInput(e.target.value)}
                            className="flex-grow border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 bg-slate-50"
                            required
                            autoFocus
                          />
                          <button type="submit" className="bg-[#075e54] text-white px-3 py-2 rounded-lg text-xs font-bold cursor-pointer">Send</button>
                        </form>
                      )}
                      {simStep === 3 && !isSimTyping && (
                        <div className="text-center py-1">
                          <p className="text-xs text-emerald-600 font-bold flex items-center justify-center gap-1 mb-1">
                            <CheckCircle2 className="h-4 w-4" /> Booked!
                          </p>
                          <button onClick={() => setSimTab('reviews')} className="text-[9px] text-cyan-accent-dark hover:underline font-bold cursor-pointer">Continue to Review flow</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Review Request Page */}
                {simTab === 'reviews' && (
                  <div className="absolute inset-0 flex flex-col pt-6 z-10 bg-[#e5ddd5]">
                    
                    <div className="bg-[#075e54] text-white p-3 pb-2.5 flex items-center justify-between shrink-0 shadow-md">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200/90 flex items-center justify-center text-[#075e54] font-bold text-xs">AH</div>
                        <div>
                          <h4 className="text-xs font-bold leading-tight">Apex Health Clinic</h4>
                          <span className="text-[8px] text-emerald-300 flex items-center gap-1 font-medium">review feedback</span>
                        </div>
                      </div>
                      <button onClick={resetReviewSimulator} className="text-[8px] border border-white/20 bg-white/10 px-2 py-0.5 rounded text-white cursor-pointer">Reset</button>
                    </div>

                    <div className="flex-grow p-3.5 overflow-y-auto space-y-3.5 flex flex-col justify-end">
                      {reviewMessages.map((msg, idx) => (
                        <div 
                          key={idx} 
                          className={`text-[11px] rounded-xl p-3 shadow-sm max-w-[85%] leading-relaxed ${
                            msg.sender === 'user' 
                              ? 'bg-[#dcf8c6] text-slate-800 self-end rounded-tr-none' 
                              : 'bg-white text-slate-800 self-start rounded-tl-none border-l-4 border-amber-400'
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.text}</p>
                          <span className="text-[7px] text-slate-400 block text-right mt-1">{msg.time}</span>
                        </div>
                      ))}
                      {reviewTyping && (
                        <div className="bg-white text-slate-800 self-start text-[10px] rounded-xl rounded-tl-none p-2.5 shadow-sm flex items-center gap-1.5 animate-pulse max-w-[50%]">
                          <span className="text-slate-500">typing...</span>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    <div className="bg-white p-3 border-t border-slate-200 shrink-0 font-sans">
                      {reviewStep === 0 && (
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider text-center mb-1.5">Tap a rating option:</p>
                          <div className="flex justify-center gap-1">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <button 
                                key={num} 
                                onClick={() => handleReviewRating(num)}
                                className="w-10 h-10 rounded-full border border-slate-200 hover:border-amber-400 bg-slate-55 hover:bg-amber-50 flex items-center justify-center font-bold text-slate-700 hover:text-amber-600 transition-all text-xs cursor-pointer"
                              >
                                {num}★
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {reviewStep === 2 && (
                        <div className="text-center py-2">
                          <a 
                            href="https://google.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#25d366] text-white font-extrabold text-xs py-2.5 px-6 rounded-full shadow-lg"
                          >
                            <Star className="h-4.5 w-4.5 fill-white text-white" />
                            Leave Google Review
                          </a>
                        </div>
                      )}
                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <section id="roi-calculator" className="py-24 md:py-32 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-accent/10 blur-3xl -top-20 -left-20 pointer-events-none"></div>
        <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-3xl -bottom-20 -right-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative font-sans">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Inputs */}
            <div className="lg:col-span-6 text-left space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1 bg-cyan-electric/10 border border-cyan-electric/20 rounded-full px-3.5 py-1 text-xs font-bold text-cyan-electric">
                  <Sliders className="h-3.5 w-3.5" />
                  <span>ROI Savings Estimator</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight leading-tight">
                  Calculate Your Earnings & Time Saved
                </h2>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  Drag the sliders below to estimate your current monthly booking volumes and ticket values. See how quickly automating appointments pays for itself.
                </p>
              </div>

              <div className="space-y-6 bg-slate-800/50 p-6 rounded-3xl border border-slate-800">
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-300">Estimated Bookings / Month</span>
                    <span className="text-cyan-electric font-bold text-lg font-heading">{calcBookings} Appointments</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="1000" 
                    step="10"
                    value={calcBookings}
                    onChange={(e) => setCalcBookings(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-accent"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>50</span>
                    <span>500</span>
                    <span>1,000+</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-300">Average Booking Ticket Value</span>
                    <span className="text-cyan-electric font-bold text-lg font-heading">
                      {currency === 'INR' ? `₹${calcTicket}` : `$${calcTicket}`}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min={currency === 'INR' ? "200" : "5"} 
                    max={currency === 'INR' ? "10000" : "150"} 
                    step={currency === 'INR' ? "100" : "5"}
                    value={calcTicket}
                    onChange={(e) => setCalcTicket(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-accent"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>{currency === 'INR' ? "₹200" : "$5"}</span>
                    <span>{currency === 'INR' ? "₹5,000" : "$75"}</span>
                    <span>{currency === 'INR' ? "₹10,000+" : "$150+"}</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Outputs */}
            <div className="lg:col-span-6">
              <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-8 text-left space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-cyan-accent text-slate-950 font-bold text-[9px] px-3.5 py-1 rounded-bl-xl uppercase tracking-wider">
                  Nexosia Projections
                </div>
                
                <h3 className="font-heading font-extrabold text-lg text-white">Your Monthly Return</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/30 space-y-1">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-cyan-accent" />
                      <span>Hours Saved</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold font-heading text-white">{timeSavedHours} Hrs</p>
                    <p className="text-[9px] text-slate-500 font-semibold">Saved from phone tasks</p>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/30 space-y-1">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                      <span>New Bookings</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold font-heading text-emerald-400">+{extraBookingsVal}</p>
                    <p className="text-[9px] text-slate-500 font-semibold">25% reply rate growth</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-accent/20 to-indigo-900/20 p-6 rounded-2xl border border-cyan-accent/20 space-y-2">
                  <div className="text-[10px] text-cyan-electric font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-cyan-electric" />
                    <span>Estimated Monthly Revenue Increase</span>
                  </div>
                  <p className="text-4xl sm:text-5xl font-extrabold font-heading text-white">{formattedRevenue}</p>
                  <p className="text-xs text-slate-400 leading-normal">
                    This revenue projection represents bookings recovered due to instant, automated WhatsApp scheduling response.
                  </p>
                </div>

                <div className="pt-2 text-center">
                  <button 
                    onClick={() => openWizard('trial')}
                    className="w-full bg-cyan-accent hover:bg-cyan-accent-dark text-slate-950 hover:text-white font-extrabold py-3.5 rounded-xl transition-all duration-300 shadow-lg text-center text-sm cursor-pointer"
                  >
                    Deploy to Your Business
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Integrations Grid */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-accent font-heading">Seamless Ecosystem</h3>
            <p className="text-xl sm:text-2xl font-extrabold text-midnight font-heading tracking-tight">
              Connects Directly to Your Everyday Work Tools
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 max-w-4xl mx-auto">
            {['Google Calendar', 'Stripe Payments', 'WhatsApp API', 'Apple Calendar', 'Google Business', 'Twilio Sync', 'WordPress', 'Shopify'].map((tool, idx) => (
              <span 
                key={idx}
                className="bg-slate-50 border border-slate-200 hover:border-cyan-accent text-slate-600 hover:text-midnight font-semibold text-xs px-4 py-2.5 rounded-full transition-all duration-200 shadow-sm flex items-center gap-2 cursor-default select-none"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-accent"></span>
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-accent font-heading">Frictionless Integration</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-midnight font-heading tracking-tight">
              We Do 100% of the Work. You Get the Bookings.
            </p>
            <p className="text-slate-600 text-base">
              Set up your modern website and WhatsApp ecosystem in three simple phases. No coding, no API configuration, and no technical headaches.
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-accent/20 via-cyan-accent to-cyan-accent/20 -translate-y-12"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
              
              {/* Step 1 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 relative flex flex-col justify-between items-center text-center shadow-lg hover:shadow-xl transition-all duration-300">
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
              <div className="bg-white border border-slate-200 rounded-3xl p-8 relative flex flex-col justify-between items-center text-center shadow-lg hover:shadow-xl transition-all duration-300">
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
              <div className="bg-white border border-slate-200 rounded-3xl p-8 relative flex flex-col justify-between items-center text-center shadow-lg hover:shadow-xl transition-all duration-300">
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

          <div className="text-center mt-16">
            <button 
              onClick={() => openWizard('trial')}
              className="bg-midnight hover:bg-slate-800 text-white font-bold text-base px-8 py-3.5 rounded-full transition-all duration-300 shadow-xl inline-flex items-center gap-2 cursor-pointer"
            >
              Get Started Risk Free
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>

        </div>
      </section>

      {/* Pricing Section (Growth vs. Scale Packages) */}
      <section id="pricing" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-accent font-heading">Transparent Pricing</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-midnight font-heading tracking-tight">
              Simple Packages. Everything Included.
            </p>
            <p className="text-slate-600 text-base">
              Flat, low upfront fee for custom website development and chatbot configuration, followed by a minor SaaS retainer to maintain hosting and bot infrastructure.
            </p>

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

          {/* Side-by-Side Cards (Growth vs Scale Package) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Card 1: Growth Package */}
            <div className="bg-slate-900 text-white rounded-3xl shadow-xl overflow-hidden border border-slate-800 relative hover:scale-[1.01] transition-transform duration-300 flex flex-col justify-between">
              <div className="p-8 sm:p-10 space-y-6 text-left">
                <div>
                  <h3 className="text-2xl font-bold font-heading text-cyan-electric">The Growth Package</h3>
                  <p className="text-slate-400 text-xs mt-1">Perfect for local clinics, salons, spas, and boutique retail stores.</p>
                </div>

                <div className="border-y border-slate-800 py-6 space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold font-heading text-white">{setupFee}</span>
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Setup fee</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <span>+</span>
                    <span className="text-2xl font-bold font-heading text-white">{monthlyRetainer}</span>
                    <span className="text-slate-400 text-xs">{billPeriodLabel} retainer</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Included Features:</h4>
                  <ul className="space-y-3 text-slate-300 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-cyan-accent flex-shrink-0" />
                      <span>Custom Website (Up to 5 Pages)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-cyan-accent flex-shrink-0" />
                      <span>WhatsApp Automated Booking Bot</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-cyan-accent flex-shrink-0" />
                      <span>1 Staff Member Calendar Integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-cyan-accent flex-shrink-0" />
                      <span>Google Reviews Automation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-cyan-accent flex-shrink-0" />
                      <span>Secure Web Hosting & Free SSL</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-8 sm:p-10 pt-0 text-left">
                <button 
                  onClick={() => openWizard('trial')}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm py-4 rounded-xl transition-all cursor-pointer text-center"
                >
                  Start 14-Day Free Trial
                </button>
              </div>
            </div>

            {/* Card 2: Scale Package */}
            <div className="bg-white text-slate-800 rounded-3xl shadow-2xl overflow-hidden border-2 border-cyan-accent relative hover:scale-[1.01] transition-transform duration-300 flex flex-col justify-between">
              
              {/* Scale Best Value Tag */}
              <div className="absolute top-0 right-0 bg-cyan-accent text-slate-950 font-bold text-[10px] px-5 py-2 rounded-bl-2xl uppercase tracking-widest font-heading">
                Best Value / Scale
              </div>

              <div className="p-8 sm:p-10 space-y-6 text-left">
                <div>
                  <h3 className="text-2xl font-bold font-heading text-midnight">The Scale Package</h3>
                  <p className="text-slate-500 text-xs mt-1">For multi-staff clinics, busy stores, and high-volume services.</p>
                </div>

                <div className="border-y border-slate-200 py-6 space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold font-heading text-midnight">{scaleSetupFee}</span>
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Setup fee</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <span>+</span>
                    <span className="text-2xl font-bold font-heading text-midnight">{scaleMonthlyRetainer}</span>
                    <span className="text-slate-400 text-xs">{billPeriodLabel} retainer</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Everything in Growth plus:</h4>
                  <ul className="space-y-3 text-slate-700 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-cyan-accent-dark flex-shrink-0" />
                      <span className="font-semibold text-midnight">Multi-Staff Scheduling (Up to 10 staff)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-cyan-accent-dark flex-shrink-0" />
                      <span className="font-semibold text-midnight">Multi-Location Booking Support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-cyan-accent-dark flex-shrink-0" />
                      <span>Custom CRM or API Integrations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-cyan-accent-dark flex-shrink-0" />
                      <span>Stripe Payment Links in WhatsApp</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-cyan-accent-dark flex-shrink-0" />
                      <span>Priority 24/7 Dedicated Manager</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-8 sm:p-10 pt-0 text-left">
                <button 
                  onClick={() => openWizard('trial')}
                  className="w-full bg-cyan-accent hover:bg-cyan-accent-dark text-slate-950 font-extrabold text-sm py-4 rounded-xl transition-all cursor-pointer text-center"
                >
                  Claim Scale Package
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-accent font-heading">Success Stories</h2>
            <p className="text-3xl font-extrabold text-midnight font-heading tracking-tight">
              Loved by Local Clinics & Stores Globally
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[350px]">
            <div className="absolute top-6 right-8 text-slate-100 text-8xl font-serif font-bold pointer-events-none select-none">“</div>

            <div className="space-y-6 text-left">
              <div className="flex gap-1 text-amber-400">
                {[...Array(TESTIMONIALS[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-lg sm:text-xl text-slate-700 italic font-medium leading-relaxed font-sans">
                "{TESTIMONIALS[activeTestimonial].quote}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 pt-6 mt-8 gap-4 text-left font-sans">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm font-heading">
                  {TESTIMONIALS[activeTestimonial].avatar}
                </div>
                <div>
                  <h4 className="font-extrabold text-midnight font-heading text-sm sm:text-base leading-tight">
                    {TESTIMONIALS[activeTestimonial].name}
                  </h4>
                  <p className="text-slate-400 text-xs mt-0.5">{TESTIMONIALS[activeTestimonial].role}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                <span className="bg-cyan-accent/10 text-cyan-accent-dark font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                  {TESTIMONIALS[activeTestimonial].badge}
                </span>
                <div className="flex gap-2">
                  {TESTIMONIALS.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveTestimonial(idx)}
                      className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                        activeTestimonial === idx ? 'bg-cyan-accent w-6' : 'bg-slate-200 hover:bg-slate-300'
                      }`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 md:py-32 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-accent font-heading">Got Questions?</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-midnight font-heading tracking-tight">
              Frequently Asked Questions
            </p>
            <p className="text-slate-600 text-sm sm:text-base">
              Everything you need to know about our websites, WhatsApp bots, billing, and trial options.
            </p>
          </div>

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
              <p className="text-slate-400 text-sm max-w-sm leading-relaxed font-sans">
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
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Packages</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Column 3: Newsletter signup block */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-bold font-heading text-cyan-electric text-sm uppercase tracking-wider">Stay Updated</h4>
              <p className="text-slate-400 text-xs leading-relaxed font-sans">
                Join our newsletter list to receive modern automation tips, case studies, and business growth strategies.
              </p>
              
              {newsletterSubmitted ? (
                <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-xl text-xs font-bold text-cyan-electric flex items-center gap-2 animate-in fade-in duration-300 font-sans">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                  <span>Subscribed! Check your inbox soon.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2 font-sans">
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

      {/* Floating WhatsApp Chat Widget Icon & Popup */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 font-sans">
        
        {/* Chat window popup */}
        {isChatWidgetOpen && (
          <div className="bg-white w-[310px] h-[380px] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200">
            
            {/* Header */}
            <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#075e54] font-bold text-xs">N</div>
                <div>
                  <h4 className="text-xs font-bold leading-tight">Nexosia Assistant</h4>
                  <span className="text-[8px] opacity-80 block">Typically replies instantly</span>
                </div>
              </div>
              <button 
                onClick={() => setIsChatWidgetOpen(false)}
                className="text-white opacity-80 hover:opacity-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-grow p-4 bg-[#e5ddd5] overflow-y-auto space-y-3.5 flex flex-col justify-end">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`text-[11px] p-2.5 rounded-xl max-w-[85%] leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-[#dcf8c6] text-slate-800 self-end rounded-tr-none' 
                      : 'bg-white text-slate-800 self-start rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Footer Input */}
            <form onSubmit={handleWidgetChatSubmit} className="bg-slate-50 p-2 flex items-center gap-2 border-t border-slate-200">
              <input 
                type="text" 
                placeholder="Ask about setup or pricing..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-grow border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#075e54] bg-white"
                required
              />
              <button 
                type="submit" 
                className="bg-[#075e54] text-white p-2 rounded-lg text-xs font-bold cursor-pointer"
              >
                Send
              </button>
            </form>

          </div>
        )}

        {/* Floating Bubble Button */}
        <button 
          onClick={() => setIsChatWidgetOpen(!isChatWidgetOpen)}
          className="bg-[#25d366] hover:bg-[#128c7e] text-white p-4 rounded-full shadow-2xl transition-all hover:scale-105 cursor-pointer flex items-center justify-center"
          aria-label="Contact support"
        >
          {isChatWidgetOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6 fill-white" />}
        </button>

      </div>

      {/* Onboarding Wizard Modal */}
      {isWizardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200 text-left">
            
            {/* Close */}
            <button 
              onClick={() => setIsWizardModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Stepper progress indicator */}
            {!wizardSubmitted && (
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-6 border-b border-slate-100 pb-3">
                <span className={wizardStep >= 1 ? 'text-cyan-accent-dark' : ''}>1. Niche</span>
                <span>•</span>
                <span className={wizardStep >= 2 ? 'text-cyan-accent-dark' : ''}>2. Obstacles</span>
                <span>•</span>
                <span className={wizardStep >= 3 ? 'text-cyan-accent-dark' : ''}>3. Details</span>
              </div>
            )}

            {/* Content by Step */}
            {wizardSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>
                <h4 className="text-lg font-bold text-midnight">Analyzing Business Profile...</h4>
                <p className="text-xs text-slate-400">Deploying customized onboarding credentials.</p>
              </div>
            ) : (
              <div>
                
                {/* Step 1: Choose Niche */}
                {wizardStep === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h3 className="text-xl font-bold font-heading text-midnight">Select Your Business Type</h3>
                    <p className="text-slate-500 text-xs">We customize the website template and automated booking bot questions based on your niche.</p>
                    <div className="grid grid-cols-2 gap-3.5 pt-2">
                      {[
                        { id: 'clinic', label: '🏥 Medical Clinic / Doctor', desc: 'Patients booking visits' },
                        { id: 'salon', label: '✂️ Salon, Spa & Beauty', desc: 'Clients booking services' },
                        { id: 'store', label: '🛍️ Retail Store / Shop', desc: 'Ordering & slot collections' },
                        { id: 'other', label: '💼 Professional Services', desc: 'Consultations & calls' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNicheSelection(item.id)}
                          className="p-4 border border-slate-200 hover:border-cyan-accent rounded-2xl hover:bg-cyan-accent/5 text-left transition-all cursor-pointer flex flex-col justify-between"
                        >
                          <span className="font-bold text-slate-800 text-xs">{item.label}</span>
                          <span className="text-[9px] text-slate-400 mt-2 block">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Obstacles */}
                {wizardStep === 2 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h3 className="text-xl font-bold font-heading text-midnight">What is your biggest booking headache?</h3>
                    <p className="text-slate-500 text-xs">Select all that apply so we configure the bot triggers correctly.</p>
                    <div className="space-y-2.5 pt-2">
                      {[
                        { id: 'after_hours', label: '⏰ Losing potential bookings after business hours' },
                        { id: 'manual_calls', label: '📞 Spending hours on phone scheduling' },
                        { id: 'no_shows', label: '❌ High appointment no-show rates' },
                        { id: 'bad_reviews', label: '⭐ Struggling to accumulate Google Reviews' }
                      ].map((item) => {
                        const isChecked = wizardData.headaches.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleHeadacheToggle(item.id)}
                            className={`w-full p-3.5 border rounded-2xl text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                              isChecked ? 'border-cyan-accent bg-cyan-accent/5 text-cyan-accent-dark' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span>{item.label}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isChecked ? 'border-cyan-accent bg-cyan-accent text-white' : 'border-slate-300'}`}>
                              {isChecked && <Check className="w-3 h-3" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <button onClick={() => setWizardStep(1)} className="text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" /> Back
                      </button>
                      <button 
                        onClick={() => setWizardStep(3)} 
                        disabled={wizardData.headaches.length === 0}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          wizardData.headaches.length > 0 ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact details */}
                {wizardStep === 3 && (
                  <form onSubmit={handleWizardSubmit} className="space-y-4 animate-in fade-in duration-200">
                    <h3 className="text-xl font-bold font-heading text-midnight">Enter Business Details</h3>
                    <p className="text-slate-500 text-xs">Let's create your account. We will analyze your profile and contact you with a layout draft.</p>
                    
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Your Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. John Doe"
                          value={wizardData.name}
                          onChange={(e) => setWizardData({...wizardData, name: e.target.value})}
                          className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-accent focus:bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Business Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Apex Dental Clinic"
                          value={wizardData.businessName}
                          onChange={(e) => setWizardData({...wizardData, businessName: e.target.value})}
                          className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-accent focus:bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">WhatsApp Number</label>
                        <input 
                          type="tel" 
                          placeholder="e.g. +91 98765 43210"
                          value={wizardData.phone}
                          onChange={(e) => setWizardData({...wizardData, phone: e.target.value})}
                          className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-accent focus:bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
                        <input 
                          type="email" 
                          placeholder="e.g. contact@business.com"
                          value={wizardData.email}
                          onChange={(e) => setWizardData({...wizardData, email: e.target.value})}
                          className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-accent focus:bg-white"
                          required={wizardType === 'trial'}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <button type="button" onClick={() => setWizardStep(2)} className="text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer">
                        <ChevronLeft className="h-4 w-4" /> Back
                      </button>
                      <button 
                        type="submit"
                        className="bg-cyan-accent hover:bg-cyan-accent-dark text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-cyan-accent/15"
                      >
                        {wizardType === 'trial' ? 'Connect & Claim Free Setup' : 'Send Demo Request'}
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                )}

              </div>
            )}

          </div>
        </div>
      )}

      {/* Hero Video Demo Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Close */}
            <button 
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 text-slate-500 hover:text-slate-800 bg-white/80 hover:bg-white p-2 rounded-full shadow-md cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Mock Player Visual */}
            <div className="aspect-video bg-slate-950 rounded-2xl relative overflow-hidden flex flex-col justify-between p-6">
              
              {/* Header */}
              <div className="flex justify-between items-center text-white z-10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Live Booking Bot Simulation</span>
                </div>
                <span className="text-[10px] bg-slate-800/80 px-2 py-0.5 rounded text-slate-300 font-mono">0:24 / 1:30</span>
              </div>

              {/* Bot Simulation Body */}
              <div className="flex-grow flex items-center justify-center gap-6 my-4 select-none z-10">
                
                {/* Chat Visual Left */}
                <div className="bg-slate-900/90 border border-slate-850 rounded-2xl p-4 w-64 text-left space-y-2 shadow-2xl">
                  <div className="text-[9px] font-bold text-cyan-electric uppercase tracking-wider mb-2 flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> WhatsApp Auto-Scheduler
                  </div>
                  <div className="bg-slate-800 p-2 rounded-lg text-[9px] text-slate-300">
                    "Hi Rohan! I would like to book a dental checkup."
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg text-[9px] text-cyan-electric border-l-2 border-cyan-accent leading-normal">
                    "Instantly! 🦷 We have Monday, 10:00 AM available. Reply 'CONFIRM' to lock it."
                  </div>
                </div>

                {/* Calendar Visual Right */}
                <div className="hidden sm:block bg-slate-900/90 border border-slate-850 rounded-2xl p-4 w-44 text-left space-y-2 shadow-2xl">
                  <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Calendar Sync
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg text-[9px] text-slate-400 space-y-1">
                    <p className="text-[8px] font-bold text-white">Monday, July 6</p>
                    <div className="bg-indigo-950/50 border border-indigo-900 p-1 rounded text-[7px] text-indigo-300">
                      📅 10:00 AM - Rohan (Dental)
                    </div>
                  </div>
                </div>

              </div>

              {/* Controls */}
              <div className="flex items-center justify-between text-white text-xs z-10 pt-2 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <button className="hover:text-cyan-electric"><Play className="h-5 w-5 fill-current" /></button>
                  <span className="text-[10px] text-slate-400">Connecting lead triggers in real-time...</span>
                </div>
                <button 
                  onClick={() => { setIsVideoModalOpen(false); openWizard('trial'); }} 
                  className="bg-cyan-accent hover:bg-cyan-accent-dark text-slate-950 hover:text-white font-extrabold text-[10px] py-1.5 px-4 rounded-lg cursor-pointer"
                >
                  Start My Trial
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
