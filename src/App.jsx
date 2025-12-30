import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnimatedCursor from './components/AnimatedCursor';
import ParticleBackground from './components/ParticleBackground';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
import Achievements from './sections/Achievements';
import CpAnalysis from './sections/CpAnalysis';
import Footer from './sections/Footer';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AllProjects from './pages/AllProjects';
import ProtectedRoute from './components/ProtectedRoute';
import Analysis from './pages/Analysis';
import './index.css';

const HomePage = () => {
  return (
    <main>
      <ParticleBackground />
      <Hero />
      <Projects />
      <Achievements />
      <CpAnalysis />
      <Footer />
    </main>
  );
};

function App() {
  return (
    <Router>
      <AnimatedCursor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/projects" element={<AllProjects />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
