import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="modal-privacy">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" data-testid="text-privacy-title">
            Privacy Policy
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-muted-foreground">
          <p data-testid="text-privacy-paragraph-1">
            This portfolio website does not collect, store, or process any personal data through forms or analytics.
          </p>
          <p data-testid="text-privacy-paragraph-2">
            <strong>Contact:</strong> All communication happens through external services (Calendly, Email, Phone) which have their own privacy policies.
          </p>
          <p data-testid="text-privacy-paragraph-3">
            <strong>No Tracking:</strong> This site does not use cookies, analytics, or any tracking technologies.
          </p>
          <p data-testid="text-privacy-paragraph-4">
            <strong>External Links:</strong> Links to Calendly and other external services are governed by their respective privacy policies.
          </p>
          <p className="text-sm text-muted-foreground" data-testid="text-privacy-last-updated">
            Last updated: January 2025
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
