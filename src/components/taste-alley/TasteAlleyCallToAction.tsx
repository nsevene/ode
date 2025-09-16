
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Camera } from "lucide-react";

const TasteAlleyCallToAction = () => {
  return (
    <div className="text-center">
      <Card className="max-w-2xl mx-auto bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold mb-4">Be Among the First to Experience</h3>
          <p className="text-emerald-100 mb-6">
            Join our exclusive waitlist to get early access to Taste Alley when it opens. 
            Subscribers get priority booking and special launch offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="secondary" size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
              <Star className="h-5 w-5 mr-2" />
              Get Early Access
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Camera className="h-5 w-5 mr-2" />
              View Gallery
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasteAlleyCallToAction;
