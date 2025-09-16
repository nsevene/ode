import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';

const TenantsMarketingBudget = () => {
  return (
    <>
      <SEOHead
        title="Marketing Budget - ODE Food Hall Tenants"
        description="Marketing support and budget allocation for ODE Food Hall tenants including digital marketing, events, and promotional campaigns."
        
      />
      
      <div className="mx-auto max-w-4xl p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Marketing Budget & Support</h1>
          <p className="text-muted-foreground">
            Comprehensive marketing support and budget allocation for all tenants
          </p>
        </header>

        {/* Placeholder Notice */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-orange-600 mt-1" />
            <div>
              <h3 className="font-semibold text-orange-900 mb-2">⚠️ Content Placeholder</h3>
              <p className="text-orange-800">
                Detailed marketing budget information will be finalized after vendor negotiations are complete. 
                This framework provides the structure for our marketing support program.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Marketing Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Marketing Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Digital Marketing</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Social media management (Instagram, TikTok)</li>
                  <li>• Google Ads and SEO optimization</li>
                  <li>• Email marketing campaigns</li>
                  <li>• Influencer partnerships</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Traditional Marketing</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Print materials and signage</li>
                  <li>• Local media partnerships</li>
                  <li>• Event participation</li>
                  <li>• Tourism board collaborations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Budget Allocation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget Allocation Framework
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Digital Marketing</span>
                  <span className="text-sm font-medium">40%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Events & Activations</span>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Content Creation</span>
                  <span className="text-sm font-medium">20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Traditional Media</span>
                  <span className="text-sm font-medium">10%</span>
                </div>
              </div>
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  Budget percentages may vary based on tenant category and seasonal campaigns
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Marketing Support Tiers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Marketing Support Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Essential</CardTitle>
                <p className="text-sm text-muted-foreground">Basic tenant tier</p>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>• Shared social media posts</li>
                  <li>• Basic signage included</li>
                  <li>• Menu integration</li>
                  <li>• Event participation opportunities</li>
                </ul>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-lg font-bold">Included</p>
                  <p className="text-xs text-muted-foreground">In base rent</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Enhanced</CardTitle>
                <p className="text-sm text-muted-foreground">Premium tenant tier</p>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>• Dedicated social content</li>
                  <li>• Premium positioning</li>
                  <li>• Monthly feature spots</li>
                  <li>• Influencer collaborations</li>
                  <li>• Custom promotional materials</li>
                </ul>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-lg font-bold">+$500/month</p>
                  <p className="text-xs text-muted-foreground">Additional marketing fee</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Premium</CardTitle>
                <p className="text-sm text-muted-foreground">Flagship tenant tier</p>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>• Comprehensive digital strategy</li>
                  <li>• Dedicated marketing manager</li>
                  <li>• Event hosting priorities</li>
                  <li>• Media interview coordination</li>
                  <li>• Custom campaign development</li>
                </ul>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-lg font-bold">+$1,200/month</p>
                  <p className="text-xs text-muted-foreground">Full marketing package</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Metrics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Performance Metrics & KPIs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-xs text-muted-foreground">Monthly Social Reach</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">2.5K</div>
                <div className="text-xs text-muted-foreground">Daily Foot Traffic</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">15%</div>
                <div className="text-xs text-muted-foreground">Avg. Conversion Rate</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">4.2</div>
                <div className="text-xs text-muted-foreground">Avg. Review Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Annual Campaign Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { month: 'Jan-Feb', campaign: 'New Year, New Flavors', focus: 'Health-conscious dining' },
                { month: 'Mar-Apr', campaign: 'Spring Awakening', focus: 'Fresh ingredients, seasonal menus' },
                { month: 'May-Jun', campaign: 'Taste of Ubud', focus: 'Local culture and flavors' },
                { month: 'Jul-Aug', campaign: 'Summer Nights', focus: 'ODE by Night events' },
                { month: 'Sep-Oct', campaign: 'Harvest Festival', focus: 'Farm-to-table experiences' },
                { month: 'Nov-Dec', campaign: 'Holiday Celebrations', focus: 'Festive menus and events' },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded">
                  <div>
                    <div className="font-medium">{item.campaign}</div>
                    <div className="text-sm text-muted-foreground">{item.focus}</div>
                  </div>
                  <div className="text-sm font-medium text-primary">{item.month}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <Button size="lg" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Request Marketing Package Details
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Contact our team to discuss custom marketing solutions for your concept
          </p>
        </div>
      </div>
    </>
  );
};

export default TenantsMarketingBudget;