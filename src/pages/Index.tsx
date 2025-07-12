
import { Header } from "@/components/Header";
import { MessageInput } from "@/components/MessageInput";
import { Features } from "@/components/Features";
import { Integrations } from "@/components/Integrations";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { ThreeBackground } from "@/components/ThreeBackground";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect } from "react";

const Index = () => {
  useScrollAnimation();

  useEffect(() => {
    // Parallax effect for hero section
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax-slow');
      
      parallaxElements.forEach((element) => {
        const speed = 0.5;
        (element as HTMLElement).style.setProperty('--scroll-y', `${scrolled * speed}px`);
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThreeBackground />
      <Header />
      
      <main>
        <section className="parallax-slow">
          <MessageInput />
        </section>
        
        <section className="section-reveal">
          <Features />
        </section>
        
        <section className="section-reveal">
          <Integrations />
        </section>
        
        <section className="section-reveal">
          <CTA />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
