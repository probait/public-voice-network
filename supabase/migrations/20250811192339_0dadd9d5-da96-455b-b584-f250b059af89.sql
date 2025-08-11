-- Seed curated BC campaign and BC MPs for Letters for Action
BEGIN;

-- Deactivate any currently active campaigns
UPDATE public.letter_campaigns SET is_active = false WHERE is_active = true;

-- Insert a curated BC campaign
INSERT INTO public.letter_campaigns (slug, title, body_md, scope, send_instructions, is_active)
VALUES (
  'bc-letters-2025',
  'BC AI Governance – Letters for Action',
  $$
# BC AI Governance – Letters for Action

Together, we’re asking BC’s elected officials to adopt responsible AI policies that protect people, strengthen public services, and support trustworthy innovation.

## Why this matters now
AI systems are shaping decisions in healthcare, education, public safety, and employment. British Columbians are clear: we need transparency, accountability, and safeguards for real-world impacts.

## What we’re hearing from British Columbians
Based on recent featured submissions, here are the most common themes:
- Transparency and public oversight in government use of AI
- Strong privacy protections, especially for health and education data
- Guardrails for bias, safety, and human rights
- Public-interest research and open, verifiable evidence
- Education and workforce transition support

## Regional highlights (BC)
### Vancouver / Lower Mainland
- Protect health and public data from commercial misuse
- Require impact assessments and plain-language disclosures for government AI
- Invest in public-interest AI capacity (universities, civic tech, health systems)

### Victoria (South Island)
- Ensure procurement rules require safety, bias testing, and auditability
- Mandate human-in-the-loop for high-stakes public decisions
- Publish model/data provenance for systems used by ministries

### Kelowna (Okanagan)
- Support small businesses with clear, practical compliance guidance
- Strengthen schools’ digital literacy and educator support
- Ensure local healthcare deployments meet privacy-by-design standards

## Our request to MPs
We’re asking MPs to champion: (1) transparent AI in government, (2) privacy and safety by design, (3) public-interest research and evaluation, and (4) practical supports for educators, workers, and small businesses.

Add your name below to support this letter for your riding. When your riding reaches its goal, we’ll deliver the letter and comments to your MP.

—

### FAQ
- What happens when a riding hits the goal? Our team compiles supporters and comments and manually delivers the letter to the MP.
- Will my comment be public? Only if you choose to make it public; we’ll still count your support either way.
- Can I edit my submission? Contact us if you need a change; we’ll help.
  $$,
  'provincial',
  'When a riding reaches its goal, our team will manually deliver the letter and supporter comments to the MP. No automated emails are sent from this site.',
  true
);

-- Insert a starter set of current BC federal MPs with estimated populations (2021 era). 
-- These enable riding-level progress goals (10% of population used by the app).

-- Vancouver / Lower Mainland
INSERT INTO public.mps (full_name, riding_name, province, population, email, parliament, source_url, is_current)
SELECT 'Hedy Fry', 'Vancouver Centre', 'BC', 110000, NULL, 'federal', 'https://www.elections.ca', true
WHERE NOT EXISTS (
  SELECT 1 FROM public.mps WHERE riding_name = 'Vancouver Centre' AND is_current = true
);

INSERT INTO public.mps (full_name, riding_name, province, population, email, parliament, source_url, is_current)
SELECT 'Jenny Kwan', 'Vancouver East', 'BC', 115000, NULL, 'federal', 'https://www.elections.ca', true
WHERE NOT EXISTS (
  SELECT 1 FROM public.mps WHERE riding_name = 'Vancouver East' AND is_current = true
);

INSERT INTO public.mps (full_name, riding_name, province, population, email, parliament, source_url, is_current)
SELECT 'Taleeb Noormohamed', 'Vancouver Granville', 'BC', 99000, NULL, 'federal', 'https://www.elections.ca', true
WHERE NOT EXISTS (
  SELECT 1 FROM public.mps WHERE riding_name = 'Vancouver Granville' AND is_current = true
);

-- Victoria / South Island
INSERT INTO public.mps (full_name, riding_name, province, population, email, parliament, source_url, is_current)
SELECT 'Laurel Collins', 'Victoria', 'BC', 114000, NULL, 'federal', 'https://www.elections.ca', true
WHERE NOT EXISTS (
  SELECT 1 FROM public.mps WHERE riding_name = 'Victoria' AND is_current = true
);

INSERT INTO public.mps (full_name, riding_name, province, population, email, parliament, source_url, is_current)
SELECT 'Elizabeth May', 'Saanich—Gulf Islands', 'BC', 118000, NULL, 'federal', 'https://www.elections.ca', true
WHERE NOT EXISTS (
  SELECT 1 FROM public.mps WHERE riding_name = 'Saanich—Gulf Islands' AND is_current = true
);

-- Kelowna / Okanagan
INSERT INTO public.mps (full_name, riding_name, province, population, email, parliament, source_url, is_current)
SELECT 'Tracy Gray', 'Kelowna—Lake Country', 'BC', 125000, NULL, 'federal', 'https://www.elections.ca', true
WHERE NOT EXISTS (
  SELECT 1 FROM public.mps WHERE riding_name = 'Kelowna—Lake Country' AND is_current = true
);

INSERT INTO public.mps (full_name, riding_name, province, population, email, parliament, source_url, is_current)
SELECT 'Dan Albas', 'Central Okanagan—Similkameen—Nicola', 'BC', 121000, NULL, 'federal', 'https://www.elections.ca', true
WHERE NOT EXISTS (
  SELECT 1 FROM public.mps WHERE riding_name = 'Central Okanagan—Similkameen—Nicola' AND is_current = true
);

COMMIT;