
import { Mail, MessageCircle, Calendar, FileText, Database, Camera, Music, ShoppingCart } from "lucide-react";

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
    <section id="integrations" className="py-24 px-6 glass">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Connect Everything
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Seamlessly integrate with your favorite apps and services
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 mb-12">
          {integrations.map((integration, index) => (
            <div 
              key={index}
              className="group flex flex-col items-center p-6 rounded-2xl glass hover:glow transition-all duration-300 hover:scale-110 fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <integration.icon className={`w-8 h-8 ${integration.color}`} />
              </div>
              <span className="text-sm font-medium text-center">
                {integration.name}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center fade-in">
          <p className="text-muted-foreground mb-4">And 90+ more integrations</p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium hover:scale-105 transition-transform duration-300 cursor-pointer glow">
            View All Integrations
          </div>
        </div>
      </div>
    </section>
  );
};
