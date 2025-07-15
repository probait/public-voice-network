
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Building2, Mail, Phone, User } from "lucide-react";
import { usePartnershipInquiry } from "@/hooks/usePartnershipInquiry";

const OrganizationContactForm = () => {
  const { submitInquiry, isSubmitting } = usePartnershipInquiry();
  const [formData, setFormData] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    phone: "",
    organizationType: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submissionData = {
      organization_name: formData.organizationName,
      contact_name: formData.contactName,
      email: formData.email,
      phone: formData.phone || undefined,
      organization_type: formData.organizationType,
      message: formData.message,
    };
    
    const result = await submitInquiry(submissionData);
    if (result.success) {
      setFormData({
        organizationName: "",
        contactName: "",
        email: "",
        phone: "",
        organizationType: "",
        message: "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="organizationName" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Organization Name *
          </Label>
          <Input
            id="organizationName"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleChange}
            required
            placeholder="Your organization name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactName" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Contact Person *
          </Label>
          <Input
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            required
            placeholder="Your full name"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="contact@organization.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="organizationType">Organization Type</Label>
        <select
          id="organizationType"
          name="organizationType"
          value={formData.organizationType}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Select organization type</option>
          <option value="business">Business/Corporation</option>
          <option value="nonprofit">Non-Profit Organization</option>
          <option value="government">Government Agency</option>
          <option value="academic">Academic Institution</option>
          <option value="investor">Investment Firm</option>
          <option value="think-tank">Think Tank/Policy Organization</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          placeholder="Tell us about your interest in collaborating on AI policy initiatives, potential partnerships, or how your organization would like to contribute to the conversation..."
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Send Partnership Inquiry"}
      </Button>
    </form>
  );
};

export default OrganizationContactForm;
