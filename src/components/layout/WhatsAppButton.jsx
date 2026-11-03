import React from "react";

export default function WhatsAppButton() {
  return (
    <>
      <div className="whatsapp-waves" aria-hidden="true">
        <span />
        <span />
      </div>
      <a
        className="whatsapp-float"
        href="https://wa.me/447577789644"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16 .8A15 15 0 0 0 3.1 23.5L1.2 31l7.7-2A15 15 0 1 0 16 .8Zm0 27.3a12.2 12.2 0 0 1-6.2-1.7l-.5-.3-4.6 1.2 1.2-4.5-.3-.5A12.2 12.2 0 1 1 16 28.1Zm6.7-9.1c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.2.4-1 1.2-1.2 1.4-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8l.6-.7.4-.6c.1-.2 0-.5 0-.7l-1.1-2.6c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.3 3.5 1.5 3.7c.2.3 2.6 4 6.3 5.6.9.4 1.6.6 2.1.7.9.3 1.7.2 2.3.1.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.8-.1-.2-.4-.3-.8-.5Z"
          />
        </svg>
      </a>
    </>
  );
}
