import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-muted-foreground text-sm" data-testid="text-footer-copyright">
              © 2025 Bishnu Prasad Neupane. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/privacy">
              <Button variant="ghost" size="sm" className="text-sm h-auto p-0" data-testid="link-privacy">
                Privacy Policy
              </Button>
            </Link>
            <span className="text-muted-foreground">|</span>
            <Button variant="ghost" size="sm" asChild className="h-auto p-0" data-testid="link-linkedin-footer">
              <a href="https://linkedin.com/in/bishnu-neupane-9a5a7426b/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
