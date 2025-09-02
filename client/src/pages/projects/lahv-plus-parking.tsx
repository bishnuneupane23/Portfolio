import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";

export default function LahvPlusParkingCaseStudy() {
  useEffect(() => {
    document.title = "Case Study: Lahv+ Parking | Bishnu Neupane - QA Lead";
  }, []);

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
                Case Study: Lahv+ Parking
              </h1>
              <div className="w-20 h-1 bg-primary"></div>
            </div>

            {/* Coming Soon */}
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="text-coming-soon-title">
                  Case Study: Coming Soon
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto" data-testid="text-coming-soon-description">
                  This detailed case study is currently being prepared. Check back soon for comprehensive insights into the Lahv+ Parking project.
                </p>
                <Link href="/">
                  <Button data-testid="button-back-to-projects">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Projects
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
