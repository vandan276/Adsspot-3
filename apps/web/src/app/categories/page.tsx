'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  ChevronRight,
  ChevronDown,
  UtensilsCrossed,
  ShieldCheck,
  ShoppingBag,
  Stethoscope,
  Printer,
  Sparkles,
  Car,
  Truck,
  Tent,
  Anchor,
  Train,
  GraduationCap,
  Plane,
  FileCheck,
  Layers,
  Droplets,
  Umbrella,
  Globe,
  HeartHandshake,
  Dumbbell,
  Activity,
  Building2,
  Home,
  Bed,
  Wrench,
  Users,
  Banknote,
  Smartphone,
  Gem,
  BookOpen,
} from 'lucide-react';

interface CategoryHierarchyItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconColor: string;
  bgColor: string;
  subcategories: string[];
}

const ALL_CATEGORIES_DATA: CategoryHierarchyItem[] = [
  {
    id: 'restaurants',
    name: 'Restaurants & Dining',
    icon: UtensilsCrossed,
    iconColor: '#E14D2A',
    bgColor: '#FFF1EE',
    subcategories: [
      'Gujarati Thali & Kathiyawadi',
      'South Indian & Dosa Hubs',
      'North Indian & Mughlai',
      'Cafes & Artisan Bakeries',
      'Chinese & Pan Asian',
      'Street Food & Chaat',
      'Ice Cream & Dessert Parlours',
      'Fine Dining & Rooftop Lounges',
      'Fast Food & Burgers',
      'Pure Veg Multi-Cuisine',
    ],
  },
  {
    id: 'security-cctv',
    name: 'Security & CCTV',
    icon: ShieldCheck,
    iconColor: '#00A86B',
    bgColor: '#EBF9F3',
    subcategories: [
      'CCTV Camera Installation & AMC',
      'Biometric Access Control Systems',
      'Home Alarm & Video Door Phones',
      'Security Guard Agencies',
      'Fire Fighting Equipment & Extinguishers',
      'GPS Vehicle Trackers',
    ],
  },
  {
    id: 'shop-online',
    name: 'Shop Online & Retail',
    icon: ShoppingBag,
    iconColor: '#3A86FF',
    bgColor: '#EFF5FF',
    subcategories: [
      'Local Supermarkets & Kirana',
      'Organic Foods & Groceries',
      'Electronics & Home Appliances',
      'Clothing & Boutiques',
      'Footwear & Leather Goods',
      'Gifts, Flowers & Cakes Delivery',
      'Toys, Baby & Kids Stores',
    ],
  },
  {
    id: 'skin-hair-doctors',
    name: 'Skin & Hair Doctors (Dermatologists)',
    icon: Stethoscope,
    iconColor: '#B5179E',
    bgColor: '#FDF0F8',
    subcategories: [
      'Clinical Dermatology',
      'Hair Transplant & PRP Clinics',
      'Laser Skin Treatments',
      'Acne & Scar Therapies',
      'Anti-Ageing & Cosmetic Surgeons',
      'Trichology Specialists',
    ],
  },
  {
    id: 'doctors-healthcare',
    name: 'Doctors & Clinics',
    icon: Stethoscope,
    iconColor: '#059669',
    bgColor: '#ECFDF5',
    subcategories: [
      'General Physicians',
      'Dentists & Orthodontists',
      'Pediatricians & Child Specialists',
      'Gynecologists & Obstetricians',
      'Cardiologists & Heart Clinics',
      'Orthopedic Doctors & Joint Care',
      'Ophthalmologists & Eye Hospitals',
      'Ayurvedic & Homeopathic Doctors',
      'Diagnostic Pathology Labs & MRI/X-Ray',
    ],
  },
  {
    id: 'tshirt-printers',
    name: 'T-Shirt Printers & Signage',
    icon: Printer,
    iconColor: '#6366F1',
    bgColor: '#EEF2FF',
    subcategories: [
      'Custom T-Shirt Screen & DTF Printing',
      'Corporate Merchandise & Uniforms',
      'Flex, Glow Signboard & LED Boards',
      'Visiting Cards & Pamphlet Printing',
      'Promotional Gifts & Mugs Printing',
      'Sublimation & Trophy Engraving',
    ],
  },
  {
    id: 'tattoo-artists',
    name: 'Tattoo Artists & Body Art',
    icon: Sparkles,
    iconColor: '#D97706',
    bgColor: '#FFFBEB',
    subcategories: [
      'Custom Permanent Tattoos',
      'Cover-up Tattoos',
      'Piercing Studios (Ear, Nose & Body)',
      'Temporary & Airbrush Tattoos',
      'Henna & Organic Mehndi Artists',
    ],
  },
  {
    id: 'taxi-cab-rentals',
    name: 'Taxi & Cab Rentals',
    icon: Car,
    iconColor: '#EA580C',
    bgColor: '#FFF7ED',
    subcategories: [
      'Local City Taxis & Hourly Cabs',
      'Outstation One-Way & Round Trips',
      'Airport Pickup & Drop Transfers',
      'Luxury Wedding Car Hire',
      'Self-Drive Car Rentals',
      'Corporate Monthly Fleet Hire',
    ],
  },
  {
    id: 'tempos-on-hire',
    name: 'Tempos On Hire & Mini Trucks',
    icon: Truck,
    iconColor: '#4B5563',
    bgColor: '#F3F4F6',
    subcategories: [
      'Tata Ace / Chota Hathi on Rent',
      'Pickup Trucks (8ft / 14ft)',
      'Local Commercial Goods Transport',
      'Inter-City Tempo Services',
      'Industrial Machinery Shifting',
    ],
  },
  {
    id: 'tent-house-events',
    name: 'Tent House & Event Mandap',
    icon: Tent,
    iconColor: '#E11D48',
    bgColor: '#FFF1F2',
    subcategories: [
      'Wedding Mandap & Stage Decoration',
      'Sound, DJ & Stage Lighting Setup',
      'German Hangar & Water-Proof Tents',
      'Catering Counter Setup & Chairs Hire',
      'Corporate Seminar & Exhibition Setup',
    ],
  },
  {
    id: 'towing-services',
    name: 'Towing Services & Breakdown Assistance',
    icon: Anchor,
    iconColor: '#0D9488',
    bgColor: '#F0FDFA',
    subcategories: [
      '24/7 Car Flatbed Towing',
      'Hydraulic Crane Towing',
      'Bike Towing & Carrier',
      'Highway On-Site Emergency Assistance',
      'Battery Jumpstart & Flat Tyre Repair',
    ],
  },
  {
    id: 'train-ticketing',
    name: 'Train & Air Ticketing Agents',
    icon: Train,
    iconColor: '#3A86FF',
    bgColor: '#EFF5FF',
    subcategories: [
      'IRCTC Authorized Train Bookings',
      'Domestic & International Flight Tickets',
      'Tatkal & Premium Tatkal Assistance',
      'Bus & Volvo Luxury Reservations',
      'Cruise Packages & Bookings',
    ],
  },
  {
    id: 'training-institutes',
    name: 'Training Institutes & Coaching',
    icon: GraduationCap,
    iconColor: '#16A34A',
    bgColor: '#F0FDF4',
    subcategories: [
      'IT, Coding & Software Development',
      'Digital Marketing & SEO Courses',
      'Graphic Designing, UI/UX & Video Editing',
      'Spoken English & IELTS/TOEFL Coaching',
      'Competitive Exams (GPSC, UPSC, Bank, SSC)',
      'Class 9th-12th Science & Commerce Tuitions',
      'CAD, Civil & Mechanical Designing',
    ],
  },
  {
    id: 'transporters-logistics',
    name: 'Transporters & Logistics',
    icon: Truck,
    iconColor: '#8338EC',
    bgColor: '#F5EEFD',
    subcategories: [
      'Full Truck Load (FTL) Freight',
      'Part Truck Load (PTL) Cargo',
      'Parcel & Courier Booking Centers',
      'Warehousing & Storage Facilities',
      'Cold Chain & Reefer Transport',
    ],
  },
  {
    id: 'travel-holidays',
    name: 'Travel & Holiday Packages',
    icon: Plane,
    iconColor: '#2B70C9',
    bgColor: '#EDF4FF',
    subcategories: [
      'Domestic Holiday Tours (Kashmir, Goa, Kerala, Himachal)',
      'International Tour Packages (Dubai, Thailand, Europe)',
      'Honeymoon Packages',
      'Religious Pilgrimage Tours (Char Dham, Kashi, Somnath)',
      'Adventure Camping & Trekking Trips',
      'Custom Corporate Group Tours',
    ],
  },
  {
    id: 'tutorials-home-tuitions',
    name: 'Tutorials & Home Tutors',
    icon: BookOpen,
    iconColor: '#F59E0B',
    bgColor: '#FEF3C7',
    subcategories: [
      'Home Tutors for Primary & Secondary Classes',
      'CBSE, ICSE & GSEB State Board Tuitions',
      'NEET, JEE Main & Advanced Coaching',
      'Maths & Physics Specialists',
      'Commerce, Accounts & Economics Coaching',
      'Foreign Language Tutors (German, French, Spanish)',
    ],
  },
  {
    id: 'visa-assistance',
    name: 'Visa Assistance & Immigration',
    icon: FileCheck,
    iconColor: '#00A86B',
    bgColor: '#EBF9F3',
    subcategories: [
      'Student Study Visa (USA, UK, Canada, Australia)',
      'Tourist & Visitor Visa Processing',
      'Work Permits & PR Immigration Consulting',
      'Passport Application & Renewal Assistance',
      'Embassy Attestation & Document Apostille',
    ],
  },
  {
    id: 'wall-papers-interior',
    name: 'Wall Papers & Wall Decor',
    icon: Layers,
    iconColor: '#4F46E5',
    bgColor: '#EEF2FF',
    subcategories: [
      '3D Customized & Designer Wallpapers',
      'Vinyl, Flocked & Metallic Wallpapers',
      'WPC & Charcoal Wall Louver Panels',
      'POP, Gypsum False Ceiling Contractors',
      'Texture Painting & Stencil Artists',
    ],
  },
  {
    id: 'water-suppliers',
    name: 'Water Suppliers (Tanker & Jars)',
    icon: Droplets,
    iconColor: '#0284C7',
    bgColor: '#E0F2FE',
    subcategories: [
      '20L Mineral RO Water Jars Supply',
      'Commercial & Construction Water Tankers',
      'Drinking Water Tanker Delivery (5000L - 10000L)',
      'Bulk Industrial Demineralized Water',
    ],
  },
  {
    id: 'waterproofing-contractors',
    name: 'Waterproofing Contractors',
    icon: Umbrella,
    iconColor: '#059669',
    bgColor: '#ECFDF5',
    subcategories: [
      'Terrace & Roof Waterproofing',
      'Bathroom & Kitchen Leakage Repair',
      'Basement & Foundation Dampness Proofing',
      'Crack Filling & Chemical Epoxy Injection',
      'Wall Seepage Treatment with Warranty',
    ],
  },
  {
    id: 'website-designers',
    name: 'Website Designers & Software',
    icon: Globe,
    iconColor: '#6366F1',
    bgColor: '#EEF2FF',
    subcategories: [
      'Custom Next.js & React Web Apps',
      'E-Commerce Portals (Shopify, WooCommerce)',
      'Corporate & Business WordPress Websites',
      'Mobile App Development (iOS & Android)',
      'SEO (Search Engine Optimization) & Lead Gen',
      'Domain, Cloud Hosting & SSL Setup',
    ],
  },
  {
    id: 'wedding-requisites',
    name: 'Wedding Requisites & Planners',
    icon: HeartHandshake,
    iconColor: '#E11D48',
    bgColor: '#FFF1F2',
    subcategories: [
      'Wedding Planners & Event Coordinators',
      'Bridal Makeup & Groom Hair Styling',
      'Wedding Photographers & Cinematic Videographers',
      'Designer Wedding Invitation Cards',
      'Band, Dhol, Ghodi & Fireworks Services',
      'Choreographers for Sangeet & Flashmobs',
    ],
  },
  {
    id: 'weight-loss-centres',
    name: 'Weight Loss Centres & Dietitians',
    icon: Activity,
    iconColor: '#16A34A',
    bgColor: '#F0FDF4',
    subcategories: [
      'Clinical Dietitians & Customized Nutrition Plans',
      'Inch Loss & Non-Surgical Body Contouring',
      'Weight Gain & Sports Nutrition',
      'PCOS, Thyroid & Diabetes Dietary Management',
      'Detox & Naturopathy Centres',
    ],
  },
  {
    id: 'yoga-classes',
    name: 'Yoga Classes & Meditation',
    icon: Dumbbell,
    iconColor: '#B5179E',
    bgColor: '#FDF0F8',
    subcategories: [
      'Hatha & Ashtanga Daily Yoga Batches',
      'Power Yoga for Weight Loss & Stamina',
      'Prenatal & Postnatal Yoga for Mothers',
      'Meditation & Pranayama Mindfulness',
      'Personal Home Yoga Instructors',
      'Online Daily Morning Yoga Sessions',
    ],
  },
  {
    id: 'packers-movers',
    name: 'Packers & Movers',
    icon: Truck,
    iconColor: '#EA580C',
    bgColor: '#FFF7ED',
    subcategories: [
      'Household Goods Shifting',
      'Office & Corporate Relocation',
      'Car & Bike Transportation by Container',
      'Single Item Luggage & Fragile Goods Move',
      'Secure Packing with Bubble Wrap & Corrugated Boxes',
    ],
  },
  {
    id: 'repairs-services',
    name: 'Repairs & Home Services',
    icon: Wrench,
    iconColor: '#4B5563',
    bgColor: '#F3F4F6',
    subcategories: [
      'AC Service, Gas Refill & Installation',
      'Electricians & Wiring Repair',
      'Plumbers for Pipe Leaks & Faucet Fitting',
      'Washing Machine & Refrigerator Repair',
      'Carpenters for Furniture & Lock Repair',
      'RO Water Purifier Repair & Filter Change',
      'Geyser & Microwave Oven Service',
    ],
  },
  {
    id: 'gym-fitness',
    name: 'Gym & Fitness Centers',
    icon: Dumbbell,
    iconColor: '#4F46E5',
    bgColor: '#EEF2FF',
    subcategories: [
      'Unisex Fitness Gyms with Certified Trainers',
      'CrossFit & Functional Training Zones',
      'Personal Fitness Training (1-on-1)',
      'Zumba, Aerobics & Dance Workout Classes',
      'Steam, Sauna & Recovery Centers',
    ],
  },
  {
    id: 'jobs-placement',
    name: 'Jobs & Placement Consultancies',
    icon: Users,
    iconColor: '#0D9488',
    bgColor: '#F0FDFA',
    subcategories: [
      'IT & Software Engineering Jobs',
      'Sales, Marketing & Field Executive Openings',
      'Accounting, Tally & Back-Office Staffing',
      'Hotel, Chef & Hospitality Jobs',
      'Overseas Gulf & Europe Employment Agencies',
      'Part-Time & Work-from-Home Vacancies',
    ],
  },
  {
    id: 'loans-finance',
    name: 'Loans & Financial Services',
    icon: Banknote,
    iconColor: '#16A34A',
    bgColor: '#F0FDF4',
    subcategories: [
      'Personal Loans with Instant Approval',
      'Home Loans & Balance Transfer',
      'Business MSME Loans & Working Capital',
      'Loan Against Property (LAP)',
      'Car & Vehicle Finance',
      'Gold Loan Centers with Lowest Interest',
    ],
  },
  {
    id: 'real-estate-properties',
    name: 'Real Estate & Property Agents',
    icon: Home,
    iconColor: '#E11D48',
    bgColor: '#FFF1F2',
    subcategories: [
      'Residential Flats & Villas for Sale',
      'Rental Apartments & Independent Houses',
      'Commercial Offices, Shops & Showrooms',
      'Industrial Plots, Sheds & Warehouses',
      'Agricultural & Farmhouse Lands',
      'Property Legal Documentation & Verification',
    ],
  },
  {
    id: 'pg-hostel-rooms',
    name: 'PG & Hostel Accommodations',
    icon: Bed,
    iconColor: '#6366F1',
    bgColor: '#EEF2FF',
    subcategories: [
      'Boys PG with AC & Food Included',
      'Girls PG with 24/7 Security & CCTV',
      'Single & Double Sharing Student Hostels',
      'Working Professionals Co-Living Spaces',
      'Short Stay Daily/Weekly PG Rooms',
    ],
  },
  {
    id: 'fashion-apparel',
    name: 'Fashion, Sarees & Boutiques',
    icon: ShoppingBag,
    iconColor: '#EC4899',
    bgColor: '#FCE7F3',
    subcategories: [
      'Bridal Lehengas & Chaniya Cholis',
      'Designer Sarees & Silk Boutiques',
      'Men’s Sherwanis, Suits & Ethnic Wear',
      'Western Wear & Casual Outfits',
      'Kids Wear & Festive Dresses',
      'Custom Tailoring & Boutique Embroidery',
    ],
  },
  {
    id: 'electronics-appliances',
    name: 'Electronics & Mobile Stores',
    icon: Smartphone,
    iconColor: '#0284C7',
    bgColor: '#E0F2FE',
    subcategories: [
      'Smartphones & Apple Authorized Resellers',
      'Laptops, MacBooks & Desktop Computers',
      'Smart TVs, Soundbars & Home Theatres',
      'Mobile Screen Replacement & Quick Repairs',
      'Laptop Motherboard & Chip Level Service',
      'Smartwatches, Earbuds & Gadget Accessories',
    ],
  },
  {
    id: 'jewellery-gold',
    name: 'Jewellery & Hallmark Gold',
    icon: Gem,
    iconColor: '#EAB308',
    bgColor: '#FEF9C3',
    subcategories: [
      'BIS 916 Hallmark Gold Jewellery',
      'Certified Real Diamond & Solitaire Rings',
      'Silver Ornaments & Antique Artifacts',
      'Bridal Heavy Kundan & Jadau Sets',
      'Platinum Bands & Daily Wear Chains',
      'Custom Jewellery Manufacturing & Valuers',
    ],
  },
  {
    id: 'automobile-dealers',
    name: 'Automobile Showrooms & Garages',
    icon: Car,
    iconColor: '#64748B',
    bgColor: '#F1F5F9',
    subcategories: [
      'Certified Pre-Owned Used Cars',
      'Multi-Brand Car Service Garages',
      'Two-Wheeler EV & Petrol Showrooms',
      'Car Ceramic Coating, PPF & Detailing',
      'Alloy Wheels, Tyres & Wheel Alignment',
      'Auto Spare Parts & Accessories Wholesale',
    ],
  },
  {
    id: 'b2b-manufacturers',
    name: 'B2B Manufacturers & Suppliers (1Cr+)',
    icon: Building2,
    iconColor: '#E14D2A',
    bgColor: '#FFF1EE',
    subcategories: [
      'Chemical & Pharmaceutical Intermediates',
      'Plastic, Injection Moulding & Packaging',
      'Engineering Components, CNC & Lathe Works',
      'Textile, Yarn & Fabric Mills',
      'Electrical Panels, Cables & Transformers',
      'Construction Cement, TMT Steel & Hardware',
    ],
  },
];

export default function AllCategoriesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const filteredCategories = ALL_CATEGORIES_DATA.filter((cat) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = cat.name.toLowerCase().includes(q);
    const subMatch = cat.subcategories.some((sub) => sub.toLowerCase().includes(q));
    return nameMatch || subMatch;
  });

  const toggleExpand = (id: string) => {
    setExpandedCategoryId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-[#17181C] flex flex-col pb-28">
      {/* 1. Header with Back Arrow and Search */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E3E8EF] shadow-xs backdrop-blur-md bg-white/95">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-full hover:bg-neutral-100 transition-colors text-[#17181C]"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <h1 className="text-base font-extrabold text-[#17181C] tracking-tight">
            All Categories
          </h1>
        </div>

        {/* Search within Categories */}
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-4 h-4 text-[#4787F2]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in 35+ categories & 200+ services..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F4F6FB] border border-[#E3E8EF] rounded-2xl text-xs sm:text-sm font-semibold text-[#17181C] placeholder:text-neutral-400 outline-none focus:border-[#4787F2] focus:bg-white transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-bold text-neutral-400 hover:text-neutral-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Full Category List with Subcategories */}
      <main className="max-w-2xl mx-auto w-full px-3 py-3 flex-1 space-y-2">
        <div className="bg-white rounded-3xl border border-[#E3E8EF] shadow-xs overflow-hidden divide-y divide-neutral-100">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            const isExpanded = expandedCategoryId === cat.id;

            return (
              <div key={cat.id} className="transition-colors hover:bg-neutral-50/50">
                {/* Category Header Row */}
                {cat.id === 'b2b-manufacturers' ? (
                  <div className="w-full px-4 py-3.5 flex items-center justify-between text-left gap-3 group">
                    <Link href="/b2b" className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: cat.bgColor }}
                      >
                        <Icon className="w-5 h-5" style={{ color: cat.iconColor }} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-[#17181C] block truncate">
                            {cat.name}
                          </span>
                          <span className="bg-[#E14D2A] text-white text-[8px] font-black px-1.5 rounded-full">
                            1Cr+ Portal
                          </span>
                        </div>
                        <span className="text-[11px] text-[#E14D2A] font-bold block truncate">
                          Explore B2B Portal &amp; 20+ Sectors →
                        </span>
                      </div>
                    </Link>

                    <button
                      onClick={() => toggleExpand(cat.id)}
                      className="p-1 text-neutral-400 hover:text-[#4787F2] transition-colors shrink-0"
                      title="Show subcategories"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-[#4787F2] stroke-[2.5]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 stroke-[2]" />
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => toggleExpand(cat.id)}
                    className="w-full px-4 py-3.5 flex items-center justify-between text-left gap-3 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: cat.bgColor }}
                      >
                        <Icon className="w-5 h-5" style={{ color: cat.iconColor }} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-[#17181C] block truncate">
                          {cat.name}
                        </span>
                        <span className="text-[11px] text-[#687182] font-medium block truncate">
                          {cat.subcategories.length} sub-services available
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-neutral-400 group-hover:text-[#4787F2] transition-colors shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-[#4787F2] stroke-[2.5]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 stroke-[2]" />
                      )}
                    </div>
                  </button>
                )}

                {/* Subcategories Accordion */}
                {isExpanded && (
                  <div className="bg-[#FAFBFD] px-4 py-3 border-t border-neutral-100 space-y-2 animate-fade-in">
                    <p className="text-[10px] font-black uppercase text-[#687182] tracking-wider">
                      Popular Services in {cat.name}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {cat.subcategories.map((sub, idx) => (
                        <Link
                          key={idx}
                          href={cat.id === 'b2b-manufacturers' ? `/b2b?q=${encodeURIComponent(sub)}` : `/explore?q=${encodeURIComponent(sub)}`}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E3E8EF] hover:border-[#4787F2] hover:bg-[#EDF4FF]/40 text-xs font-semibold text-[#17181C] transition-all group"
                        >
                          <span className="truncate">{sub}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-[#4787F2] shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredCategories.length === 0 && (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-bold text-[#17181C]">No categories found</p>
              <p className="text-xs text-[#687182]">Try searching for something else like "Doctors", "AC", "Tattoo", etc.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
