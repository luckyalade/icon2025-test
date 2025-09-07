import React, { useState } from "react";
//eslint-disable-next-line
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { saveSubmissionToFirebase, saveToLocalStorageFallback } from "../utils/firebaseUtils";

const MailModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === "" || message.trim() === "") return;
    
    setIsLoading(true);
    setSaveStatus("");
    
    try {
      // Try to save to Firebase first
      const firebaseResult = await saveSubmissionToFirebase({ 
        name: name.trim(), 
        message: message.trim() 
      });
      
      if (firebaseResult.success) {
        console.log("Message saved to Firebase:", { name, message });
        setSaveStatus("Message sent successfully!");
      } else {
        // Fallback to localStorage if Firebase fails
        console.warn("Firebase save failed, using localStorage fallback");
        const localResult = saveToLocalStorageFallback({ 
          name: name.trim(), 
          message: message.trim() 
        });
        
        if (localResult.success) {
          setSaveStatus("Message sent (saved locally)!");
        } else {
          throw new Error("Both Firebase and localStorage failed");
        }
      }
      
      setName(""); // clear name field after send
      setMessage(""); // clear textarea after send
      setSent(true); // show sent popup
      
      setTimeout(() => {
        setSent(false);
        setSaveStatus("");
      }, 3000); // hide popup after 3s
      
    } catch (error) {
      console.error("Error saving submission:", error);
      setSaveStatus("An error occurred. Please try again.");
      setTimeout(() => setSaveStatus(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4 md:px-0"
      style={{
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 700,
      }}
    >
      <motion.div
        className="bg-gray-200 w-[400px] h-[500px] md:h-[600px] shadow-md rounded-sm overflow-hidden border-2 border-[#0061a5] flex flex-col"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        {/* Title Bar */}
        <div className="flex justify-between items-center bg-gradient-to-b from-[#0061a5] to-[#0061a5] px-2 py-1">
          <span className="text-white font-semibold text-sm">Mail</span>

          <button
            aria-label="Close"
            onClick={onClose}
            className="px-1 bg-white hover:bg-[#9cd7e8] hover:text-black text-black text-xs font-bold border border-gray-600 transition-all duration-300 rounded-sm"
          >
            ✕
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
          <label htmlFor="name" className="text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-[#0061a5] text-sm font-medium mb-3"
            placeholder="Enter your name..."
          />
          <label htmlFor="message" className="text-sm font-medium mb-1">
            Your Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-2 border border-gray-400 rounded resize-none focus:outline-none focus:ring-2 focus:ring-[#0061a5] text-sm h-20 font-medium"
            placeholder="Type your message here..."
          />
          <button
            type="submit"
            disabled={isLoading}
            className="mt-3 py-2 px-4 bg-[#0061a5] hover:bg-[#0061a5] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded shadow text-sm transition-all duration-300"
          >
            {isLoading ? "Saving..." : "Send"}
          </button>
          
          {/* Status message */}
          {saveStatus && (
            <div className={`mt-2 text-xs text-center p-2 rounded ${
              saveStatus.includes("success") || saveStatus.includes("downloaded") 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {saveStatus}
            </div>
          )}
        </form>

        {/* Sent Popup */}
        {sent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 bg-green-700 text-white px-4 py-2 rounded shadow-lg text-sm"
          >
            ✅ Message Sent & Saved!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MailModal;
