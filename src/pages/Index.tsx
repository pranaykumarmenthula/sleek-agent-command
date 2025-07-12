
import { Header } from "@/components/Header";
import { MessageInput } from "@/components/MessageInput";
import { Features } from "@/components/Features";
import { Integrations } from "@/components/Integrations";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { ThreeBackground } from "@/components/ThreeBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <ThreeBackground />
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
