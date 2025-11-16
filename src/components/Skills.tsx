import { usePortfolioSection, type SkillsData } from "@/hooks/usePortfolio";

const Skills = () => {
  const { data: skillsData, loading } = usePortfolioSection<SkillsData>('skills');

  const blueSkills = new Set([
    "TypeScript", "Next.js", "Tailwind CSS", "Redux", "Vue.js",
    "Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs", "GraphQL",
    "Git", "Docker", "AWS", "Firebase", "Jest", "CI/CD",
  ]);

  if (loading) {
    return (
      <section id="skills" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/3 mx-auto"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider">Expertise</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-white">Tech</span> <span className="text-gradient">Stack</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {skillsData?.categories?.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="glass p-8 rounded-3xl hover:bg-card/60 transition-smooth"
              style={{ animationDelay: `${categoryIndex * 0.1}s` }}
            >
              <h3 className="text-2xl font-bold mb-6 text-foreground">{category.title}</h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, skillIndex) => {
                  const isBlue = skill === "React" || blueSkills.has(skill);
                  return (
                    <span
                      key={skillIndex}
                      className={
                        `px-4 py-2 rounded-full text-sm font-medium transition-smooth cursor-default ` +
                        (isBlue
                          ? "bg-blue-600 text-white border border-transparent hover:bg-blue-700"
                          : "bg-card text-foreground border border-border/60 hover:bg-primary/10 hover:border-primary/60")
                      }
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
