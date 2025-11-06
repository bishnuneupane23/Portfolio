import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SiteSettings, Profile } from "@shared/schema";

export function ContactSection() {
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/public/settings"],
  });

  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/public/profile"],
  });

  if (!profile) {
    return (
      <section id="contact" className="py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-12 bg-muted rounded mb-4"></div>
            <div className="h-8 bg-muted rounded mb-8"></div>
          </div>
        </div>
      </section>
    );
  }

  const contactMethods = [
    settings?.calendlyUrl && {
      icon: Calendar,
      title: "Schedule Interview",
      description: "Book a time that works for both of us",
      action: "Book on Calendly",
      href: settings.calendlyUrl,
      external: true,
      variant: "default" as const
    },
    {
      icon: Mail,
      title: "Email Me",
      description: "Send me a message directly",
      action: "Send Email",
      href: `mailto:${profile.email}`,
      external: false,
      variant: "outline" as const
    },
    {
      icon: Phone,
      title: "Call Me",
      description: "Direct phone contact",
      action: profile.phone,
      href: `tel:${profile.phone.replace(/[^0-9+]/g, '')}`,
      external: false,
      variant: "outline" as const
    }
  ].filter(Boolean) as Array<{
    icon: any;
    title: string;
    description: string;
    action: string;
    href: string;
    external: boolean;
    variant: "default" | "outline";
  }>;

  return (
    <section id="contact" className="py-20 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-contact-title">
              Let's Connect
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground" data-testid="text-contact-status">
              <span className="font-semibold">{profile.availability}</span>
            </p>
            {profile.responsePromise && (
              <p className="text-primary font-medium mt-2" data-testid="text-contact-response-time">
                {profile.responsePromise}
              </p>
            )}
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {contactMethods.map((method, index) => (
              <Card key={index} className="hover:border-primary/50 transition-colors" data-testid={`card-contact-${method.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <method.icon className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2" data-testid={`text-contact-method-title-${index}`}>
                    {method.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4" data-testid={`text-contact-method-description-${index}`}>
                    {method.description}
                  </p>
                  <Button 
                    variant={method.variant}
                    asChild 
                    className="w-full"
                    data-testid={`button-contact-${method.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <a 
                      href={method.href} 
                      {...(method.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {method.action}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
