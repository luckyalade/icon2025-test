import React, { useState } from "react";
//eslint-disable-next-line
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";

const Modal = ({ isOpen, onClose }) => {
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
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4 md:px-0"
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-200 w-[400px] h-[500px] md:h-[600px] shadow-md rounded-sm overflow-hidden border-2 border-[#4895e5] flex flex-col"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        {/* Title Bar */}
        <div className="flex justify-between items-center bg-gradient-to-b from-[#428bef] to-[#428bef] px-2 py-1">
          <span className="text-white font-semibold text-sm">Mail</span>

          <button
            aria-label="Close"
            onClick={onClose}
            className="px-1 bg-red-400 hover:bg-red-500 text-white text-xs font-light border border-gray-600 transition-all duration-300"
          >
            x
          </button>
        </div>

        {/* Content area */}
        <div className="flex-grow p-3 text-black font-medium overflow-y-auto">
          {/* You can add other content here above the form */}
          <Typewriter
            options={{
              cursor: "", // hides the blinking cursor
            }}
            onInit={(typewriter) => {
              typewriter
                .pauseFor(300)
                .typeString("welcome to icon")
                .pauseFor(500)
                .typeString(".")
                .pauseFor(500)
                .typeString(".")
                .pauseFor(500)
                .typeString(".")
                .pauseFor(500)
                .typeString("<br/><br/>")
                .typeString("please take a second to calibrate your senses")
                .typeString(".")
                .pauseFor(500)
                .typeString(".")
                .pauseFor(500)
                .typeString(".")
                .pauseFor(500)
                .typeString("<br/><br/>")
                .typeString("send us a message if you wish")
                .pauseFor(500)
                .typeString(".")
                .start();
            }}
          />
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
            className="mt-3 py-2 px-4 bg-[#428bef] hover:bg-[#0968e5] text-white rounded shadow text-sm transition-all duration-300"
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
