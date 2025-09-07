import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import AdminLogin from "../components/AdminLogin";
import AdminDashboard from "../components/AdminDashboard";
import FolderIcon from "../components/FolderIcon";
import { motion } from "framer-motion";

const AdminPage = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  
  const { isAdmin } = useAuth();

  // Handle admin access
  const handleAdminAccess = () => {
    if (isAdmin) {
      setShowAdminDashboard(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  // Auto-open appropriate modal on page load
  React.useEffect(() => {
    handleAdminAccess();
  }, [isAdmin]);

  const constraintsRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = (callback) => {
    if (!isDragging) callback();
  };

  const dragEvents = {
    onDragStart: () => setIsDragging(true),
    onDragEnd: () => setTimeout(() => setIsDragging(false), 50),
  };

  const iconBase =
    "w-fit min-h-[90px] flex flex-col justify-start items-center text-center shadow-2xl shadow-transparent cursor-pointer";

  return (
    <main
      className="relative w-full h-screen flex flex-col justify-start items-start gap-2 pt-14 pl-4 md:pl-10 overflow-hidden"
      ref={constraintsRef}
      style={{
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 700,
      }}
    >
      {/* Admin Folder Icon */}
      <div className="flex flex-col gap-2">
        {!showAdminLogin && !showAdminDashboard && (
          <motion.section
            className={iconBase}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            {...dragEvents}
          >
            <FolderIcon
              title={isAdmin ? "admin dashboard" : "login to icon"}
              onClick={() => handleClick(handleAdminAccess)}
              index={0}
            />
          </motion.section>
        )}
      </div>
        
      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin onClose={() => setShowAdminLogin(false)} />
      )}
      
      {/* Admin Dashboard Modal */}
      {showAdminDashboard && (
        <AdminDashboard 
          isOpen={showAdminDashboard} 
          onClose={() => setShowAdminDashboard(false)} 
        />
      )}
    </main>
  );
};

export default AdminPage;
