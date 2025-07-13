
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Lightbulb, Award } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <Header />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              About Our Mission
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We're building the future of work automation, making AI accessible and powerful for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Transforming How You Work
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                Our AI agent represents a paradigm shift in workplace automation. We believe that technology should amplify human potential, not replace it.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                By connecting all your tools through a single, intelligent interface, we're eliminating the friction that slows down modern work and unleashing unprecedented productivity.
              </p>
            </div>
            <div className="relative">
              <div className="w-full h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                <div className="text-6xl">🤖</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {[
              {
                icon: Target,
                title: "Our Mission",
                description: "To democratize AI automation and make advanced productivity tools accessible to everyone."
              },
              {
                icon: Lightbulb,
                title: "Innovation",
                description: "We're constantly pushing the boundaries of what's possible with AI and automation."
              },
              {
                icon: Users,
                title: "Community",
                description: "Building a community of forward-thinking professionals who embrace the future of work."
              },
              {
                icon: Award,
                title: "Excellence",
                description: "Committed to delivering exceptional quality in everything we build and every interaction we have."
              }
            ].map((value, index) => (
              <Card key={index} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
