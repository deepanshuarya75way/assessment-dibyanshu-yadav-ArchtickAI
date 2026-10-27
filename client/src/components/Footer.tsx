import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full py-12 px-4 md:px-16 lg:px-24 bg-transparent border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-gray-400 text-sm font-medium">© 2026 AI website builder - DevSphere</p>
          <p className="text-gray-500 text-xs text-center md:text-left">Empowering creativity with artificial intelligence.</p>
        </div>
        
        <div className="flex gap-8 text-sm font-medium text-gray-400">
          <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
          <Link to="/pricing" className="hover:text-indigo-400 transition-colors">Pricing</Link>
          <Link to="/support" className="hover:text-indigo-400 transition-colors">Support</Link>
          <Link to="/community" className="hover:text-indigo-400 transition-colors">Community</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer