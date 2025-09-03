import React from "react";
import { motion } from "framer-motion";

const FolderIcon = ({ title, onClick, index }) => {
  return (
    <motion.div
      className="flex flex-col items-start cursor-pointer select-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.2, duration: 0.4 }, // only entrance
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.15 }, // instant hover
      }}
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 }, // instant tap
      }}
      onClick={onClick}
    >
      {/* Folder Icon */}
      <div className="w-16 h-12 mb-2 relative">
        {/* Folder Back */}
        <div
          className="absolute inset-0 rounded-t-md rounded-br-md"
          style={{
            background: "linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)",
            boxShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          }}
        />
        {/* Folder Tab */}
        <div
          className="absolute top-0 left-2 w-6 h-3 rounded-t-sm"
          style={{
            background: "linear-gradient(135deg, #B0E0E6 0%, #87CEEB 100%)",
            boxShadow: "1px 1px 2px rgba(0,0,0,0.2)",
          }}
        />
        {/* Folder Front */}
        <div
          className="absolute top-2 left-0 right-0 bottom-0 rounded-md"
          style={{
            background: "linear-gradient(135deg, #B0E0E6 0%, #87CEEB 100%)",
            boxShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      {/* Folder Label */}
      <span
        className="text-white text-xs font-medium text-center w-full leading-tight"
        style={{
          textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        {title}
      </span>
    </motion.div>
  );
};

export default FolderIcon;
