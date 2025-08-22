// Dynamic hobby validation and support system
import { videoDatabase } from './videoSelection';

// Comprehensive 1000+ hobby list from user's ultimate collection
const validHobbies = [
  // Creative Arts & Crafts (100)
  'painting', 'watercolor', 'acrylic', 'oil painting', 'drawing', 'sketching', 'digital art', 'sculpture', 'pottery', 'ceramics',
  'jewelry making', 'beadwork', 'knitting', 'crocheting', 'embroidery', 'cross-stitch', 'quilting', 'sewing', 'fashion design', 'costume design',
  'woodworking', 'woodcarving', 'furniture making', 'metalworking', 'blacksmithing', 'glassblowing', 'stained glass', 'mosaic art', 'origami', 'paper crafts',
  'scrapbooking', 'card making', 'bookbinding', 'calligraphy', 'hand lettering', 'printmaking', 'screen printing', 'soap making', 'candle making', 'leatherworking',
  'basketweaving', 'macrame', 'tie-dyeing', 'batik', 'fabric painting', 'decoupage', 'resin art', 'wire wrapping', 'stone painting', 'sand art',
  'puppet making', 'mask making', 'model making', 'chainmail making', 'armor crafting', 'weapon replicas', 'prop making', 'miniature painting', 'doll making', 'teddy bear making',
  'marionette making', 'shadow box art', 'collage making', 'mixed media art', 'assemblage art', 'installation art', 'performance art', 'land art', 'ice sculpting', 'snow sculpting',
  'sandcastle building', 'clay modeling', 'wax modeling', 'plaster casting', 'bronze casting', 'lost-wax casting', 'patina techniques', 'engraving', 'etching', 'lithography',
  'woodblock printing', 'linocut printing', 'silkscreen printing', 'monotype printing', 'intaglio printing', 'relief printing', 'digital printing', 'photo manipulation', 'photo collage', 'photo transfer',
  'cyanotype photography', 'pinhole photography', 'film photography', 'darkroom processing', 'hand coloring photos', 'photo restoration', 'album making', 'frame making', 'mat cutting', 'art conservation',
  
  // Music & Performance (80)
  'playing piano', 'piano', 'playing guitar', 'guitar', 'playing violin', 'violin', 'playing drums', 'drums', 'playing flute', 'flute',
  'playing saxophone', 'saxophone', 'playing trumpet', 'trumpet', 'playing bass guitar', 'bass guitar', 'playing harmonica', 'harmonica', 'playing ukulele', 'ukulele',
  'playing banjo', 'banjo', 'playing accordion', 'accordion', 'playing mandolin', 'mandolin', 'playing harp', 'harp', 'playing cello', 'cello', 'playing viola', 'viola',
  'playing double bass', 'double bass', 'playing clarinet', 'clarinet', 'playing oboe', 'oboe', 'playing trombone', 'trombone', 'playing french horn', 'french horn', 'playing tuba', 'tuba',
  'playing xylophone', 'xylophone', 'playing vibraphone', 'vibraphone', 'playing marimba', 'marimba', 'playing timpani', 'timpani', 'playing djembe', 'djembe', 'playing bongos', 'bongos',
  'playing congas', 'congas', 'playing tabla', 'tabla', 'playing didgeridoo', 'didgeridoo', 'playing recorder', 'recorder', 'playing pan flute', 'pan flute', 'playing ocarina', 'ocarina',
  'singing', 'songwriting', 'music composition', 'music arrangement', 'music production', 'sound engineering', 'audio mixing', 'mastering', 'dj-ing', 'beatboxing',
  'rapping', 'freestyle rapping', 'dancing', 'ballet', 'hip-hop', 'ballroom', 'salsa', 'swing', 'tap', 'contemporary', 'jazz', 'folk', 'belly', 'flamenco', 'tango', 'waltz', 'breakdancing',
  'acting', 'theater', 'stand-up comedy', 'improv comedy', 'voice acting', 'puppeteering', 'magic tricks', 'juggling', 'mime', 'storytelling', 'poetry recitation', 'opera singing',
  'choir singing', 'orchestra participation', 'band participation', 'busking', 'street performance', 'clowning', 'ventriloquism', 'fire dancing',
  
  // Sports & Physical Activities (120)
  'running', 'jogging', 'walking', 'speed walking', 'marathon running', 'ultramarathon running', 'trail running', 'obstacle course racing', 'hiking', 'trekking',
  'mountaineering', 'rock climbing', 'mountain climbing', 'bouldering', 'ice climbing', 'via ferrata', 'canyoneering', 'rappelling', 'swimming', 'diving',
  'snorkeling', 'scuba diving', 'free diving', 'synchronized swimming', 'water polo', 'surfing', 'windsurfing', 'kitesurfing', 'stand-up paddleboarding', 'wakeboarding',
  'water skiing', 'jet skiing', 'sailing', 'yachting', 'kayaking', 'canoeing', 'rafting', 'rowing', 'dragon boat racing', 'skateboarding',
  'longboarding', 'snowboarding', 'alpine skiing', 'cross-country skiing', 'freestyle skiing', 'ski jumping', 'ice skating', 'figure skating', 'speed skating', 'roller skating',
  'inline skating', 'cycling', 'mountain biking', 'bmx riding', 'road cycling', 'track cycling', 'cyclocross', 'triathlon', 'duathlon', 'motorcycling',
  'motocross', 'atv riding', 'tennis', 'badminton', 'table tennis', 'squash', 'racquetball', 'paddle tennis', 'pickleball', 'basketball',
  'streetball', 'football', 'soccer', 'futsal', 'beach soccer', 'baseball', 'softball', 'cricket', 'rounders', 'volleyball',
  'beach volleyball', 'field hockey', 'ice hockey', 'street hockey', 'lacrosse', 'rugby', 'australian rules football', 'american football', 'golf', 'mini golf',
  'disc golf', 'bowling', 'ten-pin bowling', 'candlepin bowling', 'pool', 'billiards', 'snooker', 'darts', 'archery', 'crossbow shooting',
  'target shooting', 'clay pigeon shooting', 'hunting', 'bow hunting', 'karate', 'taekwondo', 'judo', 'jujitsu', 'aikido', 'kung fu',
  'kickboxing', 'boxing', 'muay thai', 'wrestling', 'mma', 'fencing', 'historical fencing', 'kendo', 'gymnastics', 'rhythmic gymnastics', 'trampoline',
  
  // Health & Fitness (50)
  'yoga', 'hot yoga', 'bikram yoga', 'ashtanga yoga', 'vinyasa yoga', 'hatha yoga', 'kundalini yoga', 'yin yoga', 'restorative yoga', 'pilates',
  'mat pilates', 'reformer pilates', 'barre', 'weightlifting', 'powerlifting', 'olympic lifting', 'bodybuilding', 'strongman training', 'crossfit', 'calisthenics',
  'street workout', 'parkour', 'freerunning', 'functional fitness', 'circuit training', 'hiit training', 'tabata', 'spinning', 'indoor cycling', 'zumba',
  'aerobics', 'step aerobics', 'aqua aerobics', 'trx training', 'kettlebell training', 'resistance band training', 'balance training', 'flexibility training', 'stretching', 'foam rolling',
  'massage therapy', 'self-massage', 'meditation', 'mindfulness', 'breathing exercises', 'tai chi', 'qigong', 'reiki', 'aromatherapy', 'acupuncture',
  
  // Collecting & Hobbies (80)
  'coin collecting', 'stamp collecting', 'postcard collecting', 'book collecting', 'rare book collecting', 'comic book collecting', 'graphic novel collecting', 'trading card collecting', 'sports cards', 'pokemon cards',
  'action figure collecting', 'doll collecting', 'barbie collecting', 'toy collecting', 'die-cast collecting', 'model train collecting', 'model car collecting', 'model airplane collecting', 'model ship collecting', 'lego collecting',
  'antique collecting', 'vintage item collecting', 'retro gaming collecting', 'record collecting', 'vinyl collecting', 'cd collecting', 'cassette collecting', 'movie collecting', 'dvd collecting', 'blu-ray collecting',
  'vhs collecting', 'art collecting', 'poster collecting', 'print collecting', 'jewelry collecting', 'vintage jewelry', 'watch collecting', 'clock collecting', 'mineral collecting', 'rock collecting',
  'gemstone collecting', 'crystal collecting', 'fossil collecting', 'seashell collecting', 'coral collecting', 'butterfly collecting', 'insect collecting', 'beetle collecting', 'plant collecting', 'seed collecting',
  'pressed flower collecting', 'bottle collecting', 'can collecting', 'badge collecting', 'pin collecting', 'patch collecting', 'magnet collecting', 'spoon collecting', 'thimble collecting', 'keychain collecting',
  'snow globe collecting', 'miniature collecting', 'shot glass collecting', 'mug collecting', 'teapot collecting', 'sports memorabilia', 'celebrity memorabilia', 'historical artifacts', 'military memorabilia', 'currency collecting',
  'banknote collecting', 'ticket stub collecting', 'menu collecting', 'matchbook collecting', 'lighter collecting', 'perfume bottle collecting', 'salt shaker collecting', 'nutcracker collecting', 'figurine collecting', 'ornament collecting',
  
  // Games & Puzzles (70)
  'chess', 'checkers', 'backgammon', 'go', 'othello', 'reversi', 'mancala', 'chinese checkers', 'scrabble', 'monopoly',
  'risk', 'settlers of catan', 'ticket to ride', 'pandemic', 'dungeons & dragons', 'pathfinder', 'warhammer', 'magic: the gathering', 'pokemon tcg', 'yu-gi-oh',
  'board game design', 'poker', 'bridge', 'blackjack', 'hearts', 'spades', 'rummy', 'gin', 'canasta', 'cribbage',
  'video gaming', 'pc gaming', 'console gaming', 'mobile gaming', 'retro gaming', 'arcade gaming', 'vr gaming', 'ar gaming', 'game streaming', 'speedrunning',
  'competitive gaming', 'game development', 'game design', 'level design', 'game testing', 'jigsaw puzzles', '3d puzzles', 'mechanical puzzles', 'logic puzzles', 'crossword puzzles',
  'cryptic crosswords', 'sudoku', 'kakuro', 'word searches', 'anagrams', 'acrostics', 'brain teasers', 'riddles', 'rubik\'s cube', 'speedcubing',
  'trivia', 'quiz competitions', 'escape rooms', 'treasure hunts', 'scavenger hunts', 'mazes', 'number puzzles', 'pattern puzzles', 'memory games', 'puzzle competitions',
  
  // Technology & Digital (100)
  'computer programming', 'coding', 'web development', 'app development', 'game development', '3d modeling', 'animation', 'video editing', 'photo editing', 'graphic design',
  'digital photography', 'drone flying', 'robotics', 'electronics', 'circuit building', 'arduino projects', 'raspberry pi projects', '3d printing', 'virtual reality', 'augmented reality',
  'cryptocurrency', 'blockchain development', 'smart contracts', 'nft creation', 'defi projects', 'artificial intelligence', 'machine learning', 'deep learning', 'neural networks', 'computer vision',
  'natural language processing', 'data science', 'data analysis', 'big data', 'cloud computing', 'devops', 'cybersecurity', 'ethical hacking', 'penetration testing', 'network security',
  'digital forensics', 'system administration', 'database management', 'software testing', 'quality assurance', 'tech blogging', 'technical writing', 'podcast production', 'youtube creation', 'live streaming',
  'social media management', 'seo optimization', 'digital marketing', 'e-commerce', 'online business', 'affiliate marketing', 'dropshipping', 'print on demand', 'saas development', 'mobile app testing',
  'ui/ux design', 'user research', 'prototyping', 'wireframing', 'design systems', 'front-end development', 'back-end development', 'full-stack development', 'api development', 'microservices',
  'containerization', 'kubernetes', 'docker', 'linux administration', 'shell scripting', 'automation', 'ci/cd', 'version control', 'project management tools', 'agile methodology',
  'scrum mastering', 'tech entrepreneurship', 'startup founding', 'tech investing', 'patent research', 'invention', 'iot development', 'embedded systems', 'firmware development', 'hardware hacking',
  'electronics repair', 'computer building', 'overclocking', 'cryptocurrency mining', 'tech support', 'it consulting', 'digital nomadism', 'remote work optimization', 'productivity hacking', 'automation tools',
  
  // Science & Nature (100)
  'astronomy', 'stargazing', 'astrophotography', 'telescope making', 'planetarium visits', 'meteorology', 'weather tracking', 'storm chasing', 'climate science', 'atmospheric research',
  'geology', 'mineralogy', 'petrology', 'volcanology', 'seismology', 'paleontology', 'archaeology', 'anthropology', 'forensic science', 'criminology',
  'biology', 'molecular biology', 'genetics', 'biotechnology', 'bioinformatics', 'botany', 'plant biology', 'horticulture', 'mycology', 'zoology',
  'marine biology', 'ichthyology', 'ornithology', 'entomology', 'arachnology', 'herpetology', 'mammalogy', 'ecology', 'conservation biology', 'environmental science',
  'sustainability', 'renewable energy', 'solar power', 'wind energy', 'hydroponics', 'aquaponics', 'permaculture', 'organic farming', 'urban farming', 'vertical farming',
  'chemistry', 'organic chemistry', 'inorganic chemistry', 'biochemistry', 'analytical chemistry', 'physical chemistry', 'physics', 'quantum physics', 'nuclear physics', 'particle physics',
  'theoretical physics', 'applied physics', 'engineering physics', 'materials science', 'nanotechnology', 'microscopy', 'spectroscopy', 'crystallography', 'laboratory work', 'scientific research',
  'experimental design', 'data collection', 'statistical analysis', 'scientific writing', 'peer review', 'conference presenting', 'nature photography', 'wildlife photography', 'macro photography', 'time-lapse photography',
  'nature journaling', 'field sketching', 'botanical illustration', 'scientific illustration', 'herbarium making', 'specimen collection', 'taxidermy', 'nature conservation', 'wildlife rehabilitation', 'animal behavior study',
  'citizen science', 'biohacking', 'diy biology', 'fermentation', 'kombucha brewing', 'mushroom cultivation', 'aquarium keeping', 'terrarium building', 'vivarium setup', 'greenhouse management',
  
  // Literature & Writing (80)
  'creative writing', 'fiction writing', 'non-fiction writing', 'novel writing', 'novella writing', 'short story writing', 'flash fiction', 'micro fiction', 'poetry writing', 'spoken word',
  'slam poetry', 'haiku writing', 'sonnet writing', 'free verse', 'screenwriting', 'television writing', 'radio writing', 'playwriting', 'musical theater writing', 'libretto writing',
  'journalism', 'investigative journalism', 'sports journalism', 'entertainment journalism', 'political journalism', 'science journalism', 'health journalism', 'travel journalism', 'food writing', 'wine writing',
  'blogging', 'personal blogging', 'professional blogging', 'guest blogging', 'technical writing', 'copywriting', 'content writing', 'seo writing', 'marketing writing', 'grant writing',
  'proposal writing', 'business writing', 'academic writing', 'research writing', 'dissertation writing', 'thesis writing', 'editing', 'proofreading', 'fact-checking', 'developmental editing',
  'line editing', 'copy editing', 'ghostwriting', 'translation', 'localization', 'interpretation', 'subtitling', 'transcription', 'book reviewing', 'literary criticism',
  'literary analysis', 'comparative literature', 'book club leading', 'reading challenges', 'speed reading', 'critical reading', 'library science', 'archival work', 'manuscript preservation', 'rare book collecting',
  'storytelling', 'oral tradition', 'memoir writing', 'autobiography writing', 'biography writing', 'historical writing', 'genealogy research', 'family history', 'oral history', 'fan fiction writing',
  
  // Food & Cooking (120)
  'cooking', 'fine dining', 'molecular gastronomy', 'fusion cuisine', 'ethnic cooking', 'regional specialties', 'traditional recipes', 'family recipes', 'recipe development', 'menu planning',
  'baking', 'artisan baking', 'sourdough baking', 'pastry making', 'cake decorating', 'sugar art', 'chocolate work', 'confectionery', 'candy making', 'caramel making',
  'ice cream making', 'gelato making', 'sorbet making', 'frozen desserts', 'cheese making', 'charcuterie', 'meat curing', 'smoking meats', 'barbecuing', 'grilling',
  'wine making', 'viticulture', 'wine tasting', 'sommelier training', 'beer brewing', 'homebrewing', 'craft beer', 'mead making', 'sake brewing', 'distilling',
  'cocktail mixing', 'mixology', 'bartending', 'coffee roasting', 'coffee cupping', 'latte art', 'espresso making', 'tea blending', 'tea ceremony', 'kombucha brewing',
  'fermentation', 'pickling', 'preserving', 'canning', 'dehydrating', 'freeze drying', 'spice blending', 'herb cultivation', 'microgreens growing', 'sprout growing',
  'food photography', 'food styling', 'food blogging', 'food vlogging', 'restaurant reviewing', 'food criticism', 'culinary history', 'nutrition science', 'diet planning', 'meal prep',
  'cooking classes', 'culinary education', 'kitchen organization', 'knife skills', 'food safety', 'sanitation', 'restaurant management', 'catering', 'personal chef', 'food truck operation',
  'farmers market vending', 'food product development', 'food packaging', 'food marketing', 'culinary tourism', 'food and wine pairing', 'foraging', 'wild edibles', 'urban farming', 'container gardening',
  'herb gardening', 'vegetable gardening', 'fruit growing', 'greenhouse growing', 'hydroponic growing', 'aquaponic growing', 'permaculture', 'sustainable cooking', 'zero waste cooking', 'plant-based cooking',
  'vegan cooking', 'vegetarian cooking', 'raw food preparation', 'gluten-free cooking', 'allergen-free cooking', 'diabetic cooking', 'heart-healthy cooking', 'weight management cooking', 'sports nutrition', 'meal planning apps',
  'cooking competitions', 'iron chef training', 'culinary competitions', 'food festivals', 'cooking shows', 'culinary podcasts', 'food writing', 'cookbook writing', 'recipe testing', 'food science experiments',
  
  // Travel & Culture (100)
  'world travel', 'solo travel', 'group travel', 'family travel', 'budget travel', 'luxury travel', 'adventure travel', 'eco-travel', 'sustainable tourism', 'responsible travel',
  'backpacking', 'hitchhiking', 'road trips', 'motorcycle touring', 'bicycle touring', 'train travel', 'cruise travel', 'sailing expeditions', 'yacht chartering', 'river cruising',
  'cultural immersion', 'homestays', 'volunteer travel', 'educational travel', 'language immersion', 'study abroad', 'work abroad', 'digital nomadism', 'slow travel', 'micro-adventures',
  'urban exploration', 'city breaks', 'weekend getaways', 'staycations', 'local tourism', 'hidden gems exploration', 'off-the-beaten-path travel', 'extreme tourism', 'dark tourism', 'disaster tourism',
  'heritage tourism', 'historical sites', 'unesco sites', 'archaeological sites', 'ancient ruins', 'castles and palaces', 'religious sites', 'pilgrimage', 'spiritual journeys', 'meditation retreats',
  'wellness travel', 'spa tourism', 'health tourism', 'medical tourism', 'dental tourism', 'cosmetic tourism', 'adventure sports tourism', 'extreme sports travel', 'safari tours', 'wildlife tourism',
  'birdwatching tours', 'nature photography tours', 'landscape photography', 'travel photography', 'street photography', 'portrait photography', 'documentary photography', 'travel blogging', 'travel vlogging', 'travel journalism',
  'travel writing', 'guidebook writing', 'travel podcasting', 'travel planning', 'itinerary creation', 'travel hacking', 'points and miles', 'loyalty programs', 'travel deals', 'travel insurance',
  'language learning', 'polyglot training', 'cultural exchange', 'international friendship', 'pen pal relationships', 'cultural competency', 'cross-cultural communication', 'international business', 'global citizenship', 'world affairs',
  'geopolitics', 'international relations', 'diplomacy', 'foreign policy', 'global economics', 'international trade', 'cultural anthropology', 'ethnography', 'sociology', 'comparative religion',
  
  // Health & Wellness (100)
  'holistic health', 'alternative medicine', 'integrative medicine', 'functional medicine', 'naturopathy', 'homeopathy', 'ayurveda', 'traditional chinese medicine', 'acupuncture', 'acupressure',
  'reflexology', 'massage therapy', 'deep tissue massage', 'swedish massage', 'hot stone massage', 'thai massage', 'shiatsu', 'sports massage', 'prenatal massage', 'geriatric massage',
  'aromatherapy', 'essential oils', 'herbalism', 'phytotherapy', 'botanical medicine', 'flower essences', 'crystal healing', 'sound healing', 'vibrational therapy', 'energy healing',
  'reiki', 'pranic healing', 'chakra balancing', 'aura reading', 'spiritual healing', 'shamanic healing', 'indigenous healing', 'mind-body medicine', 'psychosomatic medicine', 'placebo research',
  'meditation', 'mindfulness', 'vipassana', 'zen meditation', 'transcendental meditation', 'loving-kindness meditation', 'walking meditation', 'breathing exercises', 'pranayama', 'breath work',
  'wim hof method', 'cold therapy', 'heat therapy', 'sauna therapy', 'infrared therapy', 'light therapy', 'color therapy', 'music therapy', 'dance therapy', 'art therapy',
  'drama therapy', 'play therapy', 'sand therapy', 'pet therapy', 'equine therapy', 'dolphin therapy', 'forest bathing', 'nature therapy', 'ecotherapy', 'outdoor therapy',
  'adventure therapy', 'wilderness therapy', 'horticultural therapy', 'gardening therapy', 'occupational therapy', 'physical therapy', 'speech therapy', 'cognitive therapy', 'behavioral therapy', 'psychotherapy',
  'counseling', 'life coaching', 'health coaching', 'wellness coaching', 'nutrition coaching', 'fitness coaching', 'spiritual coaching', 'career coaching', 'relationship coaching', 'parenting coaching',
  'grief counseling', 'trauma therapy', 'addiction recovery', 'rehabilitation', 'chronic pain management', 'stress management', 'anxiety management', 'depression support', 'mental health advocacy', 'suicide prevention',
  
  // Business & Finance (100)
  'entrepreneurship', 'startup founding', 'business planning', 'business model design', 'lean startup', 'agile business', 'design thinking', 'innovation management', 'disruptive innovation', 'business strategy',
  'competitive analysis', 'market research', 'customer development', 'product management', 'project management', 'operations management', 'supply chain management', 'logistics', 'inventory management', 'quality control',
  'six sigma', 'lean manufacturing', 'process improvement', 'change management', 'organizational development', 'human resources', 'talent acquisition', 'employee development', 'performance management', 'compensation planning',
  'leadership development', 'executive coaching', 'team building', 'conflict resolution', 'negotiation', 'mediation', 'arbitration', 'legal studies', 'contract law', 'intellectual property',
  'patent law', 'trademark law', 'copyright law', 'business law', 'corporate governance', 'compliance', 'risk management', 'insurance', 'financial planning', 'wealth management',
  'investment banking', 'private equity', 'venture capital', 'angel investing', 'crowdfunding', 'fundraising', 'grant writing', 'accounting', 'bookkeeping', 'financial analysis',
  'valuation', 'mergers and acquisitions', 'due diligence', 'auditing', 'tax planning', 'estate planning', 'retirement planning', 'college planning', 'insurance planning', 'real estate investing',
  'property management', 'commercial real estate', 'residential real estate', 'real estate development', 'construction management', 'architecture', 'interior design', 'urban planning', 'zoning', 'land use',
  'marketing', 'brand management', 'advertising', 'public relations', 'social media marketing', 'content marketing', 'email marketing', 'influencer marketing', 'affiliate marketing', 'performance marketing',
  'sales', 'business development', 'customer relationship management', 'customer service', 'customer success', 'account management', 'key account management', 'channel management', 'partnership development', 'alliance management',
  
  // Unique & Unusual (200)
  'balloon twisting', 'balloon artistry', 'face painting', 'body painting', 'henna art', 'temporary tattoos', 'nail art', 'nail design', 'hair styling', 'hair artistry',
  'makeup artistry', 'special effects makeup', 'prosthetics making', 'monster makeup', 'zombie makeup', 'fantasy makeup', 'theatrical makeup', 'film makeup', 'tv makeup', 'fashion makeup',
  'bridal makeup', 'editorial makeup', 'avant-garde makeup', 'drag makeup', 'cosplay makeup', 'historical makeup', 'period makeup', 'character makeup', 'aging makeup', 'injury simulation',
  'mask making', 'venetian masks', 'tribal masks', 'ceremonial masks', 'theater masks', 'carnival masks', 'costume making', 'historical costumes', 'period costumes', 'fantasy costumes',
  'sci-fi costumes', 'steampunk costumes', 'victorian fashion', 'medieval clothing', 'renaissance garb', 'historical reenactment', 'living history', 'renaissance fairs', 'medieval festivals', 'civil war reenactment',
  'revolutionary war reenactment', 'viking reenactment', 'roman reenactment', 'ancient history', 'archaeology simulation', 'experimental archaeology', 'primitive technology', 'stone age skills', 'bronze age crafts', 'iron age techniques',
  'bushcraft', 'wilderness survival', 'primitive survival', 'urban survival', 'disaster preparedness', 'emergency planning', 'first aid', 'wilderness first aid', 'combat first aid', 'tactical medicine',
  'survivalism', 'prepping', 'off-grid living', 'homesteading', 'self-sufficiency', 'sustainable living', 'zero waste lifestyle', 'minimalism', 'simple living', 'intentional living',
  'tiny house living', 'van life', 'rv living', 'nomadic living', 'digital nomadism', 'location independence', 'remote work', 'freelancing', 'consulting', 'gig economy',
  'side hustles', 'passive income', 'online business', 'e-commerce', 'dropshipping', 'print on demand', 'affiliate marketing', 'influencer marketing', 'social media influence', 'content creation',
  'youtube creation', 'tiktok creation', 'instagram influence', 'podcast hosting', 'radio broadcasting', 'voice over work', 'audiobook narration', 'commercial voice over', 'character voices', 'impressions',
  'stand-up comedy', 'improv comedy', 'sketch comedy', 'comedy writing', 'satire', 'parody', 'roasting', 'comedy podcasting', 'comedy vlogging', 'comedy streaming',
  'street performance', 'busking', 'circus arts', 'acrobatics', 'aerial arts', 'trapeze', 'silk dancing', 'pole dancing', 'fire dancing', 'fire spinning',
  'fire breathing', 'fire eating', 'knife throwing', 'axe throwing', 'sword swallowing', 'escape artistry', 'lock picking', 'safe cracking', 'security consulting', 'penetration testing',
  'urban exploration', 'abandoned places', 'ruins exploration', 'cave exploration', 'spelunking', 'underground exploration', 'sewer exploration', 'tunnel exploration', 'roof topping', 'crane climbing',
  'ghost hunting', 'paranormal investigation', 'ufo hunting', 'cryptozoology', 'bigfoot hunting', 'monster hunting', 'legend tripping', 'mystery solving', 'cold case investigation', 'amateur detective work',
  'treasure hunting', 'metal detecting', 'magnet fishing', 'mudlarking', 'beachcombing', 'fossil hunting', 'arrowhead hunting', 'bottle digging', 'antique hunting', 'thrift shopping',
  'dumpster diving', 'freeganism', 'upcycling', 'repurposing', 'recycling art', 'junk art', 'found object art', 'assemblage art', 'installation art', 'performance art',
  'flash mob organizing', 'guerrilla theater', 'street art', 'graffiti art', 'mural painting', 'chalk art', 'sand art', 'ice sculpture', 'snow sculpture', 'land art',
  'environmental art', 'eco art', 'sustainable art', 'recycled art', 'natural art', 'ephemeral art', 'temporary art', 'site-specific art', 'community art', 'collaborative art',
  'social art', 'political art', 'protest art', 'activism art', 'awareness campaigns', 'social justice', 'human rights', 'environmental activism', 'animal rights', 'conservation',
  'reading quran', 'islamic studies', 'religious studies', 'theology', 'philosophy', 'metaphysics', 'ethics', 'logic', 'critical thinking', 'debate',
  'argumentation', 'rhetoric', 'public speaking', 'oratory', 'storytelling', 'oral tradition', 'folklore', 'mythology', 'legend collection', 'fairy tale study',
  'children\'s literature', 'young adult literature', 'graphic novels', 'comic books', 'manga', 'anime', 'cosplay', 'larping', 'role playing', 'character creation'
];

// Common hobby keywords and variations for fuzzy matching
const hobbyKeywords = {
  // Music
  music: ['music', 'guitar', 'piano', 'violin', 'drums', 'singing', 'bass', 'keyboard', 'ukulele'],
  // Art & Creativity  
  art: ['drawing', 'painting', 'sketching', 'art', 'illustration', 'digital art', 'watercolor', 'acrylic'],
  // Movement & Dance
  dance: ['dance', 'dancing', 'ballet', 'hip hop', 'salsa', 'ballroom', 'contemporary', 'jazz dance'],
  // Physical Activities
  fitness: ['yoga', 'pilates', 'workout', 'fitness', 'exercise', 'gym', 'strength training', 'cardio'],
  sports: ['tennis', 'basketball', 'soccer', 'football', 'volleyball', 'swimming', 'running', 'cycling'],
  martial_arts: ['karate', 'taekwondo', 'judo', 'boxing', 'mma', 'kung fu', 'aikido', 'jiu jitsu'],
  // Skills & Crafts
  cooking: ['cooking', 'baking', 'culinary', 'chef', 'cuisine', 'recipes', 'food preparation'],
  crafts: ['knitting', 'sewing', 'crochet', 'embroidery', 'quilting', 'needlework', 'crafting'],
  woodworking: ['woodworking', 'carpentry', 'furniture making', 'wood carving', 'woodcraft'],
  // Technology
  coding: ['coding', 'programming', 'web development', 'app development', 'software', 'javascript', 'python'],
  // Outdoor & Nature
  gardening: ['gardening', 'horticulture', 'plants', 'farming', 'landscaping', 'greenhouse'],
  // Creative Arts
  photography: ['photography', 'photo', 'camera', 'portrait', 'landscape photography', 'digital photography'],
  writing: ['writing', 'creative writing', 'poetry', 'storytelling', 'blogging', 'journalism'],
  // Learning & Academic
  languages: ['language', 'spanish', 'french', 'german', 'italian', 'chinese', 'japanese', 'english'],
  // Spiritual & Religious
  religious: ['quran', 'quran recitation', 'quran reading', 'islamic studies', 'arabic', 'tajweed', 'hadith', 'prayer', 'meditation'],
  // Games & Entertainment
  gaming: ['gaming', 'video games', 'board games', 'chess', 'poker', 'game development'],
  // Business & Finance
  business: ['business', 'entrepreneurship', 'marketing', 'investing', 'finance', 'economics'],
  // Home & Lifestyle
  organization: ['organization', 'decluttering', 'minimalism', 'home improvement', 'interior design'],
  // Research & Academic
  research: ['research', 'academic research', 'data research', 'market research', 'science research', 'history research', 'historical research', 'genealogy research', 'archival research', 'history', 'genealogy']
};

// Generic video fallbacks for unsupported hobbies
const genericVideoDatabase = {
  beginner: [
    { videoId: "ewMksAbPdas", title: "Getting Started - Beginner Basics", description: "Fundamental concepts and first steps" },
    { videoId: "EHhHPkb8SXs", title: "Essential Tools and Setup", description: "What you need to get started" },
    { videoId: "lTBoW6iKavc", title: "First Practice Session", description: "Your first hands-on experience" },
    { videoId: "sxJRiYqCkWk", title: "Building Good Habits", description: "Creating a consistent practice routine" },
    { videoId: "5AyOB-LJ7H4", title: "Common Beginner Mistakes", description: "What to avoid as you start" },
    { videoId: "bCerf7NJOlE", title: "Progress Tracking", description: "How to measure your improvement" },
    { videoId: "lDflB-DdiJo", title: "Next Steps Forward", description: "Planning your continued learning" }
  ],
  some: [
    { videoId: "ewMksAbPdas", title: "Intermediate Techniques", description: "Building on your foundation" },
    { videoId: "TMdqJIHb04Y", title: "Advanced Practice Methods", description: "More challenging exercises" },
    { videoId: "cOzCQSh_-vY", title: "Problem Solving Skills", description: "Overcoming common challenges" },
    { videoId: "SiJ7rjK5Wdg", title: "Creative Applications", description: "Applying skills in new ways" },
    { videoId: "oKFfSzxJy2Y", title: "Performance and Presentation", description: "Sharing your skills with others" },
    { videoId: "7BDKWT3pI_A", title: "Advanced Projects", description: "Complex, rewarding challenges" },
    { videoId: "1umSnh48XQo", title: "Teaching and Mentoring", description: "Helping others learn" }
  ],
  intermediate: [
    { videoId: "UB1O30fR-EE", title: "Advanced Techniques", description: "Professional-level skills" },
    { videoId: "hdI2bqOjy3c", title: "Mastery Projects", description: "Complex, challenging work" },
    { videoId: "zOjov-2OZ0E", title: "Innovation and Creativity", description: "Developing your unique style" },
    { videoId: "kqtD5dpn9C8", title: "Professional Development", description: "Taking skills to the next level" },
    { videoId: "c8aAYU5m4jM", title: "Community and Networking", description: "Connecting with other practitioners" },
    { videoId: "9Yf36xdLp2A", title: "Advanced Problem Solving", description: "Tackling complex challenges" },
    { videoId: "rfscVS0vtbw", title: "Expertise and Specialization", description: "Becoming an expert" }
  ]
};

// Enhanced hobby validation with comprehensive list
function isValidHobby(input: string): boolean {
  const lowerInput = input.toLowerCase().trim();
  
  // Check against comprehensive hobby list
  return validHobbies.some(hobby => 
    hobby.toLowerCase() === lowerInput ||
    lowerInput.includes(hobby.toLowerCase()) ||
    hobby.toLowerCase().includes(lowerInput)
  );
}

// Smart hobby detection function
function detectBestHobbyMatch(input: string): string | null {
  const lowerInput = input.toLowerCase().trim();
  
  // Special handling for multi-word religious reading hobbies
  if (lowerInput.includes('reading') && lowerInput.includes('quran')) {
    return 'quran reading';
  }
  if (lowerInput.includes('reading') && lowerInput.includes('bible')) {
    return 'bible reading';
  }
  if (lowerInput.includes('reading') && lowerInput.includes('holy')) {
    return 'religious reading';
  }
  if (lowerInput.includes('reading') && lowerInput.includes('book')) {
    return 'book reading';
  }
  
  // First check if it's in our comprehensive list
  const exactMatch = validHobbies.find(hobby => hobby.toLowerCase() === lowerInput);
  if (exactMatch) {
    return exactMatch;
  }
  
  // Check for partial matches in comprehensive list
  const partialMatch = validHobbies.find(hobby => 
    hobby.toLowerCase().includes(lowerInput) && lowerInput.length >= 3
  );
  if (partialMatch) {
    return partialMatch;
  }
  
  // Direct matches first
  if (videoDatabase[lowerInput]) {
    return lowerInput;
  }
  
  // Check for partial matches in hobby keywords
  let bestMatch = null;
  let bestScore = 0;
  
  for (const [category, keywords] of Object.entries(hobbyKeywords)) {
    for (const keyword of keywords) {
      let score = 0;
      
      // Exact match gets highest score
      if (lowerInput === keyword) {
        score = 100;
      }
      // Input contains keyword
      else if (lowerInput.includes(keyword)) {
        score = 80;
      }
      // Keyword contains input (partial match)
      else if (keyword.includes(lowerInput) && lowerInput.length >= 3) {
        score = 60;
      }
      // Similar words (edit distance)
      else if (calculateSimilarity(lowerInput, keyword) > 0.7) {
        score = 40;
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = videoDatabase[category] ? category : keyword;
      }
    }
  }
  
  return bestScore >= 40 ? bestMatch : null;
}

// Simple string similarity function
function calculateSimilarity(str1: string, str2: string): number {
  if (str1.length === 0 || str2.length === 0) return 0;
  if (str1 === str2) return 1;
  
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1;
  
  const commonChars = countCommonChars(shorter, longer);
  return commonChars / longer.length;
}

function countCommonChars(str1: string, str2: string): number {
  let common = 0;
  for (let i = 0; i < str1.length; i++) {
    if (str2.includes(str1[i])) {
      common++;
    }
  }
  return common;
}

// Advanced contextual hobby detection 
function detectContextualHobby(input: string): { hobby: string; category: string } | null {
  const lower = input.toLowerCase().trim();
  
  // Religious and spiritual contexts
  if (lower.includes('quran') || lower.includes('koran') || lower.includes('qoran')) {
    return { hobby: 'quran reading', category: 'religious' };
  }
  
  if (lower.includes('bible') && (lower.includes('read') || lower.includes('study'))) {
    return { hobby: 'bible study', category: 'religious' };
  }
  
  if (lower.includes('meditation') || lower.includes('mindfulness')) {
    return { hobby: 'meditation', category: 'spiritual' };
  }
  
  // Language learning contexts
  if (lower.includes('spanish') && (lower.includes('learn') || lower.includes('study'))) {
    return { hobby: 'spanish language', category: 'languages' };
  }
  
  if (lower.includes('french') && (lower.includes('learn') || lower.includes('study'))) {
    return { hobby: 'french language', category: 'languages' };
  }
  
  // Reading contexts - be specific
  if (lower.includes('reading')) {
    if (lower.includes('quran') || lower.includes('koran')) {
      return { hobby: 'quran reading', category: 'religious' };
    }
    if (lower.includes('books') || lower.includes('novels')) {
      return { hobby: 'book reading', category: 'learning' };
    }
    if (lower.includes('poetry')) {
      return { hobby: 'poetry reading', category: 'art' };
    }
    // Generic reading needs clarification
    return null;
  }
  
  // Cooking contexts
  if (lower.includes('cook') || lower.includes('baking')) {
    if (lower.includes('italian')) return { hobby: 'italian cooking', category: 'cooking' };
    if (lower.includes('indian')) return { hobby: 'indian cooking', category: 'cooking' };
    if (lower.includes('chinese')) return { hobby: 'chinese cooking', category: 'cooking' };
    if (lower.includes('baking')) return { hobby: 'baking', category: 'cooking' };
    return { hobby: 'cooking', category: 'cooking' };
  }
  
  // Music contexts
  if (lower.includes('play') && (lower.includes('guitar') || lower.includes('piano') || lower.includes('violin'))) {
    if (lower.includes('guitar')) return { hobby: 'guitar', category: 'music' };
    if (lower.includes('piano')) return { hobby: 'piano', category: 'music' };
    if (lower.includes('violin')) return { hobby: 'violin', category: 'music' };
  }
  
  // Art contexts
  if (lower.includes('draw') || lower.includes('sketch')) {
    return { hobby: 'drawing', category: 'art' };
  }
  
  if (lower.includes('paint')) {
    return { hobby: 'painting', category: 'art' };
  }
  
  // Photography contexts  
  if (lower.includes('photo')) {
    return { hobby: 'photography', category: 'art' };
  }
  
  // Exercise contexts
  if (lower.includes('yoga')) {
    return { hobby: 'yoga', category: 'fitness' };
  }
  
  if (lower.includes('dance') || lower.includes('dancing')) {
    return { hobby: 'dance', category: 'dance' };
  }
  
  // Swimming contexts
  if (lower.includes('swimming') || lower.includes('swim')) {
    return { hobby: 'swimming', category: 'fitness' };
  }
  
  // Specific hobby detection for common patterns
  if (lower.includes('learn') || lower.includes('study')) {
    // Extract the main subject after learn/study
    const words = lower.split(' ');
    const learnIndex = words.findIndex(w => w.includes('learn') || w.includes('study'));
    if (learnIndex >= 0 && learnIndex < words.length - 1) {
      const subject = words.slice(learnIndex + 1).join(' ');
      if (subject.length > 2) {
        return { hobby: subject, category: 'learning' };
      }
    }
  }
  
  return null;
}

// Helper function to find category for hobby
function findCategoryForHobby(hobby: string): string {
  const lowerHobby = hobby.toLowerCase();
  
  // Creative Arts & Crafts
  const creativeArts = ['knitting', 'crocheting', 'embroidery', 'calligraphy', 'quilling', 'origami', 'macramé', 'upcycling', 'watercolor painting', 'diamond painting', 'pour painting', 'pottery', 'scrapbooking', 'soap making', 'candle making', 'leather crafting', 'jewelry making', 'street art', 'digital art', 'mug painting', 'nail art', 'floral arranging', 'miniature model building', 'bullet journaling', 'creative writing', 'songwriting', 'acting', 'improv comedy', 'urban sketching', 'cosplay', 'vintage collecting'];
  
  // Outdoor & Nature
  const outdoor = ['gardening', 'urban farming', 'foraging', 'bird watching', 'stargazing', 'geocaching', 'hiking', 'camping', 'rock climbing', 'kayaking', 'stand-up paddleboarding', 'wild swimming', 'orienteering', 'beachcombing', 'metal detecting', 'beekeeping', 'aquascaping', 'terrarium building', 'hydroponics', 'urban exploration', 'astrophotography', 'insect collecting', 'mushroom growing'];
  
  // Fitness & Movement
  const fitness = ['parkour', 'rollerblading', 'skateboarding', 'disc golf', 'archery', 'fencing', 'tai chi', 'yoga', 'pilates', 'aerial silks', 'hula hooping', 'jump rope', 'krav maga', 'boxing', 'capoeira', 'dance', 'hip-hop', 'ballroom dancing'];
  
  // Games & Puzzles
  const games = ['chess', 'board gaming', 'puzzle solving', 'escape rooms', 'speedcubing', 'magic tricks', 'larping', 'trivia', 'quiz games', 'debate'];
  
  // Technology
  const tech = ['coding', 'robotics', '3d printing', 'drone flying', 'virtual reality gaming', 'augmented reality exploration', 'podcasting', 'vlogging', 'streaming', 'retro gaming', 'ethical hacking', 'digital nomadism'];
  
  // Culinary
  const culinary = ['cooking', 'baking', 'mixology', 'fermenting', 'cheese making', 'home brewing', 'food photography', 'kombucha brewing'];
  
  // Wellness & Learning (exclude language-related)
  const wellness = ['astronomy', 'genealogy', 'cryptography', 'philosophy reading', 'book club', 'pen palling', 'journaling', 'meditation', 'sound bathing', 'volunteering', 'letterboxing'];
  
  if (creativeArts.includes(lowerHobby)) return 'Creative Arts';
  if (outdoor.includes(lowerHobby)) return 'Outdoor/Nature';
  if (fitness.includes(lowerHobby)) return 'Fitness';
  if (games.includes(lowerHobby)) return 'Games/Puzzles';
  if (tech.includes(lowerHobby)) return 'Technology';
  if (culinary.includes(lowerHobby)) return 'Culinary';
  if (wellness.includes(lowerHobby)) return 'Wellness';
  
  return 'general';
}

export function validateHobby(hobbyInput: string): { 
  isValid: boolean; 
  normalizedHobby: string; 
  category: string | null;
  hasVideoSupport: boolean;
  detectedHobbies?: string[];
  suggestions?: string[];
} {
  const input = hobbyInput.toLowerCase().trim();
  
  // Check against comprehensive hobby list first
  if (isValidHobby(input)) {
    const exactMatch = validHobbies.find(hobby => hobby.toLowerCase() === input);
    if (exactMatch) {
      return {
        isValid: true,
        normalizedHobby: exactMatch,
        category: findCategoryForHobby(exactMatch),
        hasVideoSupport: !!videoDatabase[exactMatch],
        suggestions: []
      };
    }
  }
  
  // Advanced context-aware hobby detection
  const contextualMapping = detectContextualHobby(input);
  if (contextualMapping) {
    console.log('🎯 Contextual mapping found:', contextualMapping);
    return {
      isValid: true,
      normalizedHobby: contextualMapping.hobby,
      category: contextualMapping.category,
      hasVideoSupport: !!videoDatabase[contextualMapping.hobby],
      suggestions: []
    };
  }

  if (['history research', 'historical research', 'research', 'genealogy research', 'archival research', 'history', 'genealogy'].includes(input)) {
    return {
      isValid: true,
      normalizedHobby: 'history research',
      category: 'research',
      hasVideoSupport: false, // Will use generic fallback videos
      suggestions: []
    };
  }
  
  // Only reject completely nonsensical inputs
  const badInputs = ['bye', 'hello', 'hi', 'hey', 'hmm', 'um', 'uh', 'ah', 'ok', 'okay', 'yes', 'no', 'maybe', 'test', 'testing', '', 'null', 'undefined', 'admin', 'root', 'cool', 'nice', 'good', 'bad'];
  if (badInputs.includes(input) || input.length < 2) {
    return { 
      isValid: false, 
      normalizedHobby: '', 
      category: null, 
      hasVideoSupport: false,
      suggestions: ['guitar', 'cooking', 'drawing', 'yoga', 'photography', 'dance', 'quran reading', 'swimming']
    };
  }

  // Try to detect the best hobby match
  const detectedHobby = detectBestHobbyMatch(input);
  
  if (detectedHobby) {
    const hasVideoSupport = !!videoDatabase[detectedHobby];
    const category = hasVideoSupport ? detectedHobby : findCategoryForHobby(detectedHobby);
    
    return {
      isValid: true,
      normalizedHobby: detectedHobby,
      category: category,
      hasVideoSupport: hasVideoSupport,
      detectedHobbies: [detectedHobby]
    };
  }
  
  // If no match found, but input looks reasonable, accept it as a potential hobby
  const reasonablePattern = /^[a-zA-Z\s-]{3,30}$/;
  if (reasonablePattern.test(input)) {
    return {
      isValid: true,
      normalizedHobby: input,
      category: 'general',
      hasVideoSupport: false
    };
  }
  
  // Provide suggestions for unclear inputs
  return {
    isValid: false,
    normalizedHobby: input,
    category: null,
    hasVideoSupport: false,
    suggestions: ['guitar', 'cooking', 'drawing', 'yoga', 'photography', 'dance']
  };
}



export function getVideosForHobby(hobby: string, experience: string): any[] {
  // First check if hobby exists in curated database
  if (videoDatabase[hobby] && videoDatabase[hobby][experience]) {
    return videoDatabase[hobby][experience];
  }
  
  // Check if it maps to a supported category
  const validation = validateHobby(hobby);
  if (validation.hasVideoSupport && validation.normalizedHobby !== hobby) {
    if (videoDatabase[validation.normalizedHobby] && videoDatabase[validation.normalizedHobby][experience]) {
      return videoDatabase[validation.normalizedHobby][experience];
    }
  }
  
  // Fall back to generic videos with hobby-specific titles
  const genericVideos = genericVideoDatabase[experience as keyof typeof genericVideoDatabase] || genericVideoDatabase['beginner'];
  
  return genericVideos.map((video: any, index: number) => ({
    ...video,
    title: video.title.replace('Getting Started', `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Basics`)
                    .replace('Essential Tools', `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} Tools`)
                    .replace('Beginner Basics', `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} for Beginners`),
    description: `${hobby.charAt(0).toUpperCase() + hobby.slice(1)} - ${video.description}`
  }));
}

export function suggestAlternativeHobbies(invalidInput: string): string[] {
  const suggestions = [];
  
  // Get all supported hobbies from video database
  const supportedHobbies = Object.keys(videoDatabase);
  
  // Add some based on partial matches
  for (const hobby of supportedHobbies) {
    if (hobby.includes(invalidInput.toLowerCase()) || invalidInput.toLowerCase().includes(hobby)) {
      suggestions.push(hobby);
    }
  }
  
  // Add popular hobbies if no matches
  if (suggestions.length === 0) {
    suggestions.push('guitar', 'cooking', 'drawing', 'yoga', 'photography', 'dance');
  }
  
  return suggestions.slice(0, 6); // Limit to 6 suggestions
}