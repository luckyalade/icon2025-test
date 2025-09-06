import BackgroundVideo from "./components/BackgroundVideo";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import { AuthProvider } from "./contexts/AuthContext";
import AdminPage from "./pages/AdminPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//eslint-disable-next-line
import { motion } from "framer-motion";

function App() {
  return (
    <AuthProvider>
      <Router>
        <motion.div
          className="min-h-screen relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <BackgroundVideo />
          <Header />
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </motion.div>
      </Router>
    </AuthProvider>
  );
}

export default App;
