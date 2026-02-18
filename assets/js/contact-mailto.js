// Static contact form handler via EmailJS (no backend).
(function () {
    'use strict';

    var EMAIL_TARGET = 'marton.lakatos@b-masiv.ro';
    var EMAILJS_CONFIG = {
        // Configure these values to enable EmailJS sending.
        // https://dashboard.emailjs.com/admin
        publicKey: '823ynTtxvANEfJRJc',
        serviceId: 'service_nqbja9d',
        templateId: 'template_t43l1zg'
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

    function sendViaEmailJS(params) {
        return window.emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            params
        );
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
        var subject = getValue(form, 'Subiect') || 'Cerere de pe site';
        var message = getValue(form, 'Mesaj');
        var cleanSubject = 'Cerere website B-Masiv: ' + subject;
        var submittedAt = new Date().toLocaleString('ro-RO');

        var bodyLines = [
            'Nume: ' + (name || '-'),
            'Email: ' + (email || '-'),
            'Telefon: ' + (phone || '-'),
            'Subiect: ' + (subject || '-'),
            '',
            'Mesaj:',
            message || '-'
        ];

        var mailto = 'mailto:' + encodeURIComponent(EMAIL_TARGET) +
            '?subject=' + encodeURIComponent(cleanSubject) +
            '&body=' + encodeURIComponent(bodyLines.join('\n'));

        var simpleMessage = [
            'Data: ' + submittedAt,
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
        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.innerHTML = 'Se trimite...';
        }

        if (!emailJsConfigured()) {
            showToast('EmailJS nu este configurat. Se deschide email local.', 'info');
            window.location.href = mailto;
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.innerHTML = originalBtnHtml;
            }
            return;
        }

        sendViaEmailJS({
            to_email: EMAIL_TARGET,
            to: EMAIL_TARGET,
            recipient_email: EMAIL_TARGET,
            subject: cleanSubject,
            submitted_at: submittedAt,
            from_name: name || '-',
            from_email: email || '-',
            from_phone: phone || '-',
            message: message || '-',
            full_message: simpleMessage
        }).then(function () {
            showToast('Mesajul tău a fost trimis cu succes.\nÎți mulțumim! Revenim către tine în cel mai scurt timp.', 'success');
            form.reset();
        }).catch(function () {
            showToast('Trimiterea directă a eșuat. Se deschide email local.', 'error');
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
