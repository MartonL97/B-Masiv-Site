// ============================================
// B-Masiv Chatbot Widget
// ============================================

// Chatbot Configuration
const chatbot = {
    // Knowledge base with Romanian responses
    knowledgeBase: {
        // Greetings
        'salut': {
            response: 'Bună ziua! Sunt asistentul virtual B-Masiv. Cum vă pot ajuta astăzi?'
        },
        'buna': {
            response: 'Bună ziua! Cu ce vă pot fi de ajutor?'
        },
        'hello': {
            response: 'Bună ziua! Sunt aici să vă ajut. Ce informații doriți?'
        },

        // Navigation - Main pages
        'pagina principala': {
            response: 'Vă redirecționez către <a href="index.html">pagina principală</a>.'
        },
        'acasa': {
            response: 'Vă pot duce la <a href="index.html">pagina principală</a>.'
        },
        'despre': {
            response: 'Puteți afla mai multe despre compania noastră pe pagina <a href="despre-noi.html">Despre Noi</a>.'
        },
        'despre noi': {
            response: 'Vă invit să vizitați pagina <a href="despre-noi.html">Despre Noi</a> pentru a afla istoria și valorile companiei B-Masiv.'
        },
        'servicii': {
            response: 'Puteți vedea toate serviciile noastre pe pagina <a href="servicii.html">Servicii</a>. Oferim hale industriale, fasonare oțel beton, pardoseli industriale și multe altele!'
        },
        'galerie': {
            response: 'Vizitați <a href="galerie-foto.html">Galeria Foto/Video</a> pentru a vedea proiectele noastre realizate.'
        },
        'foto': {
            response: 'Avem o galerie bogată de fotografii! Vezi <a href="galerie-foto.html">Galeria Foto/Video</a>.'
        },
        'poze': {
            response: 'Puteți vedea pozele cu proiectele noastre în <a href="galerie-foto.html">Galeria Foto/Video</a>.'
        },

        // Services - Specific
        'hale': {
            response: 'Suntem producători de hale industriale! Vezi galeria noastră de <a href="galerie-hale-industriale.html">Hale Industriale</a> sau pagina de <a href="servicii.html">Servicii</a>.'
        },
        'hale industriale': {
            response: 'B-Masiv este producător de hale industriale. Vezi <a href="galerie-hale-industriale.html">Hale Industriale</a> pentru exemple de proiecte.'
        },
        'hale metalice': {
            response: 'Oferim hale metalice second-hand și noi, la orice dimensiune. Detalii pe pagina <a href="servicii.html">Servicii</a>.'
        },
        'fasonare': {
            response: 'Avem o <a href="fasonare.html">Fabrică de Fasonat Oțel-Beton</a> cu depozite în Carei și Crasna. Vezi și <a href="galerie-fasonare-fier.html">galeria de fasonare</a>.'
        },
        'fier beton': {
            response: 'Oferim servicii de fasonare fier beton. Vezi <a href="fasonare.html">Fabrica de Fasonare</a> sau <a href="galerie-fasonare-fier.html">galeria noastră</a>.'
        },
        'otel beton': {
            response: 'Fabrica noastră de fasonat oțel-beton este la dispoziția dvs. Vezi <a href="fasonare.html">Fabrica de Fasonare</a>.'
        },
        'pardoseli': {
            response: 'Executăm pardoseli industriale turnate și elicopterizate. Vezi <a href="galerie-pardoseli.html">Galeria Pardoseli</a>.'
        },
        'pardoseli industriale': {
            response: 'Oferim servicii profesionale de pardoseli industriale. Vezi <a href="galerie-pardoseli.html">Galeria Pardoseli</a>.'
        },
        'confectii': {
            response: 'Confecționăm accesorii și confecții metalice pentru hale. Vezi <a href="galerie-confectii.html">Galeria Confecții</a>.'
        },
        'confectii metalice': {
            response: 'Realizăm confecții metalice personalizate. Vezi <a href="galerie-confectii.html">Galeria Confecții</a>.'
        },
        'containere': {
            response: 'Oferim containere tip birou. Vezi <a href="galerie-containere.html">Galeria Containere</a>.'
        },
        'container': {
            response: 'Avem containere tip birou disponibile. Vezi <a href="galerie-containere.html">Galeria Containere</a>.'
        },
        'statie betoane': {
            response: 'Dispunem de o <a href="statie-betoane.html">Stație de Betoane</a> cu capacitate mare și produse certificate.'
        },
        'beton': {
            response: 'Oferim beton de calitate prin <a href="statie-betoane.html">Stația noastră de Betoane</a>.'
        },

        // Divisions/Locations
        'divizii': {
            response: 'Avem mai multe divizii: <a href="fasonare.html">Fabrica de Fasonare</a>, <a href="depozit-carei.html">Depozit Carei</a>, <a href="depozit-crasna.html">Depozit Crasna</a> și <a href="statie-betoane.html">Stație Betoane</a>.'
        },
        'depozit': {
            response: 'Avem două depozite: <a href="depozit-carei.html">Depozit Carei</a> și <a href="depozit-crasna.html">Depozit Crasna</a>.'
        },
        'carei': {
            response: 'Avem un depozit în Carei. Vezi <a href="depozit-carei.html">Depozit Carei</a>.'
        },
        'crasna': {
            response: 'Avem un depozit în Crasna. Vezi <a href="depozit-crasna.html">Depozit Crasna</a>.'
        },

        // Contact Information
        'contact': {
            response: '📞 <strong>B-Masiv SRL</strong><br>Tel: (004) 0260 672 788<br>Email: <a href="mailto:contact@b-masiv.ro">contact@b-masiv.ro</a><br>Adresă: Pericei Nr. 60/N, Sălaj, România<br><br><strong>Fabrica Fasonare (Popescu Nicolae):</strong><br>Tel: (004) 0758 061 773'
        },
        'telefon': {
            response: '📞 B-Masiv: (004) 0260 672 788<br>📞 Fabrica Fasonare: (004) 0758 061 773'
        },
        'email': {
            response: '📧 Email: <a href="mailto:contact@b-masiv.ro">contact@b-masiv.ro</a>'
        },
        'adresa': {
            response: '📍 Pericei Nr. 60/N, Sălaj, România'
        },
        'locatie': {
            response: '📍 Suntem situați în Pericei Nr. 60/N, Sălaj, România. Vezi secțiunea <a href="index.html#contact">Contact</a>.'
        },
        'unde': {
            response: '📍 Ne găsiți în Pericei Nr. 60/N, județul Sălaj, România.'
        },

        // Program
        'program': {
            response: '🕒 <strong>Program de lucru:</strong><br>Luni-Vineri: 09:00-17:00<br>Sâmbătă: 08:00-13:00<br>Duminică: Închis'
        },
        'orar': {
            response: '🕒 Luni-Vineri: 09:00-17:00 | Sâmbătă: 08:00-13:00 | Duminică: Închis'
        },

        // Help
        'ajutor': {
            response: 'Pot să vă ajut cu informații despre:<br>• <strong>Servicii</strong> (hale, fasonare, pardoseli, etc.)<br>• <strong>Contact</strong> și program<br>• <strong>Divizii</strong> (Carei, Crasna, Stație Betoane)<br>• <strong>Galerie</strong> foto/video<br><br>Despre ce doriți să aflați?'
        },
        'info': {
            response: 'Vă pot oferi informații despre serviciile noastre, locații, contact și program. Ce vă interesează?'
        },

        // Default responses
        'multumesc': {
            response: 'Cu plăcere! Dacă aveți alte întrebări, sunt aici să vă ajut.'
        },
        'mersi': {
            response: 'Cu drag! Vă doresc o zi frumoasă!'
        },
        'pa': {
            response: 'La revedere! Vă așteptăm pe site-ul nostru sau la sediu!'
        }
    },

    // Initialize chatbot
    init() {
        this.chatBubble = document.getElementById('chat-bubble');
        this.chatWindow = document.getElementById('chat-window');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.chatSendBtn = document.getElementById('chat-send-btn');

        // Event listeners
        this.chatBubble.addEventListener('click', () => this.toggleChat());
        this.chatSendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Show welcome message
        this.showWelcomeMessage();
    },

    // Toggle chat window
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

    // Show welcome message
    showWelcomeMessage() {
        const welcomeMsg = {
            type: 'bot',
            text: 'Bună ziua! 👋 Sunt asistentul virtual B-Masiv. Vă pot ajuta să navigați pe site și să găsiți informații despre serviciile noastre.'
        };
        this.addMessage(welcomeMsg);

        // Add quick action buttons
        setTimeout(() => {
            this.addQuickActions();
        }, 500);
    },

    // Add quick action buttons
    addQuickActions() {
        const quickActionsHTML = `
            <div class="quick-actions">
                <button class="quick-btn" onclick="chatbot.handleQuickAction('servicii')">
                    <i class="fas fa-tools"></i> Servicii
                </button>
                <button class="quick-btn" onclick="chatbot.handleQuickAction('contact')">
                    <i class="fas fa-phone"></i> Contact
                </button>
                <button class="quick-btn" onclick="chatbot.handleQuickAction('galerie')">
                    <i class="fas fa-images"></i> Galerie
                </button>
                <button class="quick-btn" onclick="chatbot.handleQuickAction('despre noi')">
                    <i class="fas fa-info-circle"></i> Despre Noi
                </button>
            </div>
        `;
        this.chatMessages.insertAdjacentHTML('beforeend', quickActionsHTML);
        this.scrollToBottom();
    },

    // Handle quick action
    handleQuickAction(keyword) {
        this.addMessage({ type: 'user', text: keyword.charAt(0).toUpperCase() + keyword.slice(1) });
        this.processMessage(keyword);
    },

    // Send message
    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage({ type: 'user', text: message });
        this.chatInput.value = '';

        // Process message
        setTimeout(() => {
            this.processMessage(message);
        }, 500);
    },

    // Process message and generate response
    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response = null;

        // Search for keywords in knowledge base
        for (const [keyword, data] of Object.entries(this.knowledgeBase)) {
            if (lowerMessage.includes(keyword)) {
                response = data.response;
                break;
            }
        }

        // Default response if no match
        if (!response) {
            response = 'Îmi pare rău, nu am înțeles întrebarea. Vă pot ajuta cu informații despre <strong>Servicii</strong>, <strong>Contact</strong>, <strong>Galerie</strong> sau <strong>Despre Noi</strong>. Scrieți o întrebare sau folosiți butoanele de mai jos.';

            // Show typing indicator
            this.showTypingIndicator();
            setTimeout(() => {
                this.hideTypingIndicator();
                this.addMessage({ type: 'bot', text: response });
                this.addQuickActions();
            }, 800);
            return;
        }

        // Show typing indicator
        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            this.addMessage({ type: 'bot', text: response });
        }, 800);
    },

    // Add message to chat
    addMessage(message) {
        const messageHTML = `
            <div class="chat-message ${message.type}">
                ${message.type === 'bot' ? `
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                ` : ''}
                <div class="message-content">${message.text}</div>
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

    // Show typing indicator
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

    // Hide typing indicator
    hideTypingIndicator() {
        const typingIndicator = this.chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.closest('.chat-message').remove();
        }
    },

    // Scroll to bottom
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
};

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    chatbot.init();
});
