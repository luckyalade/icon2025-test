import React, { useState } from "react";
//eslint-disable-next-line
import { motion } from "framer-motion";

const Modal = ({ isOpen, onClose, children }) => {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    console.log("Message sent:", message);
    setMessage(""); // clear textarea after send
    setSent(true); // show sent popup
    setTimeout(() => setSent(false), 2000); // hide popup after 2s
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4 md:px-0">
      <motion.div
        className="bg-gray-200 w-[400px] h-[500px] md:h-[600px] shadow-md rounded-sm overflow-hidden border-2 border-[#42a5e9] flex flex-col"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        {/* Title Bar */}
        <div className="flex justify-between items-center bg-gradient-to-b from-[#428bef] to-[#428bef] px-2 py-1">
          <span className="text-white font-semibold text-sm">Contact</span>

          <button
            aria-label="Close"
            onClick={onClose}
            className="px-1 bg-red-400 text-white text-xs font-light border border-gray-600"
          >
            x
          </button>
        </div>

        {/* Content area */}
        <div className="flex-grow p-3 text-black font-medium overflow-y-auto">
          {/* You can add other content here above the form */}
          {children}
        </div>

        {/* Form at bottom */}
        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-gray-300 flex flex-col"
        >
          <label htmlFor="message" className="text-sm font-medium mb-1">
            Your Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-2 border border-gray-400 rounded resize-none focus:outline-none focus:ring-2 focus:ring-[#42a5e9] text-sm h-20 font-medium"
            placeholder="Type your message here..."
          />
          <button
            type="submit"
            className="mt-3 py-2 px-4 bg-[#428bef] hover:bg-[#428dee] text-white rounded shadow text-sm transition"
          >
            Send
          </button>
        </form>

        {/* Sent Popup */}
        {sent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg text-sm"
          >
            ✅ Message Sent!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Modal;
