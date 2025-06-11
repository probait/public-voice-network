
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  province: z.string().min(1, "Please select your province/territory"),
  category: z.string().min(1, "Please select a category"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormData = z.infer<typeof formSchema>;

const ThoughtsSubmissionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      province: "",
      category: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // For now, just simulate submission - will implement database later
      console.log('Submission data:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Thank you for your submission!",
        description: "Your thoughts have been received and will be reviewed.",
      });

      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your thoughts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province/Territory</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your province/territory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AB">Alberta</SelectItem>
                    <SelectItem value="BC">British Columbia</SelectItem>
                    <SelectItem value="MB">Manitoba</SelectItem>
                    <SelectItem value="NB">New Brunswick</SelectItem>
                    <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                    <SelectItem value="NS">Nova Scotia</SelectItem>
                    <SelectItem value="ON">Ontario</SelectItem>
                    <SelectItem value="PE">Prince Edward Island</SelectItem>
                    <SelectItem value="QC">Quebec</SelectItem>
                    <SelectItem value="SK">Saskatchewan</SelectItem>
                    <SelectItem value="NT">Northwest Territories</SelectItem>
                    <SelectItem value="NU">Nunavut</SelectItem>
                    <SelectItem value="YT">Yukon</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="employment">Jobs & Employment</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="privacy">Privacy & Rights</SelectItem>
                    <SelectItem value="ethics">AI Ethics</SelectItem>
                    <SelectItem value="economy">Economic Impact</SelectItem>
                    <SelectItem value="regulation">Government & Regulation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Brief summary of your thoughts" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Thoughts</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share your thoughts, concerns, questions, or ideas about AI's impact on Canada..."
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          {isSubmitting ? "Submitting..." : "Submit Your Thoughts"}
        </Button>
      </form>
    </Form>
  );
};

export default ThoughtsSubmissionForm;
