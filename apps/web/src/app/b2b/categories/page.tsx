'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  ChevronRight,
} from 'lucide-react';

interface B2BCategoryItem {
  id: string;
  name: string;
  image: string;
  subcategories: string[];
}

const B2B_ALL_CATEGORIES_DATA: B2BCategoryItem[] = [
  {
    id: 'agriculture',
    name: 'Agriculture',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'Tractors & Farm Harvesters',
      'Organic Fertilizers & Pesticides',
      'Drip Irrigation Pipes & Sprinklers',
      'Hybrid Seeds & Agro Chemicals',
      'Grain Storage Silos & Mills',
      'Solar Water Pumps & Solar Panels',
    ],
  },
  {
    id: 'apparel-fashion',
    name: 'Apparel & Fashion',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'Cotton, Denim & Polyester Fabrics Wholesale',
      'Garment Manufacturing & Job Works',
      'Industrial Safety Uniforms & Coveralls',
      'Yarn & Textile Dyeing Chemicals',
      'Knitted & Woven Apparel Export',
      'Zippers, Buttons & Sewing Accessories',
    ],
  },
  {
    id: 'automobiles-accessories',
    name: 'Automobiles Accessories',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'Automotive Brake Pads & Clutch Plates',
      'LED Headlights & Wiring Harness',
      'Car Seat Covers & Dashboard Accessories',
      'Hydraulic Jacks & Garage Tools',
      'Engine Lubricants & Synthetic Oils',
      'Commercial Vehicle Leaf Springs & Tyres',
    ],
  },
  {
    id: 'baby-care',
    name: 'Baby Care',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'Baby Diapers & Wipes Bulk Supply',
      'Plastic Feeding Bottles & Pacifiers',
      'Organic Baby Skincare Lotions & Soaps',
      'Wooden Baby Cots & Strollers Manufacturing',
      'Infant Milk Formula & Baby Cereals',
    ],
  },
  {
    id: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'Herbal Shampoo & Hair Oil Manufacturing',
      'Cosmetics Raw Ingredients & Fragrances',
      'Salon Professional Chairs & Steamers',
      'Essential Oils & Aromatherapy Extracts',
      'Nail Art Accessories & Spa Products',
    ],
  },
  {
    id: 'chemicals',
    name: 'Chemicals',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'Industrial Solvents & Diluents',
      'Pharma Intermediates & API Raw Materials',
      'Water Treatment Chemicals & Resins',
      'Electroplating & Surface Finishing Chemicals',
      'Laboratory Grade Reagents & Acids',
      'Paint & Resin Specialty Additives',
    ],
  },
  {
    id: 'construction-real-estate',
    name: 'Construction & Real Estate',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'TMT Steel Bars & Structural Beams',
      'Ready Mix Concrete (RMC) & Portland Cement',
      'Vitrified Floor Tiles & Marble Slabs',
      'UPVC Doors, Windows & Glass Facades',
      'Scaffolding Pipes & Shuttering Plates',
      'Ready-to-Move Industrial Sheds in GIDC',
    ],
  },
  {
    id: 'electronic-component',
    name: 'Electronic Component',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'Multi-layer PCB Design & Fabrication',
      'SMD Resistors, Capacitors & Diodes',
      'Microcontrollers & Arduino/Raspberry Modules',
      'Relays, Transformers & Power Switches',
      'Semiconductor ICs & Voltage Regulators',
      'Soldering Stations & Testing Multimeters',
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics & Appliances',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'Commercial LED High Bay Lights & Floodlights',
      'Industrial Inverters & Online UPS Systems',
      'Cooling Towers & Heavy HVAC Chillers',
      'Security Access Bio-metric Scanners',
      'CCTV Surveillance Cameras & DVR NVR Wholesale',
    ],
  },
  {
    id: 'energy',
    name: 'Energy & Solar Power',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'Rooftop On-Grid & Off-Grid Solar Panels',
      'Lithium Ferro Phosphate (LFP) Solar Batteries',
      'Biomass Briquettes & Pellets Fuel',
      'Diesel Power Generators (15 kVA - 500 kVA)',
      'Solar Inverters & Net Metering Accessories',
    ],
  },
  {
    id: 'food-beverage',
    name: 'Food & Beverage',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'Refined Edible Cooking Oils Bulk Supply',
      'Spices, Chilli Powder & Turmeric Processing',
      'Basmati Rice, Wheat & Pulses Wholesale',
      'Bakery Ingredients, Yeast & Cocoa Mass',
      'Packaged Drinking Water & Soda Bottling Lines',
    ],
  },
  {
    id: 'footwear-accessories',
    name: 'Footwear & Accessories',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'Steel Toe Industrial Safety Shoes',
      'Leather Formal & Casual Shoes Wholesale',
      'EVA & PVC Shoe Soles Manufacturing',
      'Leather Belts & Wallets Bulk Supply',
      'Rubber Footwear Moulds & Dies',
    ],
  },
  {
    id: 'furniture',
    name: 'Furniture & Fixtures',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'Modular Office Workstations & Mesh Chairs',
      'Industrial Heavy Duty Storage Racks & Pallets',
      'School & College Benches & Desks',
      'Hotel Bedroom Furniture & Restaurant Tables',
      'Stainless Steel Commercial Kitchen Counters',
    ],
  },
  {
    id: 'gifts-crafts',
    name: 'Gifts & Crafts',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'Corporate Promotional Executive Gift Sets',
      'Custom Engraved Acrylic & Metal Trophies',
      'Handcrafted Brass & Wooden Artifacts',
      'Eco-Friendly Jute & Canvas Conference Bags',
      'Diwali & Festival Dry Fruit Gift Hampers',
    ],
  },
  {
    id: 'health-medical',
    name: 'Health & Medical',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'Disposable Nitrile Gloves & Surgical Masks',
      'ICU Patient Monitors & Ventilators',
      'Hospital Electric Beds & Wheelchairs',
      'Diagnostic Ultrasound & ECG Machines',
      'Orthopedic Surgical Implants & Instruments',
    ],
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'Garden Lawn Mowers & Hedge Trimmers',
      'Plastic & Ceramic Plant Pots Wholesale',
      'Automatic Lawn Sprinkler Systems',
      'Coco Peat & Vermicompost Fertilizer',
      'Outdoor Patio & Gazebo Furniture',
    ],
  },
  {
    id: 'industrial-machinery',
    name: 'Industrial Machinery',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'CNC Turning Centers & Milling Machines',
      'Hydraulic Power Presses & Shearing Machines',
      'Automatic Packaging & Pouch Sealing Machines',
      'Industrial Air Compressors (Screw & Piston)',
      'Plastic Injection Moulding Machines',
      'Boilers, Heat Exchangers & Pressure Vessels',
    ],
  },
  {
    id: 'it-components',
    name: 'IT Components & Servers',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'Rackmount Enterprise Server Chassis',
      'Cisco & Aruba Managed Network Switches',
      'Fibre Optic Patch Cables & SFP Modules',
      'NAS Storage Drives & Enterprise SSDs',
      'Server Rack Enclosures & Cooling Fans',
    ],
  },
  {
    id: 'jewellery-gems',
    name: 'Jewellery, Gems & Gold',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'Lab-Grown CVD Diamond Rough & Polished',
      'Jewellery Casting Gold Machines & Furnaces',
      'Velvet Jewellery Display Boxes & Pouches',
      'Precious Gemstones (Sapphire, Ruby, Emerald)',
      'Digital Precision Gold Weighing Scales',
    ],
  },
  {
    id: 'lights-lighting',
    name: 'Lights & Lighting Fixtures',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&auto=format&fit=crop&q=80',
    subcategories: [
      'Architectural COB LED Track Lights',
      'Highway Solar Street Lights with Inbuilt Battery',
      'Decorative Chandeliers & Crystal Pendants',
      'Flame-proof Industrial Lighting for Chemical Plants',
      'RGB Dynamic Facade & Monument Lighting',
    ],
  },
];

function B2BCategoriesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSelected = searchParams?.get('selected');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(initialSelected || null);

  const filtered = B2B_ALL_CATEGORIES_DATA.filter((cat) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = cat.name.toLowerCase().includes(q);
    const subMatch = cat.subcategories.some((sub) => sub.toLowerCase().includes(q));
    return nameMatch || subMatch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-[#17181C] pb-28">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E3E8EF] shadow-2xs">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-1 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h1 className="text-base font-extrabold text-[#17181C] tracking-tight">
              All Categories
            </h1>
          </div>
          <span className="text-[10px] font-bold text-[#E14D2A] bg-[#FFF1EE] px-2.5 py-0.5 rounded-full border border-[#E14D2A]/30">
            B2B Marketplace
          </span>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto px-4 pb-3">
          <div className="relative flex items-center bg-[#F4F6FB] border border-[#E3E8EF] rounded-2xl p-1 shadow-2xs">
            <div className="pl-2.5 pr-1.5 text-[#687182]">
              <Search className="w-4 h-4 text-[#4787F2]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in 20+ B2B industrial categories..."
              className="flex-1 bg-transparent text-xs sm:text-sm font-semibold text-[#17181C] placeholder:text-neutral-400 outline-none"
            />
          </div>
        </div>
      </header>

      {/* 2-Column Photo Card Grid matching Image 2 */}
      <main className="max-w-xl mx-auto px-3 py-3 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((cat) => {
            const isExpanded = expandedId === cat.id;

            return (
              <div
                key={cat.id}
                className="col-span-1 flex flex-col bg-white rounded-2xl border border-[#E3E8EF] shadow-2xs overflow-hidden transition-all hover:border-[#4787F2]"
              >
                {/* Visual Category Card */}
                <div
                  onClick={() => toggleExpand(cat.id)}
                  className="relative h-28 w-full cursor-pointer group overflow-hidden"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Title pill overlaid on card bottom */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-white/95 backdrop-blur-md rounded-xl px-2.5 py-1.5 shadow-sm">
                    <span className="text-[11px] font-black text-[#17181C] truncate max-w-[120px]">
                      {cat.name}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                        isExpanded ? 'rotate-90 text-[#4787F2]' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Subcategories Accordion if active */}
                {isExpanded && (
                  <div className="p-2.5 bg-[#FAFBFD] border-t border-neutral-100 space-y-1.5 animate-fade-in">
                    <span className="text-[9px] font-black uppercase text-[#687182] block tracking-wider">
                      Verified B2B Suppliers
                    </span>
                    <div className="space-y-1">
                      {cat.subcategories.map((sub, idx) => (
                        <Link
                          key={idx}
                          href={`/b2b?q=${encodeURIComponent(sub)}`}
                          className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-[#E3E8EF] text-[10px] font-bold text-[#17181C] hover:text-[#4787F2] hover:border-[#4787F2] transition-colors"
                        >
                          <span className="truncate">{sub}</span>
                          <ChevronRight className="w-2.5 h-2.5 text-neutral-300 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function B2BAllCategoriesPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#F4F6FB]" />}>
      <B2BCategoriesContent />
    </React.Suspense>
  );
}
