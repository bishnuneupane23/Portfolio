import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";

export default function ConnectPersonaCaseStudy() {
  useEffect(() => {
    document.title = "Case Study: Connect Persona | Bishnu Neupane - QA Lead";
  }, []);

  const goals = [
    "Defect leakage ≤10% per release",
    "Bug reopen <10% per release"
  ];

  const testStrategy = [
    "Smoke", "Functional", "Regression", "API Testing", 
    "Performance", "Negative Testing", "Compatibility"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <Link href="/">
                <Button variant="ghost" data-testid="button-back-to-home">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>

            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-case-study-title">
                Case Study: Connect Persona
              </h1>
              <div className="w-20 h-1 bg-primary"></div>
            </div>

            <div className="space-y-8">
              {/* Problem Section */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="text-problem-title">
                    Problem
                  </h2>
                  <p className="text-muted-foreground text-lg" data-testid="text-problem-description">
                    1-way & 2-way connection via link; Connection & Contact management.
                  </p>
                </CardContent>
              </Card>

              {/* Goals & Success */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-6" data-testid="text-goals-title">
                    Goals & Success Metrics
                  </h2>
                  <ul className="space-y-4">
                    {goals.map((goal, index) => (
                      <li key={index} className="flex items-center text-muted-foreground" data-testid={`text-goal-${index}`}>
                        <CheckCircle className="text-primary mr-4 h-5 w-5 flex-shrink-0" />
                        <span className="text-lg">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Scope & Environments */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-6" data-testid="text-scope-title">
                    Scope & Environments
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-3">Platforms</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-primary/10 text-primary">Web</Badge>
                        <Badge className="bg-primary/10 text-primary">Mobile</Badge>
                        <Badge className="bg-primary/10 text-primary">API</Badge>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-3">Environments</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-primary/10 text-primary">Staging</Badge>
                        <Badge className="bg-primary/10 text-primary">Production</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Test Strategy */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-6" data-testid="text-strategy-title">
                    Test Strategy
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {testStrategy.map((strategy) => (
                      <Badge 
                        key={strategy} 
                        className="bg-primary/10 text-primary justify-center py-2"
                        data-testid={`badge-strategy-${strategy.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {strategy}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Targets */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-6" data-testid="text-performance-title">
                    Performance Targets
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-foreground mb-2">Targets</h3>
                        <ul className="space-y-1 text-sm">
                          <li>10,000 CCU capacity</li>
                          <li>p95 ≤ 600ms</li>
                          <li>p99 ≤ 1200ms</li>
                          <li>Error rate ≤ 3.5%</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground mb-2">Load Profile</h3>
                        <ul className="space-y-1 text-sm">
                          <li>Ramp: 20 minutes</li>
                          <li>Hold: 20 minutes</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
