
import { Header } from "@/components/Header";
import { MessageInput } from "@/components/MessageInput";
import { Features } from "@/components/Features";
import { Integrations } from "@/components/Integrations";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <Header />
      <MessageInput />
      <Features />
      <Integrations />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
