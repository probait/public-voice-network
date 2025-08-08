-- Cleanup and curated insert of Citizen Thoughts (Voices) - RETRY with proper SQL quoting
BEGIN;

-- 1) Delete all voices except the manually added one
DELETE FROM public.thoughts_submissions
WHERE name <> 'Hugh Behroozy';

-- 2) Insert curated first batch (9 entries) from dataset, featuring them on homepage
-- Note: Email not available in dataset -> using empty string '' (column is NOT NULL)

INSERT INTO public.thoughts_submissions (name, email, province, category, subject, message, featured)
VALUES
-- S.No 1 (Vancouver / Lower Mainland, 32, regular AI user, mixed, job worry, public services)
('Resident, Vancouver / Lower Mainland', '', 'BC', 'Jobs and the economy',
 'Mixed on AI: opportunity and job anxiety',
 'I''m a 32-year-old Vancouver resident and a regular AI user. I''m cautiously optimistic about what AI can do for public services and the economy, but I''m worried about job security. I see room for AI to make services smarter and support a post-scarcity future, yet I want governments to take a balanced approach with strong privacy protections. My priority is that people can make a living as work changes.',
 true),

-- S.No 2 (Vancouver / Lower Mainland, 93, no experience, mostly optimistic)
('Resident, Vancouver / Lower Mainland', '', 'BC', 'Economic growth and innovation',
 'Mostly optimistic: learn fast, keep ethics',
 'I''m a 93-year-old Vancouver resident who hasn''t used AI but feels mostly optimistic. I expect benefits in healthcare, government services and the wider economy if AI is managed responsibly. I''d like trusted institutions—government, tech, and research—to guide safe progress. My advice to leaders: be quick studies on the benefits while keeping ethics front and center.',
 true),

-- S.No 3 (Vancouver / Lower Mainland, occasional user, mixed; worries about jobs and arts)
('Resident, Vancouver / Lower Mainland', '', 'BC', 'Arts, culture, and media',
 'Concerned about jobs and creative work',
 'I''m a Vancouver resident who has tried AI tools and feels mixed overall. I see promise in healthcare but worry AI will eliminate jobs and devalue human creativity and the arts. I support a balanced, ethical approach focused on privacy and fairness. Let''s use AI constructively while protecting workers and creative communities.',
 true),

-- S.No 4 (Vancouver / Lower Mainland, regular user, unsure overall; priority: protect jobs)
('Resident, Vancouver / Lower Mainland', '', 'BC', 'Jobs and the economy',
 'Unsure about AI—keep jobs safe',
 'I''m a 48-year-old Vancouver resident and a regular AI user but unsure about AI''s overall impact. I don''t yet see clear benefits and worry about AI taking jobs. Until we''re more certain, I prefer caution and keeping humans at the center.',
 true),

-- S.No 5 (Vancouver / Lower Mainland, occasional user, concerned; healthcare help; job loss & weapons worries)
('Resident, Vancouver / Lower Mainland', '', 'BC', 'Healthcare and medicine',
 'Cautious: healthcare help, regulate risks',
 'I''m an occasional AI user in Vancouver and more concerned than excited. I see practical help in healthcare—like answering questions for people without a doctor—but I worry about job loss and unregulated uses, especially in weapons. I prefer a balanced, privacy-respecting approach and want benefits to reach small businesses and the public, not just large corporations.',
 true),

-- S.No 6 (Vancouver / Lower Mainland, occasional user, strongly negative on arts/education/environment)
('Resident, Vancouver / Lower Mainland', '', 'BC', 'Arts, culture, and media',
 'Protect arts, education, and society',
 'I''m a Vancouver resident who''s skeptical of AI''s impact on society, education, the arts, and the environment. I fear unchecked AI could undermine creativity and make us too dependent on automated systems. Policy should emphasize restrictions, ethics, and hard thinking before deployment to avoid long-term harm.',
 true),

-- S.No 7 (Vancouver / Lower Mainland, aware non-user, concerned; wants strong gov rules)
('Resident, Vancouver / Lower Mainland', '', 'BC', 'Government and public services',
 'Free up doctors'' time, but strong rules',
 'I''m a non-user in Vancouver and mostly worried about AI''s downsides. It could free up doctors'' time in healthcare, but I fear job losses and security risks, along with environmental costs. I want strong government rules and enforcement to protect people and the planet.',
 true),

-- S.No 8 (Prince George, aware non-user, concerned; benefit all esp. vulnerable)
('Resident, Prince George', '', 'BC', 'Jobs and the economy',
 'Balance benefits with safeguards for all',
 'I''m a Prince George resident who''s aware of AI but hasn''t used it. I''m concerned about jobs being displaced and misuse by bad actors. With careful, balanced rules, AI should benefit everyone—especially vulnerable people—while prioritizing ethics and privacy.',
 true),

-- S.No 9 (Vancouver / Lower Mainland, occasional user, concerned; take it slow)
('Resident, Vancouver / Lower Mainland', '', 'BC', 'Jobs and the economy',
 'Use AI to improve work-life, regulate risks',
 'I''m an occasional AI user in Vancouver. AI could take on some tasks so people earn better wages or get more time off, but we must guard against rising inequality and cost-of-living pressures. I favor strong regulation on ethics and privacy and advise leaders to take it slow.',
 true);

COMMIT;