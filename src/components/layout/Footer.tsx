import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'Routes', path: '/routes' },
      { label: 'Schedule', path: '/schedule' },
    ],
    information: [
      { label: 'E-Services Portal', path: '/' },
      { label: 'Contact', path: '#' },
    ],
  };

  return (
    <footer className="bg-heading-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/Borongan City official seal design.png"
                alt="Borongan City Logo"
                className="h-10 w-10 rounded-xl object-contain"
              />
              <h3 className="text-lg font-semibold text-white">Libre Sakay</h3>
            </div>
            <p className="text-sm text-gray-300">
              Free bus ride program for Senior Citizens, Persons with Disabilities, and Students in Borongan City.
            </p>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white">Information</h4>
            <ul className="space-y-2">
              {footerLinks.information.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="text-sm text-gray-300">
                  City Hall, Borongan City, Eastern Samar
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-sm text-gray-300">(055) 261-2000</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/Borongan City official seal design.png"
                  alt="Borongan City"
                  className="w-8 h-8 rounded-lg object-contain"
                />
                <span className="text-sm text-gray-400">City Government of Borongan</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="/assets/Vibrant DA logo with leaf element.png"
                  alt="Department of Agriculture"
                  className="w-8 h-8 rounded-lg object-contain"
                />
                <span className="text-sm text-gray-400">Department of Agriculture</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              © {currentYear} Libre Sakay - Borongan City. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
