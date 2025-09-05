import React, { useState, useRef, useEffect } from "react";
import CardStackModal from "./LookBook";
// eslint-disable-next-line
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Modal from "./WindowsModal";
import VideoSection from "./VideoSection";
import WebampReactApp from "./Webamp";
import FolderIcon from "./FolderIcon";

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
  const [openFullMoonVideo, setOpenFullMoonVideo] = useState(false);
  const [openIfVideo, setOpenIfVideo] = useState(false);
  const [openBurning, setOpenBurning] = useState(false);
  const [openTrash, setOpenTrash] = useState(false);
  const [showWebamp, setShowWebamp] = useState(false);
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
    if (openFullMoonVideo) {
      document.title = "full moon. -ICON2025";
    } else {
      document.title = originalTitle.current;
    }
  }, [openFullMoonVideo]);

  useEffect(() => {
    if (openIfVideo) {
      document.title = "if. (spring in new york)";
    } else {
      document.title = originalTitle.current;
    }
  }, [openIfVideo]);

  const iconBase =
    "w-fit min-h-[90px] flex flex-col justify-start items-center text-center shadow-2xl shadow-transparent cursor-pointer";

  // Preload large images
  const loaded = useImagePreload([LARGE_BURNING, LARGE_TRASH]);

  return (
    <LayoutGroup id="desktop">
      <main
        className="relative w-full h-screen flex flex-col justify-start items-start gap-2 pt-14 pl-4 md:pl-10 overflow-hidden"
        ref={constraintsRef}
      >
        {showWebamp && <WebampReactApp key="webamp-singleton" />}

        {/* All Icons in Single Column */}
        <div className="flex flex-col gap-2">
          <motion.section
            className={iconBase}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            {...dragEvents}
          >
            <FolderIcon
              title="if. (spring in new york)"
              onClick={() => handleClick(() => setOpenIfVideo(true))}
              index={0}
            />
          </motion.section>

          {/* Folder */}
          <motion.section
            className={iconBase}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            {...dragEvents}
          >
            <FolderIcon
              title="full moon.(fall in tokyo)"
              onClick={() => handleClick(() => setOpenFullMoonVideo(true))}
              index={1}
            />
          </motion.section>

          {/* Webamp Player */}
          <motion.section
            className={iconBase}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            {...dragEvents}
          >
            <FolderIcon
              title={showWebamp ? "hide player" : "show player"}
              onClick={() => handleClick(() => setShowWebamp(!showWebamp))}
              index={2}
            />
          </motion.section>

          {/* Trash */}
          <motion.section
            className={iconBase}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            transition={{ duration: 0.2 }}
            {...dragEvents}
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
                  className=""
                  style={{ width: 64, height: 64 }}
                >
                  <FolderIcon
                    title="trash"
                    onClick={() => handleClick(() => setOpenTrash(true))}
                    index={3}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>


          {/* <motion.section
            className={iconBase}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            {...dragEvents}
          >
            <FolderIcon
              title="if. (spring in new york)"
              onClick={() => handleClick(() => setOpenIfVideo(true))}
              index={3}
            />
          </motion.section> */}

          {/* Burning Icon */}
          {/* <motion.section
            className={iconBase}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            transition={{ duration: 0.2 }}
            {...dragEvents}
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
                  className=""
                  style={{ width: 62, height: 62 }}
                >
                  <FolderIcon
                    title="burning icon"
                    onClick={() => handleClick(() => setOpenBurning(true))}
                    index={3}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section> */}

          {/* Lookbook */}
          {/* <motion.section
            className={iconBase}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            {...dragEvents}
          >
            <FolderIcon
              title="lookbook1"
              onClick={() => handleClick(() => setShowModal(true))}
              index={4}
            />
          </motion.section> */}

          {/* Contact */}
          <motion.section
            className={iconBase}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            {...dragEvents}
          >
            <FolderIcon
              title="mail"
              onClick={() => handleClick(() => setOpen(true))}
              index={4}
            />
          </motion.section>
        </div>



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

        {/*Full Moon Video Modal */}
        <VideoSection  
        isOpen={openFullMoonVideo}
        onClose={() => setOpenFullMoonVideo(false)}
        videoId="dku79-2_SCQ"
        title="Brent Faiyaz - full moon"
        downloadUrl={null}
        downloadText="Full Moon - M8 - Loud"
        />

        {/* if. (spring in new york) Video Modal */}
        <VideoSection  
        isOpen={openIfVideo}
        onClose={() => setOpenIfVideo(false)}
        videoId="4L306Dv4PmY"
        title="Brent Faiyaz - if. (spring in new york)"
        downloadUrl="https://www.youtube.com/watch?v=4L306Dv4PmY"
        downloadText="Watch if. (spring in new york) on youtube"
        />

        {/* Burning Icon Modal */}
        {/* <AnimatePresence mode="wait">
          {openBurning && (
            <motion.div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-30"
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
                    className="w-full h-full object-contain "
                    style={{
                      display: loaded[LARGE_BURNING] ? "block" : "none",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence> */}

        {/* Trash Modal */}
        <AnimatePresence mode="wait">
          {openTrash && (
            <motion.div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-30"
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
