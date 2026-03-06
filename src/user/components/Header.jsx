import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from '/BFP-LOGO.png';

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/officers', label: 'Officers' },
    { path: '/contact', label: 'Contact Us' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(255, 248, 248, 0.97)'
          : 'rgba(255, 245, 245, 1)',
        borderBottom: scrolled
          ? '1px solid rgba(220,38,38,0.2)'
          : '1px solid rgba(220,38,38,0.1)',
        boxShadow: scrolled
          ? '0 4px 24px rgba(180,0,0,0.12), 0 1px 0 rgba(220,38,38,0.1)'
          : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #b91c1c, #dc2626, #f97316, #dc2626, #b91c1c)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={Logo}
              alt="BFP Logo"
              className="w-12 h-12 rounded-full object-cover transition-all duration-300 group-hover:scale-105"
              style={{
                border: '2px solid #dc2626',
                boxShadow: '0 4px 14px rgba(220,38,38,0.3)',
              }}
            />
            <div>
              <p
                className="font-extrabold text-lg tracking-wide"
                style={{ color: '#1a0000' }}
              >
                BURGOS FIRE SUB-STATION 
              </p>
              <p
                className="text-[10px] tracking-widest uppercase font-semibold"
                style={{ color: '#dc2626' }}
              >
                Bureau of Fire Protection · CDO
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200"
                style={
                  isActive(link.path)
                    ? {
                        color: '#b91c1c',
                        background: 'rgba(220,38,38,0.08)',
                        boxShadow: 'inset 0 0 0 1px rgba(220,38,38,0.2)',
                      }
                    : {
                        color: '#4b1111',
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.color = '#b91c1c';
                    e.currentTarget.style.background = 'rgba(220,38,38,0.07)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.color = '#4b1111';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Emergency Button */}
            <a
              href="tel:911"
              className="ml-3 px-5 py-2 rounded-xl font-bold text-sm text-white flex items-center gap-1 transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #b91c1c, #dc2626)',
                boxShadow: '0 4px 14px rgba(185,28,28,0.4)',
              }}
            >
              <Phone size={15} />
              911
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200"
            style={{
              background: 'rgba(220,38,38,0.07)',
              border: '1px solid rgba(220,38,38,0.2)',
              color: '#b91c1c',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden pb-5 pt-3"
            style={{ borderTop: '1px solid rgba(220,38,38,0.15)' }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                style={
                  isActive(link.path)
                    ? {
                        color: '#b91c1c',
                        background: 'rgba(220,38,38,0.08)',
                      }
                    : {
                        color: '#4b1111',
                      }
                }
              >
                {link.label}
              </Link>
            ))}

            <a
              href="tel:911"
              className="flex items-center justify-center gap-2 mt-3 px-4 py-3 rounded-xl font-bold text-sm text-white"
              style={{
                background: 'linear-gradient(135deg, #b91c1c, #dc2626)',
                boxShadow: '0 4px 14px rgba(185,28,28,0.35)',
              }}
            >
              <Phone size={16} />
              Emergency: Call 911
            </a>
          </div>
        )}
      </div>
    </header>
  );
}