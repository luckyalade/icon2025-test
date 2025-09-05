import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VideoModal = ({ isOpen, onClose, videoId, title, downloadUrl, downloadText }) => {
  const EMBED_BASE = `https://www.youtube.com/embed/${videoId}`;
  const MAXRES_THUMB = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const HQ_THUMB = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const [videoSrc, setVideoSrc] = useState("");
  const [thumbSrc, setThumbSrc] = useState(MAXRES_THUMB);

  useEffect(() => {
    if (isOpen) {
      setVideoSrc(""); // reset so thumbnail shows until play is clicked
      setThumbSrc(MAXRES_THUMB);
    } else {
      setVideoSrc("");
    }
  }, [isOpen, videoId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />

          {/* Modal */}
          <motion.div
            className="relative rounded-md shadow-lg w-[90%] max-w-3xl px-2 pt-2 md:pt-12 md:px-12"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              backgroundImage: "url('/blue-bg-image.png')",
              backgroundSize: "cover",
              borderRadius: "12px",
              border: "2px solid #0061a5",
            }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.4, type: "spring" }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-300 transition"
            >
              ✕
            </button>

            {/* Video */}
            <div className="relative w-full pb-[56.25%] h-0 overflow-hidden">
              {videoSrc ? (
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={videoSrc}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  onClick={() => setVideoSrc(`${EMBED_BASE}?autoplay=1&rel=0`)}
                  className="absolute inset-0 w-full h-full p-0 m-0 border-0 bg-transparent"
                  aria-label="Play video"
                >
                  <img
                    src={thumbSrc}
                    onError={() => {
                      if (thumbSrc !== HQ_THUMB) setThumbSrc(HQ_THUMB);
                    }}
                    alt={`${title} thumbnail`}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-black/60 rounded-full flex items-center justify-center transform hover:scale-105 transition">
                      <svg
                        className="w-10 h-10 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </button>
              )}
            </div>

            {/* Download link */}
            {downloadUrl && (
              <div className="py-2 md:py-6 text-center">
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-white font-bold md:text-lg text-xs transform transition-transform duration-500 hover:scale-105"
                >
                  {downloadText}
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;
