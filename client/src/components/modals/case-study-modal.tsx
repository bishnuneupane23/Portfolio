import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft } from "lucide-react";

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    name: string;
    problem: string;
    goals: string[];
    testStrategy: string[];
  };
}

export function CaseStudyModal({ isOpen, onClose, project }: CaseStudyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="modal-case-study">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" data-testid="text-case-study-title">
            Case Study: {project.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Problem Section */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4" data-testid="text-case-study-problem-title">
              Problem
            </h3>
            <p className="text-muted-foreground" data-testid="text-case-study-problem-description">
              {project.problem}
            </p>
          </div>
          
          {/* Goals & Success */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4" data-testid="text-case-study-goals-title">
              Goals & Success Metrics
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              {project.goals.map((goal, index) => (
                <li key={index} className="flex items-center" data-testid={`text-case-study-goal-${index}`}>
                  <CheckCircle className="text-primary mr-3 h-5 w-5" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Test Strategy */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4" data-testid="text-case-study-strategy-title">
              Test Strategy
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {project.testStrategy.map((strategy) => (
                <Badge key={strategy} className="bg-primary/10 text-primary justify-center" data-testid={`badge-strategy-${strategy.toLowerCase()}`}>
                  {strategy}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Back Button */}
          <div className="pt-4 border-t border-border">
            <Button onClick={onClose} data-testid="button-back-to-projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
