
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, MessageSquare, Zap, Shield, Clock, Users } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Intelligent Understanding",
    description: "Advanced LLM processes natural language commands with context awareness for precise task execution."
  },
  {
    icon: MessageSquare,
    title: "Single Interface",
    description: "Control all your connected apps through one simple chat interface. No switching between platforms."
  },
  {
    icon: Zap,
    title: "Instant Automation",
    description: "Execute complex workflows across multiple apps in seconds with simple text commands."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and OAuth 2.0 authentication keep your data safe and secure."
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Your AI agent works around the clock, handling tasks even when you're offline."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share workflows and automate team processes with collaborative AI assistance."
  }
];

export const Features = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to automate your workflow and boost productivity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-500 hover:scale-105 hover:shadow-xl"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
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
