import { FaTwitter, FaLinkedin, FaYoutube, FaGlobe } from "react-icons/fa";

const socialLinks = [
  { href: "https://twitter.com/globalbusan", icon: <FaTwitter />, label: "Twitter" },
  { href: "https://linkedin.com/company/globalbusan", icon: <FaLinkedin />, label: "LinkedIn" },
  { href: "https://youtube.com/@globalbusan", icon: <FaYoutube />, label: "YouTube" },
  { href: "https://globalbusan.com", icon: <FaGlobe />, label: "Website" },
];

const Footer = () => {
  return (
    <footer className="w-screen bg-gradient-to-r from-gray-900 to-blue-900 py-12 text-white">
      <div className="container mx-auto px-5 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold text-white mb-4">Global BUSAN</h3>
            <p className="text-lg text-blue-200 mb-6 max-w-md">
              Transforming Busan into a global business hub through transparent, blockchain-powered collaboration.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-300"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#equity" className="text-blue-200 hover:text-white transition-colors">Equity Structure</a></li>
              <li><a href="#reports" className="text-blue-200 hover:text-white transition-colors">Reports</a></li>
              <li><a href="#roadmap" className="text-blue-200 hover:text-white transition-colors">Roadmap</a></li>
              <li><a href="#contact" className="text-blue-200 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold text-white mb-4">Contact</h4>
            <div className="space-y-2 text-blue-200">
              <p>info@globalbusan.com</p>
              <p>+82 51 123 4567</p>
              <p>Busan, South Korea</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-blue-200 mb-4 md:mb-0">
              © 2025 Global BUSAN. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#privacy-policy" className="text-blue-200 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-blue-200 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;