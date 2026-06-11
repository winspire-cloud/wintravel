-- Win Travel — marketplace seed
-- Seeds house vendors and the launch catalog. Safe to run once after the
-- initial migration: supabase db push && psql ... -f supabase/seed.sql
-- (or paste into the Supabase SQL editor).

insert into public.vendors (id, owner_id, name, slug, approved) values
  ('00000000-0000-4000-8000-000000000001', null, 'Atoll Private Collection', 'atoll-private-collection', true),
  ('00000000-0000-4000-8000-000000000002', null, 'Aegean House', 'aegean-house', true),
  ('00000000-0000-4000-8000-000000000003', null, 'Meridian Safaris', 'meridian-safaris', true),
  ('00000000-0000-4000-8000-000000000004', null, 'Kansai Heritage Stays', 'kansai-heritage-stays', true),
  ('00000000-0000-4000-8000-000000000005', null, 'Vine & Stone Estates', 'vine-and-stone-estates', true),
  ('00000000-0000-4000-8000-000000000006', null, 'Alpine Reserve', 'alpine-reserve', true),
  ('00000000-0000-4000-8000-000000000007', null, 'Tyrrhenian Villas', 'tyrrhenian-villas', true),
  ('00000000-0000-4000-8000-000000000008', null, 'North Atlantic Lodges', 'north-atlantic-lodges', true),
  ('00000000-0000-4000-8000-000000000009', null, 'Austral Expeditions', 'austral-expeditions', true),
  ('00000000-0000-4000-8000-00000000000a', null, 'Maison Lumière Travel', 'maison-lumiere-travel', true),
  ('00000000-0000-4000-8000-00000000000b', null, 'Gulf Meridian', 'gulf-meridian', true);

insert into public.listings
  (vendor_id, slug, title, location, country, category, nights, guests, description, inclusions,
   retail_value, starting_bid, bid_increment, buy_now_price, image_url, featured, status, ends_at)
values
  ('00000000-0000-4000-8000-000000000001', 'maldives-overwater-villa',
   'Seven Nights in an Overwater Villa, South Ari Atoll', 'South Ari Atoll', 'Maldives', 'beach', 7, 2,
   'A glass-floored villa suspended over a private lagoon, with a personal butler, sunset dolphin cruise, and seaplane transfers from Malé. Breakfast arrives by canoe; the house reef is forty feet from your deck.',
   '["7 nights, overwater pool villa","Round-trip seaplane transfers","Daily breakfast and dinner for two","Sunset dolphin cruise","60-minute couples spa treatment"]',
   24500, 6500, 250, 18900, '/art/maldives.svg', true, 'live', now() + interval '38 hours'),

  ('00000000-0000-4000-8000-000000000002', 'santorini-cliffside-suite',
   'Cliffside Cave Suite with Caldera Plunge Pool, Oia', 'Oia, Santorini', 'Greece', 'beach', 5, 2,
   'Carved into the caldera cliff, this whitewashed suite opens onto a private terrace and heated plunge pool facing the Aegean. Includes a catamaran day sail and a private wine tasting in a 17th-century canava.',
   '["5 nights, cave suite with plunge pool","Private catamaran day sail with lunch","Canava wine tasting for two","Airport transfers","Daily Greek breakfast"]',
   12800, 3400, 200, 9900, '/art/santorini.svg', true, 'live', now() + interval '14 hours'),

  ('00000000-0000-4000-8000-000000000003', 'serengeti-migration-safari',
   'Six-Night Great Migration Safari, Serengeti', 'Serengeti', 'Tanzania', 'safari', 6, 2,
   'Follow the herds from a tented camp that moves with the migration. Twice-daily game drives with a private guide, sundowners on the kopjes, and an optional dawn balloon crossing over the plains.',
   '["6 nights, luxury tented camp","Private 4x4 and guide throughout","All meals, house wines and spirits","Hot-air balloon safari at dawn","Park fees and conservation levies"]',
   31000, 8000, 500, 24500, '/art/serengeti.svg', true, 'live', now() + interval '62 hours'),

  ('00000000-0000-4000-8000-000000000004', 'kyoto-ryokan-retreat',
   'Five Nights in a Historic Ryokan with Kaiseki, Kyoto', 'Higashiyama, Kyoto', 'Japan', 'city', 5, 2,
   'A 12-room ryokan on a lantern-lit lane below Kiyomizu-dera. Tatami suites with private open-air cedar baths, nightly kaiseki dinners, a private tea ceremony, and an after-hours temple visit with a monk.',
   '["5 nights, garden suite with cedar bath","Nightly 9-course kaiseki dinner","Private tea ceremony","After-hours temple visit","Rail transfers from Kansai Airport"]',
   16400, 4200, 250, 12800, '/art/kyoto.svg', false, 'live', now() + interval '86 hours'),

  ('00000000-0000-4000-8000-000000000005', 'napa-harvest-estate',
   'Harvest Week at a Private Vineyard Estate, Napa', 'St. Helena, Napa Valley', 'United States', 'wine', 4, 4,
   'A four-bedroom estate amid forty acres of cabernet at harvest. Blend your own barrel with the winemaker, dine at a Michelin three-star, and tour the valley by vintage convertible.',
   '["4 nights, private 4-bedroom estate","Winemaker blending session and barrel","Dinner for four at a 3-star Michelin","Vintage car valley tour","Daily chef-prepared breakfast"]',
   19800, 5000, 250, 15500, '/art/napa.svg', false, 'live', now() + interval '110 hours'),

  ('00000000-0000-4000-8000-000000000006', 'swiss-alps-chalet',
   'Ski-In Chalet Week with Private Chef, Zermatt', 'Zermatt', 'Switzerland', 'mountain', 7, 6,
   'A timber-and-glass chalet at the foot of the Matterhorn with ski-in access, a private chef, in-chalet spa, and a helicopter glacier landing with champagne at 13,000 feet.',
   '["7 nights, 4-bedroom ski-in chalet","Private chef, breakfast and dinner","6-day lift passes for six","Helicopter glacier landing","In-chalet massage for six"]',
   42000, 11000, 500, 33000, '/art/zermatt.svg', false, 'live', now() + interval '134 hours'),

  ('00000000-0000-4000-8000-000000000007', 'amalfi-coast-villa',
   'Five Nights in a Clifftop Villa with Boat Days, Amalfi', 'Positano, Amalfi Coast', 'Italy', 'beach', 5, 4,
   'A lemon-grove villa above Positano with infinity pool and daily housekeeping. Two private boat days along the coast to Capri, a pasta masterclass on your terrace, and dinner reservations that don''t exist for anyone else.',
   '["5 nights, 2-bedroom clifftop villa","Two full-day private boat charters","Terrace pasta masterclass","Priority dinner reservations","Naples airport transfers"]',
   17600, 4600, 250, 13900, '/art/amalfi.svg', false, 'live', now() + interval '50 hours'),

  ('00000000-0000-4000-8000-000000000008', 'iceland-aurora-lodge',
   'Northern Lights Lodge with Glacier Lagoon, Iceland', 'Vatnajökull Region', 'Iceland', 'adventure', 4, 2,
   'A glass-roofed suite under the auroral oval. Private super-jeep glacier tour, zodiac crossing of the Jökulsárlón ice lagoon, geothermal lagoon entry, and a photographer on call for the lights.',
   '["4 nights, glass-roof aurora suite","Private super-jeep glacier day","Ice lagoon zodiac crossing","Geothermal lagoon premium entry","Aurora photography session"]',
   11200, 2900, 200, 8700, '/art/iceland.svg', false, 'live', now() + interval '26 hours'),

  ('00000000-0000-4000-8000-000000000001', 'bora-bora-lagoon-escape',
   'Six Nights Over the Lagoon, Bora Bora', 'Bora Bora', 'French Polynesia', 'beach', 6, 2,
   'An end-of-pontoon overwater bungalow facing Mount Otemanu. Private lagoon picnic on a motu, snorkeling with rays and blacktips, and a Polynesian spa ritual in an open-air fare.',
   '["6 nights, end-of-pontoon bungalow","Private motu picnic day","Guided lagoon snorkel safari","Polynesian spa ritual for two","Half-board dining"]',
   21900, 5800, 250, 16800, '/art/bora-bora.svg', false, 'live', now() + interval '158 hours'),

  ('00000000-0000-4000-8000-000000000009', 'patagonia-explorer-lodge',
   'Five-Night Explorer Lodge, Torres del Paine', 'Torres del Paine', 'Chile', 'adventure', 5, 2,
   'An all-inclusive design lodge facing the granite towers. Choose from thirty guided excursions — the W trek''s best day-hikes, horseback rides with baqueanos, and puma tracking with a naturalist.',
   '["5 nights, lake-view suite","All meals and open bar","Daily guided excursions","Puma tracking with naturalist","Punta Arenas transfers"]',
   14800, 3900, 200, 11500, '/art/patagonia.svg', false, 'live', now() + interval '182 hours'),

  ('00000000-0000-4000-8000-00000000000a', 'paris-rive-gauche',
   'Four Nights on the Rive Gauche with Private Louvre', 'Saint-Germain, Paris', 'France', 'city', 4, 2,
   'A balconied suite over the Seine, a private after-hours hour in the Louvre''s Denon wing, table at a two-star on the Left Bank, and a dawn photography walk before the city wakes.',
   '["4 nights, Seine-view suite","Private after-hours Louvre visit","Dinner for two, 2-star Michelin","Dawn photography walk","Arrival champagne and transfers"]',
   15200, 4000, 250, 12400, '/art/paris.svg', false, 'live', now() + interval '8 hours'),

  ('00000000-0000-4000-8000-00000000000b', 'dubai-desert-and-sky',
   'Desert Camp and Sky Suite Split Stay, Dubai', 'Dubai', 'United Arab Emirates', 'adventure', 5, 2,
   'Two nights in a Bedouin-style desert camp — falconry at dawn, dune dinner under the stars — then three nights in a 60th-floor sky suite with butler, helicopter city tour included.',
   '["2 nights desert camp, all-inclusive","3 nights sky suite with butler","Falconry and dune dinner","Helicopter city tour","All transfers including 4x4"]',
   13600, 3600, 200, 10900, '/art/dubai.svg', false, 'live', now() + interval '206 hours');
