import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, MapPin, Mail, Phone, Calendar, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Profile, Experience, Education, Skill, SiteSettings } from "@shared/schema";

export function ResumeSection() {
  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/public/profile"],
  });

  const { data: experiences = [] } = useQuery<Experience[]>({
    queryKey: ["/api/public/experience"],
  });

  const { data: education = [] } = useQuery<Education[]>({
    queryKey: ["/api/public/education"],
  });

  const { data: skills = [] } = useQuery<Skill[]>({
    queryKey: ["/api/public/skills"],
  });

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/public/settings"],
  });

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(`${skill.name} (${skill.level})`);
    return acc;
  }, {} as Record<string, string[]>);

  const skillCategories = Object.entries(groupedSkills).map(([category, items]) => ({
    category,
    items
  }));

  if (!profile) {
    return (
      <section id="resume" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-12 bg-muted rounded mb-8"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="resume" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-resume-title">
              Résumé
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            {settings?.resumeUrl && (
              <Button size="lg" asChild data-testid="button-download-resume">
                <a href={settings.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-5 w-5" />
                  Download Résumé (PDF)
                </a>
              </Button>
            )}
          </div>

          {/* Resume Content */}
          <Card>
            <CardContent className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2" data-testid="text-resume-name">
                  {profile.name}
                </h3>
                <p className="text-lg text-primary font-semibold mb-4" data-testid="text-resume-title-role">
                  {profile.title}
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center" data-testid="text-resume-location">
                    <MapPin className="mr-1 h-4 w-4" />
                    {profile.location}
                  </span>
                  <span className="flex items-center" data-testid="text-resume-email">
                    <Mail className="mr-1 h-4 w-4" />
                    {profile.email}
                  </span>
                  <span className="flex items-center" data-testid="text-resume-phone">
                    <Phone className="mr-1 h-4 w-4" />
                    {profile.phone}
                  </span>
                  {profile.linkedin && (
                    <Button variant="ghost" size="sm" asChild className="h-auto p-0" data-testid="link-resume-linkedin">
                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Experience */}
              {experiences.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-foreground mb-4" data-testid="text-resume-experience-title">
                    Experience
                  </h4>
                  <div className="border-l-2 border-primary pl-6">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="mb-6 last:mb-0">
                        <div className="flex flex-wrap justify-between items-start mb-2">
                          <h5 className="text-lg font-semibold text-foreground" data-testid="text-resume-job-title">
                            {exp.jobTitle}
                          </h5>
                          <span className="text-sm text-muted-foreground" data-testid="text-resume-job-dates">
                            {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        <p className="text-primary font-medium mb-3" data-testid="text-resume-company">
                          {exp.company}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-muted-foreground mb-3" data-testid="text-resume-description">
                            {exp.description}
                          </p>
                        )}
                        {exp.achievements && exp.achievements.length > 0 && (
                          <ul className="space-y-2 text-muted-foreground text-sm">
                            {exp.achievements.map((achievement, index) => (
                              <li key={index} className="flex items-start" data-testid={`text-resume-achievement-${index}`}>
                                <CheckCircle className="text-primary mt-1 mr-2 flex-shrink-0 h-4 w-4" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-foreground mb-4" data-testid="text-resume-education-title">
                    Education
                  </h4>
                  <div className="border-l-2 border-primary pl-6 space-y-4">
                    {education.map((edu) => (
                      <div key={edu.id}>
                        <div className="flex flex-wrap justify-between items-start mb-2">
                          <h5 className="text-lg font-semibold text-foreground" data-testid={`text-resume-education-degree-${edu.id}`}>
                            {edu.degree}
                          </h5>
                          <span className="text-sm text-muted-foreground" data-testid={`text-resume-education-dates-${edu.id}`}>
                            {edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}
                          </span>
                        </div>
                        <p className="text-primary font-medium" data-testid={`text-resume-education-institution-${edu.id}`}>
                          {edu.institution}
                        </p>
                        {edu.description && (
                          <p className="text-sm text-muted-foreground mt-2" data-testid={`text-resume-education-description-${edu.id}`}>
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skillCategories.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-foreground mb-4" data-testid="text-resume-skills-title">
                    Technical Skills
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skillCategories.map((skillGroup, groupIndex) => (
                      <div key={skillGroup.category}>
                        <h5 className="font-medium text-foreground mb-2" data-testid={`text-resume-skill-category-${groupIndex}`}>
                          {skillGroup.category}
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {skillGroup.items.map((item) => (
                            <Badge key={item} variant="secondary" className="bg-primary/10 text-primary" data-testid={`badge-resume-skill-${item.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
