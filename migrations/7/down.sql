-- Remove seed data (in reverse order)
DELETE FROM faqs WHERE id IN (1,2,3,4,5,6,7,8);
DELETE FROM legal_documents WHERE id IN (1,2,3,4,5);
DELETE FROM marketplace_services WHERE id IN (1,2,3,4,5,6,7,8);
DELETE FROM service_tiers WHERE id IN (1,2,3);
