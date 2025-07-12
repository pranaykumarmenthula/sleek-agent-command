
import { Header } from "@/components/Header";
import { MessageInput } from "@/components/MessageInput";
import { Features } from "@/components/Features";
import { Integrations } from "@/components/Integrations";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main>
        <MessageInput />
        <Features />
        <Integrations />
        <CTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
