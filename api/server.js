const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static dashboard files from the parent directory (root of the workspace)
app.use(express.static(path.join(__dirname, '..')));

// --- AESTHETIC COMPILER ENGINE (BHARAT EDITION) ---

// Curated Design System Schemes localized with Saffron, Peacock Blue, and Indian tones
const aesthetics = {
  cyberpunk: {
    name: "Neon Cyberpunk (Bharat)",
    bg: "bg-[#05050a]",
    text: "text-slate-200",
    primary: "from-orange-500 to-cyan-400",
    btnColor: "bg-orange-600 hover:bg-orange-700 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]",
    cardBg: "bg-slate-950/80 border border-orange-500/30 backdrop-blur-md",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
    font: "font-mono",
    palette: {
      primary: "#f97316",
      secondary: "#22d3ee",
      background: "#05050a",
      card: "#020617",
      accent: "#00f0ff"
    }
  },
  zen: {
    name: "Minimalist Organic YogSana",
    bg: "bg-[#f8f6f2]",
    text: "text-[#2d3a31]",
    primary: "from-[#854d0e] to-[#a3b3a7]",
    btnColor: "bg-[#854d0e] hover:bg-[#713f12] text-white",
    cardBg: "bg-white/80 border border-[#e2ddd5] shadow-sm",
    badgeColor: "bg-[#854d0e]/10 text-[#854d0e] border border-[#854d0e]/20",
    font: "font-serif",
    palette: {
      primary: "#854d0e",
      secondary: "#a3b3a7",
      background: "#f8f6f2",
      card: "#ffffff",
      accent: "#bfae9c"
    }
  },
  retro: {
    name: "Desi Synthwave Retro-Future",
    bg: "bg-[#1d0a27]",
    text: "text-[#f5edff]",
    primary: "from-amber-500 to-orange-600",
    btnColor: "bg-orange-600 hover:bg-orange-700 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]",
    cardBg: "bg-[#271035] border border-amber-500/20 shadow-lg",
    badgeColor: "bg-amber-400/10 text-amber-300 border border-amber-400/20",
    font: "font-sans",
    palette: {
      primary: "#f59e0b",
      secondary: "#ea580c",
      background: "#1d0a27",
      card: "#271035",
      accent: "#a855f7"
    }
  },
  corporate: {
    name: "SaaS Sahayak India",
    bg: "bg-slate-50",
    text: "text-slate-900",
    primary: "from-sky-700 to-indigo-700",
    btnColor: "bg-sky-700 hover:bg-sky-800 text-white shadow-sm",
    cardBg: "bg-white border border-slate-200/80 shadow-md shadow-slate-100",
    badgeColor: "bg-sky-50 text-sky-700 border border-sky-100",
    font: "font-sans",
    palette: {
      primary: "#0369a1",
      secondary: "#4338ca",
      background: "#f8fafc",
      card: "#ffffff",
      accent: "#38bdf8"
    }
  },
  brutalist: {
    name: "Kirana Brutalist Bold",
    bg: "bg-[#f97316]",
    text: "text-[#000000]",
    primary: "from-[#eab308] to-[#10b981]",
    btnColor: "bg-[#000000] text-white border-2 border-black hover:bg-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    cardBg: "bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
    badgeColor: "bg-black/10 text-black border border-black",
    font: "font-sans font-bold",
    palette: {
      primary: "#eab308",
      secondary: "#10b981",
      background: "#f97316",
      card: "#ffffff",
      accent: "#000000"
    }
  }
};

// Swadeshi business outlines matching Indian startup workflows
const businessOutlines = {
  crypto: {
    title: "Bharat Ledger",
    subtitle: "GST-Compliant Crypto Vault",
    tagline: "Secure your digital assets with Indian tax-compliance tracking. Calculate GST and track tax events autonomously.",
    features: [
      { title: "Tax Compliance Heuristics", desc: "Tracks the 30% Indian virtual asset tax structure on transactions automatically.", icon: "fa-solid fa-file-invoice-dollar" },
      { title: "Aadhaar e-KYC Vault", desc: "Integrates directly with sandbox e-KYC portals for fast client onboarding.", icon: "fa-solid fa-address-card" },
      { title: "Multi-Chain Hub", desc: "Monitor all token assets and wallet keys safely inside a single ledger.", icon: "fa-solid fa-vault" }
    ],
    ctaText: "Open Bharat Wallet",
    pricing: [
      { name: "SME Wallet", price: "₹0", desc: "Basic storage and tax logging.", list: ["1 Network", "GST reports", "Aadhaar authentication"] },
      { name: "Enterprise Vault", price: "₹1,499/mo", desc: "Full automation package.", list: ["Multi-chain", "Tax advisory console", "Priority Razorpay integration", "Auto GST filing support"] }
    ]
  },
  fitness: {
    title: "YogSana Core",
    subtitle: "Swadeshi Wellness Autopilot",
    tagline: "Discover ayurvedic wisdom. Personalized Yoga and meditation tracks aligned to your daily energy baseline.",
    features: [
      { title: "Ayurvedic Blueprints", desc: "Dietary suggestions tailored to your cellular dosha balances.", icon: "fa-solid fa-seedling" },
      { title: "Guided Pranayama", desc: "Calming audio and breathing indicators for cell repair and oxygen flows.", icon: "fa-solid fa-wind" },
      { title: "Prana Performance", desc: "Monitors hydration levels, active energy output, and rest baseline cycles.", icon: "fa-solid fa-spa" }
    ],
    ctaText: "Begin Pranayama",
    pricing: [
      { name: "Prana Free", price: "₹0", desc: "Basic dosha logging.", list: ["2 pranayama guides", "Water reminder", "General diet plan"] },
      { name: "Ayurveda Pro", price: "₹2,499/mo", desc: "Complete lifestyle autopilot.", list: ["Unlimited guides", "Custom dosha consultations", "Ayurvedic herbal planner", "Dedicated yoga therapist"] }
    ]
  },
  saas: {
    title: "Sahayak AI",
    subtitle: "Kirana & SME Support Agent",
    tagline: "Automate customer responses, resolve invoicing issues, and accept UPI orders directly via WhatsApp.",
    features: [
      { title: "WhatsApp Business API", desc: "Connects to active WhatsApp APIs to dispatch notifications with 95%+ open rates.", icon: "fa-brands fa-whatsapp" },
      { title: "Hinglish Support Engine", desc: "Answers user inquiries fluently in Hindi, English, and conversational Hinglish.", icon: "fa-solid fa-language" },
      { title: "Razorpay Auto-Pay Gate", desc: "Trigger UPI payments and capture automated subscription charges instantly.", icon: "fa-solid fa-indian-rupee-sign" }
    ],
    ctaText: "Automate Support Free",
    pricing: [
      { name: "Kirana Starter", price: "₹0", desc: "For local stores validating setups.", list: ["200 WhatsApp alerts/mo", "FAQ keyword matches", "UPI payment links"] },
      { name: "SME Sahayak", price: "₹5,999/mo", desc: "Complete customer support automation.", list: ["Unlimited messages", "GST invoicing automation", "Hinglish AI engine", "Dedicated support manager"] }
    ]
  }
};

// Vibe mapping logic
function selectVibeAndOutline(prompt) {
  const raw = prompt.toLowerCase();
  
  // 1. Pick Aesthetic
  let aesthetic = aesthetics.corporate; // Default
  if (raw.includes('cyber') || raw.includes('punk') || raw.includes('neon') || raw.includes('glitch') || raw.includes('black')) {
    aesthetic = aesthetics.cyberpunk;
  } else if (raw.includes('zen') || raw.includes('organic') || raw.includes('clean') || raw.includes('yoga') || raw.includes('relax') || raw.includes('nature') || raw.includes('calm') || raw.includes('sana')) {
    aesthetic = aesthetics.zen;
  } else if (raw.includes('retro') || raw.includes('synth') || raw.includes('sunset') || raw.includes('wave') || raw.includes('80s')) {
    aesthetic = aesthetics.retro;
  } else if (raw.includes('brutalist') || raw.includes('bold') || raw.includes('raw') || raw.includes('yellow') || raw.includes('industrial') || raw.includes('kirana')) {
    aesthetic = aesthetics.brutalist;
  }

  // 2. Pick Outline
  let outline = businessOutlines.saas; // Default
  if (raw.includes('coin') || raw.includes('crypto') || raw.includes('block') || raw.includes('vault') || raw.includes('web3') || raw.includes('chain') || raw.includes('wallet') || raw.includes('ledger')) {
    outline = businessOutlines.crypto;
  } else if (raw.includes('yoga') || raw.includes('health') || raw.includes('fitness') || raw.includes('sport') || raw.includes('spa') || raw.includes('wellness') || raw.includes('meditation') || raw.includes('sana')) {
    outline = businessOutlines.fitness;
  }

  return { aesthetic, outline };
}

// Generate the tailored CSS style injection for the page template
function getCustomStyles(aesthetic) {
  if (aesthetic.name.includes("Brutalist")) {
    return `
      .brutalist-border { border: 4px solid black !important; }
      .brutalist-shadow { box-shadow: 4px 4px 0px 0px rgba(0,0,0,1) !important; }
      .brutalist-shadow-lg { box-shadow: 8px 8px 0px 0px rgba(0,0,0,1) !important; }
    `;
  }
  if (aesthetic.name.includes("Cyberpunk")) {
    return `
      .neon-glow { text-shadow: 0 0 8px rgba(249,115,22,0.6); }
      .cyan-border-hover:hover { border-color: rgba(34,211,238,0.6) !important; }
    `;
  }
  return '';
}

// HTML Compiler Engine
function compileHTML(aesthetic, outline) {
  const fontLink = aesthetic.font.includes('serif') 
    ? '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,400&display=swap" rel="stylesheet">'
    : aesthetic.font.includes('mono')
      ? '<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">'
      : '<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">';

  const fontClass = aesthetic.font.includes('serif')
    ? "font-['Playfair_Display']"
    : aesthetic.font.includes('mono')
      ? "font-['JetBrains_Mono']"
      : "font-['Outfit']";

  const cardsMarkup = outline.features.map(f => `
    <div class="p-6 rounded-2xl ${aesthetic.cardBg} ${aesthetic.name.includes("Brutalist") ? 'brutalist-border brutalist-shadow' : ''} transition-all duration-300 hover:-translate-y-1">
      <div class="text-3xl mb-4 bg-gradient-to-r ${aesthetic.primary} bg-clip-text text-transparent w-fit">
        <i class="${f.icon}"></i>
      </div>
      <h3 class="text-xl font-bold mb-2">${f.title}</h3>
      <p class="opacity-80 text-sm leading-relaxed">${f.desc}</p>
    </div>
  `).join('');

  const pricingMarkup = outline.pricing.map(p => `
    <div class="p-8 rounded-3xl ${aesthetic.cardBg} ${aesthetic.name.includes("Brutalist") ? 'brutalist-border brutalist-shadow-lg' : 'shadow-lg'} flex flex-col justify-between">
      <div>
        <span class="px-3 py-1 rounded-full text-xs font-semibold uppercase ${aesthetic.badgeColor}">${p.name}</span>
        <h4 class="text-4xl font-extrabold mt-4 mb-2">${p.price}</h4>
        <p class="opacity-75 text-sm mb-6">${p.desc}</p>
        <ul class="space-y-3 mb-8">
          ${p.list.map(li => `<li class="flex items-center gap-2 text-sm"><i class="fa-solid fa-check text-green-500"></i> ${li}</li>`).join('')}
        </ul>
      </div>
      <button class="w-full py-3 rounded-xl font-bold transition-all duration-200 ${aesthetic.btnColor}">
        Select Plan
      </button>
    </div>
  `).join('');

  const bodyStyles = `${aesthetic.bg} ${aesthetic.text} ${fontClass} min-h-screen antialiased transition-colors duration-500`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${outline.title} — ${outline.subtitle}</title>
  <!-- Tailwind CSS Play CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- FontAwesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ${fontLink}
  <style>
    ${getCustomStyles(aesthetic)}
  </style>
</head>
<body class="${bodyStyles}">

  <!-- Navigation -->
  <nav class="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr ${aesthetic.primary} flex items-center justify-center text-white font-black text-xl shadow-md">
        ${outline.title[0]}
      </div>
      <span class="font-extrabold text-xl tracking-tight">${outline.title}</span>
    </div>
    <div class="hidden md:flex items-center gap-8 text-sm font-semibold opacity-90">
      <a href="#features" class="hover:opacity-100 transition-opacity">Features</a>
      <a href="#pricing" class="hover:opacity-100 transition-opacity">Pricing</a>
      <button class="px-5 py-2.5 rounded-xl font-bold transition-all duration-200 ${aesthetic.btnColor}">
        ${outline.ctaText}
      </button>
    </div>
  </nav>

  <!-- Hero Section -->
  <header class="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center flex flex-col items-center">
    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${aesthetic.badgeColor}">
      <span class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
      Swadeshi Live Build
    </div>
    
    <h1 class="text-4xl sm:text-6xl font-black max-w-4xl tracking-tight leading-[1.1] mb-6">
      <span class="bg-gradient-to-r ${aesthetic.primary} bg-clip-text text-transparent">
        ${outline.title}
      </span>
      <br> ${outline.subtitle}
    </h1>
    
    <p class="text-lg opacity-80 max-w-2xl mb-10 leading-relaxed">
      ${outline.tagline}
    </p>

    <div class="flex flex-col sm:flex-row gap-4">
      <button class="px-8 py-4 rounded-xl text-md font-bold transition-all duration-200 ${aesthetic.btnColor}">
        ${outline.ctaText} <i class="fa-solid fa-arrow-right ml-2"></i>
      </button>
      <button class="px-8 py-4 rounded-xl text-md font-bold border border-slate-500/20 hover:bg-slate-500/5 transition-all duration-200">
        Watch Live Demo
      </button>
    </div>
  </header>

  <!-- Features Grid -->
  <section id="features" class="max-w-6xl mx-auto px-6 py-16 border-t border-slate-500/10">
    <h2 class="text-3xl font-extrabold text-center mb-12">Designed to Solve Real-World Workflows</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      ${cardsMarkup}
    </div>
  </section>

  <!-- Pricing Cards -->
  <section id="pricing" class="max-w-5xl mx-auto px-6 py-20 border-t border-slate-500/10">
    <h2 class="text-3xl font-extrabold text-center mb-4">Pricing Models Tailored For Growth</h2>
    <p class="text-center opacity-70 mb-12 max-w-md mx-auto">Get started immediately on our sandbox tier, upgrade when scaling operations.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
      ${pricingMarkup}
    </div>
  </section>

  <!-- Footer -->
  <footer class="max-w-6xl mx-auto px-6 py-12 border-t border-slate-500/10 text-center">
    <p class="text-xs opacity-60">&copy; 2026 ${outline.title}. Generated instantly by Apex Bharat Engine.</p>
  </footer>

</body>
</html>`;
}

// Generate the customized strategy parameters localized for Indian market
function generateStrategy(aesthetic, outline) {
  let model = "UPI-based Subscription SaaS";
  let targetPersona = "Lean operations managers and Bengaluru startup builders seeking zero-overhead automation tools.";
  let checklist = [
    "Design 3 conversion-optimized Landing Pages matching target Swadeshi vibes.",
    "Set up automated WhatsApp notifications webhook loops via Decentro.",
    "Target B2B SME hubs and manufacturing clusters in Gurgaon, Noida, and Pune."
  ];

  if (aesthetic.name.includes("Cyberpunk")) {
    model = "Decentralized Gas Sharing / Token Integration";
    targetPersona = "Indian Web3 developers and tech hackathon participants looking for automated GST tax compliance modules.";
    checklist = [
      "Aesthetic rollout: Publish dark cyberpunk teasers showcasing the Aadhaar e-KYC integration.",
      "Deploy guerrilla launch loops across Indian crypto Telegram groups and tech Discord guilds.",
      "Partner with developers at top IIT/BITS campus hackathons."
    ];
  } else if (aesthetic.name.includes("Zen")) {
    model = "Premium Yoga Membership Packs";
    targetPersona = "Wellness seekers and organic food founders looking for active Yoga & Ayurveda scheduling platforms.";
    checklist = [
      "Establish earthy branding guidelines focusing on relaxing earth-tones and modern serif typography.",
      "Publish calm, organic video walk-throughs showcasing the YogSana calendar tools on Instagram.",
      "Partner with wellness wellness centers in Rishikesh, Goa, and Kerala for cross-promotional leads."
    ];
  } else if (aesthetic.name.includes("Retro")) {
    model = "One-Time Decentro License Fees";
    targetPersona = "Indie developers and nostalgic designers wanting retro Indian pixel-art asset templates.";
    checklist = [
      "Rollout an interactive Synthwave landing page dashboard for social sharing.",
      "Publish pixel art templates referencing classic Indian retro pop-culture on Gumroad/IndieHackers.",
      "Integrate decimals-free UPI fast payments checkout buttons."
    ];
  } else if (aesthetic.name.includes("Brutalist")) {
    model = "Pay-Per-Task Consumption Plan";
    targetPersona = "Design-forward product builders and high-intensity tech hackers demanding radical, bold interfaces.";
    checklist = [
      "Promote the project using heavy outline, raw high-contrast graphics on Indian dev subreddits and X.",
      "Release an open-source command-line tool accompanying the web dashboard.",
      "Host a fast-paced virtual building hackathon to seed community Kirana templates."
    ];
  }

  return { model, targetPersona, checklist };
}

// --- API ROUTES ---

// 1. Core Vibe-to-Code parser
app.post('/api/vibe', (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Vibe prompt is required." });
  }

  const { aesthetic, outline } = selectVibeAndOutline(prompt);
  const code = compileHTML(aesthetic, outline);
  
  res.json({
    aesthetic: aesthetic.name,
    techStack: [
      "Next.js 14 (App Router)", 
      "Tailwind CSS v3.4", 
      "FontAwesome Icons v6.4", 
      "Google Fonts: " + (aesthetic.font.includes('serif') ? 'Playfair Display' : aesthetic.font.includes('mono') ? 'JetBrains Mono' : 'Outfit')
    ],
    palette: aesthetic.palette,
    wireframeSchema: {
      framework: "Responsive Grid Layout",
      sections: ["Navigation", "Hero Segment", "Features Section", "Pricing Plans", "Footer Grid"]
    },
    code: code
  });
});

// 2. Business Strategy Engine
app.post('/api/strategy', (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Vibe prompt is required." });
  }

  const { aesthetic, outline } = selectVibeAndOutline(prompt);
  const strategy = generateStrategy(aesthetic, outline);

  res.json(strategy);
});

// 3. GitHub/Vercel Launch Deploy API
app.post('/api/deploy', (req, res) => {
  const { code, prompt } = req.body;
  if (!code) {
    return res.status(400).json({ error: "Code content is required for deployment." });
  }

  // Simulate repository build ID
  const deployId = Math.random().toString(36).substring(2, 9);
  
  res.json({
    success: true,
    repoUrl: `https://github.com/apex-agent/vibe-to-code-${deployId}`,
    deploymentUrl: `https://vibe-to-code-${deployId}.vercel.app`,
    instructions: [
      "Initialized Git workspace in Indian edge region.",
      `Created GitHub Repository: apex-agent/vibe-to-code-${deployId}`,
      "Committed compiled index.html to branch 'main'.",
      "Pushed source files to GitHub via API wrapper.",
      "Configured Vercel hook and triggered edge function compilation.",
      "Edge deploy finalized. Project online."
    ]
  });
});

// Export the app for Vercel Serverless Functions
module.exports = app;

// Start listening if run directly (local mode)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[APEX SERVER] Running at http://localhost:${PORT}`);
  });
}
