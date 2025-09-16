import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Music, Users } from "lucide-react";
import { Link } from "react-router-dom";

const EventsTeaser = () => {
  const events = [
    {
      title: "Sunrise Yoga",
      time: "7:00 - 8:30 AM",
      day: "Daily",
      icon: <Users className="w-6 h-6" />,
      description: "Start your day with mindful movement",
      tag: "Wellness",
      image: "photo-1506905925346-21bda4d32df4"
    },
    {
      title: "Live Music",
      time: "7:00 - 10:00 PM", 
      day: "Wed - Sat",
      icon: <Music className="w-6 h-6" />,
      description: "Local artists & acoustic sessions",
      tag: "Entertainment",
      image: "photo-1493225457124-a3eb161ffa5f"
    },
    {
      title: "Sunday Market",
      time: "9:00 AM - 3:00 PM",
      day: "Sundays",
      icon: <Calendar className="w-6 h-6" />,
      description: "Local artisans & organic produce",
      tag: "Community",
      image: "photo-1488459716781-31db52582fe9"
    }
  ];

  return (
    <section className="py-16 bg-sage/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-charcoal mb-2">
              Upcoming Events
            </h2>
            <p className="text-charcoal/70">
              Join our community experiences
            </p>
          </div>
          <Button asChild variant="outline" className="hidden md:flex">
            <Link to="/events">
              Full Schedule
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <Card key={index} className="group hover:shadow-soft transition-all duration-300 overflow-hidden">
              <div className="aspect-[280/180] relative overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/${event.image}?w=560&h=360&fit=crop`}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-sage text-pure-white">
                    {event.tag}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-sage/10 rounded-lg">
                    {event.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">{event.title}</h3>
                    <p className="text-sm text-charcoal/70">{event.day}</p>
                  </div>
                </div>
                
                <p className="text-sm text-charcoal/70 mb-3">{event.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-sage">{event.time}</span>
                  <Button size="sm" variant="ghost" className="text-sage hover:text-sage/80">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button asChild variant="outline">
            <Link to="/events">
              View Full Schedule
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsTeaser;