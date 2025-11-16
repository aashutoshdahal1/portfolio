import { Code2, Palette, Rocket, Users } from "lucide-react";
import { usePortfolioSection, type AboutData } from "@/hooks/usePortfolio";

const About = () => {
  const { data: aboutData, loading } = usePortfolioSection<AboutData>('about');

  const defaultIcons = [Code2, Palette, Rocket, Users];

  if (loading) {
    return (
      <section id="about" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-6 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-20 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider">About Me</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-foreground">Passionate About</span>{" "}
            <span className="text-gradient">Innovation</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-up">
            {aboutData?.paragraphs?.map((paragraph, index) => (
              <p key={index} className="text-lg text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {aboutData?.highlights?.map((item, index) => {
              const IconComponent = defaultIcons[index % defaultIcons.length];
              return (
                <div
                  key={index}
                  className="glass p-6 rounded-2xl hover:bg-card/60 transition-smooth group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:glow-primary transition-smooth">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
