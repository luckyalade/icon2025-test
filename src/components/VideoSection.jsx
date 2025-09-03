import React, { useEffect, useState } from "react";
//eslint-disable-next-line
import { motion, AnimatePresence } from "framer-motion";

const VIDEO_ID = "dku79-2_SCQ";
const EMBED_BASE = `https://www.youtube.com/embed/${VIDEO_ID}`;
const MAXRES_THUMB = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;
const HQ_THUMB = `https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`;

const VideoSection = ({ isOpen, onClose }) => {
  const [videoSrc, setVideoSrc] = useState("");
  const [thumbSrc, setThumbSrc] = useState(MAXRES_THUMB);

  useEffect(() => {
    if (isOpen) {
      setVideoSrc("");
      setThumbSrc(MAXRES_THUMB);
    } else {
      setVideoSrc("");
    }
  }, [isOpen]);

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
            className="relative rounded-md shadow-lg w-[90%] max-w-3xl px-2 pt-2 md:pt-12 md:px-12  "
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              backgroundImage:
                "url('/blue-bg-image.png')",
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

            {/* Video container */}
            <div className="relative w-full pb-[56.25%] h-0 overflow-hidden">
              {videoSrc ? (
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={videoSrc}
                  title="Brent Faiyaz - full moon. (fall in tokyo)"
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
                    alt="Video thumbnail"
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
            <div className="py-2 md:py-6 text-center">
              <a
                href="https://www.dropbox.com/scl/fi/jt2ek6rw1y4ix9uhg61iu/Full-Moon-M9-Loud.wav?rlkey=3iuswtkrh77p7ttxzpr8p16gv&st=yk6ijya7&dl=0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-white font-bold md:text-lg text-xs transform transition-transform duration-500 hover:scale-105"
              >
                download full moon - m8 - loud
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoSection;
