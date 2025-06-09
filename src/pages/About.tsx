
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
              Connecting AI enthusiasts to shape the future together
            </p>
          </div>

          <div className="grid gap-8 mb-12">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  PolicyNow is a platform that brings together AI enthusiasts, researchers, policymakers, and concerned 
                  citizens to discuss the challenges and opportunities that artificial intelligence presents. We believe 
                  that the future of AI should be shaped by diverse voices coming together in meaningful conversations. 
                  Through local meetups and community discussions, we're building a network of people who care about 
                  creating a beneficial AI future for everyone.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Why AI Meetups Matter</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>AI is rapidly transforming our world, and these changes affect everyone:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Policy Implications:</strong> Understanding how AI governance and regulation will shape our future</li>
                    <li><strong>Ethical Considerations:</strong> Discussing bias, fairness, and responsible AI development</li>
                    <li><strong>Economic Impact:</strong> Exploring how AI will change jobs, industries, and economic structures</li>
                    <li><strong>Safety Concerns:</strong> Addressing risks and ensuring AI systems remain beneficial and controllable</li>
                    <li><strong>Public Awareness:</strong> Educating communities about AI capabilities and limitations</li>
                  </ul>
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
                    <h3 className="font-semibold mb-2">Organize a Meetup</h3>
                    <p className="text-sm text-muted-foreground">Create a meetup on any AI-related topic that interests you</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">Gather Participants</h3>
                    <p className="text-sm text-muted-foreground">Connect with like-minded people in your area or join virtual discussions</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">Shape the Future</h3>
                    <p className="text-sm text-muted-foreground">Engage in meaningful conversations that can influence AI development and policy</p>
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
                  <p><strong>For partnerships:</strong> <a href="mailto:partnerships@policynow.org" className="text-primary hover:underline">partnerships@policynow.org</a></p>
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
