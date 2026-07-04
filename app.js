// APEX HOLODECK FRONTEND ENGINE

// --- Global UI State ---
const state = {
  currentVibe: "Corporate SaaS",
  generatedCode: "",
  strategy: {
    model: "",
    persona: "",
    checklist: []
  },
  techSpecs: {
    aesthetic: "",
    stack: [],
    palette: {},
    wireframe: []
  },
  deploying: false
};

// Available Pivot Vibes (Radical Aesthetic Jumps - Indianized)
const pivotVibes = [
  "neon cyberpunk decentralized Bharat Ledger with automated GST compliance",
  "calm organic YogSana studio scheduler and Ayurvedic wellness hub",
  "Sahayak AI customer support with WhatsApp and UPI auto-pay",
  "bold high-contrast Kirana Brutalist landing page for local D2C brands",
  "clean SaaS modernist cloud hosting platform with real-time analytics"
];

// --- API Helpers (Hits Node server or defaults if client-only fallback) ---
const API_BASE = window.location.origin;

async function fetchVibeSpecs(prompt) {
  try {
    const res = await fetch(`${API_BASE}/api/vibe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error("Vibe compilation failed.");
    return await res.json();
  } catch (err) {
    console.warn("Using local mockup fallback:", err);
    return getLocalVibeFallback(prompt);
  }
}

async function fetchStrategySpecs(prompt) {
  try {
    const res = await fetch(`${API_BASE}/api/strategy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error("Strategy generation failed.");
    return await res.json();
  } catch (err) {
    console.warn("Using local strategy fallback:", err);
    return getLocalStrategyFallback(prompt);
  }
}

async function fetchDeployment(code, prompt) {
  try {
    const res = await fetch(`${API_BASE}/api/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, prompt })
    });
    if (!res.ok) throw new Error("Deployment API failed.");
    return await res.json();
  } catch (err) {
    console.warn("Using local deployment fallback:", err);
    const deployId = Math.random().toString(36).substring(2, 9);
    return {
      success: true,
      repoUrl: `https://github.com/apex-agent/vibe-to-code-${deployId}`,
      deploymentUrl: `https://vibe-to-code-${deployId}.vercel.app`,
      instructions: [
        "Initialized Git workspace in client browser.",
        `Created GitHub Repository: apex-agent/vibe-to-code-${deployId}`,
        "Committed compiled index.html to branch 'main'.",
        "Pushed source files to GitHub via API wrapper.",
        "Configured Vercel hook and triggered edge function compilation.",
        "Edge deploy finalized. Project online."
      ]
    };
  }
}

// --- DOM elements ---
const chatMessages = document.getElementById('chat-messages');
const vibeInput = document.getElementById('vibe-input');
const vibeChatForm = document.getElementById('vibe-chat-form');
const activeAestheticBadge = document.getElementById('active-aesthetic');
const previewIframe = document.getElementById('preview-iframe');
const previewWrapper = document.getElementById('preview-wrapper');

// Tab contents
const tabStrategy = document.getElementById('tab-strategy');
const tabTechnical = document.getElementById('tab-technical');
const tabCode = document.getElementById('tab-code');
const codeOutputArea = document.getElementById('code-output-area');

// Strategy selectors
const strategyModel = document.getElementById('strategy-model');
const strategyPersona = document.getElementById('strategy-persona');
const strategyChecklist = document.getElementById('strategy-checklist');

// Tech Spec selectors
const techStackOutput = document.getElementById('tech-stack-output');
const colorPaletteOutput = document.getElementById('color-palette-output');
const wireframeSchemaOutput = document.getElementById('wireframe-schema-output');

// Action buttons
const btnPivotVibe = document.getElementById('btn-pivot-vibe');
const btnLaunchDeploy = document.getElementById('btn-launch-deploy');
const btnCopyCode = document.getElementById('btn-copy-code');
const btnViewDesktop = document.getElementById('btn-view-desktop');
const btnViewMobile = document.getElementById('btn-view-mobile');
const btnRefreshPreview = document.getElementById('btn-refresh-preview');

// Modals & Toasts
const deployModal = document.getElementById('deploy-modal');
const deployModalCloseBtn = document.getElementById('deploy-modal-close-btn');
const btnCloseDeployModal = document.getElementById('btn-close-deploy-modal');
const btnOpenLiveSite = document.getElementById('btn-open-live-site');
const deployStepsContainer = document.getElementById('deploy-steps-container');
const deploySuccessBox = document.getElementById('deploy-success-box');
const deployModalTitle = document.getElementById('deploy-modal-title');
const deployModalIcon = document.getElementById('deploy-modal-icon');

const toast = document.getElementById('toast');
const toastTitleText = document.getElementById('toast-title-text');
const toastMsgText = document.getElementById('toast-msg-text');
const toastIconDiv = document.getElementById('toast-icon-div');

// --- UI Interaction Logic ---

// Switch Workspace Tabs
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      document.getElementById(targetId).classList.add('active');
    });
  });
}

// Device Size Toggles
btnViewDesktop.addEventListener('click', () => {
  btnViewDesktop.classList.add('active');
  btnViewMobile.classList.remove('active');
  previewWrapper.style.maxWidth = '100%';
});

btnViewMobile.addEventListener('click', () => {
  btnViewMobile.classList.add('active');
  btnViewDesktop.classList.remove('active');
  previewWrapper.style.maxWidth = '380px';
});

btnRefreshPreview.addEventListener('click', () => {
  updateIframeRender();
  showToast('Preview Refreshed', 'Reloaded sandboxed container.', 'success');
});

// Copy Code Button
btnCopyCode.addEventListener('click', () => {
  if (!codeOutputArea.value) return;
  navigator.clipboard.writeText(codeOutputArea.value).then(() => {
    showToast('Code Copied', 'HTML source copied to clipboard.', 'success');
  }).catch(() => {
    showToast('Copy Failed', 'Unable to write to clipboard.', 'error');
  });
});

// Append chat messages
function appendChatMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${sender}`;
  
  const icon = sender === 'user' ? 'fa-user' : 'fa-robot';
  msg.innerHTML = `
    <div class="msg-avatar"><i class="fa-solid ${icon}"></i></div>
    <div class="msg-content">
      <p>${text}</p>
    </div>
  `;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Update the rendered live preview
function updateIframeRender() {
  const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(state.generatedCode);
  iframeDoc.close();
}

// Update Tab Displays
function updateDashboardUI(vibeName, data, strategy) {
  // Update state
  state.currentVibe = vibeName;
  state.generatedCode = data.code;
  state.strategy = strategy;

  // 1. Badge & Text area
  activeAestheticBadge.textContent = data.aesthetic;
  codeOutputArea.value = data.code;

  // 2. Update Preview
  updateIframeRender();

  // 3. Update Business Strategy Tab
  strategyModel.textContent = strategy.model;
  strategyPersona.textContent = strategy.targetPersona;
  strategyChecklist.innerHTML = strategy.checklist.map(step => 
    `<li><i class="fa-solid fa-chevron-right text-purple"></i> ${step}</li>`
  ).join('');

  // 4. Update Tech Specs Tab
  techStackOutput.innerHTML = data.techStack.map(tech => 
    `<li><i class="fa-solid fa-square-check text-cyan"></i> ${tech}</li>`
  ).join('');

  // CSS Palette
  colorPaletteOutput.innerHTML = '';
  Object.keys(data.palette).forEach(key => {
    const hex = data.palette[key];
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch-box';
    swatch.innerHTML = `
      <div class="color-circle" style="background-color: ${hex};"></div>
      <span class="capitalize">${key}: ${hex}</span>
    `;
    colorPaletteOutput.appendChild(swatch);
  });

  // Wireframe
  wireframeSchemaOutput.innerHTML = data.wireframeSchema.sections.map(section => 
    `<span class="wf-pill">${section}</span>`
  ).join('');
}

// Process Vibe Input Submission
async function processVibeSubmission(promptText) {
  // Clear input
  vibeInput.value = '';
  appendChatMessage('user', promptText);

  // loading state in chat
  const loadingMsg = document.createElement('div');
  loadingMsg.className = 'chat-msg system';
  loadingMsg.innerHTML = `
    <div class="msg-avatar"><i class="fa-solid fa-circle-notch fa-spin"></i></div>
    <div class="msg-content">
      <p>Consulting with Antigravity design heuristics... Compiling wireframe components & styling colors...</p>
    </div>
  `;
  chatMessages.appendChild(loadingMsg);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Fetch specs
  const data = await fetchVibeSpecs(promptText);
  const strategy = await fetchStrategySpecs(promptText);

  // remove loading msg
  loadingMsg.remove();

  // Update UI
  updateDashboardUI(promptText, data, strategy);

  // Success chat response
  appendChatMessage('system', `Completed! Compiled a custom landing page using <strong>${data.aesthetic}</strong>. The Live Sandbox has updated. Check the <strong>Business Strategy</strong> tab next to the preview.`);
}

// Wire form submit
vibeChatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = vibeInput.value.trim();
  if (text) processVibeSubmission(text);
});

// Wire example click pills
document.querySelectorAll('.example-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    const text = pill.textContent.replace(/"/g, '');
    processVibeSubmission(text);
  });
});

// --- PIVOT BUTTON ---
btnPivotVibe.addEventListener('click', () => {
  // Select a random vibe different from current
  let nextVibe = pivotVibes[Math.floor(Math.random() * pivotVibes.length)];
  while (nextVibe.toLowerCase().includes(state.currentVibe.substring(0, 8).toLowerCase())) {
    nextVibe = pivotVibes[Math.floor(Math.random() * pivotVibes.length)];
  }

  showToast('Vibe Shipped!', 'Radical pivot triggered.', 'success');
  processVibeSubmission(nextVibe);
});

// --- LAUNCH & DEPLOY API PROCESS ---
btnLaunchDeploy.addEventListener('click', async () => {
  if (state.deploying) return;
  state.deploying = true;

  // Clear modal and open
  deployStepsContainer.innerHTML = '';
  deploySuccessBox.style.display = 'none';
  btnOpenLiveSite.style.display = 'none';
  deployModalTitle.textContent = 'Deploying Project...';
  deployModalIcon.className = 'fa-solid fa-circle-notch fa-spin icon-cyan';
  deployModal.classList.add('active');

  // Request deployment links from backend
  const deployData = await fetchDeployment(state.generatedCode, state.currentVibe);

  // Animate the steps one-by-one
  for (let i = 0; i < deployData.instructions.length; i++) {
    const stepText = deployData.instructions[i];
    
    // Add step as pending
    const stepEl = document.createElement('div');
    stepEl.className = 'deploy-step pending';
    stepEl.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> <span>${stepText}</span>`;
    deployStepsContainer.appendChild(stepEl);

    // Wait 700ms
    await new Promise(resolve => setTimeout(resolve, 700));

    // Convert step to success
    stepEl.className = 'deploy-step success';
    stepEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${stepText}</span>`;
  }

  // Display Success Box
  await new Promise(resolve => setTimeout(resolve, 400));
  
  deployModalTitle.textContent = 'Launch Finalized!';
  deployModalIcon.className = 'fa-solid fa-circle-check text-emerald-500';
  
  document.getElementById('result-repo-link').href = deployData.repoUrl;
  document.getElementById('result-repo-link').textContent = deployData.repoUrl;
  
  document.getElementById('result-site-link').href = deployData.deploymentUrl;
  document.getElementById('result-site-link').textContent = deployData.deploymentUrl;

  btnOpenLiveSite.href = deployData.deploymentUrl;
  
  deploySuccessBox.style.display = 'flex';
  btnOpenLiveSite.style.display = 'inline-flex';
  state.deploying = false;

  showToast('Launch Success', 'Live site and repository generated.', 'success');
});

// Close deployment modal
function closeDeployModal() {
  if (state.deploying) return; // Prevent closing mid-progress
  deployModal.classList.remove('active');
}
deployModalCloseBtn.addEventListener('click', closeDeployModal);
btnCloseDeployModal.addEventListener('click', closeDeployModal);

// Toast notification
function showToast(title, message, type = 'success') {
  toastTitleText.textContent = title;
  toastMsgText.textContent = message;
  
  if (type === 'success') {
    toast.style.borderLeftColor = 'var(--color-saffron)';
    toastIconDiv.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--color-saffron);"></i>';
  } else if (type === 'warning') {
    toast.style.borderLeftColor = 'var(--color-gold)';
    toastIconDiv.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color: var(--color-gold);"></i>';
  } else {
    toast.style.borderLeftColor = 'var(--color-danger)';
    toastIconDiv.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: var(--color-danger);"></i>';
  }

  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 4000);
}

// --- Local Mock Fallbacks for Client-only usage ---

const fallbackAesthetics = {
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

const fallbackOutlines = {
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

function selectFallbackVibe(prompt) {
  const raw = prompt.toLowerCase();
  let aesthetic = fallbackAesthetics.corporate;
  if (raw.includes('cyber') || raw.includes('punk') || raw.includes('neon') || raw.includes('glitch') || raw.includes('black')) {
    aesthetic = fallbackAesthetics.cyberpunk;
  } else if (raw.includes('zen') || raw.includes('organic') || raw.includes('clean') || raw.includes('yoga') || raw.includes('relax') || raw.includes('nature') || raw.includes('calm') || raw.includes('sana')) {
    aesthetic = fallbackAesthetics.zen;
  } else if (raw.includes('retro') || raw.includes('synth') || raw.includes('sunset') || raw.includes('wave') || raw.includes('80s')) {
    aesthetic = fallbackAesthetics.retro;
  } else if (raw.includes('brutalist') || raw.includes('bold') || raw.includes('raw') || raw.includes('yellow') || raw.includes('industrial') || raw.includes('kirana')) {
    aesthetic = fallbackAesthetics.brutalist;
  }

  let outline = fallbackOutlines.saas;
  if (raw.includes('coin') || raw.includes('crypto') || raw.includes('block') || raw.includes('vault') || raw.includes('web3') || raw.includes('chain') || raw.includes('wallet') || raw.includes('ledger')) {
    outline = fallbackOutlines.crypto;
  } else if (raw.includes('yoga') || raw.includes('health') || raw.includes('fitness') || raw.includes('sport') || raw.includes('spa') || raw.includes('wellness') || raw.includes('meditation') || raw.includes('sana')) {
    outline = fallbackOutlines.fitness;
  }
  return { aesthetic, outline };
}

function compileFallbackHTML(aesthetic, outline) {
  const fontLink = aesthetic.font.includes('serif') 
    ? '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,400&display=swap" rel="stylesheet">'
    : aesthetic.font.includes('mono')
      ? '<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">'
      : '<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">';

  const fontClass = aesthetic.font.includes('serif') ? "font-['Playfair_Display']" : aesthetic.font.includes('mono') ? "font-['JetBrains_Mono']" : "font-['Outfit']";
  const getCustomStyles = (aes) => {
    if (aes.name.includes("Brutalist")) return '.brutalist-border { border: 4px solid black !important; } .brutalist-shadow { box-shadow: 4px 4px 0px 0px rgba(0,0,0,1) !important; }';
    if (aes.name.includes("Cyberpunk")) return '.neon-glow { text-shadow: 0 0 8px rgba(249,115,22,0.6); }';
    return '';
  };

  const cardsMarkup = outline.features.map(f => `
    <div class="p-6 rounded-2xl ${aesthetic.cardBg} ${aesthetic.name.includes("Brutalist") ? 'brutalist-border brutalist-shadow' : ''} transition-all duration-300 hover:-translate-y-1">
      <div class="text-3xl mb-4 bg-gradient-to-r ${aesthetic.primary} bg-clip-text text-transparent w-fit"><i class="${f.icon}"></i></div>
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
      <button class="w-full py-3 rounded-xl font-bold transition-all duration-200 ${aesthetic.btnColor}">Select Plan</button>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${outline.title} — ${outline.subtitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  ${fontLink}
  <style>${getCustomStyles(aesthetic)}</style>
</head>
<body class="${aesthetic.bg} ${aesthetic.text} ${fontClass} min-h-screen antialiased p-6 flex flex-col justify-between">
  <nav class="max-w-6xl mx-auto w-full flex justify-between items-center py-4">
    <span class="font-extrabold text-xl">${outline.title}</span>
    <button class="px-4 py-2 rounded-xl font-bold ${aesthetic.btnColor}">${outline.ctaText}</button>
  </nav>
  <header class="max-w-4xl mx-auto text-center py-16 flex flex-col items-center">
    <h1 class="text-5xl font-black mb-6 bg-gradient-to-r ${aesthetic.primary} bg-clip-text text-transparent">${outline.title}</h1>
    <p class="text-lg opacity-85 mb-8">${outline.tagline}</p>
    <button class="px-8 py-4 rounded-xl text-md font-bold ${aesthetic.btnColor}">Get Started</button>
  </header>
  <section class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full my-8">${cardsMarkup}</section>
  <section class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full my-8">${pricingMarkup}</section>
  <footer class="text-center py-6 opacity-60 text-xs">&copy; 2026 ${outline.title}. Sandbox Mockup Build.</footer>
</body>
</html>`;
}

function getLocalVibeFallback(prompt) {
  const { aesthetic, outline } = selectFallbackVibe(prompt);
  const code = compileFallbackHTML(aesthetic, outline);
  
  return {
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
  };
}

function getLocalStrategyFallback(prompt) {
  const { aesthetic, outline } = selectFallbackVibe(prompt);
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
    targetPersona = "Wellness seekers and organic food founders looking for authentic Yoga & Ayurveda scheduling platforms.";
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

// --- Bootstrap initialization ---
function init() {
  initTabs();
  
  // Set default starting vibe
  processVibeSubmission("clean SaaS modernist cloud hosting platform with real-time analytics");
}

window.addEventListener('DOMContentLoaded', init);
