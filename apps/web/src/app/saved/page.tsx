'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, SEED_POSTS, SEED_BUSINESSES } from '@adsspot/api';
import { Card, Button } from '@adsspot/ui';
import { Bookmark, Sparkles, LogIn } from 'lucide-react';

export default function SavedPage() {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      setSavedIds([]);
      return;
    }

    const storageKey = `adsspot_saved_${user.id}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedIds(parsed);
          return;
        }
      } catch {}
    }

    // Only demo consumer user has initial starter bookmarks; new users start with 0
    if (user.id === 'usr-consumer-1') {
      const demoSaved = ['post-1', 'post-2'];
      setSavedIds(demoSaved);
      localStorage.setItem(storageKey, JSON.stringify(demoSaved));
    } else {
      setSavedIds([]);
    }
  }, [user]);

  const handleRemoveBookmark = (postId: string) => {
    if (!user) return;
    const next = savedIds.filter((id) => id !== postId);
    setSavedIds(next);
    localStorage.setItem(`adsspot_saved_${user.id}`, JSON.stringify(next));
  };

  if (!mounted) return null;

  if (!user) {
    return (
      <div className="flex-1 bg-[#F4F6FB] pb-24 max-w-lg mx-auto w-full min-h-screen p-4 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white border border-[#E3E8EF] flex items-center justify-center text-[#4787F2] shadow-sm">
          <Bookmark className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-black text-[#17181C]">Sign In to View Saved Deals</h1>
        <p className="text-xs text-[#687182] max-w-xs">
          Bookmark festival banners, boutique discounts, and digital visiting cards in your pincode.
        </p>
        <Link href="/login">
          <Button variant="primary" size="md" leftIcon={<LogIn className="w-4 h-4" />}>
            Sign In with Phone
          </Button>
        </Link>
      </div>
    );
  }

  const savedPosts = SEED_POSTS.filter((p) => savedIds.includes(p.id));

  return (
    <div className="flex-1 bg-[#F4F6FB] pb-24 max-w-lg mx-auto w-full min-h-screen p-4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-[#17181C]">Saved Bookmarks</h1>
        <p className="text-xs text-[#687182]">Your bookmarked festival banners, shop offers &amp; digital cards</p>
      </div>

      {savedPosts.length === 0 ? (
        <div className="p-8 bg-white rounded-3xl border border-[#E3E8EF] text-center space-y-3">
          <Bookmark className="w-10 h-10 text-[#687182] mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-[#17181C]">No Bookmarks Saved Yet</h3>
          <p className="text-xs text-[#687182] max-w-xs mx-auto">
            Tap the bookmark ribbon on any feed post or store offer to save it here for later.
          </p>
          <Link href="/feed">
            <Button variant="primary" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
              Explore Live Feed
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {savedPosts.map((post) => {
            const biz = SEED_BUSINESSES.find((b) => b.id === post.business_id) || SEED_BUSINESSES[0]!;
            return (
              <Card key={post.id} padding="none" className="overflow-hidden shadow-sm">
                <img src={post.image_urls[0]} alt="Saved post" className="w-full h-48 object-cover" />
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#17181C]">{biz.name}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleRemoveBookmark(post.id)}
                        className="text-[11px] font-bold text-[#981837] hover:underline"
                      >
                        Remove
                      </button>
                      <Link href={`/card/${biz.slug}`} className="text-xs font-bold text-[#4787F2] hover:underline">
                        View Card →
                      </Link>
                    </div>
                  </div>
                  <p className="text-xs text-[#4A5260] line-clamp-2">{post.caption}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

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
