
import * as z from 'zod';

export const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  date_time: z.string().min(1, 'Date and time is required'),
  category: z.string().min(1, 'Category is required'),
  is_virtual: z.boolean(),
  meeting_link: z.string().url('Invalid URL').optional().or(z.literal('')),
  image_url: z.string().min(1, 'Event image is required').refine(
    (val) => val === 'pending_upload' || val.startsWith('http') || val.startsWith('data:'),
    'Invalid image URL'
  ),
  external_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  external_link_text: z.string().optional(),
});

export type EventFormData = z.infer<typeof eventSchema>;

export const categories = [
  'AI Research',
  'Machine Learning',
  'Quantum Computing',
  'Blockchain & Web3',
  'Biotechnology',
  'Clean Technology',
  'Cybersecurity',
  'Robotics',
  'Ethics & Policy',
  'Industry Applications',
  'Startups & Innovation',
  'Education & Training',
  'Networking',
  'Conference',
  'Workshop',
  'Panel Discussion',
  'Roundtable',
  'General'
];
