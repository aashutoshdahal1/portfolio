import { usePortfolioSection, type Experience as ExperienceType } from "@/hooks/usePortfolio";

const ExperienceSection = () => {
  const { data: experiences, loading } = usePortfolioSection<ExperienceType[]>('experience');

  if (loading) {
    return (
      <section id="experience" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/2 mx-auto"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-32 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider">Journey</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-white">Work</span> <span className="text-gradient">Experience</span>
          </h2>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent" />

          <div className="space-y-12">
            {experiences?.map((exp, index) => (
              <div
                key={index}
                className="relative pl-20 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-primary glow-primary border-4 border-background" />

                <div className="glass p-6 rounded-2xl hover:bg-card/60 transition-smooth">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <span className="text-sm font-semibold text-primary px-4 py-1 rounded-full bg-primary/10 border border-primary/20">
                      {exp.year}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{exp.role}</h3>
                  <p className="text-lg text-accent font-medium mb-3">{exp.company}</p>
                  <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
