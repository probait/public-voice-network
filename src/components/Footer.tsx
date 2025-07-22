
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">AI Canada Voice</h3>
            <p className="text-muted-foreground">
              Connecting AI enthusiasts and concerned citizens to discuss the challenges and opportunities ahead.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/events" className="block text-muted-foreground hover:text-primary transition-colors">
                AI Events
              </Link>
              <Link to="/get-involved" className="block text-muted-foreground hover:text-primary transition-colors">
                Get Involved
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Legal</h4>
            <div className="space-y-2">
              <Link to="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                Terms of Use
              </Link>
              <a href="mailto:contact@aicanadavoice.org" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p className="mb-2">
            <a 
              href="https://www.neocarbone.ca/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-destructive hover:text-destructive/80 transition-colors"
            >
              Made with love in Canada
            </a>
          </p>
          <p>&copy; 2024 AI Canada Voice. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
