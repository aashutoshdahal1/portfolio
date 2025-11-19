import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import ScrollProgress from "@/components/ScrollProgress";
import GlobalLoader from "@/components/GlobalLoader";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark text-white">
      <GlobalLoader />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <ScrollProgress />
    
    </div>
  );
};

export default Index;
