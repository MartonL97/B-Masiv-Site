// ============================================
// B-Masiv Chatbot Widget (Static FAQ)
// ============================================
// Notes:
// - Works fully static (HTML/CSS/JS only), no backend/API required.

const chatbot = {
    ai: {
        enabled: true,
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4o-mini',
        timeoutMs: 20000,
        storageKey: 'bmasiv_ai_timestamps',
        maxPerHour: 30,
        windowMs: 60 * 60 * 1000,
        minIntervalMs: 4000,
        // Hardcoded by request; localStorage /apikey can override.
        hardcodedKey: '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'
    },

    state: {
        lastIntent: null,
        lastTopic: null
    },

    // Compact, intent-based FAQ. Patterns are tested in order.
    intents: [
        {
            id: 'greeting',
            patterns: [/\b(salut|buna|bun[ăa]|hello|hi)\b/i],
            isHtml: false,
            response: () => 'Buna ziua! Sunt asistentul virtual B-Masiv. Cu ce va pot ajuta?'
        },
        {
            id: 'help',
            patterns: [/\b(ajutor|help|info)\b/i],
            isHtml: true,
            response: () =>
                'Va pot ajuta cu:<br>' +
                '• <strong>Servicii</strong> (hale, fasonare, beton, pardoseli, confectii)<br>' +
                '• <strong>Departamente / locatii</strong> (Carei, Crasna, statie betoane)<br>' +
                '• <strong>Program</strong>, <strong>adresa</strong>, <strong>contact</strong><br>' +
                'Spuneti-mi ce va intereseaza, de exemplu: <em>"beton"</em>, <em>"fasonare"</em>, <em>"program"</em>.'
        },
        {
            id: 'services',
            patterns: [/\b(servicii|solutii|ofert[ăa]|ce oferiti)\b/i],
            isHtml: true,
            response: () =>
                'Serviciile noastre principale:<br>' +
                '• <a href="servicii.html">Producator hale industriale</a><br>' +
                '• <a href="fasonare.html">Fasonare otel-beton</a><br>' +
                '• <a href="statie-betoane.html">Statie de betoane (livrare)</a><br>' +
                '• <a href="galerie-pardoseli.html">Pardoseli industriale</a><br>' +
                '• <a href="galerie-confectii.html">Confectii metalice</a><br>' +
                '• <a href="galerie-containere.html">Containere tip birou</a><br>' +
                'Doriti detalii la un serviciu anume?'
        },
        {
            id: 'concrete',
            patterns: [/\b(beton|statie betoane|sta[tț]ie betoane|pompa|autobetonier[ăa]|cif[ăa])\b/i],
            isHtml: true,
            response: () =>
                'Pentru beton si livrare, vedeti <a href="statie-betoane.html">Statie de Betoane</a>.<br>' +
                'Puteti comanda rapid la telefon: <strong>0745543664</strong>.'
        },
        {
            id: 'rebar',
            patterns: [/\b(fasonare|fier beton|otel[- ]beton|armatur[ăa])\b/i],
            isHtml: true,
            response: () =>
                'Detalii despre fasonare: <a href="fasonare.html">Fabrica de Fasonat Otel-Beton</a>.<br>' +
                'Puteti vedea si <a href="galerie-fasonare-fier.html">galeria</a> cu exemple.'
        },
        {
            id: 'halls',
            patterns: [/\b(hale|hale industriale|hale metalice|structur[ăa] metalic[ăa])\b/i],
            isHtml: true,
            response: () =>
                'Suntem producatori de hale industriale. Vedeti exemple in <a href="galerie-hale-industriale.html">Galeria Hale Industriale</a>.'
        },
        {
            id: 'floors',
            patterns: [/\b(pardoseli|elicopterizat[ăa]|turnat[ăa])\b/i],
            isHtml: true,
            response: () =>
                'Executam pardoseli industriale. Vedeti exemple in <a href="galerie-pardoseli.html">Galeria Pardoseli</a>.'
        },
        {
            id: 'metal',
            patterns: [/\b(confectii|confectii metalice|accesorii metalice)\b/i],
            isHtml: true,
            response: () =>
                'Realizam confectii metalice. Vedeti <a href="galerie-confectii.html">Galeria Confectii</a>.'
        },
        {
            id: 'containers',
            patterns: [/\b(container|containere|birou)\b/i],
            isHtml: true,
            response: () =>
                'Containere tip birou: <a href="galerie-containere.html">Galeria Containere</a>.'
        },
        {
            id: 'departments',
            patterns: [/\b(departamente|locatii|puncte de lucru|magazin|depozit)\b/i],
            isHtml: true,
            response: () =>
                'Departamente / locatii:<br>' +
                '• <a href="fasonare.html">Fabrica de Fasonare</a><br>' +
                '• <a href="statie-betoane.html">Statie de Betoane</a><br>' +
                '• <a href="depozit-carei.html">Magazin / Depozit Carei</a><br>' +
                '• <a href="depozit-crasna.html">Magazin / Depozit Crasna</a>'
        },
        {
            id: 'contact',
            patterns: [/\b(contact|telefon|numar|email|e-?mail|whatsapp)\b/i],
            isHtml: true,
            response: () =>
                '<strong>Contact</strong><br>' +
                'Telefon: <a href="tel:+40260672788">(004) 0260 672 788</a><br>' +
                'Email: <a href="mailto:contact@b-masiv.com">contact@b-masiv.com</a><br>' +
                'Adresa: Pericei Nr. 60/N, Salaj, Romania<br>' +
                'Puteti folosi si formularul din <a href="index.html#contact">Contact</a>.'
        },
        {
            id: 'schedule',
            patterns: [/\b(program|orar|deschis|inchis)\b/i],
            isHtml: true,
            response: () =>
                '<strong>Program orientativ</strong><br>' +
                'Luni-Vineri: 09:00-17:00<br>' +
                'Sambata: 08:00-13:00<br>' +
                'Duminica: Inchis'
        },
        {
            id: 'address',
            patterns: [/\b(adresa|locatie|unde sunteti|harta|google maps)\b/i],
            isHtml: true,
            response: () =>
                '<strong>Locatie</strong><br>' +
                'Pericei Nr. 60/N, Salaj, Romania.<br>' +
                'Vezi harta in <a href="index.html#contact">Contact</a>.'
        },
        {
            id: 'pricing',
            patterns: [/\b(pret|cost|tarif|oferta|deviz)\b/i],
            isHtml: true,
            response: () =>
                'Pentru un pret corect, avem nevoie de cateva detalii (cantitate, locatie, termen).<br>' +
                'Trimiteti un mesaj in <a href="index.html#contact">Contact</a> sau sunati la <strong>(004) 0260 672 788</strong>.'
        }
    ],

    init() {
        this.chatBubble = document.getElementById('chat-bubble');
        this.chatWindow = document.getElementById('chat-window');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.chatSendBtn = document.getElementById('chat-send-btn');

        if (!this.chatBubble || !this.chatWindow || !this.chatMessages || !this.chatInput || !this.chatSendBtn) {
            // Widget not present on this page.
            return;
        }

        const keyFromStorage = localStorage.getItem('openai_api_key');
        if (keyFromStorage && keyFromStorage.trim()) {
            this.ai.hardcodedKey = keyFromStorage.trim();
        }

        this.chatBubble.addEventListener('click', () => this.toggleChat());
        this.chatSendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        this.showWelcomeMessage();
    },

    toggleChat() {
        const isOpen = this.chatWindow.classList.contains('show');
        if (isOpen) {
            this.chatWindow.classList.remove('show');
            this.chatBubble.classList.remove('active');
        } else {
            this.chatWindow.classList.add('show');
            this.chatBubble.classList.add('active');
            this.chatInput.focus();
        }
    },

    showWelcomeMessage() {
        this.addMessage({
            type: 'bot',
            text: 'Buna ziua! Sunt asistentul virtual B-Masiv. Va pot ajuta cu servicii, departamente, program si contact.',
            isHtml: false
        });

        setTimeout(() => this.addQuickActions(), 250);
    },

    addQuickActions() {
        const quickActionsHTML = `
            <div class="quick-actions">
                <button class="quick-btn" onclick="chatbot.handleQuickAction('Servicii')">
                    <i class="fas fa-tools"></i> Servicii
                </button>
                <button class="quick-btn" onclick="chatbot.handleQuickAction('Departamente')">
                    <i class="fas fa-sitemap"></i> Departamente
                </button>
                <button class="quick-btn" onclick="chatbot.handleQuickAction('Program')">
                    <i class="fas fa-clock"></i> Program
                </button>
                <button class="quick-btn" onclick="chatbot.handleQuickAction('Contact')">
                    <i class="fas fa-phone"></i> Contact
                </button>
                <button class="quick-btn" onclick="chatbot.handleQuickAction('Ajutor')">
                    <i class="fas fa-question-circle"></i> Ajutor
                </button>
            </div>
        `;
        this.chatMessages.insertAdjacentHTML('beforeend', quickActionsHTML);
        this.scrollToBottom();
    },

    handleQuickAction(text) {
        this.addMessage({ type: 'user', text, isHtml: false });
        this.processMessage(text);
    },

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        this.addMessage({ type: 'user', text: message, isHtml: false });
        this.chatInput.value = '';

        await this.processMessage(message);
    },

    handleCommand(raw) {
        const message = String(raw || '').trim();
        if (!message.startsWith('/')) return false;

        const [cmd, ...rest] = message.split(' ');
        const value = rest.join(' ').trim();

        if (cmd === '/help') {
            this.addMessage({
                type: 'bot',
                isHtml: true,
                text:
                    '<strong>Comenzi</strong><br>' +
                    '• <code>/apikey CHEIA_TA</code> seteaza cheia AI local<br>' +
                    '• <code>/clearkey</code> sterge cheia AI locala<br>' +
                    '• <code>/status</code> verifica modul chatbot<br>' +
                    '• <code>/clear</code> sterge conversatia'
            });
            return true;
        }

        if (cmd === '/apikey') {
            if (!value) {
                this.addMessage({
                    type: 'bot',
                    isHtml: false,
                    text: 'Folosire: /apikey CHEIA_TA'
                });
                return true;
            }
            this.ai.hardcodedKey = value;
            localStorage.setItem('openai_api_key', value);
            this.addMessage({
                type: 'bot',
                isHtml: false,
                text: 'Cheia AI a fost salvată local în browser.'
            });
            return true;
        }

        if (cmd === '/clearkey') {
            localStorage.removeItem('openai_api_key');
            this.addMessage({
                type: 'bot',
                isHtml: false,
                text: 'Cheia AI locală a fost ștearsă. Se folosește cheia hardcoded.'
            });
            return true;
        }

        if (cmd === '/clear') {
            this.chatMessages.innerHTML = '';
            this.showWelcomeMessage();
            return true;
        }

        if (cmd === '/status') {
            this.checkStatus();
            return true;
        }

        return false;
    },

    async checkStatus() {
        const hasKey = Boolean(this.ai.hardcodedKey && this.ai.hardcodedKey.trim());
        const quota = this.getAiQuota();
        this.addMessage({
            type: 'bot',
            isHtml: false,
            text: hasKey
                ? `Chatbot activ: FAQ local + OpenAI direct din browser.\nLimită AI: ${quota.remaining}/${this.ai.maxPerHour} rămase în ultima oră.`
                : 'Chatbot activ: doar FAQ local (lipseste cheia OpenAI).'
        });
    },

    getAiTimestamps() {
        try {
            const raw = localStorage.getItem(this.ai.storageKey);
            const parsed = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(parsed)) return [];
            return parsed.filter((ts) => Number.isFinite(ts));
        } catch (_) {
            return [];
        }
    },

    saveAiTimestamps(timestamps) {
        localStorage.setItem(this.ai.storageKey, JSON.stringify(timestamps));
    },

    getActiveAiTimestamps() {
        const now = Date.now();
        const active = this.getAiTimestamps().filter((ts) => now - ts < this.ai.windowMs);
        this.saveAiTimestamps(active);
        return active;
    },

    getAiQuota() {
        const active = this.getActiveAiTimestamps();
        const remaining = Math.max(0, this.ai.maxPerHour - active.length);
        return { active, remaining };
    },

    canCallAi() {
        const now = Date.now();
        const active = this.getActiveAiTimestamps();
        if (active.length >= this.ai.maxPerHour) {
            return { ok: false, reason: 'quota' };
        }
        if (active.length > 0) {
            const lastTs = active[active.length - 1];
            if (now - lastTs < this.ai.minIntervalMs) {
                return { ok: false, reason: 'cooldown' };
            }
        }
        return { ok: true, reason: '' };
    },

    markAiCall() {
        const active = this.getActiveAiTimestamps();
        active.push(Date.now());
        this.saveAiTimestamps(active);
    },

    findLocalIntent(message) {
        for (const intent of this.intents) {
            for (const pattern of intent.patterns) {
                if (pattern.test(message)) {
                    return intent;
                }
            }
        }
        return null;
    },

    async processMessage(message) {
        if (this.handleCommand(message)) return;

        const localIntent = this.findLocalIntent(message);
        if (localIntent) {
            this.state.lastIntent = localIntent.id;
            this.showTypingIndicator();
            setTimeout(() => {
                this.hideTypingIndicator();
                const text = typeof localIntent.response === 'function'
                    ? localIntent.response({ state: this.state })
                    : String(localIntent.response);
                this.addMessage({ type: 'bot', text, isHtml: Boolean(localIntent.isHtml) });
            }, 450);
            return;
        }

        // No local match: AI fallback
        this.showTypingIndicator();
        try {
            if (!this.ai.enabled || !this.ai.hardcodedKey || !this.ai.hardcodedKey.trim()) {
                throw new Error('missing_api_key');
            }
            const aiLimit = this.canCallAi();
            if (!aiLimit.ok) {
                throw new Error(aiLimit.reason === 'quota' ? 'ai_quota_exceeded' : 'ai_cooldown');
            }
            this.markAiCall();
            const aiText = await this.getAiResponse(message);
            this.hideTypingIndicator();
            this.addMessage({
                type: 'bot',
                isHtml: false,
                text: aiText
            });
        } catch (err) {
            this.hideTypingIndicator();
            if (err && err.message === 'ai_quota_exceeded') {
                this.addMessage({
                    type: 'bot',
                    isHtml: false,
                    text: 'Ai atins limita de mesaje AI pentru ultima oră. Încearcă din nou mai târziu.'
                });
                return;
            }
            if (err && err.message === 'ai_cooldown') {
                this.addMessage({
                    type: 'bot',
                    isHtml: false,
                    text: 'Trimite mesajele puțin mai rar. Așteaptă câteva secunde și încearcă din nou.'
                });
                return;
            }
            this.addMessage({
                type: 'bot',
                isHtml: true,
                text:
                    'Imi pare rau, momentan nu am un raspuns exact.<br>' +
                    'Incearca una dintre optiunile: <strong>Servicii</strong>, <strong>Departamente</strong>, <strong>Program</strong>, <strong>Contact</strong>.'
            });
            this.addQuickActions();
        }
    },

    async getAiResponse(userMessage) {
        const payload = {
            model: this.ai.model,
            messages: [
                {
                    role: 'system',
                    content: 'Ești asistent virtual pentru B-Masiv. Răspunde scurt, clar, în română, orientat pe servicii, locații și contact.'
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            temperature: 0.3
        };

        const data = await this.fetchJson(this.ai.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.ai.hardcodedKey}`
            },
            body: JSON.stringify(payload)
        });

        const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        if (!text) throw new Error('empty_ai_response');
        return String(text).trim();
    },

    async fetchJson(url, options) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.ai.timeoutMs);
        try {
            const res = await fetch(url, { ...options, signal: controller.signal });
            if (!res.ok) {
                const errTxt = await res.text().catch(() => '');
                throw new Error(`AI HTTP ${res.status}: ${errTxt}`);
            }
            return await res.json();
        } finally {
            clearTimeout(timeout);
        }
    },

    addMessage(message) {
        const safeText = message.isHtml
            ? String(message.text || '')
            : this.escapeHtml(String(message.text || '')).replace(/\n/g, '<br>');

        const messageHTML = `
            <div class="chat-message ${message.type}">
                ${message.type === 'bot' ? `
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                ` : ''}
                <div class="message-content">${safeText}</div>
                ${message.type === 'user' ? `
                    <div class="message-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                ` : ''}
            </div>
        `;

        this.chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    },

    showTypingIndicator() {
        const typingHTML = `
            <div class="chat-message bot">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="typing-indicator show">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;

        this.chatMessages.insertAdjacentHTML('beforeend', typingHTML);
        this.scrollToBottom();
    },

    hideTypingIndicator() {
        const typingIndicator = this.chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            const wrapper = typingIndicator.closest('.chat-message');
            if (wrapper) wrapper.remove();
        }
    },

    escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    chatbot.init();
});
