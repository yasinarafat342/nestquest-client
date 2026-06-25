import { Link } from "react-router-dom";
import { FiHome, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaXTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white font-display font-bold text-xl mb-4">
              <FiHome className="text-primary-500" />
              <span>Nest<span className="text-primary-500">Quest</span></span>
            </div>
            <p className="text-sm leading-relaxed">
              Find your perfect rental home with ease. Connect with trusted property owners across Bangladesh.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="hover:text-white transition-colors"><FaXTwitter /></a>
              <a href="#" className="hover:text-white transition-colors"><FaFacebook /></a>
              <a href="#" className="hover:text-white transition-colors"><FaInstagram /></a>
              <a href="#" className="hover:text-white transition-colors"><FaLinkedin /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/properties" className="hover:text-white transition-colors">All Properties</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="text-white font-semibold mb-4">Property Types</h4>
            <ul className="space-y-2 text-sm">
              {["Apartment", "House", "Villa", "Studio", "Office", "Shop"].map(t => (
                <li key={t}>
                  <Link to={`/properties?propertyType=${t}`} className="hover:text-white transition-colors">{t}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><FiMapPin className="text-primary-500" /> Dhaka, Bangladesh</li>
              <li className="flex items-center gap-2"><FiPhone className="text-primary-500" /> +880 1700 000000</li>
              <li className="flex items-center gap-2"><FiMail className="text-primary-500" /> hello@nestquest.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
          <p>© {new Date().getFullYear()} NestQuest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
