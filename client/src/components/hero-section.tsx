import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Mail, Clock, Laptop, Briefcase } from "lucide-react";

export function HeroSection() {
  const skills = ["Taiga", "Postman", "APIDOG", "JIRA", "JMeter"];
  const quickFacts = [
    { icon: Clock, text: "1 year experience" },
    { icon: Laptop, text: "Hybrid" },
    { icon: Briefcase, text: "Currently working" },
  ];

  const handleScrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="hero-gradient py-20 sm:py-32 lg:py-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground mb-6" data-testid="text-hero-title">
            QA Lead <span className="text-primary">@ankaEK</span> | Manual & Automation Testing Enthusiast | Detail-Oriented | Problem Solver
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-subtitle">
            QA Lead ensuring reliable releases with rigorous manual testing and practical automation—focused on quality, speed, and UX.
          </p>

          {/* Quick Facts */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {quickFacts.map((fact, index) => (
              <Badge key={index} variant="secondary" className="inline-flex items-center px-3 py-1" data-testid={`badge-fact-${index}`}>
                <fact.icon className="mr-2 h-4 w-4" />
                {fact.text}
              </Badge>
            ))}
          </div>

          {/* Tool Chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {skills.map((skill) => (
              <Badge key={skill} variant="outline" className="border-primary text-primary" data-testid={`badge-skill-${skill.toLowerCase()}`}>
                {skill}
              </Badge>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" data-testid="button-book-interview-hero">
              <a href="https://calendly.com/bishnu23neupane" target="_blank" rel="noopener noreferrer">
                <Calendar className="mr-2 h-5 w-5" />
                Book Interview
              </a>
            </Button>
            <Button variant="outline" size="lg" onClick={handleScrollToProjects} data-testid="button-download-resume-hero">
              <Download className="mr-2 h-5 w-5" />
              Download Résumé
            </Button>
            <Button variant="outline" size="lg" asChild data-testid="button-email-hero">
              <a href="mailto:bishnu23neupane@gmail.com">
                <Mail className="mr-2 h-5 w-5" />
                Email Me
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
