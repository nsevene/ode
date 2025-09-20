import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Phone,
  Calendar,
  User,
  Building,
  DollarSign,
  Send,
  CheckCircle,
  Clock,
  Users,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const InvestorsIntroCall = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    investmentRange: '',
    preferredDate: '',
    preferredTime: '',
    timezone: '',
    meetingType: '',
    investmentFocus: '',
    questions: '',
    agreeTerms: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('contact_messages').insert([
        {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          subject: 'Investment Consultation Request',
          message: `Investment consultation request from ${formData.fullName} (${formData.company}).
            
Investment Range: ${formData.investmentRange}
Preferred Date: ${formData.preferredDate}
Preferred Time: ${formData.preferredTime}
Timezone: ${formData.timezone}
Meeting Type: ${formData.meetingType}
Investment Focus: ${formData.investmentFocus}
Questions: ${formData.questions}`,
          type: 'investment_call',
          status: 'new',
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Consultation Request Submitted!',
        description:
          "Thank you for your interest in ODE Food Hall. We'll contact you within 24 hours to schedule your investment consultation.",
      });
    } catch (error) {
      console.error('Error submitting consultation request:', error);
      toast({
        title: 'Submission Error',
        description:
          'There was an error submitting your request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="investor">
      <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
        <ImprovedNavigation />

        <div className="container mx-auto px-4 pt-24 pb-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Schedule Investment Consultation
            </h1>
            <p className="text-lg text-charcoal/70 max-w-3xl mx-auto">
              Book a personal consultation with our investment team to discuss
              ODE Food Hall investment opportunities and learn more about our
              vision.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange('fullName', e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange('email', e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange('phone', e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company/Organization</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) =>
                          handleInputChange('company', e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="position">Position/Title</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) =>
                        handleInputChange('position', e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Investment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Investment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="investmentRange">Investment Range *</Label>
                    <Select
                      value={formData.investmentRange}
                      onValueChange={(value) =>
                        handleInputChange('investmentRange', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select investment range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50k-100k">
                          $50,000 - $100,000
                        </SelectItem>
                        <SelectItem value="100k-250k">
                          $100,000 - $250,000
                        </SelectItem>
                        <SelectItem value="250k-500k">
                          $250,000 - $500,000
                        </SelectItem>
                        <SelectItem value="500k-1m">
                          $500,000 - $1,000,000
                        </SelectItem>
                        <SelectItem value="1m+">$1,000,000+</SelectItem>
                        <SelectItem value="exploring">
                          Just exploring
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="investmentFocus">Investment Focus</Label>
                    <Select
                      value={formData.investmentFocus}
                      onValueChange={(value) =>
                        handleInputChange('investmentFocus', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select investment focus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equity">
                          Equity Investment
                        </SelectItem>
                        <SelectItem value="debt">Debt Financing</SelectItem>
                        <SelectItem value="partnership">
                          Strategic Partnership
                        </SelectItem>
                        <SelectItem value="real-estate">
                          Real Estate Investment
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Meeting Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Meeting Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preferredDate">Preferred Date *</Label>
                      <Input
                        id="preferredDate"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) =>
                          handleInputChange('preferredDate', e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferredTime">Preferred Time *</Label>
                      <Select
                        value={formData.preferredTime}
                        onValueChange={(value) =>
                          handleInputChange('preferredTime', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="timezone">Timezone *</Label>
                      <Select
                        value={formData.timezone}
                        onValueChange={(value) =>
                          handleInputChange('timezone', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WIB">WIB (Jakarta)</SelectItem>
                          <SelectItem value="WITA">WITA (Bali)</SelectItem>
                          <SelectItem value="WIT">WIT (Papua)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">EST (New York)</SelectItem>
                          <SelectItem value="PST">PST (Los Angeles)</SelectItem>
                          <SelectItem value="GMT">GMT (London)</SelectItem>
                          <SelectItem value="CET">CET (Paris)</SelectItem>
                          <SelectItem value="JST">JST (Tokyo)</SelectItem>
                          <SelectItem value="AEST">AEST (Sydney)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="meetingType">Meeting Type *</Label>
                      <Select
                        value={formData.meetingType}
                        onValueChange={(value) =>
                          handleInputChange('meetingType', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select meeting type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video-call">
                            Video Call (Zoom/Teams)
                          </SelectItem>
                          <SelectItem value="phone-call">Phone Call</SelectItem>
                          <SelectItem value="in-person">
                            In-Person (Bali)
                          </SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="questions">
                      Questions or Topics to Discuss
                    </Label>
                    <Textarea
                      id="questions"
                      value={formData.questions}
                      onChange={(e) =>
                        handleInputChange('questions', e.target.value)
                      }
                      placeholder="What specific aspects of ODE Food Hall would you like to discuss? Any particular questions about the investment opportunity?"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle>Terms and Conditions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange('agreeTerms', checked)
                      }
                    />
                    <Label htmlFor="agreeTerms" className="text-sm">
                      I agree to the Terms and Conditions and Privacy Policy *
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || !formData.agreeTerms}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Schedule Consultation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default InvestorsIntroCall;
