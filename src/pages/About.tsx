
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">About PolicyNow</h1>
            <p className="text-xl text-muted-foreground">
              The world's platform for policy change
            </p>
          </div>

          <div className="grid gap-8 mb-12">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  PolicyNow is the world's platform for policy change. We empower people everywhere to start campaigns, 
                  mobilize supporters, and work with decision makers to drive solutions. By collecting and amplifying voices, 
                  we help policymakers, nonprofits, and organizations better understand the real challenges faced by communities. 
                  Your voice matters. Together, we can drive understanding and change.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">How Your Data Is Used</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We believe in transparency about how your contributions are used:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Policymakers:</strong> Aggregated data helps inform policy decisions and resource allocation</li>
                    <li><strong>Nonprofits:</strong> Organizations use insights to better understand community needs and direct their efforts</li>
                    <li><strong>Commercial AI Firms:</strong> Data helps train AI systems to better understand real-world problems and concerns</li>
                    <li><strong>Researchers:</strong> Academic institutions may access anonymized data for social research</li>
                  </ul>
                  <p>All data sharing follows strict privacy guidelines and user consent protocols.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">Start Your Campaign</h3>
                    <p className="text-sm text-muted-foreground">Create a campaign for any policy issue that matters to you</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">Mobilize Support</h3>
                    <p className="text-sm text-muted-foreground">Share your campaign and gather supporters from around the world</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">Drive Change</h3>
                    <p className="text-sm text-muted-foreground">Work with decision makers to implement real policy solutions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                  Have questions, suggestions, or want to partner with us? We'd love to hear from you.
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> <a href="mailto:contact@policynow.org" className="text-primary hover:underline">contact@policynow.org</a></p>
                  <p><strong>For data requests:</strong> <a href="mailto:data@policynow.org" className="text-primary hover:underline">data@policynow.org</a></p>
                  <p><strong>Privacy concerns:</strong> <a href="mailto:privacy@policynow.org" className="text-primary hover:underline">privacy@policynow.org</a></p>
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

export default About;
