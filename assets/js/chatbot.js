// ============================================
// B-Masiv Chatbot Widget (AI-first)
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

    quickResponses: [
        {
            id: 'phones',
            patterns: [/\b(telefon|telefoane|numar|numere|sun[ăa]|call)\b/i],
            isHtml: true,
            text:
                '<strong>Telefoane utile</strong><br>' +
                '• Producător Hale Industriale: +40732116176<br>' +
                '• Stație Betoane: +40745543664<br>' +
                '• Fabrica Fasonare: +40758061773<br>' +
                '• Magazin Carei: +40755130861<br>' +
                '• Magazin Crasna: +40774436522'
        },
        {
            id: 'emails',
            patterns: [/\b(email|mail|e-?mail|adresa de email)\b/i],
            isHtml: true,
            text:
                '<strong>Emailuri utile</strong><br>' +
                '• Contact: <a href="mailto:contact@b-masiv.com">contact@b-masiv.com</a><br>' +
                '• Fabrica Fasonare: <a href="mailto:fasonare@b-masiv.ro">fasonare@b-masiv.ro</a><br>' +
                '• Magazin Carei: <a href="mailto:office.carei@b-masiv.ro">office.carei@b-masiv.ro</a><br>' +
                '• Magazin Crasna: <a href="mailto:office.crasna@b-masiv.ro">office.crasna@b-masiv.ro</a><br>' +
                '• Stație Betoane: <a href="mailto:statie.betoane@b-masiv.ro">statie.betoane@b-masiv.ro</a>'
        },
        {
            id: 'address',
            patterns: [/\b(adres[ăa]|locatie|loca[țt]ie|unde|harta|map)\b/i],
            isHtml: true,
            text:
                '<strong>Adresă principală</strong><br>' +
                'Pericei, Nr. 60/N, Sălaj, România.<br>' +
                '<a href="index.html#contact">Vezi harta</a><br><br>' +
                '<strong>Magazine</strong><br>' +
                '• Carei: str Calea Armatei Romane nr 18<br>' +
                '• Crasna: Varsolțului, Crasna, România, 457085'
        },
        {
            id: 'services',
            patterns: [/\b(servicii|ce oferiti|ofert[ăa]|solutii|departamente)\b/i],
            isHtml: true,
            text:
                '<strong>Servicii / Departamente</strong><br>' +
                '• <a href="fasonare.html">Producator Confectii Metalice</a><br>' +
                '• <a href="statie-betoane.html">Stație de Betoane</a><br>' +
                '• <a href="depozit-carei.html">Depozit Magazin Carei</a><br>' +
                '• <a href="depozit-crasna.html">Depozit Magazin Crasna</a><br>' +
                '• <a href="servicii.html">Toate serviciile</a>'
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
            text: 'Buna ziua! Sunt asistentul virtual B-Masiv. Scrieti intrebarea dvs. si va raspund direct prin AI.',
            isHtml: false
        });
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
                ? `Chatbot activ: AI direct din browser.\nLimită AI: ${quota.remaining}/${this.ai.maxPerHour} rămase în ultima oră.`
                : 'Chatbot activ: AI indisponibil (lipseste cheia OpenAI).'
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

    findQuickResponse(message) {
        for (const item of this.quickResponses) {
            for (const pattern of item.patterns) {
                if (pattern.test(message)) return item;
            }
        }
        return null;
    },

    async processMessage(message) {
        if (this.handleCommand(message)) return;

        const quick = this.findQuickResponse(message);
        if (quick) {
            this.addMessage({
                type: 'bot',
                isHtml: Boolean(quick.isHtml),
                text: quick.text
            });
            return;
        }

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
                isHtml: false,
                text: 'Raspuns AI indisponibil momentan. Va rugam incercati din nou in cateva momente.'
            });
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
