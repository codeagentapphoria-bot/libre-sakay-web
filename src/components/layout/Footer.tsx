export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-700">
          {/* Brand with Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="/assets/Borongan City official seal design.png" 
              alt="Libre Sakay" 
              className="w-12 h-12 rounded-xl object-contain"
            />
            <div>
              <span className="font-bold text-white text-lg">LIBRE SAKAY</span>
              <p className="text-xs text-primary-400 font-semibold">BORONGAN CITY</p>
            </div>
          </div>
          
          {/* Partner Logos */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src="/assets/Borongan City official seal design.png" 
                alt="Borongan City" 
                className="w-10 h-10 rounded-xl object-contain"
              />
              <span className="text-sm text-gray-400 hidden sm:inline">Borongan City</span>
            </div>
            <div className="w-px h-8 bg-gray-700"></div>
            <div className="flex items-center gap-2">
              <img 
                src="/assets/Vibrant DA logo with leaf element.png" 
                alt="Dept. of Agriculture" 
                className="w-10 h-10 rounded-xl object-contain"
              />
              <span className="text-sm text-gray-400 hidden sm:inline">Dept. of Agriculture</span>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Free bus ride program for Senior Citizens, PWDs, and Students
          </p>
          
          <p className="text-xs text-gray-600">
            © 2026 City Government of Borongan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
