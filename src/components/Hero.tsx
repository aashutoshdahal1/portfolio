import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { usePortfolioSection, type HeroData } from "@/hooks/usePortfolio";

const Hero = () => {
  const { data: heroData, loading } = usePortfolioSection<HeroData>('hero');

  if (loading) {
    return (
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-20">
        <div className="animate-pulse space-y-4 max-w-3xl">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-20 bg-muted rounded w-full"></div>
          <div className="h-12 bg-muted rounded w-3/4"></div>
        </div>
      </section>
    );
  }

  return (
  <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8 animate-fade-up">
          <div className="space-y-4">
            <p className="text-muted-foreground text-lg font-medium tracking-wide uppercase">
              {heroData?.welcomeText || "Welcome to my portfolio"}
            </p>
            <h1 className="text-6xl md:text-7xl lg:text-6xl font-bold leading-tight">
              <span className="text-gradient">{heroData?.name || "Your Name"}</span>
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-medium">
              {heroData?.title || "Your Title"}
            </h2>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            {heroData?.description || "Your description here"}
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:glow-primary transition-smooth">
              View Projects
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="glass border-2 border-border/50 text-foreground hover:bg-card/60 hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              onClick={() => {
                // smooth scroll that accounts for a fixed navbar height
                const el = document.getElementById("contact");
                if (!el) return;
                const nav = document.querySelector("nav");
                const navHeight = nav ? (nav as HTMLElement).getBoundingClientRect().height + 12 : 12;
                const y = el.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: y, behavior: "smooth" });
              }}
              aria-label="Scroll to contact section"
            >
              Contact Me
            </Button>
          </div>

          <div className="flex gap-4 pt-4">
            {heroData?.socialLinks?.github && (
              <a 
                href={heroData.socialLinks.github} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth group"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {heroData?.socialLinks?.linkedin && (
              <a 
                href={heroData.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth group"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {heroData?.socialLinks?.email && (
              <a 
                href={`mailto:${heroData.socialLinks.email}`}
                className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth group"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        {/* Right Content - Image Container */}
        <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="relative w-full aspect-square max-w-lg mx-auto">
            {/* Glow Effects */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent opacity-20 blur-3xl animate-glow-pulse" />
            
            {/* Image Container */}
            <div className="relative w-full h-full glass rounded-3xl overflow-hidden border-2 border-border/50 shadow-elegant">
              {/* User image (served from public/bg.jpeg). Replace public/bg.jpeg with your actual photo. */}
              <div className="w-full h-full bg-card relative">
                <img
                  src="/bg.jpeg"
                  alt="Aashutosh Dahal"
                  className="w-full h-full object-cover block"
                />

                {/* Screen-reader only caption (visible if needed) */}
                <span className="sr-only">Profile photo of Aashutosh Dahal</span>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute bottom-4 left-4 w-20 h-20 bg-accent/10 rounded-full blur-2xl" />
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-2xl glass rotate-12 animate-float" />
            <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full glass animate-float" style={{ animationDelay: "1s" }} />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-muted-foreground/30" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
