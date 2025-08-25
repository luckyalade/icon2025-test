import React, { useState, useRef, useEffect } from "react";
import CardStackModal from "./LookBook";
// eslint-disable-next-line
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Modal from "./WindowsModal";
import VideoSection from "./VideoSection";

const LARGE_BURNING =
  "https://freight.cargo.site/t/original/i/ebe9ab5e73c964815f0062d9e4d8358c30f1b6fc9bb2b43c8bbae30594c18ecc/BurningIcon.png";
const LARGE_TRASH =
  "https://freight.cargo.site/t/original/i/88421d4355a4dbbca364e407cb2fb44cb32396b712eacf0951809ef88ee288f3/Asset-9300x.png";

function useImagePreload(urls) {
  const [loaded, setLoaded] = useState({});
  useEffect(() => {
    let mounted = true;
    urls.forEach((url) => {
      const img = new Image();
      img.onload = () => mounted && setLoaded((p) => ({ ...p, [url]: true }));
      img.onerror = () => mounted && setLoaded((p) => ({ ...p, [url]: false }));
      img.src = url;
    });
    return () => {
      mounted = false;
    };
  }, [urls]);
  return loaded;
}

const MainContent = () => {
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const [openBurning, setOpenBurning] = useState(false);
  const [openTrash, setOpenTrash] = useState(false);
  const constraintsRef = useRef(null);

  // 👇 Track drag state
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = (callback) => {
    if (!isDragging) callback();
  };

  const dragEvents = {
    onDragStart: () => setIsDragging(true),
    onDragEnd: () => setTimeout(() => setIsDragging(false), 50),
  };

  const originalTitle = useRef(document.title);

  useEffect(() => {
    if (openVideo) {
      document.title = "full moon. -ICON2025";
    } else {
      document.title = originalTitle.current;
    }
  }, [openVideo]);

  const iconBase =
    "w-24 min-h-[110px] flex flex-col justify-start items-center text-center shadow-2xl shadow-transparent cursor-pointer";

  // Preload large images
  const loaded = useImagePreload([LARGE_BURNING, LARGE_TRASH]);

  return (
    <LayoutGroup id="desktop">
      <main
        className="z-10 relative w-full h-screen flex flex-col justify-start items-start gap-4 pt-14 pl-4 md:pl-10 overflow-hidden"
        ref={constraintsRef}
      >
        {/* Folder */}
        <motion.section
          className={iconBase}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          whileTap={{ scale: 0.9 }}
          {...dragEvents}
          onClick={() => handleClick(() => setOpenVideo(true))}
        >
          <img
            src="/folder-icon.png"
            alt="folder"
            className="w-12 md:w-16 drop-shadow-sm drop-shadow-gray-400/90"
          />
          <p className="text-gray-50/90 text-xs mt-2 text-shadow-lg leading-tight">
            full moon.(fall in tokyo)
          </p>
        </motion.section>

        {/* Trash */}
        <motion.section
          className={iconBase}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          {...dragEvents}
          onClick={() => handleClick(() => setOpenTrash(true))}
        >
          <AnimatePresence>
            {!openTrash && (
              <motion.div
                layoutId="trashIcon"
                key="trashIconSmall"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="drop-shadow-sm drop-shadow-gray-400/90"
                style={{ width: 64, height: 64 }}
              >
                <img
                  src="/trashcan-icon.png"
                  alt="trash"
                  className="w-full h-full object-contain"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <p className="text-gray-50/90 text-xs mt-2 text-shadow-lg leading-tight">
            TRASH
          </p>
        </motion.section>

        {/* Burning Icon */}
        <motion.section
          className={iconBase}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          {...dragEvents}
          onClick={() => handleClick(() => setOpenBurning(true))}
        >
          <AnimatePresence>
            {!openBurning && (
              <motion.div
                layoutId="burningIcon"
                key="burningIconSmall"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="drop-shadow-sm drop-shadow-gray-400/90"
                style={{ width: 62, height: 62 }}
              >
                <img
                  src="/burningIcon.png"
                  alt="burning"
                  className="w-full h-full object-contain"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <p className="text-gray-50/90 text-xs mt-2 text-shadow-lg leading-tight">
            Burning Icon
          </p>
        </motion.section>

        {/* Lookbook */}
        <motion.section
          className={iconBase}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          whileTap={{ scale: 0.9 }}
          {...dragEvents}
          onClick={() => handleClick(() => setShowModal(true))}
        >
          <img
            src="/lookbook1-icon.png"
            alt="lookbook"
            className="w-14 drop-shadow-sm drop-shadow-gray-400/90"
          />
          <p className="text-gray-50/90 text-xs mt-2 text-shadow-lg leading-tight">
            Lookbook1
          </p>
        </motion.section>

        {/* Contact */}
        <motion.section
          className={iconBase}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          whileTap={{ scale: 0.9 }}
          {...dragEvents}
          onClick={() => handleClick(() => setOpen(true))}
        >
          <img
            src="/icons8-email-144.png"
            alt="contact"
            className="w-[68px] drop-shadow-sm drop-shadow-gray-400/90 opacity-80"
          />
          <p className="text-gray-50/90 text-xs mt-2 text-shadow-lg leading-tight">
            MAIL
          </p>
        </motion.section>

        {/* Lookbook Modal */}
        <CardStackModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          cardsData={[
            { id: 1, img: "/brent-faiyaz/brent-faiyaz-one.jpg" },
            { id: 2, img: "/brent-faiyaz/brent-faiyaz-two.jpg" },
            { id: 3, img: "/brent-faiyaz/brent-faiyaz-three.jpg" },
            { id: 4, img: "/brent-faiyaz/brent-faiyaz-four.jpg" },
            { id: 5, img: "/brent-faiyaz/brent-faiyaz-five.jpg" },
            { id: 6, img: "/brent-faiyaz/brent-faiyaz-six.jpg" },
          ]}
        />

        {/* Contact Modal */}
        <Modal isOpen={open} onClose={() => setOpen(false)} />

        {/* Video Modal */}
        <VideoSection isOpen={openVideo} onClose={() => setOpenVideo(false)} />

        {/* Burning Icon Modal */}
        <AnimatePresence mode="wait">
          {openBurning && (
            <motion.div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenBurning(false)}
            >
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  className="absolute -top-10 right-0 text-white text-2xl"
                  onClick={() => setOpenBurning(false)}
                >
                  ✕
                </button>
                <motion.div
                  layoutId="burningIcon"
                  key="burningIconLarge"
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="rounded-full drop-shadow-2xl overflow-hidden w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px]"
                >
                  {!loaded[LARGE_BURNING] && (
                    <div className="w-full h-full grid place-items-center text-white/70 text-sm">
                      Loading…
                    </div>
                  )}
                  <img
                    src={LARGE_BURNING}
                    alt="Burning Icon Large"
                    className="w-full h-full object-contain"
                    style={{
                      display: loaded[LARGE_BURNING] ? "block" : "none",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trash Modal */}
        <AnimatePresence mode="wait">
          {openTrash && (
            <motion.div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenTrash(false)}
            >
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  className="absolute -top-10 right-0 text-white text-2xl"
                  onClick={() => setOpenTrash(false)}
                >
                  ✕
                </button>
                <motion.div
                  layoutId="trashIcon"
                  key="trashIconLarge"
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="drop-shadow-2xl overflow-hidden w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px]"
                >
                  {!loaded[LARGE_TRASH] && (
                    <div className="w-full h-full grid place-items-center text-white/70 text-sm">
                      Loading…
                    </div>
                  )}
                  <img
                    src={LARGE_TRASH}
                    alt="Trash Large"
                    className="w-full h-full object-contain"
                    style={{
                      display: loaded[LARGE_TRASH] ? "block" : "none",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </LayoutGroup>
  );
};

export default MainContent;
