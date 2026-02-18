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
            alert('Mesaj trimis cu succes.');
            form.reset();
        }).catch(function () {
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
