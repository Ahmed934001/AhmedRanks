/* ==========================================================================
   AHMED RANKS — chatbot.js
   "RankBot": a rule-based conversion chatbot.
   • Suggested chips adapt to the visitor's revealed preference (state machine)
   • Built-in marketing logic: anchoring, scarcity, social proof, loss
     aversion, reciprocity & objection handling
   • Conversation always ends with the mandated support hand-off message
     + a tap-to-call customer-support button
   ========================================================================== */
(function () {
  "use strict";

  const TEL = "+923343706275";
  const WA  = "923343706275";

  /* ----------------------------- DOM refs ------------------------------ */
  const launcher = document.getElementById("chatLauncher");
  const win      = document.getElementById("chatWindow");
  const body     = document.getElementById("chatBody");
  const chipsRow = document.getElementById("chatChips");
  const input    = document.getElementById("chatInput");
  const sendBtn  = document.getElementById("chatSend");
  const teaser   = document.getElementById("chatTeaser");
  const badge    = document.getElementById("chatBadge");

  if (!launcher || !win) return;

  /* ----------------------------- state --------------------------------- */
  const state = {
    opened: false,
    ended: false,
    topic: null,          // current revealed preference
    stage: 0,             // depth of conversation on current topic
    name: null,
    objections: 0,
    unread: 0
  };

  /* --------------------------- helpers --------------------------------- */
  const now = () => new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" });
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function scrollDown() { body.scrollTop = body.scrollHeight; }

  function addMsg(text, who = "bot") {
    const div = document.createElement("div");
    div.className = `msg msg-${who}`;
    div.innerHTML = `${text}<time>${now()}</time>`;
    body.appendChild(div);
    scrollDown();
    return div;
  }

  function addTyping() {
    const div = document.createElement("div");
    div.className = "msg msg-bot typing";
    div.innerHTML = "<span></span><span></span><span></span>";
    body.appendChild(div);
    scrollDown();
    return div;
  }

  function botSay(text, chips, delay) {
    const wait = delay ?? Math.min(450 + text.length * 9, 1900);
    const t = addTyping();
    setTimeout(() => {
      t.remove();
      addMsg(text, "bot");
      if (chips) setChips(chips);
      if (!state.opened) { state.unread++; badge && (badge.textContent = state.unread); badge && (badge.style.display = "grid"); }
    }, wait);
  }

  /* Render adaptive suggestion chips */
  function setChips(list) {
    chipsRow.innerHTML = "";
    if (state.ended) return;
    list.forEach((c) => {
      const b = document.createElement("button");
      b.className = "chip" + (c.end ? " chip-end" : "");
      b.type = "button";
      b.textContent = c.label;
      b.addEventListener("click", () => {
        if (c.end) { endConversation(); return; }
        userSay(c.label);
        route(c.intent || c.label, c);
      });
      chipsRow.appendChild(b);
    });
    /* Persistent escape hatches: end chat OR jump to human */
    const end = document.createElement("button");
    end.className = "chip chip-end"; end.type = "button";
    end.textContent = "🔚 End conversation";
    end.addEventListener("click", endConversation);
    chipsRow.appendChild(end);
    scrollDown();
  }

  /* ------------------------- open / close ------------------------------ */
  function openChat() {
    state.opened = true;
    win.classList.add("open");
    launcher.classList.add("open");
    launcher.setAttribute("aria-expanded", "true");
    teaser && teaser.classList.remove("show");
    badge && (badge.style.display = "none");
    if (body.children.length === 0) greet();
    setTimeout(() => input && input.focus(), 450);
  }
  function closeChat() {
    state.opened = false;
    win.classList.remove("open");
    launcher.classList.remove("open");
    launcher.setAttribute("aria-expanded", "false");
  }
  launcher.addEventListener("click", () => (state.opened ? closeChat() : openChat()));
  document.getElementById("chatClose")?.addEventListener("click", closeChat);

  /* Proactive teaser after 6s (reciprocity hook: free audit) */
  setTimeout(() => {
    if (!state.opened && teaser) {
      teaser.classList.add("show");
      setTimeout(() => teaser.classList.remove("show"), 12000);
    }
  }, 6000);
  teaser?.addEventListener("click", (e) => { if (e.target.tagName !== "BUTTON") openChat(); });
  teaser?.querySelector("button")?.addEventListener("click", () => teaser.classList.remove("show"));

  /* --------------------------- greeting -------------------------------- */
  function greet() {
    addMsg("Assalam-o-Alaikum! 👋 I'm <b>RankBot</b>, Ahmed Ranks' growth assistant. I can quote prices, audit your brand, or book you a free strategy call — all in 60 seconds.", null);
    botSay("So I can tailor everything, what's your #1 goal right now? 🎯", [
      { label: "🚀 More sales & leads", intent: "leads" },
      { label: "🌐 I need a website", intent: "website" },
      { label: "📈 Rank on Google (SEO)", intent: "seo" },
      { label: "💼 Fix my LinkedIn profile", intent: "linkedin" },
      { label: "💰 See pricing", intent: "price" }
    ], 900);
  }

  /* --------------------- intent knowledge base -------------------------
     Every reply carries marketing logic + chips that adapt to the user's
     revealed preference (state.topic).                                */
  const INTENTS = {
    leads: {
      topic: "leads",
      reply: () => "Smart choice — revenue first, vanity metrics later. 💪 We run <b>performance marketing</b>: Meta + Google ads, landing pages and lead funnels engineered per lead-cost, not per 'like'.<br><br>📊 Current clients average a <b>3.8× return on ad spend</b> within 90 days. One Karachi clothing brand went from 11 to 67 orders/week in a single sprint.",
      chips: () => [
        { label: "💰 What does it cost?", intent: "price" },
        { label: "🧮 Show me the ROI math", intent: "roi" },
        { label: "🎁 Book my free audit", intent: "audit" }
      ]
    },
    website: {
      topic: "website",
      reply: () => "Excellent — your website is your only employee that never sleeps. 🌐 We build <b>fast, SEO-ready WordPress & custom sites</b> with glass-smooth UI, mobile-first layouts and conversion wiring (WhatsApp, forms, tracking).<br><br>⚡ Delivery in <b>7–14 days</b>, including on-page SEO, security and a training video so you're never dependent on anyone.",
      chips: () => [
        { label: "💰 Website packages & price", intent: "price" },
        { label: "🖼️ Show me your work", intent: "portfolio" },
        { label: "🎁 Free audit of my current site", intent: "audit" }
      ]
    },
    seo: {
      topic: "seo",
      reply: () => "Now we're talking long-term wealth. 📈 Our <b>SEO sprints</b> fix technical issues, build keyword clusters (like 'digital marketing agency in Karachi') and earn authority links — so Google sends you buyers while you sleep.<br><br>🔍 Typical trajectory: page 3 → page 1 in <b>90–120 days</b> for local commercial keywords.",
      chips: () => [
        { label: "🧰 What's included in SEO?", intent: "seo_scope" },
        { label: "💰 SEO pricing", intent: "price" },
        { label: "🎁 Free keyword-gap audit", intent: "audit" }
      ]
    },
    linkedin: {
      topic: "linkedin",
      reply: () => "Underrated goldmine. 💼 Our <b>LinkedIn Profile Optimization</b> service rewrites your headline into a client-magnet, rebuilds the About section with sales psychology, and designs a banner + featured section that closes deals before the first call.<br><br>🎯 Optimized profiles see up to <b>5× more recruiter & client inbound</b> in 30 days.",
      chips: () => [
        { label: "✅ What exactly do you optimize?", intent: "li_scope" },
        { label: "💰 LinkedIn optimization price", intent: "price" },
        { label: "🚀 I want it — start now", intent: "buy" }
      ]
    },
    price: {
      topic: "price",
      reply: () => "Transparent pricing — no hidden surprises: 🧾<br>• <b>Launchpad</b> — PKR 45,000/mo (starter growth)<br>• <b>Momentum</b> — PKR 95,000/mo (most chosen: ads + social + SEO)<br>• <b>Market Leader</b> — PKR 1,85,000/mo (full-funnel domination)<br>• One-off: websites from <b>PKR 60,000</b>, LinkedIn optimization <b>PKR 25,000</b>.<br><br>⏳ Founding-client <b>30% OFF</b> expires with the countdown on this page — after that, standard rates apply.",
      chips: () => [
        { label: "🏆 What's in Momentum?", intent: "momentum" },
        { label: "😬 Seems expensive…", intent: "expensive" },
        { label: "🔥 Claim 30% OFF now", intent: "buy" }
      ]
    },
    roi: {
      topic: "leads",
      reply: () => "Let's do restaurant math, not agency math: 🧮<br>If one new client is worth <b>PKR 50,000</b> to you, and our funnels bring even <b>4 clients/month</b>, that's PKR 200,000 against a PKR 95,000 retainer → <b>2.1× ROI in month one</b>, compounding after. Clients staying 6+ months average <b>3.8×</b>.<br><br>The real question: what is <i>not</i> showing up on Google costing you right now?",
      chips: () => [
        { label: "🔥 OK — let's start", intent: "buy" },
        { label: "🎁 Free audit first", intent: "audit" },
        { label: "💰 Compare packages", intent: "price" }
      ]
    },
    seo_scope: {
      topic: "seo",
      reply: () => "Full-stack SEO, sprint by sprint: 🧰<br>1️⃣ Technical audit + Core Web Vitals fixes<br>2️⃣ Keyword architecture (primary + secondary + local)<br>3️⃣ On-page & content optimization<br>4️⃣ Authority backlinks + digital PR<br>5️⃣ Monthly report in plain English — rankings, traffic, leads, revenue.<br><br>You always know what we did and what it earned.",
      chips: () => [
        { label: "💰 SEO pricing", intent: "price" },
        { label: "🔥 Start my SEO sprint", intent: "buy" },
        { label: "🧮 ROI math please", intent: "roi" }
      ]
    },
    li_scope: {
      topic: "linkedin",
      reply: () => "The complete makeover: ✅ Headline & tagline rewritten as a positioning statement · ✅ About section with proof & CTA · ✅ Experience bullets reframed as results · ✅ Banner + profile design in your brand colors · ✅ Featured-section funnel (lead magnet, calendar, portfolio) · ✅ 30-day content starter plan + DM scripts.<br><br>Delivered in <b>5 working days</b>.",
      chips: () => [
        { label: "🚀 Optimize my LinkedIn", intent: "buy" },
        { label: "💰 Price?", intent: "price" },
        { label: "🖼️ See examples", intent: "portfolio" }
      ]
    },
    momentum: {
      topic: "price",
      reply: () => "🏆 <b>Momentum</b> is our best-seller because it removes every bottleneck at once:<br>• 12 social posts + 8 stories/mo<br>• Meta + Google ads management (up to PKR 300k ad spend)<br>• On-page SEO + 2 blog articles<br>• Landing page + funnel tweaks<br>• Weekly WhatsApp performance standup (yes, like a Scrum call 😉)<br><br>Normally PKR 95,000 — <b>PKR 66,500</b> with the founding discount.",
      chips: () => [
        { label: "🔥 Lock my 30% OFF", intent: "buy" },
        { label: "⏳ How fast can we start?", intent: "timeline" },
        { label: "🤔 Still comparing…", intent: "later" }
      ]
    },
    audit: {
      topic: "audit",
      reply: () => "Love it — the audit is free and brutally honest. 🎁 In 24 hours you'll get:<br>• Your top 10 money keywords & who ranks for them<br>• 5 conversion leaks on your site/socials<br>• A 90-day growth roadmap (yours to keep, no strings)<br><br>Only <b>5 audits</b> are opened per week so each gets real senior eyes. Want me to reserve one?",
      chips: () => [
        { label: "✅ Yes, reserve my audit", intent: "buy" },
        { label: "💬 Ask on WhatsApp instead", intent: "whatsapp" },
        { label: "💰 See pricing meanwhile", intent: "price" }
      ]
    },
    portfolio: {
      reply: () => "Proof over promises: 🖼️ We've scaled a digital publisher to <b>150+ clients & 15+ deliveries/month</b>, shipped <b>20 export-grade manufacturing projects</b> at 100% QC pass, and taken local brands to page 1. The full case studies with numbers live on our <a href='portfolio.html' style='color:#C082FF;font-weight:700'>Portfolio page</a>.",
      chips: () => [
        { label: "🔥 Impressive — let's talk", intent: "buy" },
        { label: "🎁 Free audit first", intent: "audit" },
        { label: "💰 Pricing", intent: "price" }
      ]
    },
    timeline: {
      topic: state.topic,
      reply: () => "Fast is a feature: ⏱️ Kickoff within <b>48 hours</b> of signing. Websites live in 7–14 days, ads generating data in week 1, SEO compounding from week 4. We run weekly sprints with a shared board — you'll see progress move like a product team, not an agency black box.",
      chips: () => [
        { label: "🚀 Start within 48h", intent: "buy" },
        { label: "💰 Pricing recap", intent: "price" }
      ]
    },
    expensive: {
      topic: "price",
      reply: () => "Fair objection — let's reframe it. 💡 A hired marketer costs PKR 80–120k/month <i>before</i> tools, training or management. An agency team (strategist + designer + developer + media buyer) for the same price is not a cost, it's a discount.<br><br>And if budget is truly tight right now: start with <b>Launchpad (PKR 45k)</b> or the one-off <b>LinkedIn optimization (PKR 25k)</b>, prove ROI, then upgrade. Zero pressure — just don't stay invisible. 🙏",
      chips: () => [
        { label: "🌱 Start with Launchpad", intent: "buy" },
        { label: "💼 Just LinkedIn for now", intent: "buy" },
        { label: "🧮 Show ROI math", intent: "roi" }
      ]
    },
    later: {
      topic: state.topic,
      reply: () => "Totally understand — timing matters. ⏳ Just know this: every week offline, your competitors collect the clicks, leads and reviews you could have owned. October has <b>2 onboarding slots left</b>, and the 30% founding discount ends with the countdown above.<br><br>Compromise? Take the <b>free audit</b> now, decide with data later. I'll hold your file either way. 🤝",
      chips: () => [
        { label: "🎁 OK — free audit", intent: "audit" },
        { label: "🔒 Hold my slot", intent: "buy" },
        { label: "📞 Talk to a human", intent: "human" }
      ]
    },
    whatsapp: {
      topic: state.topic,
      reply: () => "Done! Opening WhatsApp with your context pre-filled so you never repeat yourself… 📲",
      action: () => window.open(`https://wa.me/${WA}?text=${encodeURIComponent("Assalam-o-Alaikum Ahmed Ranks! I chatted with RankBot and I'd like a free growth audit.")}`, "_blank", "noopener")
    },
    human: {
      topic: state.topic,
      reply: () => "Of course — a senior strategist (not a bot!) will call you. 📞 Tap below and we'll pick up between 9am–9pm, Mon–Sat.",
      renderCall: true
    },
    buy: {
      topic: state.topic,
      reply: () => "🎉 Fantastic decision — welcome aboard! I'm handing you to our onboarding team with everything you told me attached. Two fast options:<br>• <b>WhatsApp onboarding</b> (fastest, ~2 min)<br>• <b>Call us now</b> on 0334 3706275<br><br>Your 30% founding discount is locked for the next 24 hours. 🔒",
      action: () => { window.ARConfetti && window.ARConfetti.celebrate(); },
      chips: () => [
        { label: "📲 WhatsApp onboarding", intent: "whatsapp" },
        { label: "📞 Call & start now", intent: "human" }
      ]
    },
    thanks: { reply: () => "Anytime! 🤗 Shukria for trusting Ahmed Ranks with your growth. Anything else I can help with?", chips: () => [{ label: "🚀 More sales & leads", intent: "leads" }, { label: "💰 Pricing", intent: "price" }, { label: "🎁 Free audit", intent: "audit" }] },
    greet:  { reply: () => "Walaikum-Assalam! 😊 Great to meet you. I'm RankBot — tell me your goal and I'll map the fastest route to it.", chips: () => [{ label: "🚀 More sales & leads", intent: "leads" }, { label: "🌐 I need a website", intent: "website" }, { label: "📈 Rank on Google", intent: "seo" }, { label: "💰 Pricing", intent: "price" }] }
  };

  /* ------------------------- routing (NLU-lite) ------------------------ */
  function detectIntent(raw) {
    const t = raw.toLowerCase();
    if (/(assalam|salam|^hi|^hello|hey|aoa)/.test(t)) return "greet";
    if (/(thank|shukria|shukriya|great|awesome)/.test(t)) return "thanks";
    if (/(price|cost|fee|package|budget|rate|charge|kitna|pricing)/.test(t)) return "price";
    if (/(expensive|mehnga|costly|afford)/.test(t)) return "expensive";
    if (/(later|think|soch|compare|not sure|maybe)/.test(t)) return "later";
    if (/(website|site|wordpress|shop|store|ecommerce|e-commerce)/.test(t)) return "website";
    if (/(seo|rank|google|search|keyword)/.test(t)) return "seo";
    if (/(linkedin|profile|cv|resume)/.test(t)) return "linkedin";
    if (/(ads|advertis|ppc|meta|campaign|lead|sale|sell|revenue|client)/.test(t)) return "leads";
    if (/(social|instagram|facebook|content|post)/.test(t)) return "leads";
    if (/(portfolio|work|case|example|proof|result)/.test(t)) return "portfolio";
    if (/(audit|free)/.test(t)) return "audit";
    if (/(time|long|fast|deadline|start|kab)/.test(t)) return "timeline";
    if (/(human|agent|call|contact|phone|whatsapp|talk|support)/.test(t)) return "human";
    if (/(buy|start|hire|order|book|sign|ready|haan|yes)/.test(t)) return "buy";
    return null;
  }

  function route(intentKey, chip) {
    const intent = INTENTS[intentKey] || null;
    if (!intent) { fallback(); return; }
    if (intent.topic) state.topic = intent.topic;
    state.stage++;
    const text = typeof intent.reply === "function" ? intent.reply() : intent.reply;
    botSay(text, intent.chips ? intent.chips() : null);
    if (intent.action) setTimeout(intent.action, 1200);
    if (intent.renderCall) setTimeout(renderCallCard, 1600);
  }

  function fallback() {
    state.objections++;
    botSay("Great question! 🤔 I want to give you a perfect answer, not a generic one — so let me loop in the right expert. Meanwhile, these are the paths most visitors take:", [
      { label: "🎁 Free growth audit", intent: "audit" },
      { label: "💰 See pricing", intent: "price" },
      { label: "📞 Talk to a human", intent: "human" }
    ]);
  }

  /* ------------------------- user message ------------------------------ */
  function userSay(text) {
    addMsg(esc(text), "user");
    chipsRow.innerHTML = "";
  }
  function handleSend() {
    const val = (input.value || "").trim();
    if (!val || state.ended) return;
    input.value = "";
    userSay(val);
    const intent = detectIntent(val);
    if (intent) route(intent);
    else fallback();
  }
  sendBtn?.addEventListener("click", handleSend);
  input?.addEventListener("keydown", (e) => { if (e.key === "Enter") handleSend(); });

  /* --------------------- mandated conversation end --------------------- */
  function endConversation() {
    if (state.ended) return;
    state.ended = true;
    chipsRow.innerHTML = "";
    input.disabled = true;
    sendBtn.disabled = true;
    botSay("This conversation has been ended. Please contact our customer support for more details.", null, 700);
    setTimeout(renderCallCard, 1500);
  }

  function renderCallCard() {
    const card = document.createElement("div");
    card.className = "chat-call-card";
    card.innerHTML = `
      <p><i class="fa-solid fa-headset"></i> <b>Customer Support</b> — Mon–Sat, 9am–9pm PKT</p>
      <a href="tel:${TEL}"><i class="fa-solid fa-phone-volume"></i> Call 0334 3706275</a>`;
    body.appendChild(card);
    scrollDown();
  }
})();
