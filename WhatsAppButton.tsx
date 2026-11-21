export function WhatsAppButton({ number }: { number: string }) {
  if (!number) return null
  const href = `https://wa.me/${number}?text=${encodeURIComponent('Hello Silk Route Trails, I would like to know more about your journeys.')}`
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#1FA855] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 hover:bg-[#188a45]"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.500-.7-1.700-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.200-.3.200-.5.100a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.200-.4.700-1.300.1-.2 0-.3 0-.5l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.300 3 3 0 0 0-.9 2.200 5.200 5.200 0 0 0 1.100 2.800 11.900 11.900 0 0 0 4.600 4c1.700.7 2.400.8 3.300.6a2.800 2.800 0 0 0 1.800-1.300 2.300 2.300 0 0 0 .2-1.300c-.1-.1-.2-.2-.4-.3Z" />
      </svg>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  )
}
