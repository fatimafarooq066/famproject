// FAM Assistant — customer support chat widget.
// Stateless server: we keep the conversation in memory here and re-send
// it (as plain {role, content} pairs) with every request.
(function () {
    const root = document.getElementById('fam-chat-root');
    if (!root) return;

    const toggleBtn = document.getElementById('fam-chat-toggle');
    const panel = document.getElementById('fam-chat-panel');
    const minimizeBtn = document.getElementById('fam-chat-minimize');
    const iconOpen = document.getElementById('fam-chat-icon-open');
    const iconClose = document.getElementById('fam-chat-icon-close');
    const messagesEl = document.getElementById('fam-chat-messages');
    const typingEl = document.getElementById('fam-chat-typing');
    const form = document.getElementById('fam-chat-form');
    const input = document.getElementById('fam-chat-input');
    const submitBtn = form.querySelector('button[type="submit"]');

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ?? '';

    /** @type {{role: 'user'|'assistant', content: string}[]} */
    let history = [];
    let sending = false;

    function setOpen(open) {
        panel.hidden = !open;
        iconOpen.style.display = open ? 'none' : '';
        iconClose.style.display = open ? '' : 'none';
        if (open) input.focus();
    }

    toggleBtn.addEventListener('click', () => setOpen(panel.hidden));
    minimizeBtn.addEventListener('click', () => setOpen(false));

    function appendMessage(role, text) {
        const div = document.createElement('div');
        div.className = 'fam-chat-msg fam-chat-msg--' + role;
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return div;
    }

    function setTyping(on) {
        typingEl.hidden = !on;
        if (on) messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    async function sendMessage(text) {
        appendMessage('user', text);
        history.push({ role: 'user', content: text });

        sending = true;
        submitBtn.disabled = true;
        setTyping(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ message: text, history: history.slice(0, -1) }),
            });

            const data = await res.json();
            setTyping(false);

            if (!res.ok || data.error) {
                appendMessage('error', data.reply || 'Something went wrong. Please try again.');
                return;
            }

            appendMessage('assistant', data.reply);
            history = Array.isArray(data.history) ? data.history : history;
        } catch (err) {
            setTyping(false);
            appendMessage('error', "Couldn't reach the assistant — check your connection and try again.");
        } finally {
            sending = false;
            submitBtn.disabled = false;
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text || sending) return;
        input.value = '';
        sendMessage(text);
    });
})();
