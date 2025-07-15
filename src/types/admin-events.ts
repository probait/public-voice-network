
export interface Meetup {
  id: string;
  title: string;
  description: string;
  location: string;
  date_time: string;
  max_attendees: number | null;
  category: string | null;
  is_virtual: boolean | null;
  meeting_link: string | null;
  created_at: string;
  attendee_count: number;
  homepage_featured?: boolean;
  image_url?: string;
  is_published?: boolean;
  profiles: {
    full_name: string | null;
  } | null;
}
