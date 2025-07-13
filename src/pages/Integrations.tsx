
import { Header } from "@/components/Header";
import { Integrations } from "@/components/Integrations";

const IntegrationsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <Header />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Seamless Integrations
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Connect with all your favorite tools and services in just a few clicks
            </p>
          </div>
        </div>
        <Integrations />
      </div>
    </div>
  );
};

export default IntegrationsPage;
