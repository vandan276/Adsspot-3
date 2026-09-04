import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';

function loadEnv() {
  const envPaths = [
    join(process.cwd(), 'apps/web/.env.local'),
    join(process.cwd(), 'apps/web/.env'),
  ];
  for (const p of envPaths) {
    if (existsSync(p)) {
      const content = readFileSync(p, 'utf8');
      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').trim().replace(/(^['"]|['"]$)/g, '');
          if (key && val && !process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      });
      break;
    }
  }
}

// Master list of 30+ categories and subcategories
const CATEGORIES_HIERARCHY = [
  {
    id: 'restaurants',
    name: 'Restaurants & Dining',
    slug: 'restaurants',
    icon: 'UtensilsCrossed',
    subcategories: [
      { name: 'Kathiyawadi & Gujarati Thali', sub: 'Gujarati Thali & Kathiyawadi', tier: 'elite', sample: 'Gordhan Thal Kathiyawadi House', address: 'Near RC Dutt Road, Alkapuri, Vadodara', lat: 22.3106, lng: 73.1678, pincode: '390007' },
      { name: 'South Indian Dosa Hub', sub: 'South Indian & Dosa Hubs', tier: 'premium', sample: 'Dakshin Express Dosa & Filter Coffee', address: 'Shop 4, Sayajigunj Main Rd, Vadodara', lat: 22.3082, lng: 73.1812, pincode: '390005' },
      { name: 'Artisan Cafe & Bakery', sub: 'Cafes & Artisan Bakeries', tier: 'elite', sample: 'The French Roast & Artisan Bakery', address: '12 Emerald Plaza, Race Course, Vadodara', lat: 22.3152, lng: 73.1610, pincode: '390007' },
      { name: 'North Indian & Mughlai', sub: 'North Indian & Mughlai', tier: 'premium', sample: 'Peshawari Zaika Barbeque & Curries', address: 'Near Jetalpur Bridge, Vadodara', lat: 22.3050, lng: 73.1705, pincode: '390005' },
      { name: 'Pan-Asian & Dimsum', sub: 'Chinese & Pan Asian', tier: 'basic', sample: 'Wok & Roll Pan-Asian Kitchen', address: 'Inorbit Mall Food Court, Gorwa, Vadodara', lat: 22.3320, lng: 73.1550, pincode: '390016' },
    ],
  },
  {
    id: 'security-cctv',
    name: 'Security & CCTV',
    slug: 'security-cctv',
    icon: 'ShieldCheck',
    subcategories: [
      { name: 'CCTV Installation & AMC', sub: 'CCTV Camera Installation & AMC', tier: 'elite', sample: 'HawkEye AI HD CCTV & AMC Systems', address: 'Plot 45, GIDC Makarpura Industrial Estate, Vadodara', lat: 22.2540, lng: 73.1920, pincode: '390010' },
      { name: 'Biometric Access Control', sub: 'Biometric Access Control Systems', tier: 'premium', sample: 'SecureTouch Biometrics & RFID Solutions', address: 'Tower B, Atlantis Heights, Sarabhai Campus, Vadodara', lat: 22.3140, lng: 73.1730, pincode: '390007' },
      { name: 'Home Video Alarms', sub: 'Home Alarm & Video Door Phones', tier: 'basic', sample: 'SafeGuard Smart Door Phones & Sensors', address: 'Karelibaug Main Bazaar, Vadodara', lat: 22.3250, lng: 73.2010, pincode: '390018' },
    ],
  },
  {
    id: 'shop-online',
    name: 'Shop Online & Retail',
    slug: 'shop-online',
    icon: 'ShoppingBag',
    subcategories: [
      { name: 'Supermarket & Gourmet', sub: 'Local Supermarkets & Kirana', tier: 'elite', sample: 'FreshDaily Hyperlocal Supermart', address: 'Near Chakli Circle, Old Padra Road, Vadodara', lat: 22.2980, lng: 73.1620, pincode: '390015' },
      { name: 'Organic Cold-Pressed Foods', sub: 'Organic Foods & Groceries', tier: 'premium', sample: 'Vedic Roots Pure Organic & A2 Gir Farm', address: 'Vasna Bhayli Main Road, Vadodara', lat: 22.2850, lng: 73.1410, pincode: '391410' },
      { name: 'Gifts & Flowers Express', sub: 'Gifts, Flowers & Cakes Delivery', tier: 'basic', sample: 'Midnight Blossom Florist & Custom Gifts', address: 'Akota Gardens Crossing, Vadodara', lat: 22.2920, lng: 73.1740, pincode: '390020' },
    ],
  },
  {
    id: 'skin-hair-doctors',
    name: 'Skin & Hair Doctors',
    slug: 'skin-hair-doctors',
    icon: 'Stethoscope',
    subcategories: [
      { name: 'Clinical Dermatology & Laser', sub: 'Clinical Dermatology', tier: 'elite', sample: 'Dr. Mehta Skin Laser & Aesthetics Clinic', address: 'Opposite Surya Palace, Sayajigunj, Vadodara', lat: 22.3090, lng: 73.1840, pincode: '390005' },
      { name: 'Hair Transplant & Trichology', sub: 'Hair Transplant & PRP Clinics', tier: 'premium', sample: 'FolliclePlus PRP & Hair Restoration Center', address: 'Alkapuri Arcade, RC Dutt Rd, Vadodara', lat: 22.3115, lng: 73.1660, pincode: '390007' },
    ],
  },
  {
    id: 'doctors-healthcare',
    name: 'Doctors & Clinics',
    slug: 'doctors-healthcare',
    icon: 'Stethoscope',
    subcategories: [
      { name: 'Multispeciality Dental Studio', sub: 'Dentists & Orthodontists', tier: 'elite', sample: 'SmileCraft Dental Implant & Aligners Studio', address: 'Near Bird Circle, Race Course, Vadodara', lat: 22.3160, lng: 73.1590, pincode: '390007' },
      { name: 'Pediatric Care Clinic', sub: 'Pediatricians & Child Specialists', tier: 'premium', sample: 'Little Angels Child Care & Vaccination Hub', address: 'Nizampura Main Road, Vadodara', lat: 22.3380, lng: 73.1810, pincode: '390002' },
      { name: 'Advanced Pathology & Imaging', sub: 'Diagnostic Pathology Labs & MRI/X-Ray', tier: 'premium', sample: 'Apex Precision Pathology & 3T MRI Diagnostics', address: 'Opposite SSG Hospital, Raopura, Vadodara', lat: 22.3010, lng: 73.1950, pincode: '390001' },
    ],
  },
  {
    id: 'tshirt-printers',
    name: 'T-Shirt Printers & Signage',
    slug: 'tshirt-printers',
    icon: 'Printer',
    subcategories: [
      { name: 'Custom Apparel & DTF Print', sub: 'Custom T-Shirt Screen & DTF Printing', tier: 'elite', sample: 'PrintVibe Custom DTF & Corporate Merch', address: 'Waghodia Road, Near Parul University Gate, Vadodara', lat: 22.2890, lng: 73.2450, pincode: '390019' },
      { name: 'Glow Signboard & LED Display', sub: 'Flex, Glow Signboard & LED Boards', tier: 'premium', sample: 'NeonCraft LED & Architectural Signage', address: 'Gandeve Compound, Pratapnagar, Vadodara', lat: 22.2820, lng: 73.2080, pincode: '390004' },
    ],
  },
  {
    id: 'tattoo-artists',
    name: 'Tattoo Artists & Body Art',
    slug: 'tattoo-artists',
    icon: 'Sparkles',
    subcategories: [
      { name: 'Custom Piercing & Tattoos', sub: 'Custom Permanent Tattoos', tier: 'elite', sample: 'InkSpire Luxury Tattoo & Piercing Studio', address: '3rd Floor, Centre Square Mall, Vadodara', lat: 22.3200, lng: 73.1650, pincode: '390007' },
      { name: 'Organic Bridal Mehndi', sub: 'Henna & Organic Mehndi Artists', tier: 'basic', sample: 'Shree Radhe Organic Bridal Mehndi Art', address: 'Mandvi Gate Bazaar, Vadodara', lat: 22.2990, lng: 73.2060, pincode: '390006' },
    ],
  },
  {
    id: 'taxi-cab-rentals',
    name: 'Taxi & Cab Rentals',
    slug: 'taxi-cab-rentals',
    icon: 'Car',
    subcategories: [
      { name: 'Airport Transfers & Cabs', sub: 'Airport Pickup & Drop Transfers', tier: 'elite', sample: 'RoyalGlide Airport Express & Luxury Cabs', address: 'Near Vadodara Railway Station, Sayajigunj', lat: 22.3110, lng: 73.1820, pincode: '390005' },
      { name: 'Outstation Luxury Fleet', sub: 'Outstation One-Way & Round Trips', tier: 'premium', sample: 'Gujarat Wheels Intercity Car Rental', address: 'Fatehgunj Circle, Vadodara', lat: 22.3230, lng: 73.1870, pincode: '390002' },
    ],
  },
  {
    id: 'tempos-on-hire',
    name: 'Tempos On Hire & Logistics',
    slug: 'tempos-on-hire',
    icon: 'Truck',
    subcategories: [
      { name: 'Commercial Mini-Truck Hire', sub: 'Tata Ace / Chota Hathi on Rent', tier: 'premium', sample: 'CityCargo Tata Ace & 14ft Logistics', address: 'Transport Nagar, Ranoli GIDC, Vadodara', lat: 22.3780, lng: 73.1490, pincode: '391750' },
    ],
  },
  {
    id: 'tent-house-events',
    name: 'Tent House & Mandap Setup',
    slug: 'tent-house-events',
    icon: 'Tent',
    subcategories: [
      { name: 'Grand Wedding Mandap & Lights', sub: 'Wedding Mandap & Stage Decoration', tier: 'elite', sample: 'Utsav Mandap Decorators & Sound Setup', address: 'Gotri-Sevasi Road, Vadodara', lat: 22.3180, lng: 73.1250, pincode: '390021' },
      { name: 'German Hangar & Audio Setup', sub: 'Sound, DJ & Stage Lighting Setup', tier: 'premium', sample: 'BeatBlast Concert Sound & German Tents', address: 'Sun Pharma Road, Atladara, Vadodara', lat: 22.2710, lng: 73.1600, pincode: '390012' },
    ],
  },
  {
    id: 'towing-services',
    name: 'Towing Services & Assistance',
    slug: 'towing-services',
    icon: 'Anchor',
    subcategories: [
      { name: '24x7 Flatbed Highway Towing', sub: '24/7 Car Flatbed Towing', tier: 'premium', sample: 'SpeedAssist 24/7 Hydraulic Flatbed Towing', address: 'Golden Quadrilateral NH-48 Junction, Vadodara', lat: 22.3420, lng: 73.2380, pincode: '390019' },
    ],
  },
  {
    id: 'train-ticketing',
    name: 'Train & Air Ticketing',
    slug: 'train-ticketing',
    icon: 'Train',
    subcategories: [
      { name: 'IRCTC & International Flights', sub: 'Domestic & International Flight Tickets', tier: 'basic', sample: 'Suvidha Travel Point & Visa Ticketing', address: 'Raopura Tower, Vadodara', lat: 22.3020, lng: 73.1980, pincode: '390001' },
    ],
  },
  {
    id: 'training-institutes',
    name: 'Training Institutes & IT',
    slug: 'training-institutes',
    icon: 'GraduationCap',
    subcategories: [
      { name: 'Full-Stack Coding & AI Academy', sub: 'IT, Coding & Software Development', tier: 'elite', sample: 'CodeForge Tech Academy & AI Labs', address: 'K10 Grand, Sarabhai Campus, Alkapuri, Vadodara', lat: 22.3145, lng: 73.1710, pincode: '390007' },
      { name: 'IELTS, TOEFL & Foreign Study', sub: 'Spoken English & IELTS/TOEFL Coaching', tier: 'premium', sample: 'GlobalEdge Overseas Studies & IELTS Institute', address: 'Monisha Complex, Sayajigunj, Vadodara', lat: 22.3100, lng: 73.1830, pincode: '390005' },
    ],
  },
  {
    id: 'transporters-logistics',
    name: 'Transporters & Logistics',
    slug: 'transporters-logistics',
    icon: 'Truck',
    subcategories: [
      { name: 'Interstate Heavy Freight FTL', sub: 'Full Truck Load (FTL) Freight', tier: 'elite', sample: 'National Freightlines & Container Express', address: 'NH-8 Bypass, Manjusar GIDC, Savli, Vadodara', lat: 22.4550, lng: 73.2100, pincode: '391775' },
    ],
  },
  {
    id: 'travel-holidays',
    name: 'Travel & Holiday Tours',
    slug: 'travel-holidays',
    icon: 'Plane',
    subcategories: [
      { name: 'Luxury International Holidays', sub: 'International Tour Packages (Dubai, Thailand, Europe)', tier: 'elite', sample: 'VoyageCraft Bespoke World Holidays', address: 'Atlantis K-10, Vadodara', lat: 22.3150, lng: 73.1680, pincode: '390007' },
      { name: 'Himalayan & Kashmir Treks', sub: 'Domestic Holiday Tours (Kashmir, Goa, Kerala, Himachal)', tier: 'premium', sample: 'Himalayan Wanderers Eco Tours', address: 'Ellora Park, Subhanpura, Vadodara', lat: 22.3210, lng: 73.1580, pincode: '390023' },
    ],
  },
  {
    id: 'tutorials-home-tuitions',
    name: 'Tutorials & Home Tutors',
    slug: 'tutorials-home-tuitions',
    icon: 'BookOpen',
    subcategories: [
      { name: 'IIT-JEE & NEET Academy', sub: 'NEET, JEE Main & Advanced Coaching', tier: 'elite', sample: 'Resonance Apex IIT-JEE & Medical Wing', address: 'Akota Stadium Road, Vadodara', lat: 22.2960, lng: 73.1780, pincode: '390020' },
      { name: 'Personal Home Tutors Hub', sub: 'Home Tutors for Primary & Secondary Classes', tier: 'basic', sample: 'MasterMind Certified Home Educators', address: 'Manjalpur Main Road, Vadodara', lat: 22.2680, lng: 73.1950, pincode: '390011' },
    ],
  },
  {
    id: 'visa-assistance',
    name: 'Visa Assistance & Immigration',
    slug: 'visa-assistance',
    icon: 'FileCheck',
    subcategories: [
      { name: 'Canada & USA Study Visa', sub: 'Student Study Visa (USA, UK, Canada, Australia)', tier: 'elite', sample: 'Crown Immigration & Foreign Study Advisors', address: 'Sayajigunj Prestige Tower, Vadodara', lat: 22.3120, lng: 73.1810, pincode: '390005' },
    ],
  },
  {
    id: 'wall-papers-interior',
    name: 'Wallpapers & Interior Decor',
    slug: 'wall-papers-interior',
    icon: 'Layers',
    subcategories: [
      { name: '3D Designer Wallpapers & Louvers', sub: '3D Customized & Designer Wallpapers', tier: 'premium', sample: 'DecoStudio 3D Wallpapers & Louver Panels', address: 'Karelibaug Water Tank Rd, Vadodara', lat: 22.3240, lng: 73.2030, pincode: '390018' },
    ],
  },
  {
    id: 'water-suppliers',
    name: 'Water Suppliers & Tankers',
    slug: 'water-suppliers',
    icon: 'Droplets',
    subcategories: [
      { name: '20L Mineral Jar Daily Supply', sub: '20L Mineral RO Water Jars Supply', tier: 'basic', sample: 'Aquafresh Pure RO Jar Express Delivery', address: 'Gorwa BIDC Compound, Vadodara', lat: 22.3350, lng: 73.1510, pincode: '390016' },
    ],
  },
  {
    id: 'waterproofing-contractors',
    name: 'Waterproofing Contractors',
    slug: 'waterproofing-contractors',
    icon: 'Umbrella',
    subcategories: [
      { name: 'Epoxy & Chemical Terrace Roof', sub: 'Terrace & Roof Waterproofing', tier: 'premium', sample: 'DampGuard Specialist Waterproofing Solutions', address: 'Ajwa Road, Near Sardar Estate, Vadodara', lat: 22.3080, lng: 73.2320, pincode: '390019' },
    ],
  },
  {
    id: 'website-designers',
    name: 'Website Designers & Software',
    slug: 'website-designers',
    icon: 'Globe',
    subcategories: [
      { name: 'Full-Stack Next.js & App Dev', sub: 'Custom Next.js & React Web Apps', tier: 'elite', sample: 'PixelCraft Digital Labs & Cloud Apps', address: 'TechHub 4th Floor, Sayajigunj, Vadodara', lat: 22.3095, lng: 73.1825, pincode: '390005' },
      { name: 'Shopify E-Commerce Agency', sub: 'E-Commerce Portals (Shopify, WooCommerce)', tier: 'premium', sample: 'StoreFrontify E-Com Growth Agency', address: 'Alkapuri Business Park, Vadodara', lat: 22.3125, lng: 73.1670, pincode: '390007' },
    ],
  },
  {
    id: 'wedding-requisites',
    name: 'Wedding Requisites & Planners',
    slug: 'wedding-requisites',
    icon: 'HeartHandshake',
    subcategories: [
      { name: 'Luxury Destination Wedding Planners', sub: 'Wedding Planners & Event Coordinators', tier: 'elite', sample: 'ShubhVivaah Royal Wedding Architects', address: 'Sevasi Heritage Road, Vadodara', lat: 22.3190, lng: 73.1180, pincode: '391101' },
      { name: 'Cinematic Bridal Photography', sub: 'Wedding Photographers & Cinematic Videographers', tier: 'elite', sample: 'Lumiere Cinematic Wedding Stories', address: 'Race Course Towers, Vadodara', lat: 22.3140, lng: 73.1620, pincode: '390007' },
    ],
  },
  {
    id: 'weight-loss-centres',
    name: 'Weight Loss & Dietitians',
    slug: 'weight-loss-centres',
    icon: 'Activity',
    subcategories: [
      { name: 'Clinical Diet & Body Contouring', sub: 'Clinical Dietitians & Customized Nutrition Plans', tier: 'premium', sample: 'NutriFit Wellness & Inch-Loss Clinic', address: 'Old Padra Road, Vadodara', lat: 22.2995, lng: 73.1635, pincode: '390015' },
    ],
  },
  {
    id: 'yoga-classes',
    name: 'Yoga Classes & Meditation',
    slug: 'yoga-classes',
    icon: 'Dumbbell',
    subcategories: [
      { name: 'Hatha & Power Yoga Shala', sub: 'Hatha & Ashtanga Daily Yoga Batches', tier: 'premium', sample: 'Prana Sanctuary Authentic Yoga & Sound Healing', address: 'Vasna Road, Near D-Mart, Vadodara', lat: 22.2890, lng: 73.1520, pincode: '390015' },
    ],
  },
  {
    id: 'packers-movers',
    name: 'Packers & Movers',
    slug: 'packers-movers',
    icon: 'Truck',
    subcategories: [
      { name: 'All India Household Shifting', sub: 'Household Goods Shifting', tier: 'elite', sample: 'SafeShift Relocations & Container Logistics', address: 'Near Sama-Savli Road Circle, Vadodara', lat: 22.3480, lng: 73.1950, pincode: '390024' },
      { name: 'Car & Bike Container Carrier', sub: 'Car & Bike Transportation by Container', tier: 'premium', sample: 'TransAuto Car & Two-Wheeler Movers', address: 'Makarpura GIDC, Vadodara', lat: 22.2510, lng: 73.1960, pincode: '390010' },
    ],
  },
  {
    id: 'repairs-services',
    name: 'Repairs & Home Services',
    slug: 'repairs-services',
    icon: 'Wrench',
    subcategories: [
      { name: 'AC Service, Gas & Installation', sub: 'AC Service, Gas Refill & Installation', tier: 'elite', sample: 'CoolTech 24x7 AC Repair & Jet Service', address: 'Karelibaug Shopping Center, Vadodara', lat: 22.3260, lng: 73.2020, pincode: '390018' },
      { name: 'Washing Machine & Fridge Care', sub: 'Washing Machine & Refrigerator Repair', tier: 'premium', sample: 'HomeCare Appliance Doctors', address: 'Gotri Road, Vadodara', lat: 22.3160, lng: 73.1380, pincode: '390021' },
    ],
  },
  {
    id: 'gym-fitness',
    name: 'Gym & Fitness Centers',
    slug: 'gym-fitness',
    icon: 'Dumbbell',
    subcategories: [
      { name: '24/7 CrossFit & Strength Gym', sub: 'CrossFit & Functional Training Zones', tier: 'elite', sample: 'IronVault 24/7 Athletic Club & Steam', address: '4th Floor, Eva Mall, Manjalpur, Vadodara', lat: 22.2640, lng: 73.1980, pincode: '390011' },
      { name: 'Zumba & Aerobics Dance Studio', sub: 'Zumba, Aerobics & Dance Workout Classes', tier: 'premium', sample: 'PulseBeat Dance Fitness & Calisthenics', address: 'Akota, Near Productivity Council, Vadodara', lat: 22.2940, lng: 73.1760, pincode: '390020' },
    ],
  },
  {
    id: 'jobs-placement',
    name: 'Jobs & Placement Consultancies',
    slug: 'jobs-placement',
    icon: 'Users',
    subcategories: [
      { name: 'IT & Executive Staffing', sub: 'IT & Software Engineering Jobs', tier: 'premium', sample: 'TalentCrafters Executive HR Placements', address: 'Ocean Building, Sarabhai Campus, Vadodara', lat: 22.3130, lng: 73.1720, pincode: '390007' },
    ],
  },
  {
    id: 'loans-finance',
    name: 'Loans & Financial Services',
    slug: 'loans-finance',
    icon: 'Banknote',
    subcategories: [
      { name: 'Instant MSME & Home Loans', sub: 'Business MSME Loans & Working Capital', tier: 'elite', sample: 'PaisaCare Direct Loan & Mortgage Advisory', address: 'Sayajigunj Plaza, Vadodara', lat: 22.3085, lng: 73.1815, pincode: '390005' },
    ],
  },
  {
    id: 'real-estate-properties',
    name: 'Real Estate & Property Agents',
    slug: 'real-estate-properties',
    icon: 'Home',
    subcategories: [
      { name: 'Luxury Villas & Penthouse Estates', sub: 'Residential Flats & Villas for Sale', tier: 'elite', sample: 'PrimeLiving Heritage & Luxury Realty', address: 'Vasna-Bhayli Main Canal Road, Vadodara', lat: 22.2820, lng: 73.1360, pincode: '391410' },
      { name: 'Commercial Showrooms & Offices', sub: 'Commercial Offices, Shops & Showrooms', tier: 'premium', sample: 'MetroSpace Commercial Real Estate Advisors', address: 'Race Course Circle, Vadodara', lat: 22.3155, lng: 73.1605, pincode: '390007' },
    ],
  },
  {
    id: 'pg-hostel-rooms',
    name: 'PG & Hostel Accommodations',
    slug: 'pg-hostel-rooms',
    icon: 'Bed',
    subcategories: [
      { name: 'Executive AC PG for Professionals', sub: 'Working Professionals Co-Living Spaces', tier: 'premium', sample: 'UrbanNest Premium Co-Living & Food', address: 'Near MSU Polytechnic, Fatehgunj, Vadodara', lat: 22.3215, lng: 73.1885, pincode: '390002' },
      { name: 'Girls Safe Living PG with CCTV', sub: 'Girls PG with 24/7 Security & CCTV', tier: 'basic', sample: 'Stuti Girls PG Residency', address: 'Near Sayaji Garden, Sayajigunj, Vadodara', lat: 22.3115, lng: 73.1850, pincode: '390005' },
    ],
  },
  {
    id: 'fashion-apparel',
    name: 'Fashion, Sarees & Boutiques',
    slug: 'fashion-apparel',
    icon: 'Shirt',
    subcategories: [
      { name: 'Bridal Chaniya Choli & Lehengas', sub: 'Bridal Lehengas & Chaniya Cholis', tier: 'elite', sample: 'Virasat Couture Bridal Lehengas', address: 'MG Road, Mandvi Heritage Hub, Vadodara', lat: 22.3005, lng: 73.2040, pincode: '390006' },
      { name: 'Silk & Designer Sarees', sub: 'Designer Sarees & Silk Boutiques', tier: 'premium', sample: 'RoopMilan Pure Silk & Paithani Sarees', address: 'Alkapuri Main Market, Vadodara', lat: 22.3118, lng: 73.1655, pincode: '390007' },
    ],
  },
  {
    id: 'electronics-appliances',
    name: 'Electronics & Mobile Stores',
    slug: 'electronics-appliances',
    icon: 'Smartphone',
    subcategories: [
      { name: 'Apple & Premium Gadget Hub', sub: 'Smartphones & Apple Authorized Resellers', tier: 'elite', sample: 'iStore Premium Apple & Audio Reseller', address: 'Ground Floor, Inorbit Mall, Gorwa, Vadodara', lat: 22.3325, lng: 73.1545, pincode: '390016' },
      { name: 'Chip-Level Laptop Repair Lab', sub: 'Laptop Motherboard & Chip Level Service', tier: 'premium', sample: 'LaptopFix Chip-Level Motherboard Specialists', address: 'Tower Square, Raopura, Vadodara', lat: 22.3015, lng: 73.1970, pincode: '390001' },
    ],
  },
  {
    id: 'jewellery-gold',
    name: 'Jewellery & Hallmark Gold',
    slug: 'jewellery-gold',
    icon: 'Gem',
    subcategories: [
      { name: 'BIS 916 Gold & Polki Diamonds', sub: 'BIS 916 Hallmark Gold Jewellery', tier: 'elite', sample: 'Royal Heritage Jewellers & Solitaires', address: 'Opposite Nyaymandir, Mandvi, Vadodara', lat: 22.2998, lng: 73.2052, pincode: '390006' },
      { name: 'Antique Silver & Temple Ornaments', sub: 'Silver Ornaments & Antique Artifacts', tier: 'premium', sample: 'ChandiMahal Pure Silver Artifacts & Puja Sets', address: 'Dandia Bazaar, Vadodara', lat: 22.2970, lng: 73.1990, pincode: '390001' },
    ],
  },
  {
    id: 'automobile-dealers',
    name: 'Automobile Showrooms & Care',
    slug: 'automobile-dealers',
    icon: 'Car',
    subcategories: [
      { name: 'Ceramic Coating & PPF Studio', sub: 'Car Ceramic Coating, PPF & Detailing', tier: 'elite', sample: 'DetailingMafia 10H Ceramic & PPF Studio', address: 'Sun Pharma Bypass Road, Atladara, Vadodara', lat: 22.2730, lng: 73.1585, pincode: '390012' },
      { name: 'Multi-Brand Certified Service Garage', sub: 'Multi-Brand Car Service Garages', tier: 'premium', sample: 'AutoPro Bosch Certified Car Care Garage', address: 'Kapurai Crossing NH-8, Vadodara', lat: 22.2715, lng: 73.2350, pincode: '390004' },
    ],
  },
  {
    id: 'b2b-manufacturers',
    name: 'B2B Manufacturers & Suppliers',
    slug: 'b2b-manufacturers',
    icon: 'Building2',
    subcategories: [
      { name: 'CNC Precision Engineering Works', sub: 'Engineering Components, CNC & Lathe Works', tier: 'elite', sample: 'PrecisionEng CNC & Heavy Machinery Works', address: 'Plot 108, GIDC Industrial Zone, Makarpura, Vadodara', lat: 22.2560, lng: 73.1910, pincode: '390010' },
      { name: 'Pharma & Chemical Intermediates', sub: 'Chemical & Pharmaceutical Intermediates', tier: 'elite', sample: 'Zenith BioPharma Intermediates & Labs', address: 'Nandesari GIDC Estate, Vadodara', lat: 22.4120, lng: 73.0850, pincode: '391340' },
    ],
  },
];

// Curated stock photos for authentic demo previews
const DEMO_IMAGES: Record<string, { logo: string; cover: string }> = {
  restaurants: {
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
  },
  'security-cctv': {
    logo: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&auto=format&fit=crop&q=80',
  },
  'shop-online': {
    logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
  },
  'skin-hair-doctors': {
    logo: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
  },
  'doctors-healthcare': {
    logo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80',
  },
  'tshirt-printers': {
    logo: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop&q=80',
  },
  'tattoo-artists': {
    logo: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=1200&auto=format&fit=crop&q=80',
  },
  'taxi-cab-rentals': {
    logo: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&auto=format&fit=crop&q=80',
  },
  'training-institutes': {
    logo: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
  },
  'travel-holidays': {
    logo: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80',
  },
  'jewellery-gold': {
    logo: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&auto=format&fit=crop&q=80',
  },
  'gym-fitness': {
    logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
  },
  'real-estate-properties': {
    logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
  },
  'fashion-apparel': {
    logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
  },
  'electronics-appliances': {
    logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&auto=format&fit=crop&q=80',
  },
  'automobile-dealers': {
    logo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1200&auto=format&fit=crop&q=80',
  },
};

const DEFAULT_IMAGES = {
  logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80',
  cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
};

async function seedAllCategoryDemoMerchants() {
  loadEnv();
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const client = await pool.connect();
    console.log('🚀 Seeding authentic demo merchants for ALL categories and subcategories in AWS Aurora...');

    // 1. Ensure master merchant user exists
    const merchantUserId = 'usr-demo-merchant-master';
    await client.query(
      `INSERT INTO users (id, phone, full_name, role, role_id, avatar_url, created_at, updated_at)
       VALUES ($1, $2, $3, 'merchant', 'role-merchant', $4, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET full_name = $3, role = 'merchant'`,
      [
        merchantUserId,
        '+919876500001',
        'Adsspot Verified Merchant Hub',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=AdsspotMerchantMaster',
      ]
    );

    let totalCategories = 0;
    let totalMerchants = 0;

    // 2. Iterate through each category & insert into DB
    for (let i = 0; i < CATEGORIES_HIERARCHY.length; i++) {
      const cat = CATEGORIES_HIERARCHY[i];
      totalCategories++;

      // Upsert Category
      await client.query(
        `INSERT INTO categories (id, name, slug, icon, sort_order)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE 
         SET name = EXCLUDED.name, slug = EXCLUDED.slug, icon = EXCLUDED.icon, sort_order = EXCLUDED.sort_order`,
        [cat.id, cat.name, cat.slug, cat.icon, i + 1]
      );

      // Iterate subcategories and create a business for each
      for (let j = 0; j < cat.subcategories.length; j++) {
        const sub = cat.subcategories[j];
        totalMerchants++;

        const bizSlug = sub.sample.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const bizId = `biz-${cat.id}-${j + 1}-${Math.random().toString(36).substring(2, 6)}`;
        const phone = `+91987${Math.floor(1000000 + Math.random() * 9000000)}`;
        const cleanPhone = phone;
        const cleanWhatsapp = phone;
        const images = DEMO_IMAGES[cat.id] || DEFAULT_IMAGES;

        const description = `Premier ${sub.sub} in Vadodara. Specializing in ${sub.name}, offering verified quality, on-time service, customer guarantee, and direct WhatsApp booking.`;
        const openingHours = '09:00 AM - 09:30 PM (Mon - Sun)';
        const upiId = `${bizSlug.substring(0, 12)}@okhdfcbank`;
        const email = `contact@${bizSlug.substring(0, 15)}.in`;
        const website = `https://${bizSlug.substring(0, 15)}.adsspot.in`;
        const instagram = `@${bizSlug.substring(0, 15)}`;

        // Insert or update business in AWS Aurora
        const bizRes = await client.query(
          `INSERT INTO businesses (
            id, owner_id, category_id, name, slug, description, address, pincode,
            lat, lng, phone, whatsapp, logo_url, cover_url,
            email, website, instagram, upi_id, opening_hours,
            trusted, status, tier, created_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8,
            $9, $10, $11, $12, $13, $14,
            $15, $16, $17, $18, $19,
            $20, 'active', $21, NOW()
          )
          ON CONFLICT (slug) DO UPDATE
          SET category_id = EXCLUDED.category_id,
              name = EXCLUDED.name,
              description = EXCLUDED.description,
              address = EXCLUDED.address,
              pincode = EXCLUDED.pincode,
              lat = EXCLUDED.lat,
              lng = EXCLUDED.lng,
              logo_url = EXCLUDED.logo_url,
              cover_url = EXCLUDED.cover_url,
              email = EXCLUDED.email,
              website = EXCLUDED.website,
              instagram = EXCLUDED.instagram,
              upi_id = EXCLUDED.upi_id,
              opening_hours = EXCLUDED.opening_hours,
              trusted = EXCLUDED.trusted,
              tier = EXCLUDED.tier,
              status = 'active'
          RETURNING id, name, slug, tier;`,
          [
            bizId,
            merchantUserId,
            cat.id,
            sub.sample,
            bizSlug,
            description,
            sub.address,
            sub.pincode,
            sub.lat,
            sub.lng,
            cleanPhone,
            cleanWhatsapp,
            images.logo,
            images.cover,
            email,
            website,
            instagram,
            upiId,
            openingHours,
            sub.tier === 'elite' || sub.tier === 'premium',
            sub.tier,
          ]
        );

        const currentBizId = bizRes.rows[0]?.id || bizId;

        // Upsert Digital Visiting Card
        const themeConfig = {
          theme: sub.tier === 'elite' ? 'spot_ring' : sub.tier === 'premium' ? 'royal_blue' : 'minimal',
          social_links: {
            instagram,
            website,
            email,
            upi_id: upiId,
            opening_hours: openingHours,
          },
        };

        await client.query(
          `INSERT INTO digital_cards (id, business_id, theme_config, click_counts, updated_at)
           VALUES ($1, $2, $3, '{"views": 240, "whatsapp": 42, "calls": 18}', NOW())
           ON CONFLICT (business_id) DO UPDATE
           SET theme_config = EXCLUDED.theme_config, updated_at = NOW()`,
          [`card-${currentBizId}`, currentBizId, JSON.stringify(themeConfig)]
        );

        // Upsert Microsite for Elite & Premium
        if (sub.tier === 'elite' || sub.tier === 'premium') {
          await client.query(
            `INSERT INTO microsites (id, business_id, hero_title, about_text, gallery_urls, hours, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())
             ON CONFLICT (business_id) DO UPDATE
             SET hero_title = EXCLUDED.hero_title,
                 about_text = EXCLUDED.about_text,
                 hours = EXCLUDED.hours,
                 updated_at = NOW()`,
            [
              `site-${currentBizId}`,
              currentBizId,
              sub.sample,
              description,
              JSON.stringify([
                images.cover,
                'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
              ]),
              JSON.stringify({ all_days: openingHours }),
            ]
          );
        }

        // Active subscription record
        await client.query(
          `INSERT INTO subscriptions (id, business_id, plan_id, status, current_period_start, current_period_end)
           VALUES ($1, $2, $3, 'active', NOW(), NOW() + INTERVAL '1 year')
           ON CONFLICT (id) DO NOTHING`,
          [`sub-${currentBizId}`, currentBizId, `plan-${sub.tier}`]
        );
      }
    }

    console.log(`✅ Success: Seeded ${totalCategories} master categories with ${totalMerchants} demo merchants across all subcategories into AWS Aurora!`);
    client.release();
    await pool.end();
  } catch (err: any) {
    console.error('❌ Seeding demo merchants error:', err.message);
    await pool.end();
    process.exit(1);
  }
}

seedAllCategoryDemoMerchants();
