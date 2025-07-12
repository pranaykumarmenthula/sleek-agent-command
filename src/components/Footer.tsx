
import { Github, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-12 px-6 glass border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="fade-in">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              AI Agent
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Automate your workflow with intelligent AI assistance across all your favorite apps.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer glow">
                <Twitter className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer glow">
                <Linkedin className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer glow">
                <Github className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {[
            {
              title: "Product",
              links: ["Features", "Integrations", "Pricing", "API"]
            },
            {
              title: "Company", 
              links: ["About", "Blog", "Careers", "Contact"]
            },
            {
              title: "Support",
              links: ["Help Center", "Documentation", "Community", "Status"]
            }
          ].map((section, index) => (
            <div key={section.title} className="fade-in" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center fade-in">
          <p className="text-muted-foreground mb-4 md:mb-0">
            © 2024 AI Agent. All rights reserved.
          </p>
          <div className="flex space-x-6 text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
