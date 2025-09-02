import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy | Bishnu Neupane - QA Lead";
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
            <div className="mb-12 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-privacy-title">
                Privacy Policy
              </h1>
              <div className="w-20 h-1 bg-primary mx-auto"></div>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-6 text-muted-foreground">
                  <p className="text-lg" data-testid="text-privacy-paragraph-1">
                    This portfolio website does not collect, store, or process any personal data through forms or analytics.
                  </p>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Contact</h3>
                    <p data-testid="text-privacy-paragraph-2">
                      All communication happens through external services (Calendly, Email, Phone) which have their own privacy policies.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Tracking</h3>
                    <p data-testid="text-privacy-paragraph-3">
                      This site does not use cookies, analytics, or any tracking technologies.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">External Links</h3>
                    <p data-testid="text-privacy-paragraph-4">
                      Links to Calendly and other external services are governed by their respective privacy policies.
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground" data-testid="text-privacy-last-updated">
                      Last updated: January 2025
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
