
import { Mail, MessageCircle, Calendar, FileText, Database, Camera, Music, ShoppingCart } from "lucide-react";

const integrations = [
  { name: "Gmail", icon: Mail, color: "text-muted-foreground" },
  { name: "Slack", icon: MessageCircle, color: "text-muted-foreground" },
  { name: "Google Calendar", icon: Calendar, color: "text-muted-foreground" },
  { name: "Notion", icon: FileText, color: "text-muted-foreground" },
  { name: "Airtable", icon: Database, color: "text-muted-foreground" },
  { name: "Instagram", icon: Camera, color: "text-muted-foreground" },
  { name: "Spotify", icon: Music, color: "text-muted-foreground" },
  { name: "Shopify", icon: ShoppingCart, color: "text-muted-foreground" }
];

export const Integrations = () => {
  return (
    <section id="integrations" className="py-32 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
            Connect Everything
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            Seamlessly integrate with your favorite apps and services
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 mb-16">
          {integrations.map((integration, index) => (
            <div 
              key={index}
              className="flex flex-col items-center p-8 rounded-2xl glass-card hover:bg-secondary/20 soft-shadow hover:elevated-card group"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-105">
                <integration.icon className={`w-8 h-8 ${integration.color}`} />
              </div>
              <span className="text-sm font-medium text-center text-foreground">
                {integration.name}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-6 font-light">And 90+ more integrations</p>
          <div className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium subtle-glow cursor-pointer hover:shadow-lg">
            View All Integrations
          </div>
        </div>
      </div>
    </section>
  );
};
