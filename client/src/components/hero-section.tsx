import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Mail, Clock, Laptop, Briefcase } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SiteSettings, Profile, Skill } from "@shared/schema";

export function HeroSection() {
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/public/settings"],
  });

  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/public/profile"],
  });

  const { data: skills = [] } = useQuery<Skill[]>({
    queryKey: ["/api/public/skills"],
  });

  const quickFacts = profile ? [
    { icon: Clock, text: `${profile.experienceYears} year${profile.experienceYears > 1 ? 's' : ''} experience` },
    { icon: Laptop, text: profile.availability },
    { icon: Briefcase, text: "Currently working" },
  ] : [];

  const handleScrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!profile) {
    return (
      <section id="home" className="hero-gradient py-20 sm:py-32 lg:py-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-pulse">
            <div className="h-16 bg-muted rounded mb-6"></div>
            <div className="h-8 bg-muted rounded mb-8"></div>
          </div>
        </div>
      </section>
    );
  }

  const heroTitle = settings?.heroTitle || `${profile.title} | Portfolio & Resume`;
  const heroSubtitle = settings?.heroSubtitle || `${profile.name} - ${profile.location}`;

  return (
    <section id="home" className="hero-gradient py-20 sm:py-32 lg:py-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground mb-6" data-testid="text-hero-title">
            {heroTitle}
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-subtitle">
            {heroSubtitle}
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
            {skills.slice(0, 5).map((skill) => (
              <Badge key={skill.id} variant="outline" className="border-primary text-primary" data-testid={`badge-skill-${skill.name.toLowerCase()}`}>
                {skill.name}
              </Badge>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {settings?.calendlyUrl && (
              <Button asChild size="lg" data-testid="button-book-interview-hero">
                <a href={settings.calendlyUrl} target="_blank" rel="noopener noreferrer">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Interview
                </a>
              </Button>
            )}
            {settings?.resumeUrl && (
              <Button variant="outline" size="lg" asChild data-testid="button-download-resume-hero">
                <a href={settings.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-5 w-5" />
                  Download Résumé
                </a>
              </Button>
            )}
            <Button variant="outline" size="lg" asChild data-testid="button-email-hero">
              <a href={`mailto:${profile.email}`}>
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
