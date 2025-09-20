import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PageLayout from '@/components/layout/PageLayout';

const PrivacyPolicy = () => {
  const lastUpdated = 'January 1, 2025';

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Privacy Policy
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                1. Information We Collect
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  We collect information you provide directly to us, such as
                  when you:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Make a reservation through our booking system</li>
                  <li>Create an account on our website</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact us through our contact forms</li>
                  <li>Participate in our Taste Compass loyalty program</li>
                </ul>

                <p className="mt-4">This information may include:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Reservation details and preferences</li>
                  <li>Dietary restrictions and allergies</li>
                  <li>
                    Payment information (processed securely through third-party
                    providers)
                  </li>
                  <li>Device and usage information</li>
                </ul>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. How We Use Your Information
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Process and manage your reservations</li>
                  <li>Provide customer service and support</li>
                  <li>Send you booking confirmations and updates</li>
                  <li>Personalize your experience at ODE Food Hall</li>
                  <li>Communicate about special offers and events</li>
                  <li>Improve our services and website functionality</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. Information Sharing and Disclosure
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>With service providers who help operate our business</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a merger, sale, or acquisition</li>
                  <li>With your explicit consent</li>
                </ul>
                <p className="mt-3">
                  We do not sell, rent, or trade your personal information to
                  third parties for marketing purposes.
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  We implement appropriate technical and organizational measures
                  to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction.
                </p>
                <p>
                  Payment information is processed through secure, PCI-compliant
                  payment processors and is not stored on our servers.
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                5. Your Rights (GDPR)
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Under the General Data Protection Regulation (GDPR), you have
                  the right to:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Access your personal data</li>
                  <li>Rectify inaccurate personal data</li>
                  <li>Erase your personal data</li>
                  <li>Restrict processing of your personal data</li>
                  <li>Data portability</li>
                  <li>Object to processing</li>
                  <li>Withdraw consent at any time</li>
                </ul>
                <p className="mt-3">
                  To exercise these rights, please contact us at
                  selena@odefoodhall.com
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                6. Cookies and Tracking
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  We use cookies and similar tracking technologies to enhance
                  your browsing experience, analyze website traffic, and
                  understand user preferences.
                </p>
                <p>
                  You can manage your cookie preferences through your browser
                  settings or our cookie consent banner.
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  We retain your personal information for as long as necessary
                  to provide our services, comply with legal obligations,
                  resolve disputes, and enforce our agreements.
                </p>
                <p>
                  Reservation data is typically retained for 3 years for
                  business and tax purposes.
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                8. International Data Transfers
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Your information may be transferred to and processed in
                  countries other than your country of residence. We ensure
                  appropriate safeguards are in place for such transfers.
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                9. Changes to This Policy
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  We may update this Privacy Policy from time to time. We will
                  notify you of any material changes by posting the new policy
                  on our website and updating the "Last updated" date.
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  If you have any questions about this Privacy Policy, please
                  contact us:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p>
                    <strong>ODE Food Hall</strong>
                  </p>
                  <p>Jl. Monkey Forest Road, Ubud, Bali 80571, Indonesia</p>
                  <p>Email: selena@odefoodhall.com</p>
                  <p>Phone: +62 819 432 863 95</p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default PrivacyPolicy;
