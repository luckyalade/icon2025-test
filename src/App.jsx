import BackgroundVideo from "./components/BackgroundVideo";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import { AuthProvider } from "./contexts/AuthContext";
//eslint-disable-next-line
import { motion } from "framer-motion";

function App() {
  return (
    <AuthProvider>
      <motion.div
        className="min-h-screen relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <BackgroundVideo />
        <Header />
        <MainContent />
      </motion.div>
    </AuthProvider>
  );
}

export default App;
