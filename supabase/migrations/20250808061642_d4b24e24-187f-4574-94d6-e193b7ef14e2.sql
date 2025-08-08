
-- Delete all citizen voices except the manually added Hugh Behroozy entry
DELETE FROM public.thoughts_submissions
WHERE trim(lower(name)) <> 'hugh behroozy';
