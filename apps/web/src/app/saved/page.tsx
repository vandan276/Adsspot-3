'use client';

import React from 'react';
import Link from 'next/link';
import { SEED_POSTS, SEED_BUSINESSES } from '@adsspot/api';
import { Card, Button } from '@adsspot/ui';
import { Bookmark } from 'lucide-react';

export default function SavedPage() {
  const savedPosts = SEED_POSTS.slice(0, 2);

  return (
    <div className="flex-1 bg-[#F4F6FB] pb-24 max-w-lg mx-auto w-full min-h-screen p-4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-[#17181C]">Saved Bookmarks</h1>
        <p className="text-xs text-[#687182]">Your bookmarked festival banners, shop offers &amp; digital cards</p>
      </div>

      <div className="space-y-4">
        {savedPosts.map((post) => {
          const biz = SEED_BUSINESSES.find((b) => b.id === post.business_id) || SEED_BUSINESSES[0]!;
          return (
            <Card key={post.id} padding="none" className="overflow-hidden shadow-sm">
              <img src={post.image_urls[0]} alt="Saved post" className="w-full h-48 object-cover" />
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#17181C]">{biz.name}</span>
                  <Link href={`/card/${biz.slug}`} className="text-xs font-bold text-[#4787F2] hover:underline">
                    View Card →
                  </Link>
                </div>
                <p className="text-xs text-[#4A5260] line-clamp-2">{post.caption}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="p-6 bg-white rounded-3xl border border-[#E3E8EF] text-center space-y-3">
        <Bookmark className="w-8 h-8 text-[#4787F2] mx-auto" />
        <h3 className="text-sm font-bold text-[#17181C]">Looking for More Deals?</h3>
        <p className="text-xs text-[#687182]">Explore trending stores and save their festival discount codes</p>
        <Link href="/feed">
          <Button variant="primary" size="sm">
            Browse Live Feed
          </Button>
        </Link>
      </div>
    </div>
  );
}
