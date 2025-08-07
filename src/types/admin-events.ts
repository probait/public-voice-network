
export interface Meetup {
  id: string;
  title: string;
  description: string;
  location: string;
  date_time: string;
  category: string | null;
  is_virtual: boolean | null;
  meeting_link: string | null;
  created_at: string;
  homepage_featured?: boolean;
  image_url?: string;
  is_published?: boolean;
  external_url?: string;
  external_link_text?: string;
  profiles: {
    full_name: string | null;
  } | null;
}
