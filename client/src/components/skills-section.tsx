import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SkillsSection() {
  const skills = [
    { name: "Taiga", level: "Advanced", percentage: 90, color: "bg-primary" },
    { name: "Postman", level: "Intermediate", percentage: 70, color: "bg-accent" },
    { name: "APIDOG", level: "Intermediate", percentage: 70, color: "bg-accent" },
    { name: "JIRA", level: "Beginner", percentage: 40, color: "bg-muted-foreground" },
    { name: "JMeter", level: "Beginner", percentage: 40, color: "bg-muted-foreground" },
  ];

  const getBadgeVariant = (level: string) => {
    switch (level) {
      case "Advanced": return "default";
      case "Intermediate": return "secondary";
      default: return "outline";
    }
  };

  return (
    <section id="skills" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-skills-title">
              Skills & Proficiency
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <Card key={skill.name} className="hover:border-primary/50 transition-colors" data-testid={`card-skill-${skill.name.toLowerCase()}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground" data-testid={`text-skill-name-${skill.name.toLowerCase()}`}>
                      {skill.name}
                    </h3>
                    <Badge variant={getBadgeVariant(skill.level)} data-testid={`badge-skill-level-${skill.name.toLowerCase()}`}>
                      {skill.level}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`${skill.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${skill.percentage}%` }}
                      data-testid={`progress-skill-${skill.name.toLowerCase()}`}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
