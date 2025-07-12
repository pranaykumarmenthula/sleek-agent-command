
import { Github, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-16 px-6 glass border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-medium text-gradient mb-6">
              AI Agent
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed font-light">
              Automate your workflow with intelligent AI assistance across all your favorite apps.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center hover:scale-105 soft-shadow cursor-pointer">
                <Twitter className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center hover:scale-105 soft-shadow cursor-pointer">
                <Linkedin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center hover:scale-105 soft-shadow cursor-pointer">
                <Github className="w-5 h-5 text-primary-foreground" />
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
            <div key={section.title}>
              <h4 className="font-medium mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link} className="text-muted-foreground hover:text-foreground font-light cursor-pointer">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground mb-4 md:mb-0 font-light">
            © 2024 AI Agent. All rights reserved.
          </p>
          <div className="flex space-x-8 text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer font-light">Privacy Policy</span>
            <span className="hover:text-foreground cursor-pointer font-light">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
