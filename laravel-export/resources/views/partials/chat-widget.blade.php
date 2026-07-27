<!-- AI Customer Support Chat Widget -->
<div id="fam-chat-root">
    <button id="fam-chat-toggle" type="button" aria-label="Open chat with FAM Assistant">
        <svg id="fam-chat-icon-open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <svg id="fam-chat-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
            <path d="M18 6 6 18"></path><path d="M6 6l12 12"></path>
        </svg>
    </button>

    <div id="fam-chat-panel" class="fam-chat-panel" hidden>
        <div class="fam-chat-header">
            <div class="fam-chat-header-info">
                <span class="fam-chat-avatar">✦</span>
                <div>
                    <div class="fam-chat-title">FAM Assistant</div>
                    <div class="fam-chat-subtitle"><span class="fam-chat-dot"></span> Online</div>
                </div>
            </div>
            <button id="fam-chat-minimize" type="button" aria-label="Minimize chat">–</button>
        </div>

        <div id="fam-chat-messages" class="fam-chat-messages">
            <div class="fam-chat-msg fam-chat-msg--assistant">
                Hi! I'm the FAM Assistant 👋 Ask me about shades, prices, or what suits your skin tone — I can look up the catalogue for you.
            </div>
        </div>

        <div id="fam-chat-typing" class="fam-chat-typing" hidden>
            <span></span><span></span><span></span>
        </div>

        <form id="fam-chat-form" class="fam-chat-form">
            <input
                id="fam-chat-input"
                type="text"
                placeholder="Ask about a product, shade, or price…"
                autocomplete="off"
                maxlength="1000"
            />
            <button type="submit" aria-label="Send message">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 2 11 13"></path><path d="M22 2 15 22l-4-9-9-4 20-7z"></path>
                </svg>
            </button>
        </form>
    </div>
</div>
