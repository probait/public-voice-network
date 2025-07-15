-- Insert mock contributors data into the contributors table
INSERT INTO public.contributors (name, email, bio, organization, institution, headshot_url, website_url, linkedin_url, twitter_url, created_at, updated_at)
VALUES 
  (
    'Dr. Sarah Chen',
    's.chen@aiethics.org',
    'Dr. Chen is a leading researcher in AI ethics and policy, focusing on algorithmic fairness and transparency in machine learning systems. She has published over 50 papers on AI governance and serves on multiple advisory boards for tech policy organizations.',
    'AI Ethics Institute',
    'University of Toronto',
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face',
    'https://sarahchen.ai',
    'https://linkedin.com/in/drschenai',
    'https://twitter.com/drschenai',
    '2024-01-15 00:00:00+00',
    '2024-01-15 00:00:00+00'
  ),
  (
    'Michael Rodriguez',
    'm.rodriguez@techpolicy.ca',
    'Michael specializes in AI regulation and cross-border data governance. His work focuses on developing practical frameworks for AI accountability in government and enterprise settings.',
    'TechPolicy Canada',
    'McGill University',
    'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face',
    'https://mrodriguez.ca',
    'https://linkedin.com/in/mrodriguezpolicy',
    NULL,
    '2024-02-10 00:00:00+00',
    '2024-02-10 00:00:00+00'
  ),
  (
    'Dr. Priya Patel',
    'p.patel@ubc.ca',
    'A computer scientist turned policy researcher, Dr. Patel works on AI safety standards and risk assessment frameworks. She leads initiatives on responsible AI deployment in healthcare and autonomous systems.',
    'Canadian AI Safety Coalition',
    'University of British Columbia',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face',
    'https://priyapatel.research.ubc.ca',
    'https://linkedin.com/in/drpriyapatel',
    'https://twitter.com/priyaaisafety',
    '2024-01-20 00:00:00+00',
    '2024-01-20 00:00:00+00'
  ),
  (
    'James Thompson',
    'j.thompson@digitalrights.ca',
    'James is a policy advocate with 15 years of experience in digital rights and privacy law. He focuses on the intersection of AI technologies and civil liberties, working to ensure AI development respects human rights.',
    'Digital Rights Foundation',
    NULL,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    'https://jamesthompson.law',
    'https://linkedin.com/in/jamesthompsonlaw',
    'https://twitter.com/jthompsonlaw',
    '2024-03-05 00:00:00+00',
    '2024-03-05 00:00:00+00'
  ),
  (
    'Dr. Lisa Wang',
    'l.wang@yorku.ca',
    'Dr. Wang researches the economic and social impacts of AI automation on Canadian workers. Her work informs policy recommendations on education, retraining, and social safety nets in the age of AI.',
    'Future of Work Institute',
    'York University',
    'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&h=400&fit=crop&crop=face',
    'https://lisawang.yorku.ca',
    'https://linkedin.com/in/drlisawang',
    NULL,
    '2024-02-28 00:00:00+00',
    '2024-02-28 00:00:00+00'
  ),
  (
    'Robert Kim',
    'r.kim@uwaterloo.ca',
    'Robert brings a unique perspective combining technical expertise in machine learning with policy analysis. He works on AI competitiveness strategies and international cooperation frameworks.',
    'Canadian Centre for AI Innovation',
    'University of Waterloo',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    'https://robertkim.uwaterloo.ca',
    'https://linkedin.com/in/robertkimai',
    'https://twitter.com/robkimai',
    '2024-01-30 00:00:00+00',
    '2024-01-30 00:00:00+00'
  );