import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/routes', label: 'Routes' },
  { href: '/schedule', label: 'Schedule' },
];

export default function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo with City Seal and DA Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 sm:gap-3 min-w-0 group"
            onClick={closeMobileMenu}
          >
            <img 
              src="/assets/Borongan City official seal design.png" 
              alt="Borongan City Seal" 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-heading-700 leading-none">LIBRE SAKAY</span>
              <span className="text-[9px] sm:text-[10px] tracking-widest text-primary-600 leading-none mt-0.5 font-medium">BORONGAN CITY</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-gray-200 mx-2"></div>
            <img 
              src="/assets/Vibrant DA logo with leaf element.png" 
              alt="Department of Agriculture" 
              className="hidden sm:block w-10 h-10 rounded-xl object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={clsx(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-primary-600 text-white"
                    : "text-heading-600 hover:bg-primary-50 hover:text-primary-700"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-heading-600 hover:bg-gray-100 min-w-touch min-h-touch flex items-center justify-center"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 mt-2 pt-2 border-t border-gray-100">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={closeMobileMenu}
                  className={clsx(
                    'px-4 py-3 rounded-lg text-base font-medium transition-colors min-h-touch flex items-center',
                    isActive(link.href)
                      ? 'bg-primary-600 text-white'
                      : 'text-heading-600 hover:bg-primary-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
