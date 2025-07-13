
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-12 px-4 bg-white/40 backdrop-blur-sm border-t border-white/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              AI Agent
            </h3>
            <p className="text-gray-600 mb-4">
              Automate your workflow with intelligent AI assistance across all your favorite apps.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                <Twitter className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                <Linkedin className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                <Github className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Features</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Integrations</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Pricing</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">API</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="hover:text-blue-600 transition-colors cursor-pointer">About</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Blog</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Careers</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Help Center</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Documentation</li>
              <li className="hover-text-blue-600 transition-colors cursor-pointer">Community</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Status</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 mb-4 md:mb-0">
            © 2024 AI Agent. All rights reserved.
          </p>
          <div className="flex space-x-6 text-gray-600">
            <span className="hover:text-blue-600 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-blue-600 transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
