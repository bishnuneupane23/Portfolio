import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, MapPin, Mail, Phone, Calendar, CheckCircle } from "lucide-react";

export function ResumeSection() {
  const skills = [
    { category: "Testing Tools", items: ["Taiga (Advanced)", "Postman (Intermediate)", "APIDOG (Intermediate)"] },
    { category: "Project Management", items: ["JIRA (Beginner)", "JMeter (Beginner)"] }
  ];

  const achievements = [
    "Led QA strategy across 3 products with focus on manual and automation testing",
    "Implemented API and performance testing protocols for 10k CCU load scenarios",
    "Reduced regression risk through comprehensive test case development and execution",
    "Enhanced RCA quality and mentored junior QA team members"
  ];

  return (
    <section id="resume" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-resume-title">
              Résumé
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <Button size="lg" data-testid="button-download-resume">
              <Download className="mr-2 h-5 w-5" />
              Download Résumé (PDF)
            </Button>
          </div>

          {/* Resume Content */}
          <Card>
            <CardContent className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2" data-testid="text-resume-name">
                  Bishnu Prasad Neupane
                </h3>
                <p className="text-lg text-primary font-semibold mb-4" data-testid="text-resume-title-role">
                  Quality Assurance Lead
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center" data-testid="text-resume-location">
                    <MapPin className="mr-1 h-4 w-4" />
                    Kathmandu, Nepal
                  </span>
                  <span className="flex items-center" data-testid="text-resume-email">
                    <Mail className="mr-1 h-4 w-4" />
                    bishnu23neupane@gmail.com
                  </span>
                  <span className="flex items-center" data-testid="text-resume-phone">
                    <Phone className="mr-1 h-4 w-4" />
                    +977 980-354-5245
                  </span>
                  <Button variant="ghost" size="sm" asChild className="h-auto p-0" data-testid="link-resume-linkedin">
                    <a href="https://linkedin.com/in/bishnu-neupane-9a5a7426b/" target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </Button>
                </div>
              </div>

              {/* Experience */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-foreground mb-4" data-testid="text-resume-experience-title">
                  Experience
                </h4>
                <div className="border-l-2 border-primary pl-6">
                  <div className="mb-6">
                    <div className="flex flex-wrap justify-between items-start mb-2">
                      <h5 className="text-lg font-semibold text-foreground" data-testid="text-resume-job-title">
                        QA Lead
                      </h5>
                      <span className="text-sm text-muted-foreground" data-testid="text-resume-job-dates">
                        11/2024 - Present
                      </span>
                    </div>
                    <p className="text-primary font-medium mb-3" data-testid="text-resume-company">
                      ankaEK
                    </p>
                    <p className="text-sm text-muted-foreground mb-3" data-testid="text-resume-progression">
                      Progression: QA Intern → Jr QA → QA Lead (current)
                    </p>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      {achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start" data-testid={`text-resume-achievement-${index}`}>
                          <CheckCircle className="text-primary mt-1 mr-2 flex-shrink-0 h-4 w-4" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-foreground mb-4" data-testid="text-resume-skills-title">
                  Technical Skills
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map((skillGroup, groupIndex) => (
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
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
