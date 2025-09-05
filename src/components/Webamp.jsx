// WebampReactApp.jsx
import React, { useEffect, useRef, useState } from "react";
import Webamp from "webamp";
//eslint-disable-next-line
import { motion } from "framer-motion";

// Global flag to prevent multiple instances
let globalWebampInstance = null;
let isInitializing = false;

const initialTracks = [
  {
    metaData: {
      artist: "Brent Faiyaz",
      title: "Full Moon - M9 - Loud",
    },
    url: "https://dl.dropboxusercontent.com/scl/fi/jt2ek6rw1y4ix9uhg61iu/Full-Moon-M9-Loud.wav?rlkey=3iuswtkrh77p7ttxzpr8p16gv",
    // duration: 3.3,
  },
  {
    metaData: {
      artist: "Brent Faiyaz",
      title: "Brent Faiyaz - if. (spring in new york)",
    },
    url: "/Brent_Faiyaz-if.(spring in new york).mp3",
    // duration: 3.3,
  },
];

// Define the AOL Instant Messenger Amp skin as our default
const AOL_INSTANT_MESSENGER_AMP_SKIN = {
  url: "https://cdn.jsdelivr.net/gh/luckyalade/winamp-skins-1@main/alade_5.wsz.zip",
  name: "Icon Radio",
};

const availableSkins = [
  AOL_INSTANT_MESSENGER_AMP_SKIN,
  {
    url: "https://cdn.jsdelivr.net/gh/luckyalade/winamp-skins-1@main/alade_5.wsz.zip",
    name: "Icon Radio",
  },
];

const WebampReactApp = ({ changeSkinTrigger }) => {
  const playerRef = useRef(null);
  const webampInstance = useRef(null);
  const [currentSkinIndex, setCurrentSkinIndex] = useState(0);
  const unsubscribeRef = useRef(null);

  // Handler for changing skin when background is tapped
  const handleBackgroundTap = (e) => {
    // Only change skin if the click/tap is directly on the background container
    // and not on any Webamp elements
    if (e.target === e.currentTarget && webampInstance.current) {
      const nextIndex = (currentSkinIndex + 1) % availableSkins.length;
      const nextSkin = availableSkins[nextIndex];
      console.log("Changing to skin:", nextSkin.name);
      webampInstance.current.setSkinFromUrl(nextSkin.url);
      setCurrentSkinIndex(nextIndex);
    }
  };

  // Effect to change skin when changeSkinTrigger changes
  useEffect(() => {
    if (changeSkinTrigger !== undefined && webampInstance.current) {
      const nextIndex = (currentSkinIndex + 1) % availableSkins.length;
      const nextSkin = availableSkins[nextIndex];
      console.log("Changing to skin:", nextSkin.name);
      webampInstance.current.setSkinFromUrl(nextSkin.url);
      setCurrentSkinIndex(nextIndex);
    }
  }, [changeSkinTrigger]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === "p" && webampInstance.current) {
        const nextIndex = (currentSkinIndex + 1) % availableSkins.length;
        const nextSkin = availableSkins[nextIndex];
        console.log("Changing to skin:", nextSkin.name);
        webampInstance.current.setSkinFromUrl(nextSkin.url);
        setCurrentSkinIndex(nextIndex);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentSkinIndex]);

  useEffect(() => {
    let isDisposed = false;
    let initializationPromise = null;

    const initWebamp = async () => {
      try {
        // Prevent multiple initializations globally
        if (isInitializing || globalWebampInstance) {
          console.log("Webamp already initializing or exists, skipping...");
          return;
        }

        isInitializing = true;

        // Prevent multiple initializations
        if (webampInstance.current || initializationPromise) {
          isInitializing = false;
          return;
        }

        if (playerRef.current) {
          playerRef.current.innerHTML = "";
        }

        if (!isDisposed) {
          initializationPromise = (async () => {
            const webamp = new Webamp({
              initialTracks,
              availableSkins,
              initialSkin: AOL_INSTANT_MESSENGER_AMP_SKIN,
              __butterchurnOptions: {
                importButterchurn: () => Promise.resolve(window.butterchurn),
                getPresets: () => {
                  const presets = window.butterchurnPresets.getPresets();
                  return Object.keys(presets).map((name) => {
                    return {
                      name,
                      butterchurnPresetObject: presets[name],
                    };
                  });
                },
                butterchurnOpen: false,
                windowTitle: "Brent Faiyaz",
              },
              initialWindowLayout: {
                main: { position: { x: 0, y: 0 } },
                equalizer: { position: { x: 0, y: 116 } },
                playlist: { position: { x: 0, y: 232 }, size: [0, 4] },
                milkdrop: {
                  position: { x: 275, y: 0 },
                  size: [275, 116],
                  title: "Icon Radio",
                },
              },
            });

            if (!isDisposed && playerRef.current) {
              await webamp.skinIsLoaded();
              await webamp.renderWhenReady(playerRef.current);
              if (!isDisposed) {
                webampInstance.current = webamp;
                globalWebampInstance = webamp;
                console.log("Webamp initialized and rendered");
              } else {
                webamp.dispose();
              }
            } else {
              webamp.dispose();
            }

            initializationPromise = null;
            isInitializing = false;
          })();

          await initializationPromise;
        }
      } catch (error) {
        console.error("Error initializing Webamp:", error);
        initializationPromise = null;
        isInitializing = false;
      }
    };

    initWebamp();

    return () => {
      isDisposed = true;

      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      if (webampInstance.current) {
        try {
          webampInstance.current.dispose();
          webampInstance.current = null;
          globalWebampInstance = null;
        } catch (error) {
          console.error("Error disposing Webamp:", error);
        }
      }

      // Clear the player container
      if (playerRef.current) {
        playerRef.current.innerHTML = "";
      }

      // Reset global flags
      isInitializing = false;
    };
  }, []);

  return (
    <motion.div
      className="absolute left-1/2 top-[45%] -translate-x-1/2 translate-y-1/2"
      onClick={handleBackgroundTap}
      onTouchEnd={(e) => {
        if (e.target === e.currentTarget) {
          handleBackgroundTap(e);
        }
      }}
    >
      {/* Webamp Player */}
      <motion.div
        ref={playerRef}
        style={{ height: "auto", width: "auto" }}
        tabIndex={0}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      ></motion.div>
    </motion.div>
  );
};

export default WebampReactApp;
