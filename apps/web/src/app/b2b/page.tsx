'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  Camera,
  Mic,
  MapPin,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Send,
  Building,
  Factory,
  Cpu,
  Shirt,
  Utensils,
  Stethoscope,
  Printer,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

const B2B_QUICK_CATEGORIES = [
  {
    id: 'construction-real-estate',
    name: 'Construction & Real Estate',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=200&auto=format&fit=crop&q=80',
    icon: Building,
  },
  {
    id: 'industrial-machinery',
    name: 'Industrial Machinery',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=80',
    icon: Factory,
  },
  {
    id: 'electronic-component',
    name: 'Electronic Component',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=80',
    icon: Cpu,
  },
  {
    id: 'apparel-fashion',
    name: 'Apparel & Fashion',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&auto=format&fit=crop&q=80',
    icon: Shirt,
  },
  {
    id: 'food-beverage',
    name: 'Food & Beverage',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80',
    icon: Utensils,
  },
  {
    id: 'health-medical',
    name: 'Health & Medical',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=200&auto=format&fit=crop&q=80',
    icon: Stethoscope,
  },
  {
    id: 'chemicals',
    name: 'Chemicals & Pharma',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=200&auto=format&fit=crop&q=80',
    icon: Printer,
  },
  {
    id: 'energy',
    name: 'Energy & Solar Power',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=200&auto=format&fit=crop&q=80',
    icon: Calendar,
    badge: 'NEW',
  },
];

const SIMILAR_SEARCH_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Computer Consoles',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80',
    price: '₹14,500 / Piece',
    minOrder: 'Min. 5 Units',
  },
  {
    id: 'prod-2',
    name: 'Desktop Reader',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
    price: '₹2,800 / Unit',
    minOrder: 'Min. 20 Units',
  },
  {
    id: 'prod-3',
    name: 'Embedded Disk Card',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=300&auto=format&fit=crop&q=80',
    price: '₹1,250 / Piece',
    minOrder: 'Min. 50 Pieces',
  },
  {
    id: 'prod-4',
    name: 'Computer Chip IC',
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=300&auto=format&fit=crop&q=80',
    price: '₹450 / Piece',
    minOrder: 'Min. 100 Pieces',
  },
];

const TOP_RANKED_PRODUCTS = [
  {
    id: 'top-1',
    name: 'Communications Industrial Board',
    image: 'https://images.unsplash.com/photo-1517055729445-fa7d27394b48?w=400&auto=format&fit=crop&q=80',
    supplier: 'Vertex Power Systems Ltd',
    location: 'Makarpura GIDC, Vadodara',
  },
  {
    id: 'top-2',
    name: 'Professional Audio Control Board',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&auto=format&fit=crop&q=80',
    supplier: 'Matrix Audio Instruments',
    location: 'Manjusar GIDC, Vadodara',
  },
];

export default function B2BPortalPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [leadQty, setLeadQty] = useState('10');
  const [leadUnits, setLeadUnits] = useState('Units');
  const [postSuccess, setPostSuccess] = useState(false);

  const handlePostReq = (e: React.FormEvent) => {
    e.preventDefault();
    setPostSuccess(true);
    setTimeout(() => setPostSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-[#17181C] pb-28">
      {/* 1. TOP HEADER & LOCATION */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E3E8EF] shadow-2xs">
        <div className="max-w-xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="p-1 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div>
              <span className="text-[10px] text-[#687182] font-semibold block leading-tight">Location</span>
              <button className="flex items-center gap-1 text-xs font-black text-[#17181C]">
                Vadodara (390007)
                <ChevronDown className="w-3.5 h-3.5 text-[#4787F2]" />
              </button>
            </div>
          </div>

          <span className="bg-[#FFF1EE] border border-[#E14D2A]/30 text-[#E14D2A] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-2xs">
            1Cr+ B2B Portal
          </span>
        </div>

        {/* 2. SEARCH BAR WITH CAMERA & VOICE */}
        <div className="max-w-xl mx-auto px-4 pb-3">
          <div className="relative flex items-center bg-[#F4F6FB] border border-[#E3E8EF] rounded-2xl p-1 shadow-2xs">
            <div className="pl-2.5 pr-1.5 text-[#687182]">
              <Search className="w-4 h-4 text-[#4787F2]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search "Packaging Materials", "CNC Lathe"...'
              className="flex-1 bg-transparent text-xs sm:text-sm font-semibold text-[#17181C] placeholder:text-neutral-400 outline-none"
            />
            <div className="flex items-center gap-1 pr-2 text-[#687182]">
              <button className="p-1.5 rounded-full hover:bg-neutral-200/60 text-neutral-500">
                <Camera className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-full hover:bg-neutral-200/60 text-[#4787F2]">
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-3 space-y-4">
        {/* 3. HERO REQUIREMENT MATCHING CARDS */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {/* Requirement Prompt 1 */}
          <div className="min-w-[280px] sm:min-w-[320px] rounded-3xl p-4 bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] border border-[#C7D2FE] shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <p className="text-[11px] font-semibold text-[#4338CA]">
                Hi Business Owner, looking for
              </p>
              <h3 className="text-sm sm:text-base font-black text-[#1E1B4B] leading-tight mt-0.5">
                Vertex Media Technology Computer Consoles
              </h3>
            </div>

            <form onSubmit={handlePostReq} className="space-y-2">
              <span className="text-[10px] font-bold text-[#4338CA] block">What is the required quantity?</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={leadQty}
                  onChange={(e) => setLeadQty(e.target.value)}
                  className="w-16 px-2 py-1.5 bg-white border border-[#C7D2FE] rounded-xl text-xs font-bold text-center outline-none"
                />
                <select
                  value={leadUnits}
                  onChange={(e) => setLeadUnits(e.target.value)}
                  className="px-2 py-1.5 bg-white border border-[#C7D2FE] rounded-xl text-xs font-bold outline-none"
                >
                  <option>Units</option>
                  <option>Pieces</option>
                  <option>Tons</option>
                  <option>Kg</option>
                </select>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-[#4338CA] hover:bg-[#3730A3] text-white rounded-xl text-xs font-black shadow-xs transition-transform active:scale-95 whitespace-nowrap"
                >
                  Get Verified Sellers
                </button>
              </div>
            </form>
          </div>

          {/* Requirement Prompt 2 */}
          <div className="min-w-[280px] sm:min-w-[320px] rounded-3xl p-4 bg-gradient-to-br from-[#FFF1F2] to-[#FFE4E6] border border-[#FECDD3] shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold text-[#BE123C]">
                  Direct Factory Deals
                </p>
                <h3 className="text-sm sm:text-base font-black text-[#881337] leading-tight mt-0.5">
                  Industrial Packaging Corrugated Cartons
                </h3>
              </div>
              <img
                src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=120&auto=format&fit=crop&q=80"
                alt="Boxes"
                className="w-12 h-12 rounded-xl object-cover border border-white shadow-2xs shrink-0"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPostSuccess(true)}
                className="w-full py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl text-xs font-black shadow-xs transition-transform active:scale-95"
              >
                Request Free Instant Quotes
              </button>
            </div>
          </div>
        </div>

        {postSuccess && (
          <div className="p-3 bg-[#EBF9F3] border border-[#35AB4E]/30 rounded-2xl flex items-center gap-2 text-xs font-bold text-[#00A86B] animate-slide-up shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
            Requirement posted! 4 verified Vadodara GIDC manufacturers contacted.
          </div>
        )}

        {/* 4. ACTION BAR (All Categories & Post Requirement) */}
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href="/b2b/categories"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white border border-[#E3E8EF] shadow-2xs hover:border-[#4787F2] transition-all group active:scale-95"
          >
            <LayoutGrid className="w-4 h-4 text-[#4787F2] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black text-[#17181C]">All Categories</span>
          </Link>

          <button
            onClick={() => setPostSuccess(true)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white border border-[#E3E8EF] shadow-2xs hover:border-[#E14D2A] transition-all group active:scale-95"
          >
            <Send className="w-4 h-4 text-[#E14D2A] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black text-[#17181C]">Post Requirement</span>
          </button>
        </div>

        {/* 5. TOP B2B CATEGORY CIRCLES */}
        <div className="bg-white rounded-3xl p-4 border border-[#E3E8EF] shadow-2xs">
          <div className="grid grid-cols-4 gap-y-4 gap-x-2">
            {B2B_QUICK_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/b2b/categories?selected=${cat.id}`}
                className="flex flex-col items-center gap-1.5 group text-center"
              >
                <div className="relative w-14 h-14 rounded-full overflow-hidden p-0.5 bg-[#F4F6FB] border border-[#E3E8EF] group-hover:border-[#4787F2] group-hover:scale-105 transition-all shadow-2xs">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                  {cat.badge && (
                    <span className="absolute -top-1 right-0 bg-[#E14D2A] text-white text-[7px] font-black px-1 rounded-full uppercase">
                      {cat.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-[#17181C] group-hover:text-[#4787F2] leading-tight max-w-[70px]">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 6. CATEGORIES SIMILAR TO YOUR SEARCH */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#17181C]">
              Categories Similar To Your Search
            </h3>
            <Link href="/b2b/categories" className="text-neutral-400 hover:text-[#4787F2]">
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {SIMILAR_SEARCH_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-2 border border-[#E3E8EF] shadow-2xs flex flex-col items-center text-center gap-1.5 group cursor-pointer hover:border-[#4787F2] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F4F6FB] overflow-hidden flex items-center justify-center p-1">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover rounded-lg" />
                </div>
                <span className="text-[10px] font-bold text-[#17181C] leading-tight max-w-[70px] truncate">
                  {prod.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 7. TOP-RANKED CATEGORIES FOR YOU */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#17181C]">
              Top-Ranked Categories For You
            </h3>
            <Link href="/b2b/categories" className="text-neutral-400 hover:text-[#4787F2]">
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {TOP_RANKED_PRODUCTS.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#E3E8EF] shadow-2xs hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                <div className="h-32 w-full bg-[#F4F6FB] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-3 space-y-1">
                  <h4 className="text-xs font-black text-[#17181C] leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-[#687182] truncate">{item.supplier}</p>
                  <span className="text-[9px] text-[#4787F2] font-semibold flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" /> {item.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
