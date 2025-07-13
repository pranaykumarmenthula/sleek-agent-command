
import { Mail, MessageCircle, Calendar, FileText, Database, Camera, Music, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const integrations = [
  { name: "Gmail", icon: Mail, color: "text-red-500" },
  { name: "Slack", icon: MessageCircle, color: "text-purple-500" },
  { name: "Google Calendar", icon: Calendar, color: "text-blue-500" },
  { name: "Notion", icon: FileText, color: "text-gray-700 dark:text-gray-300" },
  { name: "Airtable", icon: Database, color: "text-yellow-600" },
  { name: "Instagram", icon: Camera, color: "text-pink-500" },
  { name: "Spotify", icon: Music, color: "text-green-500" },
  { name: "Shopify", icon: ShoppingCart, color: "text-green-600" }
];

export const Integrations = () => {
  return (
    <section className="py-24 px-4 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text">
            Connect Everything
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Seamlessly integrate with your favorite apps and services
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 mb-12">
          {integrations.map((integration, index) => (
            <div 
              key={index}
              className="group flex flex-col items-center p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-700/60 transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <integration.icon className={`w-8 h-8 ${integration.color}`} />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
                {integration.name}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">And 90+ more integrations</p>
          <Link to="/integrations">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:scale-105 transition-transform duration-300 cursor-pointer">
              View All Integrations
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
