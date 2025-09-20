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
  FileText,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  CheckCircle,
  Send,
  ArrowLeft,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  sendTenantApplicationConfirmation,
  sendTenantApplicationNotification,
} from '@/lib/email';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const TenantsApply = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    businessName: '',
    businessType: '',
    cuisineType: '',
    concept: '',
    preferredSpace: '',
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
      const { error } = await supabase.from('space_bookings').insert([
        {
          experience_type: 'tenant_application',
          booking_date: new Date().toISOString().split('T')[0],
          time_slot: 'application',
          guest_count: 1,
          guest_name: formData.fullName,
          guest_email: formData.email,
          guest_phone: formData.phone,
          status: 'pending',
          additional_data: formData,
        },
      ]);

      if (error) throw error;

      // Send confirmation email to applicant
      await sendTenantApplicationConfirmation(
        formData.email,
        formData.fullName
      );

      // Send notification email to ops team
      await sendTenantApplicationNotification({
        guest_name: formData.fullName,
        guest_email: formData.email,
        guest_phone: formData.phone,
        additional_data: formData,
      });

      toast({
        title: 'Application Submitted Successfully!',
        description:
          "Thank you for your interest in ODE Food Hall. We'll review your application and get back to you within 3 business days.",
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Submission Error',
        description:
          'There was an error submitting your application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
      <ImprovedNavigation />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Apply for Space
          </h1>
          <p className="text-lg text-charcoal/70 max-w-3xl mx-auto">
            Join ODE Food Hall and be part of Bali's premier culinary
            destination.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
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
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) =>
                        handleInputChange('company', e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) =>
                        handleInputChange('businessName', e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) =>
                        handleInputChange('businessType', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="food-truck">Food Truck</SelectItem>
                        <SelectItem value="catering">Catering</SelectItem>
                        <SelectItem value="bakery">Bakery</SelectItem>
                        <SelectItem value="cafe">Café</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="cuisineType">Cuisine Type *</Label>
                  <Input
                    id="cuisineType"
                    value={formData.cuisineType}
                    onChange={(e) =>
                      handleInputChange('cuisineType', e.target.value)
                    }
                    placeholder="e.g., Italian, Asian Fusion, Vegan"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="concept">Business Concept *</Label>
                  <Textarea
                    id="concept"
                    value={formData.concept}
                    onChange={(e) =>
                      handleInputChange('concept', e.target.value)
                    }
                    placeholder="Describe your culinary concept, target audience, and unique selling points..."
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

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
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TenantsApply;
