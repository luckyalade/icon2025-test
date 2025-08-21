import React from "react";

const BackgroundVideo = () => {
  return (
    <div
      className="video_wrapper_inner absolute top-0 left-0"
      style={{ width: "100%", height: "100vh", position: "absolute" }}
    >
      <video
        className="video_embed"
        autoPlay
        playsInline
        muted
        loop
        id="video_179"
        style={{
          opacity: 1,
          width: "100%",
          height: "100%",
          zIndex: 2,
          visibility: "visible",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <source
          src="/BRENT-FULL-MOON-SITE-MAIN-COMPRESSED.mp4"
          type="video/mp4"
        />
      </video>
      <div
        className="image_overlay"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundSize: "512px 512px",
          backgroundImage:
            'url("https://icon2025.com/_jsapps/backdrop/video/assets/noise.png")',
          display: "block",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />
      <div className="bg-gray-200/40 absolute top-0 left-0 right-0 bottom-0 w-full h-full z-[2]" />
    </div>
  );
};

export default BackgroundVideo;
