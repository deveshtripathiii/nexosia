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
  Building,
  Settings,
  Trash2,
  PlayCircle,
  PauseCircle,
  UserCheck,
  Zap,
  LogOut,
  Send,
  ArrowLeft
} from 'lucide-react';
import logoImg from './assets/logo.png';
import { auth, db } from './firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDoc
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

// FAQ items
const FAQ_ITEMS = [
  {
    question: "What are the website pricing options at Nexosia Tech?",
    answer: "We offer 4 clear options to suit your business stage: 1) Monthly Website Rental at ₹599/month (₹599 security deposit, ₹250 advance), 2) Yearly Website Rental at ₹5,000/year (₹599 security deposit, saves ₹2,100+), 3) Monthly Rental + Maintenance Pack at ₹748/month (includes 10 minor edits/month), and 4) Permanent Website Purchase at ₹10,000 one-time (full source code handover and IP rights defined in a written agreement)."
  },
  {
    question: "How do advance payments and delivery balances work for rental plans?",
    answer: "To start your custom design and WhatsApp bot setup, you pay an advance payment of ₹250 (which is included in the initial total). The remaining balance (₹948 for Monthly Rental, or ₹5,349 for Yearly Rental) is payable only after website delivery and agreed admin access."
  },
  {
    question: "What is the ₹599 Security Deposit and how is it handled?",
    answer: "The ₹599 security deposit is a separate one-time deposit required for rental plans. It is neither a service fee nor a guaranteed unconditional refund. The deposit is held separately from rental fees, and its reconciliation strictly follows the signed agreement and applicable law upon plan termination or conversion."
  },
  {
    question: "What is the Monthly Maintenance Pack (₹149/mo) and what does it include?",
    answer: "The Maintenance Pack is an optional monthly add-on of ₹149/month (bringing total recurring cost to ₹748/month with rental). It requires explicit customer consent and includes up to 10 minor edit requests per billing month (such as price updates, menu edits, hours changes, or text updates) subject to our fair-use policy. We do not automatically apply monthly Maintenance Pack charges to yearly rental customers; their maintenance arrangement is confirmed separately."
  },
  {
    question: "What basic maintenance is included vs what is charged separately?",
    answer: "All rental plans include the first month of basic maintenance from website activation (covering server uptime, SSL certificate renewal, core security monitoring, and basic bug fixes). Routine hosting health continues with active renewals. Heavy structural redesigns, adding new modules/pages, or edit requests exceeding the 10 minor edits/month fair-use policy are quoted and charged separately."
  },
  {
    question: "How does the Permanent Website Purchase (₹10,000) work?",
    answer: "Plan 4 (₹10,000 one-time) is a full purchase arrangement, not a recurring rental plan. The website scope, deliverables, source-code handover, intellectual-property rights, third-party licence exclusions, hosting, domain, future renewals, and maintenance are defined in a written agreement. We do not promise lifetime hosting, domain renewals, or maintenance unless explicitly included in writing. When converting from rental to permanent purchase, prior rental dues or deposit balances are reconciled per the contract."
  },
  {
    question: "Are custom domains and renewals included?",
    answer: "A default fast subdomain (e.g. yourbusiness.nexosia.app) is included with all rental packages. Custom domain registration (.com, .in, etc.) and annual domain renewals are charged separately unless agreed otherwise in writing."
  },
  {
    question: "How long does it take to build and launch my website?",
    answer: "We deliver your custom, premium website and fully functional WhatsApp booking bot within 3 to 5 business days. We handle everything from copy, design, to technical integrations."
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
  { feature: "Pricing Structure", nexosia: "₹599/mo Rental (₹250 Adv) or ₹10,000 Purchase", agency: "₹50,000 - ₹1,50,000+ upfront", diy: "Hidden plugins + time investment" },
  { feature: "Security Deposit Terms", nexosia: "₹599 one-time (Reconciled per signed contract & law)", agency: "Non-refundable heavy deposits", diy: "Non-refundable annual subscriptions" },
  { feature: "Setup Time", nexosia: "3 - 5 Days rapid delivery", agency: "4 - 8 Weeks", diy: "Weeks of trial & error" },
  { feature: "Maintenance Inclusions", nexosia: "1st mo basic incl. + optional ₹149/mo pack (10 edits)", agency: "₹5,000 - ₹15,000/mo retainer", diy: "Self-maintained / Community forums" },
  { feature: "WhatsApp Auto-Booking", nexosia: "Yes, pre-configured 24/7 assistant", agency: "Requires separate expensive API integration", diy: "Not supported natively" },
  { feature: "Source Code & IP Rights", nexosia: "Rental flexibility or 100% Code Handover (₹10k plan)", agency: "Often retained / locked by agency", diy: "Proprietary lock-in (cannot export)" },
  { feature: "Domain & Hosting Clarity", nexosia: "Subdomain incl. / Custom domain charged separately", agency: "₹5,000+ yearly hosting bills", diy: "₹1,200 - ₹3,000/mo recurring" },
  { feature: "Founder Support", nexosia: "24/7 Direct Founder WhatsApp (+91 7860716837)", agency: "Slow support ticket queues", diy: "Generic AI chatbots only" }
];


// --- ROYAL GOLDEN MANDALA SVG COMPONENT ---
const MandalaOrnament = ({ className = "w-96 h-96", opacity = 0.25, reverse = false }) => (
  <svg
    viewBox="0 0 400 400"
    className={`pointer-events-none select-none ${className}`}
    style={{ opacity, animation: reverse ? 'spinReverseSlow 70s linear infinite' : 'spinSlow 50s linear infinite' }}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="30%" stopColor="#FDE047" />
        <stop offset="70%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <radialGradient id="goldCenterGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#78350F" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="200" cy="200" r="192" stroke="url(#goldGrad)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
    <circle cx="200" cy="200" r="180" stroke="url(#goldGrad)" strokeWidth="1.8" opacity="0.7" />
    <circle cx="200" cy="200" r="155" stroke="url(#goldGrad)" strokeWidth="1.2" />
    <circle cx="200" cy="200" r="125" stroke="url(#goldGrad)" strokeWidth="1.6" strokeDasharray="8 4" />
    <circle cx="200" cy="200" r="95" stroke="url(#goldGrad)" strokeWidth="1.2" />
    <circle cx="200" cy="200" r="65" stroke="url(#goldGrad)" strokeWidth="1.8" />
    <circle cx="200" cy="200" r="35" stroke="url(#goldGrad)" strokeWidth="2" fill="url(#goldCenterGlow)" />
    <circle cx="200" cy="200" r="12" fill="url(#goldGrad)" />
    {[...Array(24)].map((_, i) => (
      <g key={`op-${i}`} transform={`rotate(${i * 15} 200 200)`}>
        <path d="M200 20 C210 55 218 105 200 145 C182 105 190 55 200 20 Z" stroke="url(#goldGrad)" strokeWidth="1" fill="rgba(245,158,11,0.03)" />
        <circle cx="200" cy="26" r="2.5" fill="#FDE047" />
      </g>
    ))}
    {[...Array(16)].map((_, i) => (
      <g key={`mp-${i}`} transform={`rotate(${i * 22.5 + 7.5} 200 200)`}>
        <path d="M200 75 C214 105 216 135 200 165 C184 135 186 105 200 75 Z" stroke="url(#goldGrad)" strokeWidth="1.4" fill="rgba(217,119,6,0.05)" />
        <circle cx="200" cy="80" r="3" fill="#FBBF24" />
      </g>
    ))}
    {[...Array(12)].map((_, i) => (
      <g key={`ip-${i}`} transform={`rotate(${i * 30} 200 200)`}>
        <path d="M200 115 C212 135 214 158 200 172 C186 158 188 135 200 115 Z" stroke="url(#goldGrad)" strokeWidth="1.6" fill="rgba(253,224,71,0.1)" />
      </g>
    ))}
  </svg>
);

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [currency, setCurrency] = useState('INR'); // 'INR' or 'USD'
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' or 'yearly'
  
  // --- Interactive AI Demo Generator States ---
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalStep, setAiModalStep] = useState(1);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiGenStatusText, setAiGenStatusText] = useState('');
  const [aiGenProgress, setAiGenProgress] = useState(0);

  const [aiModalData, setAiModalData] = useState({
    businessName: '',
    businessType: 'clinic',
    city: '',
    phone: '',
    openTime: '09:00',
    closeTime: '20:00',
    services: [
      { name: '', price: '' },
      { name: '', price: '' },
      { name: '', price: '' },
      { name: '', price: '' }
    ],
    themeColor: 'blue'
  });

  // Top WhatsApp Form state
  const [topFormData, setTopFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    website: '',
    message: '',
    selectedPlan: 'Plan 1: Monthly Website Rental (₹599/mo + ₹599 deposit | ₹250 adv)'
  });
  const [isSubmittingTopForm, setIsSubmittingTopForm] = useState(false);

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
    phone: '',
    openTime: '09:00',
    closeTime: '20:00',
    services: [
      { name: '', price: '' },
      { name: '', price: '' },
      { name: '', price: '' }
    ],
    themeColor: 'blue'
  });

  // --- SaaS premium mock states ---
  const [botFlowStep, setBotFlowStep] = useState('start');
  const [tempBookingData, setTempBookingData] = useState({ name: '', service: '', slot: '' });
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState('plan1'); // 'plan1' | 'plan2' | 'plan3' | 'plan4'
  const [checkoutStep, setCheckoutStep] = useState('form'); // 'form' | 'processing' | 'success'
  const [checkoutForm, setCheckoutForm] = useState({ method: 'card', cardNumber: '', cardExpiry: '', cardCvv: '', upiId: '' });

  const [editingNotesLeadId, setEditingNotesLeadId] = useState(null);
  const [notesText, setNotesText] = useState('');
  const [editingNotesCollection, setEditingNotesCollection] = useState('leads'); // 'leads' | 'trials'
  
  const [isSavingCustomizer, setIsSavingCustomizer] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

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

  // --- Auth & Routing States ---
  const [currentUser, setCurrentUser] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [page, setPage] = useState('landing'); // 'landing' | 'admin' | 'demo'
  const [adminTab, setAdminTab] = useState('leads'); // 'leads' | 'trials' | 'ai-agent' | 'subscribers' | 'settings'

  // --- AI Generated Site Preview State ---
  const [activeDemoData, setActiveDemoData] = useState(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  // --- Firestore Collections State ---
  const [leads, setLeads] = useState([]);
  const [trials, setTrials] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  // --- AI Agent States ---
  const [aiAutopilot, setAiAutopilot] = useState(true);
  const [aiInstructions, setAiInstructions] = useState(
    "1. Greet new leads on WhatsApp within 2 minutes of form submission.\n2. Inquire about their typical booking workload and available calendar slots.\n3. Keep the tone friendly, helpful, and results-focused.\n4. Route happy customers to their Google review link post-appointment."
  );
  const [aiLogs, setAiLogs] = useState([
    { id: 1, type: 'info', text: 'AI Lead Agent successfully initialized.', time: '02:15 PM' },
    { id: 2, type: 'action', text: 'AI Agent synchronized with Google Calendar API.', time: '02:16 PM' },
    { id: 3, type: 'whatsapp', text: 'AI Agent drafted custom review request follow-up for client John Doe.', time: '02:40 PM' }
  ]);
  const [drafts, setDrafts] = useState([
    {
      id: 'd1',
      leadName: 'Dr. Ramesh Kumar',
      businessName: 'Kumar Dental Clinic',
      phone: '+91 98123 45678',
      type: 'whatsapp_welcome',
      message: 'Hello Dr. Ramesh Kumar! 👋 Welcome to Nexosia. We noticed you selected "spending hours on phone scheduling" as your booking headache for Kumar Dental Clinic. I have prepared your dental booking bot demo! Let me know if you would like to test it now.'
    },
    {
      id: 'd2',
      leadName: 'Anita Sharma',
      businessName: 'Vibe Salon & Spa',
      phone: '+91 87654 32109',
      type: 'whatsapp_welcome',
      message: 'Hi Anita! 👋 This is the Nexosia Assistant. We are building a custom website draft for Vibe Salon & Spa. I noticed you are losing bookings after hours. Would you like to connect our WhatsApp bot to your Google Calendar to book clients 24/7?'
    }
  ]);

  // Listen to Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      // Auto route to admin only if URL doesn't contain a demo parameters query
      const params = new URLSearchParams(window.location.search);
      if (user && !params.get('demo')) {
        setPage('admin');
      }
    });
    return () => unsubscribe();
  }, []);

  // Check URL queries on mount for direct demo links
  useEffect(() => {
    const fetchDemoOnMount = async () => {
      const params = new URLSearchParams(window.location.search);
      const demoId = params.get('demo');
      if (demoId) {
        setIsDemoLoading(true);
        setPage('demo');
        try {
          // Check trials collection first
          let docRef = doc(db, 'trials', demoId);
          let docSnap = await getDoc(docRef);
          
          if (!docSnap.exists()) {
            // Check leads collection as fallback
            docRef = doc(db, 'leads', demoId);
            docSnap = await getDoc(docRef);
          }

          if (docSnap.exists()) {
            setActiveDemoData({ id: docSnap.id, ...docSnap.data() });
          } else {
            // Fallback mock details if document not found in DB
            setActiveDemoData({
              id: demoId,
              businessName: 'My Custom Business',
              businessType: 'clinic',
              name: 'Owner',
              phone: '+91 98000 00000',
              headaches: ['after_hours']
            });
          }
        } catch (err) {
          console.error("Fetch Demo Error: ", err);
        } finally {
          setIsDemoLoading(false);
        }
      }
    };
    fetchDemoOnMount();
  }, []);

  // Fetch Leads real-time
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(list);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Fetch Trials real-time
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'trials'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrials(list);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Fetch Subscribers real-time
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'newsletter'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubscribers(list);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Dynamic AI logs triggered by new leads
  const prevLeadsLength = useRef(leads.length);
  useEffect(() => {
    if (leads.length > prevLeadsLength.current && aiAutopilot) {
      const newLead = leads[0];
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setAiLogs(prev => [
        {
          id: Date.now(),
          type: 'whatsapp',
          text: `[Autopilot] AI Agent drafted custom WhatsApp onboarding message for ${newLead.name} (${newLead.businessName}).`,
          time
        },
        ...prev
      ]);
      setDrafts(prev => [
        {
          id: `draft_${Date.now()}`,
          leadName: newLead.name,
          businessName: newLead.businessName,
          phone: newLead.phone,
          type: 'whatsapp_welcome',
          message: `Hi ${newLead.name}! 👋 This is the Nexosia Assistant. We are building your premium demo website for ${newLead.businessName}. Let me know if you would like to link your WhatsApp number to test the slot booking.`
        },
        ...prev
      ]);
    }
    prevLeadsLength.current = leads.length;
  }, [leads, aiAutopilot]);

  // Auth Operations
  const handleAdminSignIn = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);
    try {
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
      setIsLoginModalOpen(false);
      setAuthEmail('');
      setAuthPassword('');
      setPage('admin');
    } catch (err) {
      console.error(err);
      setAuthError('Invalid credentials. Please verify your email and password.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleAdminSignOut = async () => {
    try {
      await signOut(auth);
      setPage('landing');
    } catch (err) {
      console.error("Signout Error: ", err);
    }
  };

  // Lead Operations
  const handleDeleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await deleteDoc(doc(db, 'leads', id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateLeadStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'leads', id), { status });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTrialStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'trials', id), { status });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTrial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trial?")) return;
    try {
      await deleteDoc(doc(db, 'trials', id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubscriber = async (id) => {
    if (!window.confirm("Remove subscriber?")) return;
    try {
      await deleteDoc(doc(db, 'newsletter', id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveDraft = (id, name) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAiLogs(prev => [
      {
        id: Date.now(),
        type: 'action',
        text: `Lead Draft Approved. AI Agent successfully sent WhatsApp message to ${name}.`,
        time
      },
      ...prev
    ]);
  };

  const handleRejectDraft = (id, name) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAiLogs(prev => [
      {
        id: Date.now(),
        type: 'info',
        text: `Lead Draft Rejected by admin for ${name}.`,
        time
      },
      ...prev
    ]);
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

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitted(true);
    try {
      await addDoc(collection(db, 'newsletter'), {
        email: newsletterEmail,
        createdAt: serverTimestamp()
      });
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    } catch (err) {
      console.error("Newsletter Save Error: ", err);
    }
  };

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

  // Fix: Prevent auto-scrolling on initial page load
  const isInitialMount = useRef(true);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Only scroll if there are actual active simulator interactions
    if (simMessages.length > 1 || reviewMessages.length > 1) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
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
      const botText = `🎉 Appointment Confirmed, ${name}!\n\n🏥 Clinic: ${activeDemoData ? activeDemoData.businessName : 'Apex Health Clinic'}\n📅 Date: Monday, July 6\n⏰ Time: 10:00 AM\n👨‍⚕️ Specialist: Dr. Sarah Jenkins\n\nWe have saved your slot. A WhatsApp reminder will be sent to you 2 hours before your session. See you there!`;
      
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

  // Onboarding Wizard handlers
  const openWizard = (type) => {
    if (type === 'trial') {
      setCheckoutStep('form');
      setCheckoutForm({ method: 'card', cardNumber: '', cardExpiry: '', cardCvv: '', upiId: '' });
      setIsCheckoutOpen(true);
    } else {
      setWizardType('demo');
      setWizardStep(1);
      setWizardSubmitted(false);
      setIsWizardModalOpen(true);
    }
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

  // --- AI Demo Generator Helpers & Presets ---
  const nichePresets = {
    clinic: {
      businessName: 'Apex Healthcare & Dental Clinic',
      businessType: 'clinic',
      city: 'Jaipur',
      openTime: '09:00',
      closeTime: '20:00',
      themeColor: 'blue',
      services: [
        { name: 'Doctor Consultation', price: '₹500' },
        { name: 'Root Canal Treatment', price: '₹2,500' },
        { name: 'Teeth Whitening & Scaling', price: '₹1,200' },
        { name: 'Digital X-Ray & Diagnostics', price: '₹800' }
      ]
    },
    salon: {
      businessName: 'Aura Luxury Salon & Spa',
      businessType: 'salon',
      city: 'Delhi NCR',
      openTime: '10:00',
      closeTime: '21:00',
      themeColor: 'rose',
      services: [
        { name: 'Designer Haircut & Styling', price: '₹600' },
        { name: 'Keratin & Hair Botox', price: '₹3,500' },
        { name: 'Hydra-Facial & Glow Therapy', price: '₹1,800' },
        { name: 'Gel Nails & Manicure', price: '₹999' }
      ]
    },
    gym: {
      businessName: 'IronFit 24/7 Fitness Studio',
      businessType: 'gym',
      city: 'Mumbai',
      openTime: '06:00',
      closeTime: '23:00',
      themeColor: 'orange',
      services: [
        { name: 'Monthly Gym Membership', price: '₹1,999' },
        { name: 'Personal Trainer Package', price: '₹5,000' },
        { name: 'HIIT & Crossfit Group Class', price: '₹2,500' },
        { name: 'Diet & Nutrition Consultation', price: '₹1,200' }
      ]
    },
    cafe: {
      businessName: 'Urban Brew Cafe & Kitchen',
      businessType: 'cafe',
      city: 'Bangalore',
      openTime: '08:30',
      closeTime: '23:00',
      themeColor: 'orange',
      services: [
        { name: 'Artisan Pour-Over Coffee', price: '₹240' },
        { name: 'Wood-Fired Pizza Slice', price: '₹390' },
        { name: 'Table Reservation Slot', price: 'Free' },
        { name: 'Custom Party Catering Box', price: '₹2,499' }
      ]
    },
    ca: {
      businessName: 'TaxPro Legal & Business Advisory',
      businessType: 'professional',
      city: 'Pune',
      openTime: '09:30',
      closeTime: '19:00',
      themeColor: 'purple',
      services: [
        { name: 'GST Filing & Audit Consultation', price: '₹1,500' },
        { name: 'Company Registration (Pvt Ltd)', price: '₹7,999' },
        { name: 'Income Tax Return (ITR)', price: '₹999' },
        { name: 'Trademark & IP Filing', price: '₹4,500' }
      ]
    },
    store: {
      businessName: 'Royal Elegance Boutique & Store',
      businessType: 'store',
      city: 'Chandigarh',
      openTime: '10:30',
      closeTime: '21:30',
      themeColor: 'emerald',
      services: [
        { name: 'Custom Tailoring & Fitting', price: '₹1,200' },
        { name: 'Pre-Order Catalog Booking', price: 'Free' },
        { name: 'VIP Home Trial Delivery', price: '₹250' },
        { name: 'Personal Style Consultation', price: '₹800' }
      ]
    }
  };

  const startAiGenerationSequence = async (demoPayload) => {
    setIsAiGenerating(true);
    setIsAiModalOpen(false);
    setAiGenProgress(15);
    setAiGenStatusText('⚡ Initializing Nexosia Neural Design Core...');

    try {
      // Save lead to Firestore backup
      await addDoc(collection(db, 'leads'), {
        name: demoPayload.businessName,
        businessName: demoPayload.businessName,
        phone: demoPayload.phone || 'AI Generated Demo',
        businessType: demoPayload.businessType || 'clinic',
        city: demoPayload.city || 'India',
        source: 'ai_demo_generator',
        status: 'Demo Generated',
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.warn("Firestore logging (offline fallback active)", err);
    }

    setTimeout(() => {
      setAiGenProgress(45);
      setAiGenStatusText(`🔍 Analyzing business niche: "${demoPayload.businessName}"...`);
    }, 700);

    setTimeout(() => {
      setAiGenProgress(75);
      setAiGenStatusText('🎨 Synthesizing responsive UI components & branding palette...');
    }, 1400);

    setTimeout(() => {
      setAiGenProgress(95);
      setAiGenStatusText('💬 Initializing 24/7 WhatsApp AI booking simulator...');
    }, 2100);

    setTimeout(() => {
      setIsAiGenerating(false);
      setActiveDemoData(demoPayload);
      setPage('demo');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2800);
  };

  const handleQuickAiGenerate = (customPrompt) => {
    const text = (customPrompt || aiPromptInput).trim();
    if (!text) {
      setIsAiModalOpen(true);
      return;
    }

    const lower = text.toLowerCase();
    let detectedType = 'clinic';
    let themeColor = 'blue';

    if (lower.includes('salon') || lower.includes('spa') || lower.includes('hair') || lower.includes('beauty') || lower.includes('parlour')) {
      detectedType = 'salon';
      themeColor = 'rose';
    } else if (lower.includes('gym') || lower.includes('fitness') || lower.includes('workout') || lower.includes('crossfit')) {
      detectedType = 'gym';
      themeColor = 'orange';
    } else if (lower.includes('cafe') || lower.includes('coffee') || lower.includes('restaurant') || lower.includes('food') || lower.includes('bakery')) {
      detectedType = 'cafe';
      themeColor = 'orange';
    } else if (lower.includes('ca') || lower.includes('tax') || lower.includes('legal') || lower.includes('advocate') || lower.includes('law')) {
      detectedType = 'professional';
      themeColor = 'purple';
    } else if (lower.includes('shop') || lower.includes('store') || lower.includes('boutique') || lower.includes('retail')) {
      detectedType = 'store';
      themeColor = 'emerald';
    }

    const words = text.split(/[,\n•-]+/).map(w => w.trim()).filter(Boolean);
    const bName = words[0] || (detectedType === 'clinic' ? 'Apex Health Clinic' : 'Modern Business Studio');

    const defaultPreset = nichePresets[detectedType] || nichePresets.clinic;
    const demoPayload = {
      businessName: bName,
      businessType: detectedType,
      city: words[1] || 'Metro City',
      openTime: '09:00',
      closeTime: '20:00',
      themeColor: themeColor,
      services: defaultPreset.services,
      headaches: ['after_hours', 'manual_calls']
    };

    startAiGenerationSequence(demoPayload);
  };

  const handleSelectPlan = (planName) => {
    setTopFormData(prev => ({ ...prev, selectedPlan: planName }));
    const el = document.getElementById('custom-inquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTopFormSubmit = async (e) => {
    e.preventDefault();
    if (!topFormData.name || !topFormData.phone || !topFormData.businessName) {
      alert("Please fill in Name, Business Name, and WhatsApp Number.");
      return;
    }
    setIsSubmittingTopForm(true);
    try {
      // Save lead to Firestore backup
      await addDoc(collection(db, 'leads'), {
        name: topFormData.name,
        businessName: topFormData.businessName,
        phone: topFormData.phone,
        selectedPlan: topFormData.selectedPlan || 'Plan 1: Monthly Website Rental (₹599/mo)',
        website: topFormData.website || 'None',
        message: topFormData.message || 'Submitted via top form',
        status: 'New',
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Firestore save failed, proceeding to WhatsApp", err);
    }

    // Format WhatsApp Message
    const messageText = `*New Nexosia Request:*\n\n` +
      `👤 *Name:* ${topFormData.name}\n` +
      `🏥 *Business:* ${topFormData.businessName}\n` +
      `📞 *WhatsApp:* ${topFormData.phone}\n` +
      `📦 *Selected Plan:* ${topFormData.selectedPlan || 'Plan 1: Monthly Website Rental (₹599/mo)'}\n` +
      `🌐 *Current Website:* ${topFormData.website || 'None'}\n` +
      `📝 *Goals/Requirements:* ${topFormData.message || 'None'}`;

    const whatsappUrl = `https://wa.me/917860716837?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset
    setTopFormData({
      name: '',
      businessName: '',
      phone: '',
      website: '',
      message: '',
      selectedPlan: 'Plan 1: Monthly Website Rental (₹599/mo + ₹599 deposit | ₹250 adv)'
    });
    setIsSubmittingTopForm(false);
  };

  const handleWizardSubmit = async (e) => {
    e.preventDefault();
    setWizardSubmitted(true);

    try {
      const collectionName = wizardType === 'trial' ? 'trials' : 'leads';
      
      const docRef = await addDoc(collection(db, collectionName), {
        name: wizardData.name,
        businessName: wizardData.businessName,
        phone: wizardData.phone,
        email: wizardData.email,
        businessType: wizardData.businessType,
        headaches: wizardData.headaches,
        openTime: wizardData.openTime || '09:00',
        closeTime: wizardData.closeTime || '20:00',
        services: wizardData.services || [],
        themeColor: wizardData.themeColor || 'blue',
        status: 'New',
        notes: '',
        createdAt: serverTimestamp()
      });

      const demoObj = {
        id: docRef.id,
        collectionType: collectionName,
        name: wizardData.name,
        businessName: wizardData.businessName,
        phone: wizardData.phone,
        email: wizardData.email,
        businessType: wizardData.businessType,
        headaches: wizardData.headaches,
        openTime: wizardData.openTime || '09:00',
        closeTime: wizardData.closeTime || '20:00',
        services: wizardData.services || [],
        themeColor: wizardData.themeColor || 'blue',
        status: 'New',
        notes: ''
      };

      setTimeout(() => {
        setIsWizardModalOpen(false);
        setWizardSubmitted(false);
        setActiveDemoData(demoObj);
        
        // Push state to browser window URL query parameters for dynamic sharing
        window.history.pushState(null, '', `?demo=${docRef.id}`);
        setPage('demo');
        
        setWizardData({
          businessType: '',
          headaches: [],
          name: '',
          businessName: '',
          email: '',
          phone: '',
          openTime: '09:00',
          closeTime: '20:00',
          services: [
            { name: '', price: '' },
            { name: '', price: '' },
            { name: '', price: '' }
          ],
          themeColor: 'blue'
        });
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

    setTimeout(() => {
      let replyText = "That's a great question! For custom WhatsApp integrations, Nexosia handles all setup. Would you like to schedule a quick 10-minute demo?";
      
      const textLower = userMsg.toLowerCase();
      if (textLower.includes('pricing') || textLower.includes('cost') || textLower.includes('package')) {
        replyText = `Our pricing is transparent: 1) Monthly Rental at ₹599/mo (₹250 advance token), 2) Yearly Rental at ₹5,000/yr (save ₹2,100+), 3) Monthly Rental + Maintenance Pack at ₹748/mo (up to 10 edits/mo), or 4) Permanent Website Purchase at ₹10,000 one-time with 100% source-code handover. Which plan fits your business?`;
      } else if (textLower.includes('setup') || textLower.includes('how long')) {
        replyText = "We configure everything and deliver your premium website + WhatsApp booking API ready to use in just 3 to 5 business days!";
      }

      setChatMessages(prev => [...prev, { sender: 'agent', text: replyText }]);
    }, 1000);
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

  // ROI Calculator Calculations
  const timeSavedHours = Math.round((calcBookings * 8) / 60);
  const extraBookingsVal = Math.round(calcBookings * 0.25);
  const calculatedGain = extraBookingsVal * calcTicket;
  const formattedRevenue = currency === 'INR' 
    ? `₹${calculatedGain.toLocaleString('en-IN')}` 
    : `$${calculatedGain.toLocaleString('en-US')}`;

  // ----------------------------------------------------
  // --- DYNAMIC AI-GENERATED WEBSITE DEMO VIEW ---
  // ----------------------------------------------------
  if (page === 'demo') {
    const isClinic = activeDemoData?.businessType === 'clinic';
    const isSalon = activeDemoData?.businessType === 'salon';
    const isStore = activeDemoData?.businessType === 'store';
    
    // Theme configurations
    const activeColor = activeDemoData?.themeColor || (isClinic ? 'blue' : isSalon ? 'rose' : 'purple');
    
    const themeConfig = {
      blue: {
        accentText: 'text-indigo-600',
        bgBadge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        btnTheme: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        borderAccent: 'border-indigo-500'
      },
      emerald: {
        accentText: 'text-emerald-600',
        bgBadge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        btnTheme: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        borderAccent: 'border-emerald-500'
      },
      purple: {
        accentText: 'text-violet-600',
        bgBadge: 'bg-violet-50 text-violet-700 border-violet-100',
        btnTheme: 'bg-violet-600 hover:bg-violet-700 text-white',
        borderAccent: 'border-violet-500'
      },
      rose: {
        accentText: 'text-rose-600',
        bgBadge: 'bg-rose-50 text-rose-700 border-rose-100',
        btnTheme: 'bg-rose-600 hover:bg-rose-700 text-white',
        borderAccent: 'border-rose-500'
      },
      orange: {
        accentText: 'text-amber-600',
        bgBadge: 'bg-amber-50 text-amber-700 border-amber-100',
        btnTheme: 'bg-amber-600 hover:bg-amber-700 text-white',
        borderAccent: 'border-amber-500'
      }
    };

    const currentTheme = themeConfig[activeColor] || themeConfig.blue;
    const accentTextClass = currentTheme.accentText;
    const bgBadgeClass = currentTheme.bgBadge;
    const btnThemeClass = currentTheme.btnTheme;
    
    const rawServices = activeDemoData?.services || [];
    const validRawServices = rawServices.filter(s => s && s.name && s.name.trim() !== '');
    
    const services = validRawServices.length > 0 
      ? validRawServices.map(s => `${s.name} (₹${s.price || '0'})`)
      : (isClinic 
          ? ['Doctor Consultation', 'Dental Checkup & Scaling', 'Family Health Audit', 'Emergency Care']
          : isSalon
            ? ['Designer Haircut & Styling', 'Keratin & Nourishing Treatment', 'Relaxing Facial Spa', 'Gel Manicure & Nails']
            : ['Product In-Store Pickup', 'Custom Sales Consultation', 'Pre-Order Slot Selection', 'Client Support Audit']
        );

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
        
        {/* Dynamic Header */}
        <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200 shadow-sm backdrop-blur-md">
          
          {/* Top Banner Alert showing it is an interactive AI simulator demo */}
          <div className="bg-gradient-to-r from-cyan-accent to-cyan-accent-dark text-slate-950 px-4 py-2.5 text-center text-xs font-extrabold flex flex-wrap justify-between items-center gap-3 shadow-md">
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <Sparkles className="h-4 w-4 animate-bounce text-slate-950" />
              <span>✨ LIVE AI DEMO PREVIEW: "{activeDemoData?.businessName || 'Your Business'}" (Visual Only)</span>
            </div>
            
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <a 
                href="tel:+917860716837"
                className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 transition-all shadow-sm"
              >
                <Phone className="h-3 w-3 text-cyan-accent" />
                <span>Call: 7860716837</span>
              </a>
              <a 
                href={`https://wa.me/917860716837?text=${encodeURIComponent(`Hi Devesh! I just tested the AI demo website for "${activeDemoData?.businessName || 'My Business'}" on Nexosia. I am interested in launching it live. Please share pricing & next steps!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25d366] hover:bg-[#128c7e] text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 transition-all shadow-sm"
              >
                <MessageSquare className="h-3 w-3 fill-white" />
                <span>WhatsApp to Launch</span>
              </a>
              <button 
                onClick={() => {
                  window.history.pushState(null, '', window.location.pathname);
                  setActiveDemoData(null);
                  setPage('landing');
                }}
                className="bg-black/20 hover:bg-black/40 text-slate-950 hover:text-white px-2.5 py-1 rounded-full text-[10px] cursor-pointer transition-colors"
              >
                Back to Home ✕
              </button>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <span className="text-lg font-extrabold font-heading text-midnight flex items-center gap-1">
              <Building className="h-5 w-5 text-slate-500" />
              {activeDemoData?.businessName || 'My Custom Business'}
            </span>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  // Open booking bot simulator instantly
                  setIsChatWidgetOpen(true);
                  setChatMessages([
                    { sender: 'bot', text: `Hi there! Welcome to ${activeDemoData?.businessName || 'our business'} virtual assistant. 🤖 Would you like to book a session for Monday?` }
                  ]);
                }}
                className={`text-xs font-bold px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${btnThemeClass}`}
              >
                <MessageSquare className="h-4 w-4 fill-white" />
                Book via WhatsApp
              </button>
            </div>
          </div>
        </header>

        {isDemoLoading ? (
          <div className="flex-grow flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-cyan-accent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold text-sm">AI Generator compiling site resources...</p>
          </div>
        ) : (
          <div className="flex-grow animate-in fade-in duration-300">
            
            {/* Hero Block */}
            <section className="bg-gradient-to-b from-white to-slate-100 py-16 md:py-24 border-b border-slate-200 text-left">
              <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-7 space-y-6">
                  
                  <span className={`inline-block border text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${bgBadgeClass}`}>
                    {activeDemoData?.businessType || 'Services'} • Automated Scheduling
                  </span>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-midnight font-heading tracking-tight leading-tight">
                    {isClinic && `Professional Patient Care at ${activeDemoData.businessName}.`}
                    {isSalon && `Experience Premium Styles & Care at ${activeDemoData.businessName}.`}
                    {isStore && `Automated Order Bookings at ${activeDemoData.businessName}.`}
                    {!isClinic && !isSalon && !isStore && `Welcome to ${activeDemoData?.businessName || 'Our Business'}.`}
                    <br />
                    <span className={accentTextClass}>Book Your Appointment Online.</span>
                  </h1>

                  <p className="text-slate-600 text-base leading-relaxed max-w-xl">
                    {activeDemoData?.headaches?.includes('after_hours') && 
                      "Tired of missing appointments after closing? Our 24/7 WhatsApp AI assistant allows you to reserve slots at your convenience, anytime."}
                    {activeDemoData?.headaches?.includes('manual_calls') && 
                      "Skip the busy phone lines. Book your appointments in 30 seconds via WhatsApp and receive instant confirmation."}
                    {(!activeDemoData?.headaches || activeDemoData.headaches.length === 0) && 
                      "We value your time. Our online scheduler links directly to WhatsApp and secures your slot on our master calendar instantly."}
                  </p>

                  <div className="pt-2">
                    <button 
                      onClick={() => {
                        setIsChatWidgetOpen(true);
                        setChatMessages([
                          { sender: 'bot', text: `Welcome to ${activeDemoData?.businessName || 'our business'}! I am your conversational booking assistant. Would you like to schedule an appointment for Monday?` }
                        ]);
                      }}
                      className={`text-sm font-extrabold px-8 py-3.5 rounded-full transition-all shadow-lg flex items-center gap-2 cursor-pointer ${btnThemeClass}`}
                    >
                      Book Appointment Now
                      <ArrowRight className="h-4.5 w-4.5" />
                    </button>
                  </div>

                </div>

                <div className="md:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-midnight">Business Hours</span>
                    <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Open Today
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between"><span>Mon - Fri</span><span>{activeDemoData?.openTime || '09:00'} - {activeDemoData?.closeTime || '20:00'}</span></div>
                    <div className="flex justify-between"><span>Saturday</span><span>10:00 AM - 4:00 PM</span></div>
                    <div className="flex justify-between text-slate-400"><span>Sunday</span><span>Closed (Bot active 24/7)</span></div>
                  </div>
                </div>

              </div>
            </section>

            {/* Services List Grid */}
            <section className="py-16 bg-white border-b border-slate-200 text-left">
              <div className="max-w-6xl mx-auto px-4 space-y-8">
                <div>
                  <h2 className="text-xl font-bold font-heading text-midnight">Our Specialised Services</h2>
                  <p className="text-slate-500 text-xs mt-1">Select from our expert offerings. Bookings sync instantly with our calendars.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {services.map((serv, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4 flex flex-col justify-between hover:border-slate-350 transition-colors">
                      <span className="text-xs font-bold text-slate-800 block leading-tight">{serv}</span>
                      <button 
                        onClick={() => {
                          setIsChatWidgetOpen(true);
                          setChatMessages([
                            { sender: 'bot', text: `Hi there! Ready to book a slot for "${serv}"? What day works best for you?` }
                          ]);
                        }}
                        className="text-[10px] font-extrabold text-cyan-accent-dark hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Book Service <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* High-Converting Launch CTA on Demo Website */}
            <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16 sm:py-20 text-center relative overflow-hidden border-t border-slate-800">
              <div className="absolute w-96 h-96 rounded-full bg-cyan-accent/10 blur-3xl -top-20 -right-20 pointer-events-none"></div>
              <div className="absolute w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl -bottom-20 -left-20 pointer-events-none"></div>

              <div className="max-w-4xl mx-auto px-4 space-y-7 relative z-10">
                <span className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-accent text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  <Sparkles className="h-4 w-4" />
                  Visual Demo Generated by Nexosia AI
                </span>

                <h3 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
                  Interested in Launching This Website for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-accent to-cyan-accent-dark">"{activeDemoData?.businessName || 'Your Business'}"</span>?
                </h3>
                
                <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  We will link your custom .com domain, configure your real WhatsApp booking automation, and go live within 48 hours. Let's talk directly with our founder!
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <a 
                    href="tel:+917860716837"
                    className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg border border-slate-700 hover:border-slate-500 cursor-pointer"
                  >
                    <Phone className="h-4.5 w-4.5 text-cyan-accent" />
                    <span>Call Founder: +91 7860716837</span>
                  </a>

                  <a 
                    href={`https://wa.me/917860716837?text=${encodeURIComponent(`Hi Devesh! I tested the AI demo website for "${activeDemoData?.businessName || 'My Business'}" on Nexosia. I would like to discuss launching it live. Let's connect!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-[#25d366] hover:bg-[#128c7e] text-white font-extrabold text-sm py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer"
                  >
                    <MessageSquare className="h-4.5 w-4.5 fill-white text-white" />
                    <span>Message on WhatsApp (7860716837)</span>
                  </a>

                  <button 
                    onClick={() => {
                      window.history.pushState(null, '', window.location.pathname);
                      setActiveDemoData(null);
                      setPage('landing');
                    }}
                    className="w-full sm:w-auto text-slate-400 hover:text-white font-bold text-xs py-3 px-5 transition-colors cursor-pointer"
                  >
                    ← Back to Nexosia
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 pt-2">
                  ✅ 14-Day Money-Back Guarantee • Full WhatsApp Support • Zero Hidden Charges
                </p>
              </div>
            </section>

          </div>
        )}

        {/* Live Customizer Dock */}
        <div className="fixed bottom-6 left-6 z-50 font-sans">
          {!isSavingCustomizer && !isSavedSuccess && (
            <button 
              onClick={() => {
                // Toggle customization panel
                const customizerPanel = document.getElementById("demo-customizer-dock");
                if (customizerPanel) {
                  customizerPanel.classList.toggle("hidden");
                }
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all"
              title="Open Site Customizer"
            >
              <Sliders className="h-6 w-6" />
            </button>
          )}

          <div 
            id="demo-customizer-dock" 
            className="hidden bg-slate-900 text-white w-[320px] rounded-3xl shadow-2xl border border-slate-800 p-5 space-y-4 animate-in slide-in-from-left-5 duration-200 text-left"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h4 className="font-bold text-xs flex items-center gap-1.5"><Sliders className="h-4.5 w-4.5 text-cyan-accent" /> Live Customizer</h4>
              <button 
                onClick={() => document.getElementById("demo-customizer-dock").classList.add("hidden")} 
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Business Name</label>
                <input 
                  type="text" 
                  value={activeDemoData?.businessName || ''}
                  onChange={(e) => setActiveDemoData({...activeDemoData, businessName: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Theme Accent</label>
                <div className="flex gap-2.5">
                  {[
                    { id: 'blue', color: 'bg-indigo-600' },
                    { id: 'emerald', color: 'bg-emerald-600' },
                    { id: 'purple', color: 'bg-violet-600' },
                    { id: 'rose', color: 'bg-rose-600' },
                    { id: 'orange', color: 'bg-amber-600' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveDemoData({...activeDemoData, themeColor: item.id})}
                      className={`w-6 h-6 rounded-full ${item.color} cursor-pointer relative flex items-center justify-center`}
                    >
                      {activeDemoData?.themeColor === item.id && <span className="absolute w-2 h-2 bg-white rounded-full"></span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Opening Hour</label>
                  <input 
                    type="time" 
                    value={activeDemoData?.openTime || '09:00'}
                    onChange={(e) => setActiveDemoData({...activeDemoData, openTime: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Closing Hour</label>
                  <input 
                    type="time" 
                    value={activeDemoData?.closeTime || '20:00'}
                    onChange={(e) => setActiveDemoData({...activeDemoData, closeTime: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Custom Services</label>
                <div className="space-y-1.5">
                  {[0, 1, 2].map((idx) => {
                    const svcs = activeDemoData?.services ? [...activeDemoData.services] : [];
                    const svc = svcs[idx] || { name: '', price: '' };
                    return (
                      <div key={idx} className="grid grid-cols-12 gap-1.5">
                        <input 
                          type="text" 
                          placeholder={`Service ${idx + 1}`}
                          value={svc.name}
                          onChange={(e) => {
                            const updated = [...svcs];
                            updated[idx] = { ...svc, name: e.target.value };
                            setActiveDemoData({...activeDemoData, services: updated});
                          }}
                          className="col-span-8 bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-accent"
                        />
                        <input 
                          type="text" 
                          placeholder="Price"
                          value={svc.price}
                          onChange={(e) => {
                            const updated = [...svcs];
                            updated[idx] = { ...svc, price: e.target.value };
                            setActiveDemoData({...activeDemoData, services: updated});
                          }}
                          className="col-span-4 bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-accent"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={async () => {
                    setIsSavingCustomizer(true);
                    try {
                      const coll = activeDemoData.collectionType || 'leads';
                      const docRef = doc(db, coll, activeDemoData.id);
                      await updateDoc(docRef, {
                        businessName: activeDemoData.businessName,
                        themeColor: activeDemoData.themeColor || 'blue',
                        openTime: activeDemoData.openTime || '09:00',
                        closeTime: activeDemoData.closeTime || '20:00',
                        services: activeDemoData.services || []
                      });
                      setIsSavedSuccess(true);
                      setTimeout(() => setIsSavedSuccess(false), 2000);
                    } catch (err) {
                      console.error(err);
                      alert("Error saving configurations.");
                    } finally {
                      setIsSavingCustomizer(false);
                    }
                  }}
                  disabled={isSavingCustomizer}
                  className="w-full bg-cyan-accent text-slate-950 hover:bg-cyan-accent-dark font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1 shadow-md shadow-cyan-accent/15"
                >
                  {isSavingCustomizer ? (
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  ) : isSavedSuccess ? (
                    <>Saved successfully! <Check className="h-4.5 w-4.5" /></>
                  ) : (
                    <>Save Customizations ➔</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating WhatsApp chat phone shell simulator */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 font-sans">
          {isChatWidgetOpen && (
            <div className="relative w-[310px] h-[525px] bg-slate-950 border-[8px] border-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200">
              
              {/* Speaker Notch */}
              <div className="absolute top-0 inset-x-0 h-3.5 bg-slate-900 rounded-b-2xl z-50 flex justify-center items-center">
                <div className="w-12 h-0.5 bg-slate-800 rounded-full"></div>
              </div>
              
              <div className="flex-grow flex flex-col pt-3.5 overflow-hidden">
                {/* WhatsApp Header */}
                <div className="bg-[#075e54] text-white p-3 pt-4 flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[#075e54] font-bold text-xs">🤖</div>
                    <div>
                      <h4 className="text-[10px] font-bold leading-tight truncate max-w-[130px]">
                        {activeDemoData?.businessName || 'Business'} Bot
                      </h4>
                      <span className="text-[7px] opacity-80 block flex items-center gap-1">
                        <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping"></span>online assistant
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsChatWidgetOpen(false)}
                    className="text-white opacity-80 hover:opacity-100 cursor-pointer"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Messaging Frame */}
                <div className="flex-grow p-3 bg-[#e5ddd5] overflow-y-auto space-y-3 flex flex-col justify-end">
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`text-[10px] p-2 rounded-xl max-w-[85%] leading-relaxed shadow-sm ${
                        msg.sender === 'user' 
                          ? 'bg-[#dcf8c6] text-slate-850 self-end rounded-tr-none' 
                          : 'bg-white text-slate-850 self-start rounded-tl-none border-l-4 border-emerald-500'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Form Input */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!chatInput.trim()) return;

                    const userMsg = chatInput.trim();
                    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
                    setChatInput('');

                    setTimeout(() => {
                      let replyText = "";
                      let nextStep = botFlowStep;

                      const textLower = userMsg.toLowerCase();

                      if (botFlowStep === 'start') {
                        if (userMsg === '1' || textLower.includes('book') || textLower.includes('appoint')) {
                          replyText = "Sure, let's book a slot! 📅\n\nPlease enter your **Full Name** to get started.";
                          nextStep = 'awaiting_name';
                        } else if (userMsg === '2' || textLower.includes('time') || textLower.includes('hour')) {
                          const openTime = activeDemoData?.openTime || '09:00';
                          const closeTime = activeDemoData?.closeTime || '20:00';
                          replyText = `Our business hours for **${activeDemoData?.businessName || 'our business'}** are:\n\n⏰ Mon - Fri: ${openTime} to ${closeTime}\n⏰ Saturday: 10:00 AM to 04:00 PM\n\nWould you like to book an appointment now? (Type '1' or 'book')`;
                        } else {
                          replyText = "I didn't quite catch that. Please select an option:\n\nType **1** to: Book an Appointment\nType **2** to: Check Business Hours";
                        }
                      } 
                      
                      else if (botFlowStep === 'awaiting_name') {
                        const clientName = userMsg;
                        setTempBookingData(prev => ({ ...prev, name: clientName }));
                        
                        const svcList = validRawServices.length > 0 
                          ? validRawServices.map((s, i) => `Type **${i+1}** for: ${s.name} (₹${s.price || '0'})`).join('\n')
                          : (isClinic
                              ? "Type **1** for: Doctor Consultation (₹500)\nType **2** for: Dental Checkup & Scaling (₹1000)\nType **3** for: Emergency Care (₹1500)"
                              : "Type **1** for: Haircut & Styling (₹400)\nType **2** for: Relaxing Facial Spa (₹1200)\nType **3** for: Gel Manicure & Nails (₹600)");
                        
                        replyText = `Nice to meet you, **${clientName}**! Which service would you like to book?\n\nSelect a service:\n${svcList}`;
                        nextStep = 'awaiting_service';
                      } 
                      
                      else if (botFlowStep === 'awaiting_service') {
                        let selectedService = "Standard Consultation";
                        if (userMsg === '1') {
                          selectedService = validRawServices[0]?.name || (isClinic ? 'Doctor Consultation' : 'Haircut & Styling');
                        } else if (userMsg === '2') {
                          selectedService = validRawServices[1]?.name || (isClinic ? 'Dental Checkup & Scaling' : 'Relaxing Facial Spa');
                        } else if (userMsg === '3') {
                          selectedService = validRawServices[2]?.name || (isClinic ? 'Emergency Care' : 'Gel Manicure & Nails');
                        } else {
                          selectedService = userMsg;
                        }
                        
                        setTempBookingData(prev => ({ ...prev, service: selectedService }));
                        
                        replyText = `Great choice! We have the following slots available for **${selectedService}** on Monday:\n\n- Slot 1: **10:30 AM**\n- Slot 2: **02:00 PM**\n- Slot 3: **04:30 PM**\n\nPlease reply with the slot number (e.g. **'1'**, **'2'**, **'3'**) to lock your choice.`;
                        nextStep = 'awaiting_slot';
                      } 
                      
                      else if (botFlowStep === 'awaiting_slot') {
                        let time = "10:30 AM";
                        if (userMsg === '1') time = "10:30 AM";
                        else if (userMsg === '2') time = "02:00 PM";
                        else if (userMsg === '3') time = "04:30 PM";
                        else time = userMsg;
                        
                        replyText = `🎉 **Appointment Confirmed!**\n\n🏥 Business: **${activeDemoData?.businessName || 'My Clinic'}**\n💼 Service: **${tempBookingData.service}**\n📅 Date: Monday, July 6\n⏰ Time: **${time}**\n👤 Client: **${tempBookingData.name}**\n\nWe have saved your slot! We look forward to seeing you. A WhatsApp reminder will be sent to you 2 hours before.`;
                        nextStep = 'start'; // Reset flow
                      }

                      setChatMessages(prev => [...prev, { sender: 'bot', text: replyText.replace(/\\n/g, '\n') }]);
                      setBotFlowStep(nextStep);
                    }, 1000);
                  }}
                  className="bg-slate-50 p-2 flex items-center gap-1.5 border-t border-slate-200"
                >
                  <input 
                    type="text" 
                    placeholder="Type message..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-grow border border-slate-200 rounded-lg px-3 py-1.5 text-[9px] focus:outline-none focus:border-[#075e54] bg-white text-slate-800"
                    required
                  />
                  <button 
                    type="submit" 
                    className="bg-[#075e54] text-white px-3 py-1.5 rounded-lg text-[9px] font-bold cursor-pointer hover:bg-[#0b4840] transition-colors"
                  >
                    Send
                  </button>
                </form>
              </div>

              {/* Bottom Speaker bar Notch */}
              <div className="h-2.5 bg-slate-900 flex justify-center items-center">
                <div className="w-16 h-0.5 bg-slate-800 rounded-full"></div>
              </div>

            </div>
          )}

          <button 
            onClick={() => {
              setIsChatWidgetOpen(!isChatWidgetOpen);
              setBotFlowStep('start');
              setChatMessages([
                { sender: 'bot', text: `Welcome to **${activeDemoData?.businessName || 'our business'}** assistant! 🤖\n\nType **1** to: Book an Appointment\nType **2** to: Check Business Hours`.replace(/\\n/g, '\n') }
              ]);
            }}
            className="bg-[#25d366] hover:bg-[#128c7e] text-white p-4 rounded-full shadow-2xl transition-all hover:scale-105 cursor-pointer flex items-center justify-center animate-bounce"
            aria-label="Contact bot"
          >
            {isChatWidgetOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6 fill-white" />}
          </button>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800">
          <p>© {new Date().getFullYear()} {activeDemoData?.businessName || 'My Custom Business'} • Generated via Nexosia Engine</p>
        </footer>

      </div>
    );
  }

  // ----------------------------------------------------
  // --- ADMIN PORTAL VIEW IF AUTHENTICATED ---
  // ----------------------------------------------------
  if (page === 'admin' && currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
        
        {/* Sidebar Nav */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6 select-none">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
              <img src={logoImg} alt="Nexosia Logo" className="h-9 w-auto brightness-0 invert" />
            </div>

            {/* Menu Links */}
            <nav className="flex flex-col gap-1.5">
              <button 
                onClick={() => setAdminTab('leads')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  adminTab === 'leads' ? 'bg-cyan-accent text-slate-950 shadow-lg shadow-cyan-accent/15' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <MessageSquare className="h-4.5 w-4.5" />
                Leads Command Center
              </button>

              <button 
                onClick={() => setAdminTab('trials')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  adminTab === 'trials' ? 'bg-cyan-accent text-slate-950 shadow-lg shadow-cyan-accent/15' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Calendar className="h-4.5 w-4.5" />
                Active Trials Tracker
              </button>

              <button 
                onClick={() => setAdminTab('ai-agent')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  adminTab === 'ai-agent' ? 'bg-cyan-accent text-slate-950 shadow-lg shadow-cyan-accent/15' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Sparkles className="h-4.5 w-4.5" />
                AI Agent Automation
              </button>

              <button 
                onClick={() => setAdminTab('subscribers')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  adminTab === 'subscribers' ? 'bg-cyan-accent text-slate-950 shadow-lg shadow-cyan-accent/15' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Mail className="h-4.5 w-4.5" />
                Email Subscribers
              </button>

              <button 
                onClick={() => setAdminTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  adminTab === 'settings' ? 'bg-cyan-accent text-slate-950 shadow-lg shadow-cyan-accent/15' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Settings className="h-4.5 w-4.5" />
                Platform Settings
              </button>
            </nav>
          </div>

          {/* Sidebar Footer Logout */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-cyan-electric">
                A
              </div>
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block font-bold">Logged in as</span>
                <span className="text-xs text-white truncate max-w-[150px] block font-semibold">{currentUser.email}</span>
              </div>
            </div>
            <button 
              onClick={handleAdminSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-left cursor-pointer"
            >
              <LogOut className="h-4.5 w-4.5" />
              Logout System
            </button>
          </div>
        </aside>

        {/* Content Workspace Area */}
        <main className="flex-grow p-10 overflow-y-auto">
          
          {/* Header Overview bar */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-800 mb-8 text-left">
            <div>
              <span className="text-[10px] text-cyan-electric font-extrabold uppercase tracking-widest">Nexosia SaaS Workspace</span>
              <h1 className="text-3xl font-extrabold font-heading text-white mt-1">Admin Command Center</h1>
            </div>
            
            {/* High Level Cards */}
            <div className="flex gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 text-left">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Leads</span>
                <p className="text-xl font-bold font-heading text-white">{leads.length}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 text-left">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Trials</span>
                <p className="text-xl font-bold font-heading text-white">{trials.length}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 text-left">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">AI Automation</span>
                <p className="text-xl font-bold font-heading text-emerald-400 flex items-center gap-1">
                  <Zap className="h-4.5 w-4.5 text-emerald-400 fill-current" />
                  92%
                </p>
              </div>
            </div>
          </header>

          {/* Tab 1: Leads Tab */}
          {adminTab === 'leads' && (
            <div className="space-y-6 text-left animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold font-heading text-white">Client Leads Manager</h2>
                  <p className="text-slate-400 text-xs mt-1">Manage new business leads submitted from the website forms in real-time.</p>
                </div>
              </div>

              {leads.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center text-slate-400">
                  <MessageSquare className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-sm font-semibold">No client leads collected yet.</p>
                  <p className="text-xs text-slate-500 mt-1">Try filling out the 'Get a Free Demo' form on the landing page.</p>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-slate-850">
                          <th className="p-4 pl-6">Client Name</th>
                          <th className="p-4">Business</th>
                          <th className="p-4">WhatsApp Phone</th>
                          <th className="p-4">Niche</th>
                          <th className="p-4">Headaches</th>
                          <th className="p-4">Demo Link</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 pr-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-xs">
                        {leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-4 pl-6 font-bold text-white">{lead.name}</td>
                            <td className="p-4 text-slate-300 font-semibold">{lead.businessName}</td>
                            <td className="p-4 text-slate-400">
                              <div className="flex items-center gap-1.5">
                                <span>{lead.phone}</span>
                                <button 
                                  onClick={() => {
                                    const template = `Hi ${lead.name}! 👋 This is the Nexosia Assistant. I saw your new AI Demo website for "${lead.businessName}" generated on Nexosia. Let's connect to customize it further!`;
                                    const url = `https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(template)}`;
                                    window.open(url, '_blank');
                                  }}
                                  className="text-[#25d366] hover:text-[#128c7e] p-1 rounded hover:bg-slate-800 transition-all cursor-pointer"
                                  title="Quick Send WhatsApp Follow-up"
                                >
                                  <MessageSquare className="h-3.5 w-3.5 fill-[#25d366]" />
                                </button>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="bg-slate-800 border border-slate-700 text-slate-300 text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {lead.businessType || 'Other'}
                              </span>
                            </td>
                            <td className="p-4 max-w-xs truncate text-slate-400">
                              {lead.headaches ? lead.headaches.join(', ') : 'None'}
                            </td>
                            <td className="p-4">
                              <a 
                                href={`?demo=${lead.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-electric hover:underline font-bold flex items-center gap-1 text-[10px]"
                              >
                                View Demo <ArrowUpRight className="h-3 w-3" />
                              </a>
                            </td>
                            <td className="p-4">
                              <select 
                                value={lead.status || 'New'}
                                onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                                className={`text-[9px] font-bold px-2 py-1 rounded focus:outline-none border ${
                                  lead.status === 'New'
                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                    : lead.status === 'Called'
                                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                      : lead.status === 'Demo Booked'
                                        ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                                        : lead.status === 'Interested'
                                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                }`}
                              >
                                <option value="New">New</option>
                                <option value="Called">Called</option>
                                <option value="Demo Booked">Demo Booked</option>
                                <option value="Interested">Interested</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <button 
                                onClick={() => {
                                  setEditingNotesLeadId(lead.id);
                                  setNotesText(lead.notes || '');
                                  setEditingNotesCollection('leads');
                                }}
                                className="text-slate-500 hover:text-cyan-accent p-1.5 rounded hover:bg-slate-850 transition-colors cursor-pointer mr-1"
                                title="Edit CRM Notes"
                              >
                                <Sliders className="h-4.5 w-4.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteLead(lead.id)}
                                className="text-slate-500 hover:text-rose-400 p-1.5 rounded hover:bg-slate-850 transition-colors cursor-pointer"
                                title="Delete Lead"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Trials Tab */}
          {adminTab === 'trials' && (
            <div className="space-y-6 text-left animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-bold font-heading text-white">Active Free Trials Tracker</h2>
                <p className="text-slate-400 text-xs mt-1">Monitor the 14-day free trial signups and setup status of client websites.</p>
              </div>

              {trials.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center text-slate-400">
                  <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-sm font-semibold">No free trials active.</p>
                  <p className="text-xs text-slate-500 mt-1">Trial requests from the 'Claim Setup' cards will populate here.</p>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-slate-850">
                          <th className="p-4 pl-6">Client Name</th>
                          <th className="p-4">Business</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Demo Link</th>
                          <th className="p-4">Created Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 pr-6 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-xs">
                        {trials.map((trial) => (
                          <tr key={trial.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-4 pl-6 font-bold text-white">{trial.name}</td>
                            <td className="p-4 text-slate-300 font-semibold">{trial.businessName}</td>
                            <td className="p-4 text-slate-400">{trial.email}</td>
                            <td className="p-4 text-slate-400">
                              <div className="flex items-center gap-1.5">
                                <span>{trial.phone}</span>
                                <button 
                                  onClick={() => {
                                    const template = `Hi ${trial.name}! 👋 This is the Nexosia Assistant. I saw your new AI Demo website for "${trial.businessName}" generated on Nexosia. Let's connect to customize it further!`;
                                    const url = `https://wa.me/${trial.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(template)}`;
                                    window.open(url, '_blank');
                                  }}
                                  className="text-[#25d366] hover:text-[#128c7e] p-1 rounded hover:bg-slate-800 transition-all cursor-pointer"
                                  title="Quick Send WhatsApp Follow-up"
                                >
                                  <MessageSquare className="h-3.5 w-3.5 fill-[#25d366]" />
                                </button>
                              </div>
                            </td>
                            <td className="p-4">
                              <a 
                                href={`?demo=${trial.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-electric hover:underline font-bold flex items-center gap-1 text-[10px]"
                              >
                                View Demo <ArrowUpRight className="h-3 w-3" />
                              </a>
                            </td>
                            <td className="p-4 text-slate-500">
                              {trial.createdAt ? new Date(trial.createdAt.seconds * 1000).toLocaleDateString() : 'Pending'}
                            </td>
                            <td className="p-4">
                              <select 
                                value={trial.status || 'New'}
                                onChange={(e) => handleUpdateTrialStatus(trial.id, e.target.value)}
                                className={`text-[9px] font-bold px-2 py-1 rounded focus:outline-none border ${
                                  trial.status === 'New'
                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                    : trial.status === 'Called'
                                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                      : trial.status === 'Demo Booked'
                                        ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                                        : trial.status === 'Interested'
                                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                }`}
                              >
                                <option value="New">New</option>
                                <option value="Called">Called</option>
                                <option value="Demo Booked">Demo Booked</option>
                                <option value="Interested">Interested</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <button 
                                onClick={() => {
                                  setEditingNotesLeadId(trial.id);
                                  setNotesText(trial.notes || '');
                                  setEditingNotesCollection('trials');
                                }}
                                className="text-slate-500 hover:text-cyan-accent p-1.5 rounded hover:bg-slate-850 transition-colors cursor-pointer mr-1"
                                title="Edit CRM Notes"
                              >
                                <Sliders className="h-4.5 w-4.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteTrial(trial.id)}
                                className="text-slate-500 hover:text-rose-400 p-1.5 rounded hover:bg-slate-850 transition-colors cursor-pointer"
                                title="Delete Trial"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: AI Agent Automation Panel */}
          {adminTab === 'ai-agent' && (
            <div className="space-y-8 text-left animate-in fade-in duration-200">
              
              {/* Autopilot Controller Header */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-cyan-accent animate-pulse" />
                    AI Auto-Pilot Agent Control
                  </h2>
                  <p className="text-slate-400 text-xs">When enabled, the AI Agent processes incoming leads, generates follow-ups, and schedules slots on autopilot.</p>
                </div>
                
                {/* Autopilot toggle */}
                <button 
                  onClick={() => setAiAutopilot(!aiAutopilot)}
                  className={`px-5 py-3 rounded-full text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                    aiAutopilot 
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {aiAutopilot ? (
                    <>
                      <PlayCircle className="h-4.5 w-4.5 fill-slate-950 text-slate-950" />
                      AUTOPILOT: ACTIVE
                    </>
                  ) : (
                    <>
                      <PauseCircle className="h-4.5 w-4.5 text-slate-400" />
                      AUTOPILOT: PAUSED
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Sandbox and Settings */}
                <div className="lg:col-span-7 space-y-8">
                  
                  {/* AI Onboarding Sandbox (Draft approvals) */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                    <div>
                      <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
                        <Zap className="h-4.5 w-4.5 text-cyan-electric" />
                        AI Lead-Responder Sandbox
                      </h3>
                      <p className="text-slate-400 text-[11px] mt-0.5">Edit and approve custom draft replies compiled by the AI agent for recent leads.</p>
                    </div>

                    {drafts.length === 0 ? (
                      <div className="py-12 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500 text-xs">
                        No pending AI drafts. Leads are fully processed!
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {drafts.map((d) => (
                          <div key={d.id} className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4">
                            <div className="flex justify-between items-start border-b border-slate-900 pb-2">
                              <div>
                                <h4 className="font-extrabold text-white text-xs">{d.leadName}</h4>
                                <span className="text-[10px] text-slate-400">{d.businessName} • {d.phone}</span>
                              </div>
                              <span className="bg-cyan-accent/10 text-cyan-accent-dark text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                WhatsApp Welcome
                              </span>
                            </div>
                            
                            {/* Message box */}
                            <textarea 
                              value={d.message}
                              onChange={(e) => {
                                const txt = e.target.value;
                                setDrafts(prev => prev.map(item => item.id === d.id ? { ...item, message: txt } : item));
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-accent h-24 font-sans leading-relaxed resize-none"
                            />

                            {/* Action triggers */}
                            <div className="flex justify-end gap-2 text-[10px]">
                              <button 
                                onClick={() => handleRejectDraft(d.id, d.leadName)}
                                className="px-3.5 py-2 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer font-bold"
                              >
                                Reject Draft
                              </button>
                              <button 
                                onClick={() => handleApproveDraft(d.id, d.leadName)}
                                className="bg-cyan-accent hover:bg-cyan-accent-dark text-slate-950 hover:text-white px-4 py-2 rounded-lg font-extrabold transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Send className="h-3 w-3" />
                                Approve & Send
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Editable AI guidelines config panel */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                    <div>
                      <h3 className="text-base font-bold font-heading text-white">AI Agent Instructions</h3>
                      <p className="text-slate-400 text-[11px] mt-0.5">Customize the system prompt and operational guidelines for your AI scheduler.</p>
                    </div>
                    <textarea 
                      value={aiInstructions}
                      onChange={(e) => setAiInstructions(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs text-slate-300 focus:outline-none focus:border-cyan-accent h-32 font-mono leading-relaxed"
                    />
                    <button 
                      onClick={() => alert("AI guidelines updated successfully!")}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg transition-all cursor-pointer"
                    >
                      Save operational guidelines
                    </button>
                  </div>

                </div>

                {/* Right Column: AI Action Logs */}
                <div className="lg:col-span-5">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
                          <Clock className="h-4.5 w-4.5 text-cyan-accent" />
                          AI Agent Activity Logs
                        </h3>
                        <p className="text-slate-400 text-[11px] mt-0.5">Real-time actions executed by the autopilot system.</p>
                      </div>
                      
                      {/* Log feed */}
                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {aiLogs.map((log) => (
                          <div key={log.id} className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-xl flex items-start gap-2.5 text-[10px] leading-relaxed text-left animate-in fade-in duration-200">
                            <span className="text-slate-500 font-bold font-mono shrink-0">{log.time}</span>
                            <div>
                              <span className={`font-bold mr-1.5 uppercase ${
                                log.type === 'action' 
                                  ? 'text-emerald-400' 
                                  : log.type === 'whatsapp' 
                                    ? 'text-cyan-electric' 
                                    : 'text-slate-400'
                              }`}>
                                [{log.type}]
                              </span>
                              <span className="text-slate-300">{log.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Tab 4: Newsletter Subscribers */}
          {adminTab === 'subscribers' && (
            <div className="space-y-6 text-left animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-bold font-heading text-white">Email Subscriber List</h2>
                <p className="text-slate-400 text-xs mt-1">View user emails registered to the newsletter subscriber block.</p>
              </div>

              {subscribers.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center text-slate-400">
                  <Mail className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-sm font-semibold">No newsletter subscribers.</p>
                  <p className="text-xs text-slate-500 mt-1">Submitted emails from the footer form will display here.</p>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl max-w-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-slate-850">
                          <th className="p-4 pl-6">Subscriber Email</th>
                          <th className="p-4">Opt-In Date</th>
                          <th className="p-4 pr-6 text-right">Remove</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-xs">
                        {subscribers.map((sub) => (
                          <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-4 pl-6 font-bold text-white">{sub.email}</td>
                            <td className="p-4 text-slate-500">
                              {sub.createdAt ? new Date(sub.createdAt.seconds * 1000).toLocaleDateString() : 'Pending'}
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <button 
                                onClick={() => handleDeleteSubscriber(sub.id)}
                                className="text-slate-500 hover:text-rose-400 p-1.5 rounded hover:bg-slate-850 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Platform Settings */}
          {adminTab === 'settings' && (
            <div className="space-y-6 text-left animate-in fade-in duration-200 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold font-heading text-white">Platform Settings</h2>
                <p className="text-slate-400 text-xs mt-1">Verify backend database connections and operational parameters.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-855 text-xs">
                  <span className="text-slate-400">Database Engine</span>
                  <span className="text-white font-bold">Cloud Firestore (Active/Online)</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-855 text-xs">
                  <span className="text-slate-400">Authentication Service</span>
                  <span className="text-white font-bold">Firebase Auth (Email/Password Provider)</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-855 text-xs">
                  <span className="text-slate-400">Google Calendar Synchronization</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> Enabled
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">WhatsApp Business API Sync</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> Connected
                  </span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    );
  }

  // ----------------------------------------------------
  // --- VISITOR LANDING PAGE VIEW (DEFAULT) ---
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0A0205] text-[#FEF3C7] font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600 z-50 transition-all duration-305" style={{
        width: `${typeof window !== 'undefined' ? (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 105 : 0}%`
      }}></div>

      {/* Sticky Navigation Bar - Royal Mandala Glass */}
      <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-[#0E0207]/85 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <img src={logoImg} alt="Nexosia Logo" className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(245,158,11,0.3)]" />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-amber-100/80">
            <a href="#features" className="hover:text-amber-300 transition-colors duration-200">Superpowers</a>
            <a href="#demo" className="hover:text-amber-300 transition-colors duration-200">Live Simulator</a>
            <a href="#about" className="hover:text-amber-300 transition-colors duration-200">About Story</a>
            <a href="#roi-calculator" className="hover:text-amber-300 transition-colors duration-200">ROI Calculator</a>
            <a href="#pricing" className="hover:text-amber-300 transition-colors duration-200">Pricing</a>
            <a href="#faq" className="hover:text-amber-300 transition-colors duration-200">FAQ</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="text-amber-200/80 hover:text-amber-300 text-sm font-bold transition-colors duration-200 px-4 py-2"
            >
              Login
            </button>
            <button 
              onClick={() => openWizard('demo')}
              className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-sm font-black px-6 py-2.5 rounded-full transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 gold-glow-button cursor-pointer"
            >
              Get a Free Demo
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-amber-300 hover:text-amber-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#140309] border-b border-amber-500/25 absolute top-16 left-0 w-full p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-5 duration-250">
            <nav className="flex flex-col gap-4 text-base font-semibold text-amber-100/90">
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-300 py-2 border-b border-amber-900/30">Superpowers</a>
              <a href="#demo" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-300 py-2 border-b border-amber-900/30">Live Simulator</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-300 py-2 border-b border-amber-900/30">About Story</a>
              <a href="#roi-calculator" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-300 py-2 border-b border-amber-900/30">ROI Calculator</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-300 py-2 border-b border-amber-900/30">Pricing</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-300 py-2 border-b border-amber-900/30">FAQ</a>
            </nav>
            <div className="flex flex-col gap-3 pt-4">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setIsLoginModalOpen(true); }}
                className="w-full text-center text-amber-200 hover:text-amber-100 py-2 font-bold"
              >
                Login
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); openWizard('demo'); }}
                className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 text-center font-black py-3 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/25"
              >
                Get a Free Demo
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - Royal Golden Mandala Theme */}
      <section className="relative pt-12 pb-24 md:py-32 overflow-hidden mandala-hero-bg text-[#FEF3C7]">
        
        {/* Ambient Golden Rotating Mandalas in Background */}
        <div className="absolute -top-24 -right-24 md:-top-32 md:-right-32 w-[480px] md:w-[650px] h-[480px] md:h-[650px] pointer-events-none opacity-20">
          <MandalaOrnament className="w-full h-full" opacity={0.35} />
        </div>
        <div className="absolute -bottom-32 -left-32 w-[420px] md:w-[550px] h-[420px] md:h-[550px] pointer-events-none opacity-15">
          <MandalaOrnament className="w-full h-full" opacity={0.25} reverse={true} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-8">
              
              <div className="inline-flex items-center gap-2 bg-amber-500/10 backdrop-blur-md border border-amber-500/30 rounded-full px-4 py-1.5 text-xs sm:text-sm font-bold text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>Stop losing clients while you sleep 😴 • 24/7 WhatsApp AI Assistant</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-tight text-white">
                Get an Aesthetic Website + <span className="text-gold-gradient">Smart WhatsApp Bot</span> in 48 Hours. 🚀
              </h1>

              <p className="text-lg sm:text-xl text-amber-100/80 max-w-2xl font-normal leading-relaxed">
                Hey! Are you still booking appointments on WhatsApp manually or missing clients after hours? Nexosia crafts your luxury website with a 24/7 WhatsApp assistant that books clients in 30 seconds.
              </p>

              {/* ⚡ Interactive AI Demo Generator Command Bar */}
              <div className="w-full bg-[#120308]/90 p-6 sm:p-7 rounded-3xl text-white shadow-2xl border border-amber-500/30 relative overflow-hidden text-left space-y-4 backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                    <span className="text-xs font-bold text-amber-400 tracking-wider uppercase font-mono">Nexosia AI Generator v2.5</span>
                  </div>
                  <button 
                    onClick={() => {
                      setAiModalStep(1);
                      setIsAiModalOpen(true);
                    }}
                    className="text-[11px] font-bold text-amber-200/80 hover:text-amber-100 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>💬 Step-by-Step AI Guide</span>
                    <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
                  </button>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white font-heading leading-tight">
                    Generate Your AI Website Demo in 5 Seconds
                  </h3>
                  <p className="text-xs text-amber-200/70 mt-1">
                    Enter your business details below or select a niche preset to test your visual website & WhatsApp booking bot instantly!
                  </p>
                </div>

                {/* AI Prompt Input Bar */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleQuickAiGenerate(aiPromptInput);
                  }}
                  className="flex flex-col sm:flex-row gap-2 pt-1"
                >
                  <div className="relative flex-grow">
                    <Sparkles className="h-4 w-4 text-amber-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="text" 
                      placeholder="e.g. Dr. Verma Dental Care, Jaipur, Root Canal ₹1500, Consultation ₹500..."
                      value={aiPromptInput}
                      onChange={(e) => setAiPromptInput(e.target.value)}
                      className="w-full bg-[#080104]/80 border border-amber-500/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-amber-50 placeholder-amber-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs px-6 py-3 rounded-2xl transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap hover:scale-102 active:scale-98"
                  >
                    <span>⚡ Generate Demo</span>
                    <ArrowRight className="h-4 w-4 text-slate-950" />
                  </button>
                </form>

                {/* Quick Presets Row */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-amber-300/70 uppercase tracking-wider block mb-2">Or Choose a Business Niche Preset:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'clinic', icon: '🏥', label: 'Dental / Clinic' },
                      { key: 'salon', icon: '💇‍♀️', label: 'Salon & Spa' },
                      { key: 'gym', icon: '🏋️', label: 'Gym & Fitness' },
                      { key: 'cafe', icon: '☕', label: 'Cafe & Dining' },
                      { key: 'ca', icon: '🏢', label: 'CA & Legal' },
                      { key: 'store', icon: '🛍️', label: 'Retail Store' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          const preset = nichePresets[item.key];
                          if (preset) startAiGenerationSequence(preset);
                        }}
                        className="bg-[#1C050E]/90 hover:bg-[#2A0815] text-amber-100 hover:text-amber-300 border border-amber-500/25 rounded-xl px-3 py-1.5 text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:border-amber-400/50"
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Direct Quick Action CTAs */}
              <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button 
                  onClick={() => openWizard('trial')}
                  className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
                >
                  <span>🚀 Start 14-Day Free Setup Trial</span>
                  <ArrowRight className="h-4 w-4 text-slate-950" />
                </button>
                <a 
                  href="#custom-inquiry"
                  className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>Custom Requirements Form ↓</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-amber-900/40 w-full">
                <div className="flex items-center gap-2 text-amber-200/80 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-amber-400 flex-shrink-0" />
                  <span>No credit card required for trial</span>
                </div>
                <div className="flex items-center gap-2 text-amber-200/80 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-amber-400 flex-shrink-0" />
                  <span>Setup ready in 3-5 business days</span>
                </div>
              </div>

            </div>

            {/* Right Column - Aesthetic Mockups & Floating Badges */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="absolute w-80 h-80 rounded-full bg-amber-500/15 blur-3xl -top-10 -right-10 pointer-events-none"></div>
              <div className="absolute w-80 h-80 rounded-full bg-red-500/15 blur-3xl -bottom-10 -left-10 pointer-events-none"></div>

              {/* Side-by-side Layout Wrapper with Float Animation */}
              <div className="flex items-end gap-4 max-w-full relative animate-float">
                
                {/* Mockup 1: Mobile Web Interface */}
                <div className="relative w-48 sm:w-56 bg-[#16050C] rounded-2xl shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col select-none -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 z-10">
                  <div className="bg-[#0D0206] px-3 py-2 flex items-center gap-1.5 border-b border-amber-900/40">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <div className="bg-[#1C050E] text-[9px] text-amber-300/70 rounded px-2 py-0.5 ml-2 truncate w-full flex-grow text-center">
                      apexhealth.com
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-2 border-b border-amber-900/30 pb-2">
                      <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 text-[10px] font-black">A</div>
                      <span className="font-bold text-[10px] text-amber-200 font-heading">Apex Health</span>
                    </div>
                    <div className="h-20 bg-gradient-to-br from-amber-950/40 to-[#120308] border border-amber-500/20 rounded-lg flex items-center justify-center p-2 relative overflow-hidden">
                      <span className="text-[10px] text-amber-300 font-bold text-center z-10">Modern Clinic Website</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-3/4 bg-amber-900/40 rounded"></div>
                      <div className="h-1.5 w-full bg-amber-950/40 rounded"></div>
                    </div>
                    <div className="pt-2">
                      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg p-2 flex items-center justify-center gap-1.5 text-[9px] font-bold shadow-sm">
                        <MessageSquare className="h-3 w-3" />
                        <span>Book on WhatsApp</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mockup 2: WhatsApp Chat Interface */}
                <div className="relative w-52 sm:w-60 bg-[#0e1614] rounded-2xl shadow-2xl border border-amber-500/40 overflow-hidden flex flex-col select-none rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 z-20">
                  <div className="bg-[#075e54] text-white p-3 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs">🤖</div>
                    <div className="flex-grow min-w-0">
                      <div className="text-[11px] font-bold truncate">Apex Bot Assistant</div>
                      <div className="text-[8px] text-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
                      </div>
                    </div>
                  </div>
                  <div className="p-3 space-y-2.5 bg-[#0b141a] text-[10px] flex-grow">
                    <div className="bg-[#202c33] text-slate-200 p-2.5 rounded-xl rounded-tl-none shadow-sm max-w-[88%] border border-slate-700/40">
                      Namaste! 🙏 Welcome to Apex Health. Would you like to book a consultation today?
                    </div>
                    <div className="bg-[#005c4b] text-white p-2.5 rounded-xl rounded-tr-none shadow-sm max-w-[88%] ml-auto">
                      Yes please, tomorrow at 5 PM.
                    </div>
                    <div className="bg-[#202c33] text-slate-200 p-2.5 rounded-xl rounded-tl-none shadow-sm max-w-[88%] border border-slate-700/40">
                      ✅ Slot locked for 5:00 PM! Reminder sent to your calendar.
                    </div>
                  </div>
                </div>

                {/* Floating Aesthetic Badges */}
                <div className="absolute -top-4 -left-4 bg-[#140308]/90 backdrop-blur-md border border-amber-500/40 px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 text-[11px] font-bold text-amber-300 z-30">
                  <span>⚡ 0.8s WhatsApp Sync</span>
                </div>
                <div className="absolute -bottom-4 -right-2 bg-[#140308]/90 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 z-30">
                  <span>📈 3.4x More Bookings</span>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      <section id="custom-inquiry" className="py-20 bg-[#0E0207] border-y border-amber-900/40 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-10">
          <MandalaOrnament className="w-full h-full" opacity={0.2} />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-10 relative z-10">
          
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              <MessageSquare className="h-4 w-4 fill-amber-400" />
              Direct Founder Connection
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              Have Custom Business Requirements?
            </h2>
            <p className="text-sm text-amber-200/70 leading-relaxed">
              Fill in your details below. We'll build your custom website & WhatsApp bot layout and connect with you directly on WhatsApp at <strong className="text-amber-400">+91 7860716837</strong>!
            </p>
          </div>

          {/* Premium Glassmorphic Lead Generation Form Card */}
          <div className="glass-gold-card rounded-3xl p-8 sm:p-10 shadow-2xl text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <form onSubmit={handleTopFormSubmit} className="space-y-6 font-sans relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300/80">Your Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dr. Ramesh Sharma / Anita Verma"
                    value={topFormData.name}
                    onChange={(e) => setTopFormData({...topFormData, name: e.target.value})}
                    className="w-full border border-amber-500/25 bg-[#080104]/80 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-400 focus:bg-[#0D0206] transition-all text-amber-50 placeholder-amber-200/30 shadow-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300/80">Business Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Apex Health Clinic / Vibe Salon & Spa"
                    value={topFormData.businessName}
                    onChange={(e) => setTopFormData({...topFormData, businessName: e.target.value})}
                    className="w-full border border-amber-500/25 bg-[#080104]/80 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-400 focus:bg-[#0D0206] transition-all text-amber-50 placeholder-amber-200/30 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300/80">WhatsApp Phone Number *</label>
                  <input 
                    type="tel" 
                    placeholder="e.g. 7860716837"
                    value={topFormData.phone}
                    onChange={(e) => setTopFormData({...topFormData, phone: e.target.value})}
                    className="w-full border border-amber-500/25 bg-[#080104]/80 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-400 focus:bg-[#0D0206] transition-all text-amber-50 placeholder-amber-200/30 shadow-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300/80">Current Website / Instagram (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. www.apexclinic.com / @vibesalon"
                    value={topFormData.website}
                    onChange={(e) => setTopFormData({...topFormData, website: e.target.value})}
                    className="w-full border border-amber-500/25 bg-[#080104]/80 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-400 focus:bg-[#0D0206] transition-all text-amber-50 placeholder-amber-200/30 shadow-sm"
                  />
                </div>
              </div>

              {/* Plan Selection Option */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300/80">Choose Preferred Pricing Plan *</label>
                  <span className="text-[10px] text-amber-400/80 font-mono">₹250 Advance Token for Rentals</span>
                </div>
                <select 
                  value={topFormData.selectedPlan}
                  onChange={(e) => setTopFormData({...topFormData, selectedPlan: e.target.value})}
                  className="w-full border border-amber-500/30 bg-[#080104]/90 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-400 focus:bg-[#0D0206] transition-all text-amber-100 shadow-sm cursor-pointer font-medium"
                >
                  <option value="Plan 1: Monthly Website Rental (₹599/mo + ₹599 deposit | ₹250 adv)">Plan 1: Monthly Website Rental — ₹599/mo (₹250 Adv, ₹599 Deposit, Balance ₹948)</option>
                  <option value="Plan 2: Yearly Website Rental (₹5,000/yr + ₹599 deposit | ₹250 adv)">Plan 2: Yearly Website Rental — ₹5,000/yr (Save ₹2,100+, ₹250 Adv, Balance ₹5,349)</option>
                  <option value="Plan 3: Monthly Rental + Maintenance Pack (₹748/mo + ₹599 deposit)">Plan 3: Monthly Rental + Maintenance Pack — ₹748/mo (10 Edits/mo Fair-Use)</option>
                  <option value="Plan 4: Permanent Website Purchase (₹10,000 one-time)">Plan 4: Permanent Website Purchase — ₹10,000 One-Time (100% Source Code & IP Handover)</option>
                  <option value="Custom Enterprise / Consultation">Custom Enterprise / Free Consultation</option>
                </select>
                <p className="text-[10px] text-amber-300/60 pl-1">
                  * All rental plans include 1st month basic maintenance. Security deposit (₹599) reconciliation follows the signed agreement and applicable law.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300/80">Describe Your Goals & Specific Requirements</label>
                <textarea 
                  placeholder="e.g. I run a 4-chair dental clinic in Lucknow. I want an automated WhatsApp chatbot that books appointments, sends Google Review links after treatment, and links with my clinic calendar..."
                  value={topFormData.message}
                  onChange={(e) => setTopFormData({...topFormData, message: e.target.value})}
                  className="w-full border border-amber-500/25 bg-[#080104]/80 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-400 focus:bg-[#0D0206] transition-all h-24 resize-none text-amber-50 placeholder-amber-200/30 shadow-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-amber-900/30">
                <div className="text-xs text-amber-200/70 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Direct submission to founder WhatsApp: <strong className="text-amber-400">+91 7860716837</strong></span>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmittingTopForm}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm py-4 px-8 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 hover:scale-102 active:scale-98"
                >
                  {isSubmittingTopForm ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <MessageSquare className="h-4.5 w-4.5 fill-white text-white" />
                      <span>Submit & Send to WhatsApp ➔</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Features Grid - Royal Mandala Bento Grid */}
      <section id="features" className="py-24 md:py-32 bg-[#0A0205] text-[#FEF3C7] relative overflow-hidden border-t border-amber-900/30">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <span>⚡ Superpowers for your business</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-white">
              Everything Your Business Needs to <span className="text-gold-gradient">Dominate Locally</span>
            </h2>
            <p className="text-amber-100/70 text-base sm:text-lg">
              No bloated software, no endless setup. Just clean royal automation that fills your appointment book on autopilot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1 - Main Feature */}
            <div className="md:col-span-2 bento-gold rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
                  <Phone className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Instant WhatsApp Capture</span>
                  <h3 className="text-2xl font-bold font-heading text-white">Web-to-WhatsApp Direct Pipeline</h3>
                  <p className="text-amber-200/70 text-sm leading-relaxed max-w-xl">
                    Every visitor gets a warm, one-click WhatsApp prompt. Their inquiry lands directly inside your phone with zero forms, zero friction, and instant response capability.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-xs font-medium text-amber-300">⚡ 0.8s Response Time</span>
                <span className="px-3 py-1 bg-[#1A040C] border border-amber-900/40 rounded-full text-xs font-medium text-amber-200/70">📈 +340% Conversions</span>
                <span className="px-3 py-1 bg-[#1A040C] border border-amber-900/40 rounded-full text-xs font-medium text-amber-200/70">💬 Zero App Downloads</span>
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="bento-gold rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">24/7 Smart Booking</span>
                  <h3 className="text-xl font-bold font-heading text-white">Zero Double Bookings</h3>
                  <p className="text-amber-200/70 text-sm leading-relaxed">
                    AI checks available slots in real time, locks appointments, and sends instant confirmation to both you and the client.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-amber-900/40 flex items-center justify-between text-xs text-emerald-400 font-bold">
                <span>Google Calendar Sync</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Bento Card 3 */}
            <div className="bento-gold rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Star className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Reputation Booster</span>
                  <h3 className="text-xl font-bold font-heading text-white">5-Star Review Engine</h3>
                  <p className="text-amber-200/70 text-sm leading-relaxed">
                    Automatically checks in with clients 2 hours post-visit. Satisfied clients are nudged straight to your Google Maps review page.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-amber-900/40 flex items-center justify-between text-xs text-amber-400 font-bold">
                <span>Rank #1 on Google Maps</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Bento Card 4 */}
            <div className="md:col-span-2 bento-gold rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Zap className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Zero Setup Headache</span>
                  <h3 className="text-2xl font-bold font-heading text-white">We Build & Manage Everything For You</h3>
                  <p className="text-amber-200/70 text-sm leading-relaxed max-w-xl">
                    You don't touch a single line of code. Our team sets up your custom website, connects your WhatsApp, trains the assistant on your services, and goes live in under 48 hours.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-amber-900/40 flex items-center justify-between">
                <span className="text-xs text-amber-200/60">Need adjustments later? Text us anytime on WhatsApp.</span>
                <a href="https://wa.me/917860716837?text=Hi%20Devesh!%20I%20want%20to%20learn%20more%20about%20Nexosia." target="_blank" rel="noreferrer" className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                  Chat With Us <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Advanced Feature: Comparison Table */}
      <section id="compare" className="py-24 md:py-32 bg-[#0E0207] border-t border-b border-amber-900/40">
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

          <div className="glass-gold-card rounded-3xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1C050E] text-amber-300 text-xs uppercase tracking-wider font-bold border-b border-amber-500/30">
                    <th className="p-6">Feature / Metric</th>
                    <th className="p-6 text-amber-400 font-extrabold">🚀 Nexosia (Royal)</th>
                    <th className="p-6 opacity-80">Traditional Agency</th>
                    <th className="p-6 opacity-80">DIY Builders (Wix/WPS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-900/30 text-sm text-amber-100">
                  {COMPARISON_ROWS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-bold text-midnight">{row.feature}</td>
                      <td className="p-6 bg-amber-500/10 font-bold text-amber-300">{row.nexosia}</td>
                      <td className="p-6 text-slate-505">{row.agency}</td>
                      <td className="p-6 text-slate-505">{row.diy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Showcase & Chat Simulator */}
      <section id="demo" className="py-24 bg-[#0A0205] relative overflow-hidden border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Content column */}
            <div className="lg:col-span-6 text-left space-y-6">
              <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3.5 py-1.5 text-xs font-bold text-amber-300">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Interactive Live Demo Simulator</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
                Experience the Entire Booking & Feedback Ecosystem
              </h2>
              <p className="text-amber-100/70 text-base leading-relaxed">
                Click the tabs below to toggle between different modules of the system. Test how visitors transition from browsing to booking, and finally giving a 5-star Google review.
              </p>

              {/* Selector Tabs */}
              <div className="flex flex-col sm:flex-row gap-2.5 p-1.5 bg-[#140309] rounded-2xl border border-amber-500/25">
                <button 
                  onClick={() => setSimTab('widget')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    simTab === 'widget' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/20' : 'text-amber-200/70 hover:text-amber-100'
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  1. Website Booking Widget
                </button>
                <button 
                  onClick={() => setSimTab('bot')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    simTab === 'bot' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/20' : 'text-amber-200/70 hover:text-amber-100'
                  }`}
                >
                  <MessageCircle className="h-4 w-4" />
                  2. WhatsApp Bot Flow
                </button>
                <button 
                  onClick={() => setSimTab('reviews')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    simTab === 'reviews' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/20' : 'text-amber-200/70 hover:text-amber-100'
                  }`}
                >
                  <Star className="h-4 w-4" />
                  3. Auto-Review Request
                </button>
              </div>

              {/* Tab Description Cards */}
              <div className="glass-gold-card rounded-2xl p-6">
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
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-955 flex justify-center items-center z-30">
                  <div className="w-24 h-4 bg-slate-955 rounded-b-xl flex justify-center items-start">
                    <div className="w-10 h-1 bg-slate-800 rounded-full mt-1.5"></div>
                  </div>
                </div>

                {/* 1. Website Booking Widget Page */}
                {simTab === 'widget' && (
                  <div className="absolute inset-0 bg-white flex flex-col pt-6 z-10 select-none">
                    <div className="bg-slate-100 px-3 py-2 flex items-center gap-1.5 border-b border-slate-200">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                      <span className="text-[8px] text-slate-400 flex-grow text-center">apexhealth.com</span>
                    </div>
                    <div className="flex-grow p-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-extrabold text-[12px] text-indigo-700">🏥 Apex Health</span>
                          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-505 font-bold">☰</div>
                        </div>
                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 text-center space-y-2">
                          <h4 className="font-extrabold text-xs text-indigo-955 font-heading">Complete Family Medical Center</h4>
                          <p className="text-[9px] text-indigo-600">Secure top-tier care instantly with our expert doctor panel.</p>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-bold text-[10px] text-slate-700">Available Doctors:</h5>
                          <div className="flex items-center gap-2 p-2 border border-slate-100 rounded-xl bg-slate-50/50">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-505 font-heading">SJ</div>
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
                      <button onClick={resetSimulator} className="text-[8px] border border-white/20 bg-white/10 px-2 py-0.5 rounded text-white cursor-pointer font-bold">Reset</button>
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
                        <div className="bg-white text-slate-805 self-start text-[10px] rounded-xl rounded-tl-none p-2.5 shadow-sm flex items-center gap-1.5 animate-pulse max-w-[50%]">
                          <span className="text-slate-500">typing...</span>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    <div className="bg-white p-3 border-t border-slate-200 shrink-0 font-sans">
                      {simStep === 0 && !isSimTyping && (
                        <div className="space-y-1.5">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider text-center mb-1">Choose an option:</p>
                          <button onClick={() => handleSimOptionClick("Monday, July 6", 1)} className="w-full bg-slate-50 hover:bg-emerald-50 text-slate-805 border border-slate-200 text-xs py-2 px-3 rounded-lg text-left transition-all cursor-pointer font-bold">📅 Monday, July 6</button>
                          <button onClick={() => handleSimOptionClick("Tuesday, July 7", 1)} className="w-full bg-slate-50 hover:bg-emerald-50 text-slate-805 border border-slate-200 text-xs py-2 px-3 rounded-lg text-left transition-all cursor-pointer font-bold">📅 Tuesday, July 7</button>
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
                        <form onSubmit={handleSimNameSubmit} className="flex gap-2 items-center">
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
                      <button onClick={resetReviewSimulator} className="text-[8px] border border-white/20 bg-white/10 px-2 py-0.5 rounded text-white cursor-pointer font-bold">Reset</button>
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
                        <div className="bg-white text-slate-805 self-start text-[10px] rounded-xl rounded-tl-none p-2.5 shadow-sm flex items-center gap-1.5 animate-pulse max-w-[50%]">
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
                                className="w-10 h-10 rounded-full border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50 flex items-center justify-center font-bold text-slate-700 hover:text-amber-600 transition-all text-xs cursor-pointer"
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
      <section id="roi-calculator" className="py-24 md:py-32 bg-[#0E0207] text-white relative overflow-hidden border-t border-amber-900/40">
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

              <div className="space-y-6 bg-slate-800/50 p-6 rounded-3xl border border-slate-850">
                
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
                  <div className="flex justify-between text-[10px] text-slate-505 font-bold">
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
                  <div className="flex justify-between text-[10px] text-slate-505 font-bold">
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
                <span className="w-1.5 h-1.5 bg-cyan-accent"></span>
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

            {/* About Us & Founder Story Section */}
      <section id="about" className="py-24 md:py-32 bg-slate-900 text-white relative overflow-hidden border-t border-b border-slate-800">
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Story Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <span>👋 Who's behind Nexosia?</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight text-white leading-tight">
                Built with ❤️ by <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Devesh Tripathi</span> & Team
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                We started Nexosia because we noticed a painful reality: local business owners — doctors, salons, coaches, and boutique consultants — are losing dozens of high-paying clients every week simply because their websites are slow, outdated, and lack immediate WhatsApp connectivity.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">We treat your business like our own</h4>
                    <p className="text-slate-400 text-sm">No robotic tickets or overseas outsourcing. You talk directly with the founders who build and tune your pipeline.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Laser-focused on ROI, not vanity metrics</h4>
                    <p className="text-slate-400 text-sm">We don't just give you pretty pictures. We engineer funnels designed to turn clicks into paid bookings.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Direct Line: +91 7860716837</h4>
                    <p className="text-slate-400 text-sm">Got an urgent question or need a custom tweak? Ping us directly on WhatsApp or call anytime.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a 
                  href="https://wa.me/917860716837?text=Hi%20Devesh!%20I%20would%20like%20to%20talk%20about%20Nexosia." 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat with Devesh on WhatsApp
                </a>
                <a 
                  href="tel:+917860716837"
                  className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm rounded-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <Phone className="h-4 w-4 text-cyan-400" />
                  Direct Call
                </a>
              </div>

            </div>

            {/* Right Card / Founder Highlight Column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/80 rounded-3xl p-8 space-y-6 relative overflow-hidden shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black font-heading shadow-lg shadow-cyan-500/30">
                    DT
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-heading text-white">Devesh Tripathi</h3>
                    <p className="text-cyan-400 text-xs font-semibold">Founder & Tech Lead @ Nexosia</p>
                    <span className="inline-block mt-1 text-[11px] text-slate-400">Gorakhpur & Lucknow, India</span>
                  </div>
                </div>

                <div className="border-t border-slate-700/60 pt-4 space-y-3 text-xs text-slate-300 leading-relaxed">
                  <p className="italic">
                    "My goal is simple: ensure every local business gets access to the same high-converting automation technology that multi-million dollar venture-backed startups use — at an honest, upfront price."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-center">
                    <span className="text-2xl font-extrabold text-cyan-400 font-heading block">50+</span>
                    <span className="text-[11px] text-slate-400">Websites Deployed</span>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-center">
                    <span className="text-2xl font-extrabold text-emerald-400 font-heading block">100%</span>
                    <span className="text-[11px] text-slate-400">Client Satisfaction</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 space-y-3 hover:border-cyan-500/40 transition-colors text-left">
                <span className="text-2xl block">🤝</span>
                <h4 className="text-base font-bold font-heading text-white">Direct Human Support</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You get direct WhatsApp access to our founder and engineering team whenever you need to update prices, timings, or add staff.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 md:py-32 bg-[#0A0205] text-[#FEF3C7] relative overflow-hidden border-t border-amber-900/30">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative font-sans">
          
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
                  <p className="text-sm text-slate-505 leading-relaxed">
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
                  <p className="text-sm text-slate-505 leading-relaxed">
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
                  <p className="text-sm text-slate-505 leading-relaxed">
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

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-32 bg-[#0E0207] text-[#FEF3C7] border-t border-amber-900/40 relative overflow-hidden">
        {/* Ambient Mandala Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-10">
          <MandalaOrnament className="w-full h-full" opacity={0.18} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Transparent Pricing Architecture</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
              Fair Website Rentals or <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">100% Code Ownership</span>
            </h2>
            
            <p className="text-amber-100/70 text-sm sm:text-base leading-relaxed">
              Launch a high-converting website with an automated 24/7 WhatsApp assistant. Choose flexible low-cost monthly rental, save with yearly rental, or purchase the complete codebase forever.
            </p>

            {/* Legal & Security Deposit Notice Box */}
            <div className="mt-6 bg-[#16040C]/90 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-left flex items-start gap-3.5 shadow-xl backdrop-blur-sm max-w-2xl mx-auto">
              <Shield className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-amber-300 uppercase tracking-wider font-mono">
                  ⚖️ Transparent Contract & Deposit Policy
                </p>
                <p className="text-amber-100/80 leading-relaxed">
                  The one-time <strong>₹599 security deposit</strong> on rental plans is held separately from rental fees. It is neither a service fee nor a guaranteed unconditional refund; its reconciliation strictly follows the signed agreement and applicable law upon termination or conversion.
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4 STUNNING PRICING CARDS */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            
            {/* ---------------- CARD 1: Monthly Website Rental ---------------- */}
            <div className="bg-[#120308]/90 border border-amber-500/25 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-amber-400/50 transition-all duration-300 shadow-xl relative backdrop-blur-md hover:-translate-y-1 text-left font-sans">
              <div className="space-y-5">
                <div className="flex justify-between items-start gap-2">
                  <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-500/30 font-mono">
                    Plan 1 • Monthly Rental
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Zero Lock-in
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-heading text-white">Monthly Website Rental</h3>
                  <p className="text-amber-200/60 text-xs mt-1">Ideal for budding clinics, studios, salons & local businesses.</p>
                </div>

                {/* Pricing Display */}
                <div className="border-y border-amber-900/40 py-4 space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-amber-400 font-heading">₹599</span>
                    <span className="text-amber-200/60 text-xs font-semibold">/ month</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-300/80 font-medium">
                    <span>+ ₹599 One-time Security Deposit</span>
                  </div>
                </div>

                {/* Breakdown Mini Box */}
                <div className="bg-[#1C050E]/80 border border-amber-900/50 rounded-2xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-amber-200/80">
                    <span>Initial Total Outlay:</span>
                    <strong className="text-white font-mono">₹1,198</strong>
                  </div>
                  <div className="flex justify-between items-center text-emerald-400 font-semibold">
                    <span>Advance to Start:</span>
                    <span className="font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">₹250</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-200/70 text-[11px]">
                    <span>Balance on Delivery & Access:</span>
                    <span className="text-amber-300 font-mono">₹948</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-200/70 text-[11px] pt-1 border-t border-amber-900/40">
                    <span>Subsequent Renewals:</span>
                    <span className="text-white font-mono">₹599/mo</span>
                  </div>
                </div>

                {/* Inclusions */}
                <div className="space-y-2.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/70 block">What is Included:</span>
                  <ul className="space-y-2 text-xs text-amber-100/80">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>1st month basic maintenance</strong> included from website activation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Default subdomain included</strong> (custom domain & renewal separate unless agreed)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Official 24/7 WhatsApp AI booking bot & lead sync</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>High-speed cloud hosting, SSL & mobile responsiveness</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 space-y-2">
                <a
                  href={`https://wa.me/917860716837?text=${encodeURIComponent("Hi Devesh! I want to get started with Plan 1: Monthly Website Rental (₹599/month, ₹250 advance payment). Please share the setup details!")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Book with ₹250 Advance</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-950" />
                </a>
                <button
                  type="button"
                  onClick={() => handleSelectPlan("Plan 1: Monthly Website Rental (₹599/mo + ₹599 deposit | ₹250 adv)")}
                  className="w-full text-center text-[11px] text-amber-300/80 hover:text-amber-200 py-1 cursor-pointer transition-colors"
                >
                  Or Select in Inquiry Form ↓
                </button>
              </div>
            </div>

            {/* ---------------- CARD 2: Yearly Website Rental (VIP Highlighted) ---------------- */}
            <div className="bg-gradient-to-b from-[#1C050E] to-[#120308] border-2 border-amber-400 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl shadow-amber-500/20 relative backdrop-blur-md scale-[1.02] text-left font-sans ring-1 ring-amber-400/50">
              {/* Highlight Ribbon */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md whitespace-nowrap">
                👑 MOST POPULAR • SAVE ₹2,100+
              </div>

              <div className="space-y-5 pt-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-400/50 font-mono">
                    Plan 2 • Annual Rental
                  </span>
                  <span className="text-[10px] text-amber-300 font-extrabold bg-amber-500/20 px-2 py-0.5 rounded-full">
                    Best Value
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black font-heading text-white">Yearly Website Rental</h3>
                  <p className="text-amber-200/70 text-xs mt-1">Maximum value for established practices & growing stores.</p>
                </div>

                {/* Pricing Display */}
                <div className="border-y border-amber-500/30 py-4 space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-white font-heading">₹5,000</span>
                    <span className="text-amber-300/80 text-xs font-semibold">/ year</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-amber-300/90 font-medium">
                    <span>+ ₹599 One-time Security Deposit</span>
                    <span className="text-emerald-400 font-bold font-mono">~₹416/mo</span>
                  </div>
                </div>

                {/* Breakdown Mini Box */}
                <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-amber-200">
                    <span>Initial Total Outlay:</span>
                    <strong className="text-white font-mono text-sm">₹5,599</strong>
                  </div>
                  <div className="flex justify-between items-center text-emerald-400 font-semibold">
                    <span>Advance to Start:</span>
                    <span className="font-mono bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">₹250</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-200/80 text-[11px]">
                    <span>Balance on Delivery & Access:</span>
                    <span className="text-amber-300 font-mono">₹5,349</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-200/80 text-[11px] pt-1 border-t border-amber-500/20">
                    <span>Annual Renewal:</span>
                    <span className="text-white font-mono">₹5,000/year (Agreed terms)</span>
                  </div>
                </div>

                {/* Inclusions */}
                <div className="space-y-2.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">Everything in Monthly, Plus:</span>
                  <ul className="space-y-2 text-xs text-amber-100/90">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Saves ₹2,188/year</strong> compared to monthly renewals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>1st month basic maintenance</strong> included (extra arranged separately)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Default subdomain included</strong> (custom domain & renewal separate)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Priority setup & direct founder WhatsApp access</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 space-y-2">
                <a
                  href={`https://wa.me/917860716837?text=${encodeURIComponent("Hi Devesh! I want to get started with Plan 2: Yearly Website Rental (₹5,000/year, ₹250 advance payment). Please share the setup details!")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs py-3.5 px-4 rounded-xl transition-all shadow-xl shadow-amber-500/30 text-center flex items-center justify-center gap-1.5 cursor-pointer hover:scale-102 active:scale-98"
                >
                  <span>Book with ₹250 Advance</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-950" />
                </a>
                <button
                  type="button"
                  onClick={() => handleSelectPlan("Plan 2: Yearly Website Rental (₹5,000/yr + ₹599 deposit | ₹250 adv)")}
                  className="w-full text-center text-[11px] text-amber-300 hover:text-white py-1 cursor-pointer transition-colors font-semibold"
                >
                  Or Select in Inquiry Form ↓
                </button>
              </div>
            </div>

            {/* ---------------- CARD 3: Rental + Monthly Maintenance Pack ---------------- */}
            <div className="bg-[#120308]/90 border border-amber-500/25 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-amber-400/50 transition-all duration-300 shadow-xl relative backdrop-blur-md hover:-translate-y-1 text-left font-sans">
              <div className="space-y-5">
                <div className="flex justify-between items-start gap-2">
                  <span className="bg-purple-500/10 text-purple-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-purple-500/30 font-mono">
                    Plan 3 • Rental + Pack
                  </span>
                  <span className="text-[10px] text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
                    10 Edits/Mo
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-heading text-white">Rental + Maintenance</h3>
                  <p className="text-amber-200/60 text-xs mt-1">For businesses needing frequent price, menu, or banner updates.</p>
                </div>

                {/* Pricing Display */}
                <div className="border-y border-amber-900/40 py-4 space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-amber-400 font-heading">₹748</span>
                    <span className="text-amber-200/60 text-xs font-semibold">/ month</span>
                  </div>
                  <div className="text-[11px] text-amber-300/80 font-medium">
                    <span>₹599 rental + ₹149 Maintenance Pack</span>
                  </div>
                </div>

                {/* Breakdown Mini Box */}
                <div className="bg-[#1C050E]/80 border border-amber-900/50 rounded-2xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-amber-200/80">
                    <span>Initial Total Outlay:</span>
                    <strong className="text-white font-mono">₹1,198</strong>
                  </div>
                  <div className="flex justify-between items-center text-emerald-400 font-semibold">
                    <span>Advance to Start:</span>
                    <span className="font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">₹250</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-200/70 text-[11px]">
                    <span>Balance on Delivery & Access:</span>
                    <span className="text-amber-300 font-mono">₹948</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-200/70 text-[11px] pt-1 border-t border-amber-900/40">
                    <span>Recurring Cost:</span>
                    <span className="text-purple-300 font-mono">₹748/mo (Opt-in only)</span>
                  </div>
                </div>

                {/* Inclusions */}
                <div className="space-y-2.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/70 block">Maintenance Pack Scope:</span>
                  <ul className="space-y-2 text-xs text-amber-100/80">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                      <span><strong>Up to 10 minor edits/month</strong> (subject to fair-use policy)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>Fast turnaround for menu, timings, prices, and photos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>Pack requires <strong>explicit consent</strong>; not auto-applied to yearly rental</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>Default subdomain included (custom domain separate)</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 space-y-2">
                <a
                  href={`https://wa.me/917860716837?text=${encodeURIComponent("Hi Devesh! I want to get started with Plan 3: Website Rental + Monthly Maintenance Pack (₹748/month). Please share the setup details!")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Book Plan 3 (₹748/mo)</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-950" />
                </a>
                <button
                  type="button"
                  onClick={() => handleSelectPlan("Plan 3: Monthly Rental + Maintenance Pack (₹748/mo + ₹599 deposit)")}
                  className="w-full text-center text-[11px] text-amber-300/80 hover:text-amber-200 py-1 cursor-pointer transition-colors"
                >
                  Or Select in Inquiry Form ↓
                </button>
              </div>
            </div>

            {/* ---------------- CARD 4: Permanent Website Purchase ---------------- */}
            <div className="bg-[#120308]/90 border border-amber-500/25 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-amber-400/50 transition-all duration-300 shadow-xl relative backdrop-blur-md hover:-translate-y-1 text-left font-sans">
              <div className="space-y-5">
                <div className="flex justify-between items-start gap-2">
                  <span className="bg-emerald-500/10 text-emerald-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30 font-mono">
                    Plan 4 • One-Time Buy
                  </span>
                  <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    100% Code Handover
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-heading text-white">Permanent Purchase</h3>
                  <p className="text-amber-200/60 text-xs mt-1">Full code handover & intellectual property rights per contract.</p>
                </div>

                {/* Pricing Display */}
                <div className="border-y border-amber-900/40 py-4 space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-amber-400 font-heading">₹10,000</span>
                    <span className="text-amber-200/60 text-xs font-semibold">one-time</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium">
                    <span>Purchase arrangement • Not a rental</span>
                  </div>
                </div>

                {/* Breakdown Mini Box */}
                <div className="bg-[#1C050E]/80 border border-amber-900/50 rounded-2xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-amber-200/80">
                    <span>One-Time Price:</span>
                    <strong className="text-white font-mono">₹10,000</strong>
                  </div>
                  <div className="flex justify-between items-center text-emerald-400 font-semibold">
                    <span>Security Deposit:</span>
                    <span className="font-mono text-emerald-300">₹0 (None required)</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-200/70 text-[11px]">
                    <span>Source Code Handover:</span>
                    <span className="text-amber-300 font-semibold">Full GitHub / Zip</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-200/70 text-[11px] pt-1 border-t border-amber-900/40">
                    <span>Recurring Nexosia Fee:</span>
                    <span className="text-white font-mono">₹0 (Zero)</span>
                  </div>
                </div>

                {/* Inclusions */}
                <div className="space-y-2.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/70 block">Written Agreement Terms:</span>
                  <ul className="space-y-2 text-xs text-amber-100/80">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Full source-code & IP rights</strong> defined in written contract</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Deliverables, 3rd-party license exclusions & scope clearly documented</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Hosting, domain & future maintenance defined in writing (no false lifetime claims)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Rental conversion: Prior rental dues / deposit reconciled upon purchase</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 space-y-2">
                <a
                  href={`https://wa.me/917860716837?text=${encodeURIComponent("Hi Devesh! I am interested in Plan 4: Permanent Website Purchase (₹10,000 one-time). Please share written agreement details & contract terms!")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Purchase Website (₹10,000)</span>
                  <ArrowRight className="h-3.5 w-3.5 text-white" />
                </a>
                <button
                  type="button"
                  onClick={() => handleSelectPlan("Plan 4: Permanent Website Purchase (₹10,000 one-time)")}
                  className="w-full text-center text-[11px] text-amber-300/80 hover:text-amber-200 py-1 cursor-pointer transition-colors"
                >
                  Or Select in Inquiry Form ↓
                </button>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* PAYMENT FLOW & TRANSPARENCY INFOGRAPHIC */}
          {/* ========================================================================= */}
          <div className="mt-20 bg-[#140309] border border-amber-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl text-left">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-3xl mb-8 space-y-2">
              <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                ⚡ Simple 4-Step Payment Journey
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                How Onboarding & Milestone Payments Work
              </h3>
              <p className="text-xs sm:text-sm text-amber-200/70">
                Transparent milestones with zero guesswork. Start with just a ₹250 advance token for any rental plan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              
              {/* Step 1 */}
              <div className="bg-[#0A0205]/80 border border-amber-500/20 rounded-2xl p-5 space-y-3 relative group hover:border-amber-400/40 transition-all">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-sm font-mono">
                  01
                </div>
                <h4 className="font-bold text-sm text-white font-heading">₹250 Advance Token</h4>
                <p className="text-xs text-amber-100/70 leading-relaxed">
                  Pay an advance payment of <strong>₹250</strong> (included in initial total) to kick off custom UI design and bot drafting.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#0A0205]/80 border border-amber-500/20 rounded-2xl p-5 space-y-3 relative group hover:border-amber-400/40 transition-all">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-sm font-mono">
                  02
                </div>
                <h4 className="font-bold text-sm text-white font-heading">3–5 Days Rapid Build</h4>
                <p className="text-xs text-amber-100/70 leading-relaxed">
                  We build your mobile-responsive luxury website and integrate the 24/7 WhatsApp appointment booking assistant.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#0A0205]/80 border border-amber-500/20 rounded-2xl p-5 space-y-3 relative group hover:border-amber-400/40 transition-all">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-sm font-mono">
                  03
                </div>
                <h4 className="font-bold text-sm text-white font-heading">Delivery & Balance</h4>
                <p className="text-xs text-amber-100/70 leading-relaxed">
                  Inspect your live website. Pay the remaining balance (<strong>₹948</strong> for Monthly / <strong>₹5,349</strong> for Yearly) upon delivery and agreed admin access.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-[#0A0205]/80 border border-amber-500/20 rounded-2xl p-5 space-y-3 relative group hover:border-amber-400/40 transition-all">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-sm font-mono">
                  04
                </div>
                <h4 className="font-bold text-sm text-white font-heading">Deposit & Maintenance</h4>
                <p className="text-xs text-amber-100/70 leading-relaxed">
                  The ₹599 security deposit reconciliation follows the signed agreement & law. 1st month basic maintenance included; optional ₹149/mo pack covers 10 edits.
                </p>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* UPDATED 4-OPTION PRICING COMPARISON TABLE */}
          {/* ========================================================================= */}
          <div className="mt-20 text-left space-y-6">
            <div className="space-y-2">
              <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                📊 Detailed Breakdown
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Side-by-Side Plan Comparison
              </h3>
              <p className="text-xs sm:text-sm text-amber-200/70">
                Compare one-time charges, recurring fees, security deposits, and maintenance deliverables across all 4 plans.
              </p>
            </div>

            <div className="glass-gold-card rounded-3xl shadow-2xl overflow-hidden border border-amber-500/30">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#1C050E] text-amber-300 uppercase tracking-wider font-bold border-b border-amber-500/30">
                      <th className="p-4 sm:p-5 font-mono">Plan Feature / Metric</th>
                      <th className="p-4 sm:p-5 bg-amber-500/5 text-amber-300">
                        <span className="block font-black text-sm">Plan 1: Monthly Rental</span>
                        <span className="text-[10px] text-amber-200/60 font-normal">₹599 / month</span>
                      </th>
                      <th className="p-4 sm:p-5 bg-amber-500/15 text-amber-400 border-x border-amber-500/30">
                        <span className="block font-black text-sm">Plan 2: Yearly Rental 👑</span>
                        <span className="text-[10px] text-amber-300 font-normal">₹5,000 / year (Save ₹2,100+)</span>
                      </th>
                      <th className="p-4 sm:p-5 bg-purple-500/5 text-purple-300">
                        <span className="block font-black text-sm">Plan 3: Rental + Pack</span>
                        <span className="text-[10px] text-purple-200/60 font-normal">₹748 / month</span>
                      </th>
                      <th className="p-4 sm:p-5 bg-emerald-500/5 text-emerald-300">
                        <span className="block font-black text-sm">Plan 4: Permanent Purchase</span>
                        <span className="text-[10px] text-emerald-200/60 font-normal">₹10,000 One-Time</span>
                      </th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-amber-900/30 text-amber-100/90 font-sans">
                    
                    {/* Row 1: Plan Arrangement */}
                    <tr className="hover:bg-amber-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-white">Billing Arrangement</td>
                      <td className="p-4 sm:p-5">
                        <span className="bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-bold border border-cyan-500/30">
                          Recurring Monthly
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 bg-amber-500/5 border-x border-amber-500/30">
                        <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-500/40">
                          Recurring Annual
                        </span>
                      </td>
                      <td className="p-4 sm:p-5">
                        <span className="bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded text-[10px] font-bold border border-purple-500/30">
                          Monthly + Optional Add-on
                        </span>
                      </td>
                      <td className="p-4 sm:p-5">
                        <span className="bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/30">
                          One-Time Purchase (Not Rental)
                        </span>
                      </td>
                    </tr>

                    {/* Row 2: Security Deposit */}
                    <tr className="hover:bg-amber-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-white">One-Time Security Deposit</td>
                      <td className="p-4 sm:p-5 text-amber-300 font-mono">
                        ₹599 <span className="text-[10px] block text-amber-200/60">(Reconciled per agreement & law)</span>
                      </td>
                      <td className="p-4 sm:p-5 bg-amber-500/5 text-amber-300 font-mono border-x border-amber-500/30">
                        ₹599 <span className="text-[10px] block text-amber-200/60">(Separate from annual rental)</span>
                      </td>
                      <td className="p-4 sm:p-5 text-amber-300 font-mono">
                        ₹599 <span className="text-[10px] block text-amber-200/60">(Reconciled per agreement & law)</span>
                      </td>
                      <td className="p-4 sm:p-5 text-emerald-400 font-mono font-bold">
                        ₹0 (None required)
                      </td>
                    </tr>

                    {/* Row 3: Advance to Start */}
                    <tr className="hover:bg-amber-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-white">Advance Payment to Start</td>
                      <td className="p-4 sm:p-5 text-emerald-400 font-bold font-mono">
                        ₹250 <span className="text-[10px] block text-amber-200/60">(Included in initial total)</span>
                      </td>
                      <td className="p-4 sm:p-5 bg-amber-500/5 text-emerald-400 font-bold font-mono border-x border-amber-500/30">
                        ₹250 <span className="text-[10px] block text-amber-200/60">(Included in initial total)</span>
                      </td>
                      <td className="p-4 sm:p-5 text-emerald-400 font-bold font-mono">
                        ₹250 <span className="text-[10px] block text-amber-200/60">(Included in initial total)</span>
                      </td>
                      <td className="p-4 sm:p-5 text-amber-300 font-mono">
                        Milestone advance per written agreement
                      </td>
                    </tr>

                    {/* Row 4: Initial Total Outlay */}
                    <tr className="hover:bg-amber-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-white">Initial Total Outlay</td>
                      <td className="p-4 sm:p-5 font-bold font-mono text-white">₹1,198</td>
                      <td className="p-4 sm:p-5 bg-amber-500/5 font-bold font-mono text-amber-300 border-x border-amber-500/30 text-sm">₹5,599</td>
                      <td className="p-4 sm:p-5 font-bold font-mono text-white">
                        ₹1,198 <span className="text-[10px] block text-amber-200/60">(Excluding future recurring)</span>
                      </td>
                      <td className="p-4 sm:p-5 font-bold font-mono text-emerald-400 text-sm">₹10,000</td>
                    </tr>

                    {/* Row 5: Balance on Delivery */}
                    <tr className="hover:bg-amber-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-white">Balance Due on Delivery</td>
                      <td className="p-4 sm:p-5 text-amber-200 font-mono">
                        ₹948 <span className="text-[10px] block text-amber-200/60">(After delivery & agreed access)</span>
                      </td>
                      <td className="p-4 sm:p-5 bg-amber-500/5 text-amber-200 font-mono border-x border-amber-500/30">
                        ₹5,349 <span className="text-[10px] block text-amber-200/60">(After delivery & agreed access)</span>
                      </td>
                      <td className="p-4 sm:p-5 text-amber-200 font-mono">
                        ₹948 <span className="text-[10px] block text-amber-200/60">(After delivery & agreed access)</span>
                      </td>
                      <td className="p-4 sm:p-5 text-amber-200 font-mono">
                        Agreed milestone balance per contract
                      </td>
                    </tr>

                    {/* Row 6: Ongoing Renewals */}
                    <tr className="hover:bg-amber-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-white">Subsequent Renewals</td>
                      <td className="p-4 sm:p-5 font-mono text-white">₹599 / month</td>
                      <td className="p-4 sm:p-5 bg-amber-500/5 font-mono text-amber-300 border-x border-amber-500/30">
                        ₹5,000 / year (Agreed terms)
                      </td>
                      <td className="p-4 sm:p-5 font-mono text-purple-300">
                        ₹748 / month (₹599 + ₹149 pack)
                      </td>
                      <td className="p-4 sm:p-5 font-mono text-emerald-400 font-bold">
                        ₹0 (Zero recurring fees to Nexosia)
                      </td>
                    </tr>

                    {/* Row 7: Maintenance Scope */}
                    <tr className="hover:bg-amber-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-white">Maintenance Scope</td>
                      <td className="p-4 sm:p-5">1st month basic maintenance included from activation</td>
                      <td className="p-4 sm:p-5 bg-amber-500/5 border-x border-amber-500/30">
                        1st month basic maintenance included (extra arranged separately)
                      </td>
                      <td className="p-4 sm:p-5 text-purple-200 font-medium">
                        Up to 10 minor edits/month (fair-use policy; explicit consent required)
                      </td>
                      <td className="p-4 sm:p-5">
                        Defined in written agreement (No lifetime claims)
                      </td>
                    </tr>

                    {/* Row 8: Domain & Hosting */}
                    <tr className="hover:bg-amber-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-white">Domain & Hosting</td>
                      <td className="p-4 sm:p-5">Subdomain incl. / Custom domain & renewal charged separate</td>
                      <td className="p-4 sm:p-5 bg-amber-500/5 border-x border-amber-500/30">
                        Subdomain incl. / Custom domain & renewal charged separate
                      </td>
                      <td className="p-4 sm:p-5">Subdomain incl. / Custom domain & renewal charged separate</td>
                      <td className="p-4 sm:p-5">Source-code handover; self-hostable anywhere per agreement</td>
                    </tr>

                    {/* Row 9: Source Code Handover */}
                    <tr className="hover:bg-amber-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-white">Source Code & IP Rights</td>
                      <td className="p-4 sm:p-5 text-amber-300/70">Retained by Nexosia during rental</td>
                      <td className="p-4 sm:p-5 bg-amber-500/5 text-amber-300/70 border-x border-amber-500/30">Retained by Nexosia during rental</td>
                      <td className="p-4 sm:p-5 text-amber-300/70">Retained by Nexosia during rental</td>
                      <td className="p-4 sm:p-5 text-emerald-400 font-bold">
                        100% Source-Code Handover & IP Rights per contract
                      </td>
                    </tr>

                    {/* Row 10: Legal Agreement */}
                    <tr className="hover:bg-amber-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-white">Agreement & Legal Scope</td>
                      <td className="p-4 sm:p-5">Standard digital rental agreement</td>
                      <td className="p-4 sm:p-5 bg-amber-500/5 border-x border-amber-500/30">Yearly rental agreement with renewal clauses</td>
                      <td className="p-4 sm:p-5">Monthly rental agreement with optional maintenance add-on</td>
                      <td className="p-4 sm:p-5">Written purchase agreement defining IP, deliverables & exclusions</td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Specialized Doctor Clinic & EHR System (Added from Tech Department) */}
      <section className="py-24 md:py-32 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.15),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="bg-cyan-500/10 text-cyan-accent text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              🏥 Specialized Vertical Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight text-white pt-2">
              Ready-to-Deploy Clinic EHR & Patient System
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
              Apne clinic ko paperless aur smart banayein! We offer ready-to-deploy, fully customizable software packages for doctors, clinics, and health professionals with <strong className="text-white">zero monthly subscription fees</strong>.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            
            {/* Visual Column */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-center items-center text-center">
              <div className="w-full aspect-video bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden relative group shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80" 
                  alt="Doctor Clinic EHR System Layout" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-[1.03] transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end justify-center p-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-accent">Interactive Telehealth Demo Included</span>
                </div>
              </div>
              
              <div className="bg-slate-950/85 border border-slate-800 rounded-2xl p-6 w-full text-center space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">One-Time License Option</span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-extrabold text-white">₹15,000</span>
                  <span className="text-slate-400 text-xs">/ lifetime</span>
                </div>
                <p className="text-[11px] text-slate-400">Lifetime access • No subscription costs • Custom medical branding</p>
                <div className="pt-2">
                  <a 
                    href="https://wa.me/917860716837?text=Hi!%20I%20am%20interested%20in%20buying%20your%20Customizable%20Doctor%20Clinic%20Software%20for%20₹15,000.%20Please%20share%20customization%20details." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block bg-cyan-accent hover:bg-cyan-accent-dark text-slate-950 font-extrabold text-xs px-6 py-2.5 rounded-lg transition-all"
                  >
                    💬 Get Details on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Details Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold text-cyan-accent uppercase tracking-widest">Interactive Features</span>
                <h3 className="text-2xl font-bold font-heading text-white mt-1">EHR & Telehealth Booking Suite</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    <h4 className="font-bold text-sm text-white">Patient Appointment Scheduler</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-7">
                    Interactive calendar booking with automatic slot blocking, email confirmations, and specialty toggle.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🩺</span>
                    <h4 className="font-bold text-sm text-white">Secure EHR Vitals Logger</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-7">
                    Track blood pressure, heart rate, temp, and weight logs. Automatically colors dangerous vitals.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🤖</span>
                    <h4 className="font-bold text-sm text-white">AI Medical Help Assistant</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-7">
                    Smart assistant answering customer queries about fees, timings, checkup details, and availability.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧠</span>
                    <h4 className="font-bold text-sm text-white">Clinical AI Diagnostic Helper</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-7">
                    Simulates medical logs, suggesting potential tests (e.g. HbA1c) and summaries on critical values.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📹</span>
                    <h4 className="font-bold text-sm text-white">Telehealth Video Consultations</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-7">
                    Built-in telehealth portal with microphone/camera toggles and live consultation notes pane.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧾</span>
                    <h4 className="font-bold text-sm text-white">Invoicing & PDF Generator</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-7">
                    Calculate checkup costs, print prescriptions, and download clean digital PDF invoices on the fly.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-55 border-t border-slate-200">
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
                <div className="w-12 h-12 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-sm font-heading">
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
      <section id="faq" className="py-24 md:py-32 bg-[#0A0205] text-[#FEF3C7] border-t border-amber-900/40 relative overflow-hidden">
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

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-505 font-medium">
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

      {/* CRM Notes Modal Dialog */}
      {editingNotesLeadId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 text-left space-y-4">
            
            <button 
              onClick={() => setEditingNotesLeadId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="bg-violet-500/10 text-violet-400 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                📝 Lead Interaction CRM Notes
              </span>
              <h3 className="text-lg font-bold font-heading text-white mt-2">Interaction Notes</h3>
              <p className="text-slate-400 text-[10px] mt-0.5">Write and save notes for this customer's pipeline history.</p>
            </div>

            <textarea
              rows="5"
              placeholder="e.g. Called John on Tuesday. He is very interested in the Scale plan but wants custom salon templates. Scheduled call next Monday."
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-accent resize-none"
            />

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingNotesLeadId(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await updateDoc(doc(db, editingNotesCollection, editingNotesLeadId), { notes: notesText });
                    setEditingNotesLeadId(null);
                  } catch (err) {
                    console.error(err);
                    alert("Error saving CRM notes.");
                  }
                }}
                className="bg-cyan-accent hover:bg-cyan-accent-dark text-slate-955 hover:text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-cyan-accent/15"
              >
                Save Notes
                <Check className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Sandbox Payment Checkout Simulator Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 text-left space-y-6">
            
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {checkoutStep === 'form' && (
              <div className="space-y-4">
                <div>
                  <span className="bg-amber-500/10 text-amber-400 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                    🔒 Sandbox Payment Simulator
                  </span>
                  <h3 className="text-xl font-bold font-heading text-white mt-2">Simulated Booking Checkout</h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Select a plan to test simulated payment:
                  </p>
                  
                  {/* Plan pills */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {[
                      { id: 'plan1', name: 'Plan 1: Monthly Rental', price: '₹250 Adv • ₹599/mo' },
                      { id: 'plan2', name: 'Plan 2: Yearly Rental', price: '₹250 Adv • ₹5,000/yr' },
                      { id: 'plan3', name: 'Plan 3: Rental + Pack', price: '₹250 Adv • ₹748/mo' },
                      { id: 'plan4', name: 'Plan 4: Purchase', price: '₹10,000 One-time' }
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setCheckoutPlan(p.id)}
                        className={`p-2 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                          (checkoutPlan === p.id || (!checkoutPlan && p.id === 'plan1'))
                            ? 'border-amber-400 bg-amber-500/15 text-amber-300 font-bold'
                            : 'border-slate-800 text-slate-400 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="leading-tight">{p.name}</div>
                        <div className="text-[10px] text-amber-400/80 mt-0.5">{p.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-white">Amount Due Now (Simulated):</p>
                    <p className="text-slate-400 text-[10px]">
                      {checkoutPlan === 'plan4' ? 'Full one-time purchase' : 'Advance token (Balance due on delivery)'}
                    </p>
                  </div>
                  <p className="font-bold text-lg text-amber-400 font-mono">
                    {checkoutPlan === 'plan4' ? (currency === 'INR' ? '₹10,000' : '$130') : (currency === 'INR' ? '₹250' : '$5')}
                  </p>
                </div>

                {/* Radio selection */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setCheckoutForm({...checkoutForm, method: 'card'})}
                    className={`p-3 rounded-xl border text-xs font-bold cursor-pointer text-center transition-all ${
                      checkoutForm.method === 'card' ? 'border-cyan-accent bg-cyan-accent/5 text-cyan-accent' : 'border-slate-800 text-slate-400 hover:bg-slate-800/30'
                    }`}
                  >
                    💳 Credit Card
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCheckoutForm({...checkoutForm, method: 'upi'})}
                    className={`p-3 rounded-xl border text-xs font-bold cursor-pointer text-center transition-all ${
                      checkoutForm.method === 'upi' ? 'border-cyan-accent bg-cyan-accent/5 text-cyan-accent' : 'border-slate-800 text-slate-400 hover:bg-slate-800/30'
                    }`}
                  >
                    📱 UPI ID
                  </button>
                </div>

                {checkoutForm.method === 'card' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Card Number</label>
                      <input 
                        type="text" 
                        placeholder="4242 4242 4242 4242"
                        value={checkoutForm.cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 16);
                          const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                          setCheckoutForm({...checkoutForm, cardNumber: formatted});
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          value={checkoutForm.cardExpiry}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                            const formatted = val.length >= 2 ? `${val.slice(0, 2)}/${val.slice(2)}` : val;
                            setCheckoutForm({...checkoutForm, cardExpiry: formatted});
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">CVV</label>
                        <input 
                          type="password" 
                          placeholder="123"
                          value={checkoutForm.cardCvv}
                          onChange={(e) => setCheckoutForm({...checkoutForm, cardCvv: e.target.value.replace(/[^0-9]/g, '').slice(0, 3)})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">UPI VPA Address</label>
                    <input 
                      type="text" 
                      placeholder="username@upi"
                      value={checkoutForm.upiId}
                      onChange={(e) => setCheckoutForm({...checkoutForm, upiId: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                      required
                    />
                  </div>
                )}

                <button 
                  type="button"
                  onClick={() => {
                    if (checkoutForm.method === 'card' && (!checkoutForm.cardNumber || !checkoutForm.cardExpiry || !checkoutForm.cardCvv)) {
                      alert("Please fill card details.");
                      return;
                    }
                    if (checkoutForm.method === 'upi' && !checkoutForm.upiId) {
                      alert("Please enter UPI VPA ID.");
                      return;
                    }
                    setCheckoutStep('processing');
                    setTimeout(() => {
                      setCheckoutStep('success');
                      setTimeout(() => {
                        setIsCheckoutOpen(false);
                        setWizardType('trial');
                        setWizardStep(1);
                        setIsWizardModalOpen(true);
                      }, 1500);
                    }, 2000);
                  }}
                  className="w-full bg-cyan-accent hover:bg-cyan-accent-dark text-slate-950 hover:text-white font-extrabold text-xs py-3.5 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1 shadow-md shadow-cyan-accent/15"
                >
                  Confirm Simulated Payment
                </button>
              </div>
            )}

            {checkoutStep === 'processing' && (
              <div className="py-12 text-center space-y-4 font-sans">
                <div className="w-10 h-10 border-4 border-slate-800 border-t-cyan-accent rounded-full animate-spin mx-auto"></div>
                <h4 className="text-sm font-bold text-white">Authorizing Simulated Payment...</h4>
                <p className="text-[10px] text-slate-400">Verifying sandbox accounts with simulated API nodes.</p>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div className="py-12 text-center space-y-4 font-sans">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Payment Completed!</h4>
                <p className="text-[10px] text-slate-400">Opening Onboarding Customization Wizard...</p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 🤖 Interactive AI Website Generator Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 text-left space-y-6">
            
            <button 
              onClick={() => setIsAiModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Stepper Header */}
            <div className="space-y-1">
              <span className="bg-cyan-500/10 text-cyan-accent text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                🤖 AI Website Generator Assistant
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
                {aiModalStep === 1 && "1. Tell us about your business"}
                {aiModalStep === 2 && "2. Configure services & pricing"}
                {aiModalStep === 3 && "3. Working hours & brand vibe"}
              </h3>
              <p className="text-xs text-slate-400">
                Our AI will synthesize your inputs and launch a live interactive visual website demo in seconds.
              </p>
            </div>

            {/* Step 1: Basic Business Details */}
            {aiModalStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Business Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dr. Verma Dental Hospital"
                    value={aiModalData.businessName}
                    onChange={(e) => setAiModalData({...aiModalData, businessName: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Business Category / Niche</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'clinic', label: '🏥 Clinic' },
                      { key: 'salon', label: '💇‍♀️ Salon' },
                      { key: 'gym', label: '🏋️ Gym' },
                      { key: 'cafe', label: '☕ Cafe' },
                      { key: 'ca', label: '🏢 CA/Law' },
                      { key: 'store', label: '🛍️ Retail' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          const preset = nichePresets[item.key];
                          setAiModalData(prev => ({
                            ...prev,
                            businessType: item.key,
                            services: preset ? preset.services : prev.services,
                            themeColor: preset ? preset.themeColor : prev.themeColor
                          }));
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                          aiModalData.businessType === item.key 
                            ? 'border-cyan-accent bg-cyan-accent/10 text-cyan-accent' 
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">City / Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Jaipur, Rajasthan"
                      value={aiModalData.city}
                      onChange={(e) => setAiModalData({...aiModalData, city: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">WhatsApp Number</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 7860716837"
                      value={aiModalData.phone}
                      onChange={(e) => setAiModalData({...aiModalData, phone: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-accent"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button 
                    type="button"
                    onClick={() => {
                      if (!aiModalData.businessName.trim()) {
                        alert("Please enter your business name.");
                        return;
                      }
                      setAiModalStep(2);
                    }}
                    className="bg-cyan-accent hover:bg-cyan-accent-dark text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Next: Services & Rates</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Custom Services */}
            {aiModalStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Core Services & Pricing</label>
                    <button
                      type="button"
                      onClick={() => {
                        const preset = nichePresets[aiModalData.businessType] || nichePresets.clinic;
                        setAiModalData(prev => ({ ...prev, services: preset.services }));
                      }}
                      className="text-[10px] text-cyan-accent hover:underline font-bold"
                    >
                      ⚡ Auto-fill for {aiModalData.businessType}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">Edit or enter the services you want customers to book via WhatsApp:</p>
                </div>

                <div className="space-y-2.5">
                  {aiModalData.services.map((svc, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2">
                      <input 
                        type="text" 
                        placeholder={`Service ${idx + 1} Name`}
                        value={svc.name}
                        onChange={(e) => {
                          const updated = [...aiModalData.services];
                          updated[idx] = { ...svc, name: e.target.value };
                          setAiModalData({...aiModalData, services: updated});
                        }}
                        className="col-span-8 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-accent"
                      />
                      <input 
                        type="text" 
                        placeholder="Price (e.g. ₹500)"
                        value={svc.price}
                        onChange={(e) => {
                          const updated = [...aiModalData.services];
                          updated[idx] = { ...svc, price: e.target.value };
                          setAiModalData({...aiModalData, services: updated});
                        }}
                        className="col-span-4 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-accent"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-3 flex justify-between">
                  <button 
                    type="button"
                    onClick={() => setAiModalStep(1)}
                    className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAiModalStep(3)}
                    className="bg-cyan-accent hover:bg-cyan-accent-dark text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Next: Brand Theme & Hours</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Timings & Theme */}
            {aiModalStep === 3 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Accent Color Theme</label>
                  <div className="flex gap-3">
                    {[
                      { id: 'blue', color: 'bg-indigo-600', name: 'Indigo' },
                      { id: 'emerald', color: 'bg-emerald-600', name: 'Emerald' },
                      { id: 'purple', color: 'bg-violet-600', name: 'Purple' },
                      { id: 'rose', color: 'bg-rose-600', name: 'Rose' },
                      { id: 'orange', color: 'bg-amber-600', name: 'Orange' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setAiModalData({...aiModalData, themeColor: item.id})}
                        className={`w-9 h-9 rounded-2xl ${item.color} relative cursor-pointer flex items-center justify-center transition-transform hover:scale-105`}
                        title={item.name}
                      >
                        {aiModalData.themeColor === item.id && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Opening Time</label>
                    <input 
                      type="time" 
                      value={aiModalData.openTime}
                      onChange={(e) => setAiModalData({...aiModalData, openTime: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-accent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Closing Time</label>
                    <input 
                      type="time" 
                      value={aiModalData.closeTime}
                      onChange={(e) => setAiModalData({...aiModalData, closeTime: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-accent"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-between items-center">
                  <button 
                    type="button"
                    onClick={() => setAiModalStep(2)}
                    className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button 
                    type="button"
                    onClick={() => startAiGenerationSequence(aiModalData)}
                    className="bg-gradient-to-r from-cyan-accent to-cyan-accent-dark text-slate-950 font-extrabold text-xs px-7 py-3.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-accent/20 hover:scale-102 active:scale-98"
                  >
                    <Sparkles className="h-4 w-4 text-slate-950" />
                    <span>⚡ Compile & Launch Live Demo</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 🚀 AI Live Generation Compilation Screen Overlay */}
      {isAiGenerating && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl max-w-md w-full p-8 text-center shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-accent/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-cyan-accent/10 border border-cyan-500/40 flex items-center justify-center mx-auto shadow-lg shadow-cyan-accent/10 animate-bounce">
                <Sparkles className="h-8 w-8 text-cyan-accent" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold font-heading text-white">Nexosia AI Generator Active</h3>
              <p className="text-xs text-cyan-accent font-mono animate-pulse">{aiGenStatusText}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-cyan-accent to-indigo-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${aiGenProgress}%` }}
              ></div>
            </div>

            <p className="text-[10px] text-slate-500">
              Synthesizing layouts, service catalog, calendar slots, and WhatsApp bot simulator...
            </p>
          </div>
        </div>
      )}

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
                <span>•</span>
                <span className={wizardStep >= 4 ? 'text-cyan-accent-dark' : ''}>4. Customize</span>
              </div>
            )}

            {/* Content by Step */}
            {wizardSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-505 flex items-center justify-center mx-auto">
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
                    <p className="text-slate-550 text-xs">We customize the website template and automated booking bot questions based on your niche.</p>
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
                    <p className="text-slate-555 text-xs">Select all that apply so we configure the bot triggers correctly.</p>
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
                              isChecked ? 'border-cyan-accent bg-cyan-accent/5 text-cyan-accent-dark' : 'border-slate-200 hover:bg-slate-55 text-slate-705'
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
                      <button onClick={() => setWizardStep(1)} className="text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer">
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
                  <div className="space-y-4 animate-in fade-in duration-200 text-left">
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
                        type="button"
                        onClick={() => {
                          if(!wizardData.name || !wizardData.businessName || !wizardData.phone || (wizardType==='trial' && !wizardData.email)) {
                            alert("Please fill all required details first.");
                            return;
                          }
                          setWizardStep(4);
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-slate-900/10"
                      >
                        Configure Customizations
                        <ChevronRight className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Customizations (timings, color, services) */}
                {wizardStep === 4 && (
                  <form onSubmit={handleWizardSubmit} className="space-y-4 animate-in fade-in duration-200 text-left">
                    <h3 className="text-xl font-bold font-heading text-midnight">Customize Demo Setup</h3>
                    <p className="text-slate-500 text-xs">Configure your website's custom theme color, opening/closing hours, and service list.</p>
                    
                    <div className="space-y-4 pt-2">
                      
                      {/* Theme selection */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Accent Theme Color</label>
                        <div className="flex gap-3">
                          {[
                            { id: 'blue', color: 'bg-indigo-600', name: 'Indigo' },
                            { id: 'emerald', color: 'bg-emerald-600', name: 'Emerald' },
                            { id: 'purple', color: 'bg-violet-600', name: 'Purple' },
                            { id: 'rose', color: 'bg-rose-600', name: 'Rose' },
                            { id: 'orange', color: 'bg-amber-600', name: 'Orange' }
                          ].map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setWizardData({...wizardData, themeColor: item.id})}
                              className={`w-7 h-7 rounded-full ${item.color} relative cursor-pointer flex items-center justify-center`}
                              title={item.name}
                            >
                              {wizardData.themeColor === item.id && (
                                <span className="absolute inset-0 border-2 border-white rounded-full scale-75 flex items-center justify-center">
                                  <Check className="h-3.5 w-3.5 text-white" />
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Timings row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Opening Time</label>
                          <input 
                            type="time" 
                            value={wizardData.openTime}
                            onChange={(e) => setWizardData({...wizardData, openTime: e.target.value})}
                            className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-accent focus:bg-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Closing Time</label>
                          <input 
                            type="time" 
                            value={wizardData.closeTime}
                            onChange={(e) => setWizardData({...wizardData, closeTime: e.target.value})}
                            className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-accent focus:bg-white"
                            required
                          />
                        </div>
                      </div>

                      {/* Services inputs */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Custom Services & Prices (Optional)</label>
                        <div className="space-y-2">
                          {[0, 1, 2].map((idx) => {
                            const svc = wizardData.services[idx] || { name: '', price: '' };
                            return (
                              <div key={idx} className="grid grid-cols-12 gap-2">
                                <input 
                                  type="text" 
                                  placeholder={`Service ${idx + 1} Name (e.g. Consultation)`}
                                  value={svc.name}
                                  onChange={(e) => {
                                    const updatedSvcs = [...wizardData.services];
                                    updatedSvcs[idx] = { ...svc, name: e.target.value };
                                    setWizardData({...wizardData, services: updatedSvcs});
                                  }}
                                  className="col-span-8 border border-slate-200 bg-slate-55 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-accent focus:bg-white"
                                />
                                <input 
                                  type="text" 
                                  placeholder="Price (e.g. ₹500)"
                                  value={svc.price}
                                  onChange={(e) => {
                                    const updatedSvcs = [...wizardData.services];
                                    updatedSvcs[idx] = { ...svc, price: e.target.value };
                                    setWizardData({...wizardData, services: updatedSvcs});
                                  }}
                                  className="col-span-4 border border-slate-200 bg-slate-55 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-accent focus:bg-white"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <button type="button" onClick={() => setWizardStep(3)} className="text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer">
                        <ChevronLeft className="h-4 w-4" /> Back
                      </button>
                      <button 
                        type="submit"
                        className="bg-cyan-accent hover:bg-cyan-accent-dark text-slate-950 hover:text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-cyan-accent/15"
                      >
                        {wizardType === 'trial' ? 'Connect & Claim Free Setup' : 'Send Demo Request'}
                        <Check className="h-4.5 w-4.5" />
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
            
            <button 
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 text-slate-500 hover:text-slate-808 bg-white/80 hover:bg-white p-2 rounded-full shadow-md cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="aspect-video bg-slate-955 rounded-2xl relative overflow-hidden flex flex-col justify-between p-6">
              
              <div className="flex justify-between items-center text-white z-10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Live Booking Bot Simulation</span>
                </div>
                <span className="text-[10px] bg-slate-808/80 px-2 py-0.5 rounded text-slate-300 font-mono">0:24 / 1:30</span>
              </div>

              <div className="flex-grow flex items-center justify-center gap-6 my-4 select-none z-10">
                
                <div className="bg-slate-900/90 border border-slate-850 rounded-2xl p-4 w-64 text-left space-y-2 shadow-2xl">
                  <div className="text-[9px] font-bold text-cyan-electric uppercase tracking-wider mb-2 flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> WhatsApp Auto-Scheduler
                  </div>
                  <div className="bg-slate-808 p-2 rounded-lg text-[9px] text-slate-300">
                    "Hi Rohan! I would like to book a dental checkup."
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg text-[9px] text-cyan-electric border-l-2 border-cyan-accent leading-normal">
                    "Instantly! 🦷 We have Monday, 10:00 AM available. Reply 'CONFIRM' to lock it."
                  </div>
                </div>

                <div className="hidden sm:block bg-slate-900/90 border border-slate-850 rounded-2xl p-4 w-44 text-left space-y-2 shadow-2xl font-sans">
                  <div className="text-[9px] font-bold text-indigo-404 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Calendar Sync
                  </div>
                  <div className="bg-slate-955 p-2 rounded-lg text-[9px] text-slate-400 space-y-1">
                    <p className="text-[8px] font-bold text-white">Monday, July 6</p>
                    <div className="bg-indigo-950/50 border border-indigo-900 p-1 rounded text-[7px] text-indigo-300">
                      📅 10:00 AM - Rohan (Dental)
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex items-center justify-between text-white text-xs z-10 pt-2 border-t border-white/10 font-sans">
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

      {/* --- Admin Sign-in Modal --- */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200 text-left">
            
            <button 
              onClick={() => { setIsLoginModalOpen(false); setAuthError(''); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 focus:outline-none cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="space-y-2 mb-6">
              <h3 className="text-2xl font-bold font-heading text-midnight flex items-center gap-2">
                <Lock className="h-5 w-5 text-cyan-accent" />
                Admin Console
              </h3>
              <p className="text-slate-550 text-xs">Access the Nexosia lead command center, manage active trials, and configure your AI agent autopilot settings.</p>
            </div>

            {authError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold p-3 rounded-xl mb-4 leading-normal">
                {authError}
              </div>
            )}

            <form onSubmit={handleAdminSignIn} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Admin Email</label>
                <input 
                  type="email"
                  placeholder="e.g. deveshdln@gmail.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-55 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-cyan-accent focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Access Password</label>
                <input 
                  type="password"
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-55 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-cyan-accent focus:bg-white"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isAuthenticating}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {isAuthenticating ? "Verifying Keys..." : "Unlock Dashboard"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-4 border-t border-slate-100 pt-3 text-[9px] text-slate-400 leading-normal font-semibold">
              🔒 Connected to secure Firebase Authentication node. Only authorized admin roles can unlock.
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
