//eslint-disable-next-line
import { motion, useMotionValue } from "framer-motion";
import { useState, useEffect } from "react";

function CardRotate({ children, onSendToBack, sensitivity, isMobile }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  function handleDragEnd(_, info) {
    if (
      Math.abs(info.offset.x) > sensitivity ||
      Math.abs(info.offset.y) > sensitivity
    ) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="absolute cursor-grab touch-none"
      style={{ x, y }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={isMobile ? 0.2 : 0.4}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

export default function CardStackModal({
  isOpen,
  onClose,
  sensitivity = 50,
  cardDimensions = { width: 350, height: 450 },
  cardsData = [],
  animationConfig = { stiffness: 260, damping: 20 },
}) {
  const [cards, setCards] = useState(cardsData);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const sendToBack = (id) => {
    setCards((prev) => {
      const newCards = [...prev];
      const index = newCards.findIndex((card) => card.id === id);
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      return newCards;
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal box */}
      <motion.div
        className="relative flex items-center justify-center overflow-hidden opacity-95 shadow-xl max-w-full max-h-[90vh]"
        style={{
          width: isMobile ? "100%" : cardDimensions.width + 110,
          height: isMobile ? "75vh" : cardDimensions.height + 110,
          backgroundColor: "white",
          backgroundImage:
            "url('https://icon2025.com/_jsapps/backdrop/video/assets/noise.png')",
          backgroundSize: "cover",
          borderRadius: "12px",
          border: "2px solid #ddd",
        }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-200 rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center hover:bg-gray-300 transition z-50 text-xs md:text-sm "
        >
          ✕
        </button>

        {/* Instructions */}
        <div className="absolute top-3 left-3 text-xs sm:text-sm text-black z-50">
          drag to shuffle
        </div>

        {/* Card stack */}
        <section
          className="relative w-full h-full flex justify-center items-center"
          style={{ perspective: 600, touchAction: "none" }}
        >
          {cards.map((card, index) => {
            const positionIndex = card.id - 1;
            let translateX = 0;
            let translateY = 0;

            if (positionIndex % 4 === 0) {
              translateY = -10;
              translateX = ((positionIndex % 3) - 1) * 8;
            } else if (positionIndex % 4 === 1) {
              translateX = 10;
              translateY = ((positionIndex % 3) - 1) * 8;
            } else if (positionIndex % 4 === 2) {
              translateY = 10;
              translateX = ((positionIndex % 3) - 1) * 8;
            } else {
              translateX = -10;
              translateY = ((positionIndex % 3) - 1) * 8;
            }

            return (
              <CardRotate
                key={card.id}
                onSendToBack={() => sendToBack(card.id)}
                sensitivity={sensitivity}
                isMobile={isMobile}
              >
                <motion.article
                  className="rounded-2xl overflow-hidden border border-white mx-auto"
                  style={{
                    width: isMobile
                      ? Math.min(window.innerWidth * 0.8, 280)
                      : cardDimensions.width,
                    height: isMobile
                      ? Math.min(window.innerHeight * 0.6, 360)
                      : cardDimensions.height,
                    zIndex: cards.length - index,
                  }}
                  animate={{
                    transformOrigin: "center",
                    x: translateX,
                    y: translateY,
                  }}
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: animationConfig.stiffness,
                    damping: animationConfig.damping,
                  }}
                >
                  <img
                    src={card.img}
                    alt={`Interactive Card ${card.id}`}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </motion.article>
              </CardRotate>
            );
          })}
        </section>

        {/* Footer link */}
        <motion.footer
          className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-full text-center px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          style={{ zIndex: 100 }}
        >
          <a
            href="https://www.youtube.com/watch?v=dku79-2_SCQ&t=24s"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black text-xs sm:text-sm px-4 py-1 cursor-pointer text-center hover:bg-black hover:text-white transition-all duration-500 rounded"
          >
            full moon. (fall in tokyo)
          </a>
        </motion.footer>
      </motion.div>
    </motion.div>
  );
}
