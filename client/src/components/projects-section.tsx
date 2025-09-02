import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export function ProjectsSection() {
  const projects = [
    {
      id: "a-ok",
      name: "a-OK",
      problem: "unreliable redemption flow; API instability under load; regression escapes.",
      platforms: ["Web", "Mobile", "API"],
      status: "completed",
      route: "/projects/a-ok"
    },
    {
      id: "connect-persona",
      name: "Connect Persona",
      problem: "1-way & 2-way connection via link; Connection & Contact management.",
      platforms: ["Web", "Mobile", "API"],
      status: "completed",
      route: "/projects/connect-persona"
    },
    {
      id: "lahv-plus-parking",
      name: "Lahv+ Parking",
      problem: "Case Study: Coming Soon",
      platforms: ["In Progress"],
      status: "coming-soon",
      route: "/projects/lahv-plus-parking"
    },
    {
      id: "ems",
      name: "EMS",
      problem: "Enterprise Management System with comprehensive QA coverage.",
      platforms: ["Web", "API"],
      status: "available"
    },
    {
      id: "carecore",
      name: "CareCore",
      problem: "Healthcare management platform with rigorous testing protocols.",
      platforms: ["Web", "Mobile"],
      status: "available"
    }
  ];

  return (
    <section id="projects" className="py-20 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-projects-title">
              Featured Projects
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground" data-testid="text-projects-subtitle">
              <span className="font-semibold">ankaEK</span> • Nov 2024 - Present • Web, Mobile, API (Manual & Automation)
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="hover:border-primary/50 transition-all duration-300 hover:shadow-lg group" data-testid={`card-project-${project.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors" data-testid={`text-project-name-${project.id}`}>
                      {project.name}
                    </h3>
                    {project.status === "coming-soon" ? (
                      <Clock className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    ) : (
                      <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>

                  <p className="text-muted-foreground mb-4 text-sm" data-testid={`text-project-problem-${project.id}`}>
                    {project.problem}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.platforms.map((platform) => (
                      <Badge 
                        key={platform} 
                        variant={project.status === "coming-soon" ? "outline" : "secondary"}
                        className={project.status !== "coming-soon" ? "bg-primary/10 text-primary" : ""}
                        data-testid={`badge-platform-${project.id}-${platform.toLowerCase()}`}
                      >
                        {platform}
                      </Badge>
                    ))}
                  </div>

                  {project.route ? (
                    <Link href={project.route}>
                      <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80" data-testid={`link-case-study-${project.id}`}>
                        View Case Study <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground" data-testid={`text-project-status-${project.id}`}>
                      Case Study Available
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
