
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, MessageSquare, Zap, Shield, Clock, Users } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Intelligent Understanding",
    description: "Advanced AI processes natural language commands with context awareness for precise task execution across all your apps."
  },
  {
    icon: MessageSquare,
    title: "Single Interface",
    description: "Control all your connected apps through one simple chat interface. No more switching between dozens of platforms."
  },
  {
    icon: Zap,
    title: "Instant Automation", 
    description: "Execute complex workflows across multiple apps in seconds with simple text commands. Boost productivity by 300%."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and OAuth 2.0 authentication keep your data safe while connecting to your favorite tools."
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Your AI agent works around the clock, handling routine tasks and notifications even when you're offline."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share workflows and automate team processes with collaborative AI assistance. Perfect for growing startups."
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Powerful Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Everything you need to
            <span className="block text-gradient">automate your workflow</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Built for the modern professional who values efficiency and wants to focus on what matters most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group glass-card border-border/50 hover:glow transition-all duration-500 hover:scale-105 section-reveal hover:border-primary/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 glow">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
