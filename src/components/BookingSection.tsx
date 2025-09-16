import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, User, Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BookingSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    guests: "2",
    experience: "taste-compass",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Booking Request Submitted! ✅",
        description: "Thank you for your booking request! We will contact you soon.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        date: "",
        guests: "2",
        experience: "taste-compass",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Booking Error",
        description: "Please try again or contact us by phone.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const experiences = [
    { value: "taste-compass", label: "Taste Compass 2.0 Experience" },
    { value: "chefs-table", label: "Chef's Table Private Dining" },
    { value: "taste-quest", label: "Interactive Taste Quest" },
    { value: "wine-staircase", label: "Wine & Light Staircase" },
    { value: "general-dining", label: "General Dining" }
  ];

  return (
    <section id="booking" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            Book Your Experience
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Book Your Experience
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Ready to embark on a culinary journey? Reserve your spot at ODE Food Hall and discover the taste compass.
          </p>
        </header>

        {/* Booking Form */}
        <Card className="shadow-xl border-primary/10">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
              <Send className="h-6 w-6 text-primary" />
              Complete Your Booking
            </CardTitle>
            <p className="text-muted-foreground">
              Fill out the form below and we'll confirm your reservation within 24 hours
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                  />
                </div>
              </div>

              {/* Date and Guests Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Preferred Date *
                  </label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="guests" className="text-sm font-medium">
                    Number of Guests
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className="w-full h-12 px-3 border border-input rounded-md bg-background"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                    <option value="10+">10+ Guests (Group Booking)</option>
                  </select>
                </div>
              </div>

              {/* Experience Selection */}
              <div className="space-y-2">
                <label htmlFor="experience" className="text-sm font-medium">
                  Choose Your Experience
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full h-12 px-3 border border-input rounded-md bg-background"
                >
                  {experiences.map(exp => (
                    <option key={exp.value} value={exp.value}>{exp.label}</option>
                  ))}
                </select>
              </div>

              {/* Special Requests */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Special Requests (Optional)
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Any dietary restrictions, special occasions, or specific requests..."
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing Booking...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Submit Booking Request
                  </div>
                )}
              </Button>

              {/* Form Footer */}
              <p className="text-sm text-muted-foreground text-center">
                * Required fields. We'll confirm your booking within 24 hours via email or phone.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/10">
            <h3 className="text-lg font-semibold mb-3">🌟 Opening December 1, 2025</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're currently accepting advance bookings for our grand opening. 
              Be among the first to experience the Taste Compass journey at ODE Food Hall.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;