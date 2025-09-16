import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ChefHat, Users, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const EventsPopUp = () => {
  const { t } = useTranslation();

  const upcomingEvents = [
    {
      type: "Master Class",
      title: "Balinese Traditional Cooking",
      chef: "Chef Wayan Sutrisna",
      date: "Dec 15, 2024",
      time: "10:00 AM - 2:00 PM",
      price: "$85",
      seats: "8 seats left"
    },
    {
      type: "Pop-Up",
      title: "Japanese Omakase Experience",
      chef: "Chef Takeshi Yamamoto",
      date: "Dec 20, 2024", 
      time: "7:00 PM - 10:00 PM",
      price: "$150",
      seats: "Fully booked"
    },
    {
      type: "Workshop",
      title: "Fermentation Secrets",
      chef: "Chef Maria Santos",
      date: "Dec 22, 2024",
      time: "3:00 PM - 6:00 PM", 
      price: "$65",
      seats: "12 seats left"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-terracotta/10 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-forest to-sage rounded-2xl text-white p-12 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-golden text-forest mb-4">Featured Pop-Up</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Exclusive Culinary Events
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Learn from world-class chefs and experience unique pop-up dining
            </p>
            <Button size="lg" className="bg-golden hover:bg-golden/90 text-forest">
              Book a Seat
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-forest mb-8 text-center">
            Upcoming Events
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="border-terracotta/30 hover:border-terracotta transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="border-terracotta text-terracotta">
                      {event.type}
                    </Badge>
                    <span className="text-2xl font-bold text-forest">{event.price}</span>
                  </div>
                  <CardTitle className="text-forest text-xl">{event.title}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ChefHat className="h-4 w-4" />
                    <span>{event.chef}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-sage" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-sage" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-sage" />
                    <span className={event.seats === "Fully booked" ? "text-red-500" : "text-green-600"}>
                      {event.seats}
                    </span>
                  </div>
                  <Button 
                    className="w-full bg-terracotta hover:bg-terracotta/90"
                    disabled={event.seats === "Fully booked"}
                  >
                    {event.seats === "Fully booked" ? "Sold Out" : "Book Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pop-Up Chef Banner */}
        <Card className="bg-gradient-to-r from-golden/20 to-terracotta/20 border-golden/30">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold text-forest mb-4">
              Become a Pop-Up Chef
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Share your culinary vision with our community. Apply for a pop-up slot and showcase your unique cuisine.
            </p>
            <Button size="lg" variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
              Apply for Pop-Up Slot
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventsPopUp;