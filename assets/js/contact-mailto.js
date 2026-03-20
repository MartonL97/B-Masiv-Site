// Static contact form handler via EmailJS (no backend).
(function () {
    'use strict';

    var EMAIL_TARGET = 'marton.lakatos@b-masiv.ro';
    var DEPARTMENT_EMAILS = {
        // RO
        'Ofertare hale industriale si constructii metalice': 'ofertare@b-masiv.ro',
        'Fabrica de fasonare otel-beton': 'fasonare@b-masiv.ro',
        'Contact birou': 'office@b-masiv.ro',
        'Magazin Carei': 'office.carei@b-masiv.ro',
        'Magazin Crasna': 'office.crasna@b-masiv.ro',
        'Statie de betoane': 'beton@b-masiv.ro',
        'Contabilitate': 'contabilitate@b-masiv.ro',
        'Secretariat': 'secretariat@b-masiv.ro',
        // EN
        'Quotation for industrial halls and metal structures': 'ofertare@b-masiv.ro',
        'Rebar processing factory': 'fasonare@b-masiv.ro',
        'Office contact': 'office@b-masiv.ro',
        'Carei store': 'office.carei@b-masiv.ro',
        'Crasna store': 'office.crasna@b-masiv.ro',
        'Concrete plant': 'beton@b-masiv.ro',
        'Accounting': 'contabilitate@b-masiv.ro',
        // DE
        'Angebote für Industriehallen und Metallkonstruktionen': 'ofertare@b-masiv.ro',
        'Betonstahl-Biegewerk': 'fasonare@b-masiv.ro',
        'Bürokontakt': 'office@b-masiv.ro',
        'Lager/Shop Carei': 'office.carei@b-masiv.ro',
        'Lager/Shop Crasna': 'office.crasna@b-masiv.ro',
        'Betonwerk': 'beton@b-masiv.ro',
        'Buchhaltung': 'contabilitate@b-masiv.ro',
        'Sekretariat': 'secretariat@b-masiv.ro',
        // HU
        'Ipari csarnokok és fémszerkezetek ajánlatkérés': 'ofertare@b-masiv.ro',
        'Betonacél-hajlító üzem': 'fasonare@b-masiv.ro',
        'Irodai kapcsolat': 'office@b-masiv.ro',
        'Carei üzlet': 'office.carei@b-masiv.ro',
        'Crasna üzlet': 'office.crasna@b-masiv.ro',
        'Betonüzem': 'beton@b-masiv.ro',
        'Könyvelés': 'contabilitate@b-masiv.ro',
        'Titkárság': 'secretariat@b-masiv.ro'
    };
    var EMAILJS_CONFIG = {
        // Configure these values to enable EmailJS sending.
        // https://dashboard.emailjs.com/admin
        publicKey: '823ynTtxvANEfJRJc',
        serviceId: 'service_nqbja9d',
        templateId: 'template_0ztzd3r'
    };
    var I18N = {
        ro: {
            sending: 'Se trimite...',
            limitReached: 'Ai atins limita de 3 mesaje în 24h.\nÎncearcă din nou mai târziu.',
            emailJsNotConfigured: 'EmailJS nu este configurat. Se deschide email local.',
            success: 'Mesajul tău a fost trimis cu succes.\nÎți mulțumim! Revenim către tine în cel mai scurt timp.',
            fallbackError: 'Trimiterea directă a eșuat. Se deschide email local.'
        },
        de: {
            sending: 'Wird gesendet...',
            limitReached: 'Du hast das Limit von 3 Nachrichten in 24h erreicht.\nBitte versuche es später erneut.',
            emailJsNotConfigured: 'EmailJS ist nicht konfiguriert. E-Mail wird lokal geöffnet.',
            success: 'Deine Nachricht wurde erfolgreich gesendet.\nVielen Dank! Wir melden uns schnellstmöglich bei dir.',
            fallbackError: 'Direktes Senden ist fehlgeschlagen. E-Mail wird lokal geöffnet.'
        },
        hu: {
            sending: 'Küldés...',
            limitReached: 'Elérted a 3 üzenet/24 óra korlátot.\nKérjük, próbáld meg később újra.',
            emailJsNotConfigured: 'Az EmailJS nincs beállítva. Megnyitjuk a helyi e-mail klienst.',
            success: 'Az üzeneted sikeresen elküldve.\nKöszönjük! Hamarosan válaszolunk.',
            fallbackError: 'A közvetlen küldés nem sikerült. Megnyitjuk a helyi e-mail klienst.'
        },
        en: {
            sending: 'Sending...',
            limitReached: 'You reached the limit of 3 messages in 24h.\nPlease try again later.',
            emailJsNotConfigured: 'EmailJS is not configured. Opening local email client.',
            success: 'Your message was sent successfully.\nThank you! We will get back to you shortly.',
            fallbackError: 'Direct sending failed. Opening local email client.'
        }
    };

    function getLang() {
        var lang = (document.documentElement.getAttribute('lang') || 'ro').toLowerCase();
        if (lang.indexOf('de') === 0) return 'de';
        if (lang.indexOf('hu') === 0) return 'hu';
        if (lang.indexOf('en') === 0) return 'en';
        return 'ro';
    }

    function t(key) {
        var lang = getLang();
        return (I18N[lang] && I18N[lang][key]) || I18N.ro[key] || key;
    }
    var EMAIL_LIMIT = {
        storageKey: 'bmasiv_email_timestamps',
        maxPerWindow: 3,
        windowMs: 24 * 60 * 60 * 1000
    };

    function getValue(form, name) {
        var el = form.querySelector('[name="' + name + '"]');
        return el ? String(el.value || '').trim() : '';
    }

    function emailJsConfigured() {
        return Boolean(
            window.emailjs &&
            EMAILJS_CONFIG.publicKey &&
            EMAILJS_CONFIG.serviceId &&
            EMAILJS_CONFIG.templateId
        );
    }

    function sendViaEmailJS(templateId, params) {
        return window.emailjs.send(
            EMAILJS_CONFIG.serviceId,
            templateId,
            params
        );
    }

    function getRecipientEmailForDepartment(department) {
        return DEPARTMENT_EMAILS[department] || EMAIL_TARGET;
    }

    function getEmailTimestamps() {
        try {
            var raw = localStorage.getItem(EMAIL_LIMIT.storageKey);
            var parsed = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(parsed)) return [];
            return parsed.filter(function (ts) {
                return Number.isFinite(ts);
            });
        } catch (_) {
            return [];
        }
    }

    function saveEmailTimestamps(timestamps) {
        localStorage.setItem(EMAIL_LIMIT.storageKey, JSON.stringify(timestamps));
    }

    function getActiveEmailTimestamps() {
        var now = Date.now();
        var valid = getEmailTimestamps().filter(function (ts) {
            return now - ts < EMAIL_LIMIT.windowMs;
        });
        saveEmailTimestamps(valid);
        return valid;
    }

    function canSendEmail() {
        var active = getActiveEmailTimestamps();
        return active.length < EMAIL_LIMIT.maxPerWindow;
    }

    function markEmailSent() {
        var active = getActiveEmailTimestamps();
        active.push(Date.now());
        saveEmailTimestamps(active);
    }

    function ensureToastStyles() {
        if (document.getElementById('bmasiv-toast-style')) return;
        var style = document.createElement('style');
        style.id = 'bmasiv-toast-style';
        style.textContent =
            '.bmasiv-toast{position:fixed;left:50%;top:18px;z-index:99999;width:min(92vw,460px);padding:12px 14px;border-radius:10px;color:#fff;font:600 15px/1.35 Arial,Helvetica,sans-serif;text-align:center;white-space:pre-line;box-shadow:0 12px 24px rgba(0,0,0,.22);opacity:0;transform:translateX(-50%) translateY(-10px);transition:all .25s ease}' +
            '.bmasiv-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}' +
            '.bmasiv-toast.success{background:#198754}' +
            '.bmasiv-toast.error{background:#dc3545}' +
            '.bmasiv-toast.info{background:#1f1f1f}';
        document.head.appendChild(style);
    }

    function showToast(message, type) {
        ensureToastStyles();
        var toast = document.createElement('div');
        toast.className = 'bmasiv-toast ' + (type || 'info');
        toast.textContent = message;
        document.body.appendChild(toast);
        requestAnimationFrame(function () {
            toast.classList.add('show');
        });
        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 250);
        }, 2800);
    }

    function onSubmit(e) {
        e.preventDefault();

        var form = e.currentTarget;

        var name = getValue(form, 'Nume');
        var email = getValue(form, 'Email');
        var phone = getValue(form, 'Telefon');
        var department = getValue(form, 'Departament');
        var subject = getValue(form, 'Subiect') || 'Cerere de pe site';
        var message = getValue(form, 'Mesaj');
        var cleanSubject = subject;
        var submittedAt = new Date().toLocaleString('ro-RO');
        var templateId = EMAILJS_CONFIG.templateId;
        var recipientEmail = getRecipientEmailForDepartment(department);

        var bodyLines = [
            'Departament: ' + (department || '-'),
            'Nume: ' + (name || '-'),
            'Email: ' + (email || '-'),
            'Telefon: ' + (phone || '-'),
            'Subiect: ' + (subject || '-'),
            '',
            'Mesaj:',
            message || '-'
        ];

        var mailto = 'mailto:' + encodeURIComponent(recipientEmail) +
            '?subject=' + encodeURIComponent(cleanSubject) +
            '&body=' + encodeURIComponent(bodyLines.join('\n'));

        var simpleMessage = [
            'Data: ' + submittedAt,
            'Departament: ' + (department || '-'),
            'Nume: ' + (name || '-'),
            'Email: ' + (email || '-'),
            'Telefon: ' + (phone || '-'),
            'Subiect: ' + (subject || '-'),
            '',
            'Mesaj:',
            message || '-'
        ].join('\n');

        var sendBtn = form.querySelector('button[type="submit"]');
        var originalBtnHtml = sendBtn ? sendBtn.innerHTML : '';

        if (!canSendEmail()) {
            showToast(t('limitReached'), 'error');
            return;
        }

        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.innerHTML = t('sending');
        }

        if (!emailJsConfigured()) {
            showToast(t('emailJsNotConfigured'), 'info');
            window.location.href = mailto;
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.innerHTML = originalBtnHtml;
            }
            return;
        }

        sendViaEmailJS(templateId, {
            to_email: recipientEmail,
            to: recipientEmail,
            recipient_email: recipientEmail,
            department: department || '-',
            subject: cleanSubject,
            submitted_at: submittedAt,
            from_name: name || '-',
            from_email: email || '-',
            from_phone: phone || '-',
            message: message || '-',
            full_message: simpleMessage
        }).then(function () {
            markEmailSent();
            showToast(t('success'), 'success');
            form.reset();
        }).catch(function () {
            showToast(t('fallbackError'), 'error');
            window.location.href = mailto;
        }).finally(function () {
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.innerHTML = originalBtnHtml;
            }
        });
    }

    function init() {
        if (window.emailjs && EMAILJS_CONFIG.publicKey) {
            window.emailjs.init({
                publicKey: EMAILJS_CONFIG.publicKey
            });
        }

        var forms = document.querySelectorAll('form.js-contact-mailto');
        forms.forEach(function (form) {
            form.addEventListener('submit', onSubmit);
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
