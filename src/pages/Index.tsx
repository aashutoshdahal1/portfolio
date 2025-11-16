import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import ExperienceSection from "@/components/Experience";
import Contact from "@/components/Contact";
import ScrollProgress from "@/components/ScrollProgress";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark text-white">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <ExperienceSection />
      <Contact />
      <ScrollProgress />
    
    </div>
  );
};

export default Index;
