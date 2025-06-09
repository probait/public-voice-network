
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy & Terms of Use</h1>
            <p className="text-muted-foreground">Last updated: June 2024</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
                
                <div className="space-y-6 text-muted-foreground">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Information We Collect</h3>
                    <p>When you start a campaign, we collect:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Your name and email address</li>
                      <li>Your location (city, state/province, country)</li>
                      <li>The content of your campaign or policy issue</li>
                      <li>Timestamp of submission</li>
                      <li>Your preference for anonymous display</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">How We Use Your Information</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Display your campaign in our public community feed (with your chosen anonymity settings)</li>
                      <li>Provide aggregated, anonymized data to policymakers, nonprofits, and commercial AI firms</li>
                      <li>Analyze trends and patterns in policy concerns</li>
                      <li>Contact you about your campaign (only if necessary)</li>
                      <li>Improve our platform and services</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Data Sharing</h3>
                    <p>We may share anonymized, aggregated data with:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Government agencies and policymakers for policy research</li>
                      <li>Nonprofit organizations working on policy issues</li>
                      <li>Commercial AI firms for training and research purposes</li>
                      <li>Academic researchers studying policy and social issues</li>
                    </ul>
                    <p className="mt-2">We never sell individual personal information or share identifiable data without explicit consent.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Your Rights</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Request deletion of your campaigns</li>
                      <li>Update your anonymity preferences</li>
                      <li>Access the data we have about you</li>
                      <li>Opt out of future data sharing arrangements</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Data Security</h3>
                    <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Terms of Use</h2>
                
                <div className="space-y-6 text-muted-foreground">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Acceptable Use</h3>
                    <p>By using PolicyNow, you agree to:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Provide truthful and accurate information</li>
                      <li>Respect the privacy and rights of others</li>
                      <li>Not submit harmful, offensive, or illegal content</li>
                      <li>Not spam or abuse the platform</li>
                      <li>Use the platform for its intended purpose of sharing legitimate policy concerns</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Content Guidelines</h3>
                    <p>Campaign submissions should be:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Relevant to policy issues or concerns</li>
                      <li>Free from hate speech, discrimination, or harassment</li>
                      <li>Not defamatory or invasive of others' privacy</li>
                      <li>Not promotional or commercial in nature</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Content Moderation</h3>
                    <p>We reserve the right to review, edit, or remove content that violates these terms or is deemed inappropriate for our platform.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Limitation of Liability</h3>
                    <p>PolicyNow is provided "as is" without warranties. We are not responsible for the accuracy of user-submitted content or any decisions made based on platform data.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <p className="text-muted-foreground">
                  For questions about this Privacy Policy or Terms of Use, please contact us at:
                </p>
                <div className="mt-4 space-y-1 text-muted-foreground">
                  <p><strong>Email:</strong> <a href="mailto:privacy@policynow.org" className="text-primary hover:underline">privacy@policynow.org</a></p>
                  <p><strong>General inquiries:</strong> <a href="mailto:contact@policynow.org" className="text-primary hover:underline">contact@policynow.org</a></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
