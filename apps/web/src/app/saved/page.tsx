'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@adsspot/api';
import { Card, Button } from '@adsspot/ui';
import { Bookmark, Sparkles, LogIn } from 'lucide-react';

export default function SavedPage() {
  const { user } = useAuth();
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchSavedData = async () => {
    if (!user) {
      setSavedPosts([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [interactRes, postsRes] = await Promise.all([
        fetch(`/api/interactions?userId=${encodeURIComponent(user.id)}`),
        fetch('/api/posts'),
      ]);

      const interactData = await interactRes.json();
      const postsData = await postsRes.json();

      const savedMap = interactData?.saved || {};
      const allPosts = postsData?.posts || [];

      const filtered = allPosts.filter((p: any) => savedMap[p.id]);
      setSavedPosts(filtered);
    } catch (err) {
      console.warn('[SavedPage] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchSavedData();
  }, [user]);

  const handleRemoveBookmark = async (postId: string) => {
    if (!user) return;
    setSavedPosts((prev) => prev.filter((p) => p.id !== postId));
    try {
      await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          userId: user.id,
          postId,
        }),
      });
    } catch (err) {
      console.warn('[SavedPage] Remove bookmark error:', err);
    }
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

  return (
    <div className="flex-1 bg-[#F4F6FB] pb-24 max-w-lg mx-auto w-full min-h-screen p-4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-[#17181C]">Saved Bookmarks</h1>
        <p className="text-xs text-[#687182]">Your bookmarked festival banners, shop offers &amp; digital cards</p>
      </div>

      {loading ? (
        <div className="p-8 bg-white rounded-3xl border border-[#E3E8EF] text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#4787F2] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#687182]">Loading saved deals...</p>
        </div>
      ) : savedPosts.length === 0 ? (
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
          {savedPosts.map((post) => (
            <Card key={post.id} padding="none" className="overflow-hidden shadow-sm">
              <img src={post.image_urls[0]} alt="Saved post" className="w-full h-48 object-cover" />
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#17181C]">{post.business_name}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleRemoveBookmark(post.id)}
                      className="text-[11px] font-bold text-[#981837] hover:underline"
                    >
                      Remove
                    </button>
                    <Link href={`/card/${post.business_slug || post.business_id}`} className="text-xs font-bold text-[#4787F2] hover:underline">
                      View Card →
                    </Link>
                  </div>
                </div>
                <p className="text-xs text-[#4A5260] line-clamp-2">{post.caption}</p>
              </div>
            </Card>
          ))}
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
