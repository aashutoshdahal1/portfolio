import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { useContent } from "@/contexts/ContentContext";

const Projects = () => {
  const { content } = useContent();
  const { projects } = content;

  return (
    <section id="projects" className="py-32 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider">Portfolio</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-white">Featured</span> <span className="text-gradient">Projects</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="group glass border-2 border-border/50 hover:border-primary/50 transition-smooth overflow-hidden"
            >
              {/* Project Image / Background */}
              {(() => {
                const isGradient = project.bgType === 'gradient';
                const isImage = project.bgType === 'image';
                const isColor = project.bgType === 'color';
                const bgValue = project.bgValue ?? '';
                const bgClass = isGradient ? `bg-gradient-to-br ${bgValue}` : '';
                const bgColorStyle: any = isColor && bgValue ? { backgroundColor: bgValue } : undefined;

                // For images use an <img> with object-cover so the entire image fits the container nicely
                if (isImage && bgValue) {
                  return (
                    <div className={`h-48 relative overflow-hidden ${bgClass}`} style={bgColorStyle}>
                      <img
                        src={bgValue}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback: hide broken image by removing src
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-smooth" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
                        <div className="flex gap-4">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="shadow-lg"
                            onClick={() => {
                              const url = project.demoUrl && project.demoUrl.startsWith('http')
                                ? project.demoUrl
                                : project.demoUrl
                                ? `https://${project.demoUrl.replace(/^\/+/, '')}`
                                : '#';
                              if (url !== '#') window.open(url, '_blank');
                            }}
                          >
                            Demo
                          </Button>

                          <Button size="sm" variant="secondary" className="shadow-lg" onClick={() => project.codeUrl && window.open(project.codeUrl, '_blank')}>
                            <Github className="h-4 w-4 mr-2" />
                            Code
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Gradient or color (or fallback)
                return (
                  <div className={`h-48 ${bgClass} relative overflow-hidden`} style={bgColorStyle}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-smooth" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
                      <div className="flex gap-4">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="shadow-lg"
                          onClick={() => {
                            const url = project.demoUrl && project.demoUrl.startsWith('http')
                              ? project.demoUrl
                              : project.demoUrl
                              ? `https://${project.demoUrl.replace(/^\/+/, '')}`
                              : '#';
                            if (url !== '#') window.open(url, '_blank');
                          }}
                        >
                          Demo
                        </Button>

                        <Button size="sm" variant="secondary" className="shadow-lg" onClick={() => project.codeUrl && window.open(project.codeUrl, '_blank')}>
                          <Github className="h-4 w-4 mr-2" />
                          Code
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold group-hover:text-gradient transition-smooth">
                  {project.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
