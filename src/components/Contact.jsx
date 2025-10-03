import Button from "./Button";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="container mx-auto px-5 sm:px-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8">
            Get <span className="text-blue-300">In Touch</span>
          </h2>
          <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            Ready to be part of transforming Busan into a global business hub? 
            Contact us to learn more about how you can contribute to this vision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-3xl font-bold text-white mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">Email</div>
                    <div className="text-blue-200">info@globalbusan.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <FaPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">Phone</div>
                    <div className="text-blue-200">+82 51 123 4567</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <FaMapMarkerAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">Address</div>
                    <div className="text-blue-200">Busan, South Korea</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <FaGlobe className="text-white text-xl" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">Website</div>
                    <div className="text-blue-200">www.globalbusan.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h3 className="text-3xl font-bold text-white mb-8">Send us a Message</h3>
            
            <form className="space-y-6">
              <div>
                <label className="block text-white font-semibold text-lg mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-white font-semibold text-lg mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-white font-semibold text-lg mb-2">Message</label>
                <textarea 
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about your interest in the project..."
                ></textarea>
              </div>
              
              <Button 
                title="Send Message" 
                containerClass="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-xl font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;