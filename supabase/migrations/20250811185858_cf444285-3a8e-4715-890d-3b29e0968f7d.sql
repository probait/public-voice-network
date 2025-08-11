
-- 1) MPs table (federal MPs with riding population)
create table if not exists public.mps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text not null,
  email text,
  riding_name text not null,
  province text not null,
  population integer not null check (population >= 0),
  parliament text not null default 'federal',
  is_current boolean not null default true,
  source_url text
);

-- Keep updated_at fresh
drop trigger if exists mps_update_updated_at on public.mps;
create trigger mps_update_updated_at
before update on public.mps
for each row
execute procedure public.update_updated_at_column();

alter table public.mps enable row level security;

-- Public can read MPs (to display recipients and compute targets)
drop policy if exists "Public can view MPs" on public.mps;
create policy "Public can view MPs"
  on public.mps
  for select
  using (true);

-- Admins can insert/update/delete MPs
drop policy if exists "Admins can insert MPs" on public.mps;
create policy "Admins can insert MPs"
  on public.mps
  for insert
  with check (has_role(auth.uid(), 'admin'::app_role));

drop policy if exists "Admins can update MPs" on public.mps;
create policy "Admins can update MPs"
  on public.mps
  for update
  using (has_role(auth.uid(), 'admin'::app_role));

drop policy if exists "Admins can delete MPs" on public.mps;
create policy "Admins can delete MPs"
  on public.mps
  for delete
  using (has_role(auth.uid(), 'admin'::app_role));

-- Helpful indexes
create index if not exists mps_province_idx on public.mps (province);
create index if not exists mps_is_current_idx on public.mps (is_current);

-- 2) Letter campaigns (curated letter content)
create table if not exists public.letter_campaigns (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  body_md text not null,
  is_active boolean not null default true,
  scope text not null default 'national',
  send_instructions text
);

drop trigger if exists letter_campaigns_update_updated_at on public.letter_campaigns;
create trigger letter_campaigns_update_updated_at
before update on public.letter_campaigns
for each row
execute procedure public.update_updated_at_column();

alter table public.letter_campaigns enable row level security;

-- Public can view active campaign(s)
drop policy if exists "Public can view active campaigns" on public.letter_campaigns;
create policy "Public can view active campaigns"
  on public.letter_campaigns
  for select
  using (is_active = true);

-- Admins can view/manage all campaigns
drop policy if exists "Admins can view all campaigns" on public.letter_campaigns;
create policy "Admins can view all campaigns"
  on public.letter_campaigns
  for select
  using (has_role(auth.uid(), 'admin'::app_role));

drop policy if exists "Admins can insert campaigns" on public.letter_campaigns;
create policy "Admins can insert campaigns"
  on public.letter_campaigns
  for insert
  with check (has_role(auth.uid(), 'admin'::app_role));

drop policy if exists "Admins can update campaigns" on public.letter_campaigns;
create policy "Admins can update campaigns"
  on public.letter_campaigns
  for update
  using (has_role(auth.uid(), 'admin'::app_role));

drop policy if exists "Admins can delete campaigns" on public.letter_campaigns;
create policy "Admins can delete campaigns"
  on public.letter_campaigns
  for delete
  using (has_role(auth.uid(), 'admin'::app_role));

-- 3) Letter supports (public submissions toward riding targets)
create table if not exists public.letter_supports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  campaign_id uuid not null references public.letter_campaigns(id) on delete cascade,
  mp_id uuid not null references public.mps(id) on delete cascade,
  display_name text,
  comment text not null,
  is_public boolean not null default true,
  constraint comment_length_max check (char_length(comment) <= 500)
);

alter table public.letter_supports enable row level security;

-- Anyone can submit support
drop policy if exists "Anyone can insert supports" on public.letter_supports;
create policy "Anyone can insert supports"
  on public.letter_supports
  for insert
  with check (true);

-- Public can view public supports (for transparency / recent comments)
drop policy if exists "Public can view public supports" on public.letter_supports;
create policy "Public can view public supports"
  on public.letter_supports
  for select
  using (is_public = true);

-- Admins can view everything and moderate
drop policy if exists "Admins can view all supports" on public.letter_supports;
create policy "Admins can view all supports"
  on public.letter_supports
  for select
  using (has_role(auth.uid(), 'admin'::app_role));

drop policy if exists "Admins can update supports" on public.letter_supports;
create policy "Admins can update supports"
  on public.letter_supports
  for update
  using (has_role(auth.uid(), 'admin'::app_role));

drop policy if exists "Admins can delete supports" on public.letter_supports;
create policy "Admins can delete supports"
  on public.letter_supports
  for delete
  using (has_role(auth.uid(), 'admin'::app_role));

-- Helpful indexes
create index if not exists letter_supports_campaign_idx on public.letter_supports (campaign_id);
create index if not exists letter_supports_mp_idx on public.letter_supports (mp_id);
create index if not exists letter_supports_created_at_idx on public.letter_supports (created_at);

-- 4) Seed a default active campaign you can edit later in the dashboard
insert into public.letter_campaigns (slug, title, body_md, is_active, scope, send_instructions)
values (
  'letters-for-action-001',
  'Letters for Action: National AI Voices',
  'Dear Member of Parliament,

We are sharing a summary of concerns and hopes from Canadians regarding AI. This letter consolidates input gathered across provinces and territories.

Highlights:
- Top issues mentioned by Canadians: [will be summarized from the dataset on the page]
- Regional nuances: [we will provide brief notes per region]
- Constructive requests: transparency, safety, accountability, and equitable access.

We appreciate your leadership and attention to these citizen perspectives.

Sincerely,
PolicyNow Team',
  true,
  'national',
  'Once a riding reaches 100% (10% of its population), our staff will manually send this letter to that riding''s MP with a tailored regional introduction.'
)
on conflict (slug) do nothing;
