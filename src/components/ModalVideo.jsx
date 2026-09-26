export default function ModalVideo({ isOpen, onClose, fbUrl }) {
  if (!isOpen) return null;

  const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(fbUrl)}&show_text=0`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-gray-900 rounded-2xl w-full max-w-3xl overflow-hidden relative shadow-2xl border border-gray-700 transform transition-all scale-100">
        
        {/* Header Pop-up */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900">
          <h3 className="text-gray-200 font-semibold text-sm">Preview Video FB</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Kontainer Video Responsif */}
        <div className="w-full h-[60vh] md:h-[75vh] flex justify-center bg-black p-2">
          <iframe 
            src={embedUrl}
            className="w-full h-full rounded-lg"
            style={{ border: 'none', overflow: 'hidden' }} 
            scrolling="no" 
            frameBorder="0" 
            allowFullScreen={true} 
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
        </div>
      </div>
    </div>
  );
}