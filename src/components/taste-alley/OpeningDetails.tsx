
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const OpeningDetails = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-6 w-6" />
          Opening Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
            Phase 1
          </Badge>
          <span className="text-sm">LED Pulse Wall & Interactive Elements</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Phase 2
          </Badge>
          <span className="text-sm">AR Experiences & Taste Quest</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Phase 3
          </Badge>
          <span className="text-sm">Full Interactive Journey</span>
        </div>
        
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Duration:</strong> 30-45 minutes
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Capacity:</strong> 20-30 people per session
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Language:</strong> English, Indonesian, Russian
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpeningDetails;
