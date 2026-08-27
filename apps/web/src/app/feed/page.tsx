'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, SEED_BUSINESSES, SEED_POSTS, SEED_CATEGORIES } from '@adsspot/api';
import { Avatar, StorySpotRing } from '@adsspot/ui';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  Plus,
  CheckCircle,
  X,
  Send,
  Gift,
  QrCode,
  ShieldCheck,
  UserPlus,
  UserCheck,
  Clock,
} from 'lucide-react';

const WhatsAppIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const STORY_DATA = [
  {
    id: 'story-vad-1',
    businessId: 'biz-vad-1',
    name: 'Mandap Gujarati Thali',
    logo: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=200&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=1000&auto=format&fit=crop&q=80',
    tag: 'FESTIVAL',
    coupon: 'MANDAP15',
    caption: 'Royal Gujarati Grand Thali with authentic Puran Poli & Rasawala Khaman at Alkapuri!',
    time: '1h ago',
    location: 'Express Hotel, Alkapuri',
    phone: '+912652330720',
  },
  {
    id: 'story-vad-2',
    businessId: 'biz-vad-2',
    name: 'Jagdish Farshan',
    logo: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=200&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=1000&auto=format&fit=crop&q=80',
    tag: 'FRESH BATCH',
    coupon: 'JAGDISH10',
    caption: 'World-famous Vadodara special hot crispy Bhakarwadi freshly prepared in Pure Desi Ghee!',
    time: '2h ago',
    location: 'Jubilee Baug / Alkapuri',
    phone: '+912652410188',
  },
  {
    id: 'story-vad-3',
    businessId: 'biz-vad-3',
    name: 'C.H. Jewellers',
    logo: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1000&auto=format&fit=crop&q=80',
    tag: '20% OFF',
    coupon: 'CHJEWEL20',
    caption: 'Exclusive 20% Off making charges on 916 Hallmark Solitaire Diamond & Antique Bridal Sets!',
    time: '3h ago',
    location: 'CH House, Alkapuri',
    phone: '+912652300000',
  },
  {
    id: 'story-1',
    businessId: 'biz-elite-1',
    name: 'Royal Heritage Jewellers',
    logo: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1000&auto=format&fit=crop&q=80',
    tag: '20% OFF',
    coupon: 'ROYAL20',
    caption: 'Exclusive 20% Off making charges on 916 Hallmark Bridal Kundan Sets this festival week!',
    time: '4h ago',
    location: 'Zaveri Bazaar, Kalbadevi',
    phone: '+919876543213',
  },
];

const SPOT_DROPS = [
  {
    id: 'drop-1',
    businessId: 'biz-vad-1',
    businessName: 'Mandap Gujarati Thali',
    logo: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=200&auto=format&fit=crop&q=80',
    title: '40% OFF Royal Grand Thali',
    code: 'FLASH40',
    totalClaims: 15,
    claimedCount: 11,
    endTime: '01:45:20',
    location: 'Alkapuri, Vadodara',
  },
  {
    id: 'drop-2',
    businessId: 'biz-vad-2',
    businessName: 'Jagdish Farshan & Sweets',
    logo: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=200&auto=format&fit=crop&q=80',
    title: 'Buy 1kg Bhakarwadi Get 250g Free',
    code: 'JAGDISHBOGO',
    totalClaims: 20,
    claimedCount: 17,
    endTime: '02:10:45',
    location: 'Jubilee Baug, Vadodara',
  },
  {
    id: 'drop-3',
    businessId: 'biz-vad-3',
    businessName: 'C.H. Jewellers',
    logo: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&auto=format&fit=crop&q=80',
    title: 'Flat ₹2,500 Off Diamond Jewellery',
    code: 'CH2500',
    totalClaims: 10,
    claimedCount: 6,
    endTime: '03:30:15',
    location: 'Alkapuri, Vadodara',
  },
];

export default function MobileFeedPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [claimedDrops, setClaimedDrops] = useState<Record<string, boolean>>({});
  const [activeClaimModal, setActiveClaimModal] = useState<typeof SPOT_DROPS[0] | null>(null);

  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [doubleTapHeart, setDoubleTapHeart] = useState<string | null>(null);
  const [likesCounts, setLikesCounts] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    SEED_POSTS.forEach((p) => {
      init[p.id] = p.likes_count;
    });
    return init;
  });
  const [followingBiz, setFollowingBiz] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});

  // Dynamic Live Posts & Stories from PostgreSQL API
  const [livePosts, setLivePosts] = useState<any[]>(SEED_POSTS);
  const [liveStories, setLiveStories] = useState<any[]>(STORY_DATA);

  // Fetch live posts and stories
  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.posts && data.posts.length > 0) {
          setLivePosts(data.posts);
          setLikesCounts((prev) => {
            const next = { ...prev };
            data.posts.forEach((p: any) => {
              if (next[p.id] === undefined) next[p.id] = p.likes_count || 0;
            });
            return next;
          });
        }
      })
      .catch(() => {});

    fetch('/api/stories')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.stories && data.stories.length > 0) {
          // Format stories to match feed UI schema
          const mapped = data.stories.map((s: any) => {
            const biz = SEED_BUSINESSES.find((b) => b.id === s.business_id);
            return {
              id: s.id,
              businessId: s.business_id,
              name: s.business_name || biz?.name || 'Local Store',
              logo: s.business_logo || biz?.logo_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150',
              image: s.media_url,
              tag: s.tag || 'Flash Offer',
              coupon: s.coupon_code || 'SPECIAL20',
              caption: s.caption || 'Special 24-hour flash offer',
              time: 'Just now',
              location: biz?.address || 'Alkapuri, Vadodara',
              phone: biz?.phone || '+919876543210',
            };
          });
          setLiveStories(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Stories Player State
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState<number>(0);
  const [storyReactions, setStoryReactions] = useState<{ id: string; emoji: string }[]>([]);

  // Comments Sheet State
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [postComments, setPostComments] = useState<Record<string, { id: string; author: string; text: string; time: string }[]>>({
    'post-1': [
      { id: 'c-1', author: 'Pooja Nair', text: 'Stunning craftsmanship! Is this available in Kalbadevi store?', time: '1h ago' },
      { id: 'c-2', author: 'Aarav Sharma', text: 'Visited yesterday, hallmark certified quality is outstanding.', time: '30m ago' },
    ],
    'post-2': [
      { id: 'c-3', author: 'Rohan Deshmukh', text: 'Best Kesar Jalebis in South Mumbai without doubt 🔥', time: '2h ago' },
    ],
  });

  const [locationState, setLocationState] = useState({
    city: 'Vadodara',
    pincode: '390007',
    area: 'Alkapuri & Old Padra Road',
  });

  useEffect(() => {
    const updateLoc = () => {
      try {
        const storedLoc = localStorage.getItem('adsspot_user_location');
        if (storedLoc) {
          const parsed = JSON.parse(storedLoc);
          if (parsed.city) {
            setLocationState({
              city: parsed.city,
              pincode: parsed.pincode || '390007',
              area: parsed.area || 'Alkapuri',
            });
          }
        }
      } catch {}
    };
    updateLoc();
    window.addEventListener('adsspot_location_changed', updateLoc);
    return () => window.removeEventListener('adsspot_location_changed', updateLoc);
  }, []);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Story Auto-Advance Timer & Navbar Hide Signal
  useEffect(() => {
    // Notify floating bottom nav and navbar to hide/show during story playback
    const isStoryActive = activeStoryIndex !== null;
    window.dispatchEvent(new CustomEvent('adsspot_story_active', { detail: { active: isStoryActive } }));

    if (activeStoryIndex === null) return;
    setStoryProgress(0);
    const interval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          if (activeStoryIndex < liveStories.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, liveStories.length]);

  // Hydrate user interactions (Likes & Follows) from PostgreSQL database on mount
  useEffect(() => {
    if (user?.id) {
      fetch(`/api/interactions?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            if (data.likes && Object.keys(data.likes).length > 0) {
              setLikedPosts(data.likes);
            }
            if (data.follows && Object.keys(data.follows).length > 0) {
              setFollowingBiz(data.follows);
            }
          }
        })
        .catch(() => {});
    }
  }, [user?.id]);

  const handleToggleLike = (postId: string) => {
    const isLiked = !likedPosts[postId];
    // Optimistic UI update
    setLikedPosts((prev) => ({ ...prev, [postId]: isLiked }));
    setLikesCounts((c) => ({
      ...c,
      [postId]: (c[postId] || 0) + (isLiked ? 1 : -1),
    }));

    // Persist to PostgreSQL database
    if (user?.id) {
      fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like',
          userId: user.id,
          postId,
        }),
      }).catch((err) => console.error('Like persistence error:', err));
    }
  };

  const handleDoubleTapPost = (postId: string) => {
    if (!likedPosts[postId]) {
      handleToggleLike(postId);
    }
    setDoubleTapHeart(postId);
    setTimeout(() => setDoubleTapHeart(null), 800);
  };

  const handleToggleFollow = (bizId: string, bizName: string) => {
    const isFollowing = !followingBiz[bizId];
    // Optimistic UI update
    setFollowingBiz((prev) => ({ ...prev, [bizId]: isFollowing }));
    showToast(isFollowing ? `Following ${bizName}` : `Unfollowed ${bizName}`);

    // Persist to PostgreSQL database
    if (user?.id) {
      fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'follow',
          userId: user.id,
          businessId: bizId,
        }),
      }).catch((err) => console.error('Follow persistence error:', err));
    }
  };

  // Load user saved posts from localStorage
  useEffect(() => {
    if (!user) {
      setSavedPosts({});
      return;
    }
    const storageKey = `adsspot_saved_${user.id}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const arr: string[] = JSON.parse(stored);
        const map: Record<string, boolean> = {};
        arr.forEach((id) => {
          map[id] = true;
        });
        setSavedPosts(map);
      } catch {}
    } else if (user.id === 'usr-consumer-1') {
      setSavedPosts({ 'post-1': true, 'post-2': true });
      localStorage.setItem(storageKey, JSON.stringify(['post-1', 'post-2']));
    }
  }, [user]);

  const handleToggleSave = (postId: string) => {
    if (!user) {
      showToast('Please sign in to bookmark deals.');
      return;
    }
    setSavedPosts((prev) => {
      const isSaved = !prev[postId];
      showToast(isSaved ? 'Saved to Bookmarks' : 'Removed from Bookmarks');
      const nextMap = { ...prev, [postId]: isSaved };

      const activeIds = Object.keys(nextMap).filter((k) => nextMap[k]);
      localStorage.setItem(`adsspot_saved_${user.id}`, JSON.stringify(activeIds));
      return nextMap;
    });
  };

  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;
    const text = newCommentText.trim();
    const newComment = {
      id: `comm-${Date.now()}`,
      author: user?.full_name || 'Aarav Sharma',
      text,
      time: 'Just now',
    };
    
    // Optimistic UI update
    setPostComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));
    setNewCommentText('');
    showToast('Comment posted!');

    // Persist to PostgreSQL database
    if (user?.id) {
      fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'comment',
          userId: user.id,
          postId,
          content: text,
        }),
      }).catch((err) => console.error('Comment persistence error:', err));
    }
  };

  const handleSendStoryReaction = (emoji: string) => {
    const reactionId = `react-${Date.now()}`;
    setStoryReactions((prev) => [...prev, { id: reactionId, emoji }]);
    setTimeout(() => {
      setStoryReactions((prev) => prev.filter((r) => r.id !== reactionId));
    }, 1500);
  };

  const filteredPosts = livePosts.filter((post) => {
    const biz = SEED_BUSINESSES.find((b) => b.id === post.business_id);
    if (!biz) return true;
    return selectedCategory === 'all' || biz.category_id === selectedCategory;
  });

  const currentActiveStory = activeStoryIndex !== null ? liveStories[activeStoryIndex] : null;

  return (
    <div className="flex-1 bg-[#F8FAFC] dark:bg-[#0B0E14] pb-28 md:pb-16 min-h-screen relative transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 transform -translate-x-1/2 z-50 bg-[#17181C] text-white text-[11px] font-semibold px-3.5 py-2 rounded-full shadow-lg flex items-center gap-1.5 border border-neutral-700 animate-fade-in whitespace-nowrap">
          <CheckCircle className="w-3.5 h-3.5 text-[#35AB4E]" />
          {toastMessage}
        </div>
      )}

      {/* 🌟 IMMERSIVE FULL-SCREEN STORY VIEWER */}
      {currentActiveStory && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveStoryIndex(null);
          }}
        >
          <div className="relative w-full h-full sm:h-[90vh] sm:max-w-sm bg-[#17181C] sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none">
            {/* Story Floating Reactions Animation */}
            {storyReactions.map((r) => (
              <div
                key={r.id}
                className="absolute bottom-28 right-8 text-4xl animate-float-up pointer-events-none z-40 drop-shadow-md"
              >
                {r.emoji}
              </div>
            ))}

            {/* Story Progress Segments */}
            <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5 pointer-events-none">
              {liveStories.map((s, idx) => (
                <div key={s.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-xs">
                  <div
                    className="h-full bg-white transition-all duration-100 ease-linear rounded-full shadow-xs"
                    style={{
                      width:
                        idx < activeStoryIndex!
                          ? '100%'
                          : idx === activeStoryIndex!
                            ? `${storyProgress}%`
                            : '0%',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Top Bar: Author Info, Time, Close */}
            <div className="relative z-30 flex items-center justify-between p-4 pt-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
              <div className="flex items-center gap-2.5">
                <StorySpotRing size={38} imageSrc={currentActiveStory.logo} alt={currentActiveStory.name} />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white leading-tight drop-shadow-xs">{currentActiveStory.name}</span>
                    <span className="text-[9px] bg-[#981837] text-white px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider">
                      Elite
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-white/80 font-medium">
                    <Clock className="w-2.5 h-2.5" /> {currentActiveStory.time} • {currentActiveStory.location}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveStoryIndex(null)}
                className="text-white hover:bg-white/20 p-2 rounded-full bg-black/40 backdrop-blur-md transition-all active:scale-95 shrink-0"
                aria-label="Close story"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Story Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              <img
                src={currentActiveStory.image}
                alt={currentActiveStory.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/40" />
            </div>

            {/* Tap Zones: Left (Previous) & Right (Next) */}
            <div
              className="absolute left-0 top-16 bottom-36 w-1/2 z-20 cursor-pointer"
              onClick={() => {
                if (activeStoryIndex! > 0) setActiveStoryIndex(activeStoryIndex! - 1);
              }}
              title="Previous Story"
            />
            <div
              className="absolute right-0 top-16 bottom-36 w-1/2 z-20 cursor-pointer"
              onClick={() => {
                if (activeStoryIndex! < liveStories.length - 1) setActiveStoryIndex(activeStoryIndex! + 1);
                else setActiveStoryIndex(null);
              }}
              title="Next Story"
            />

            {/* Story Caption & Action */}
            <div className="relative z-30 p-4 space-y-3 bg-gradient-to-t from-black via-black/85 to-transparent">
              <p className="text-xs text-white leading-relaxed font-medium bg-black/50 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg">
                {currentActiveStory.caption}
              </p>

              {/* Reactions */}
              <div className="flex items-center justify-between px-2 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/15">
                {['❤️', '🔥', '😍', '👏', '🎉'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleSendStoryReaction(emoji)}
                    className="text-xl p-1.5 hover:scale-125 transition-transform active:scale-95"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Offer CTA */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    showToast(`Coupon ${currentActiveStory.coupon} claimed!`);
                  }}
                  className="flex-1 py-3 rounded-full bg-[#4787F2] hover:bg-[#3972D4] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-95"
                >
                  <Gift className="w-4 h-4" /> Claim {currentActiveStory.coupon}
                </button>
                <a
                  href={`https://wa.me/${currentActiveStory.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(currentActiveStory.name)},%20I%20saw%20your%20story%20on%20Adsspot!`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center shadow-lg gap-1.5 transition-transform active:scale-95"
                >
                  <WhatsAppIcon size={18} className="text-white" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 COMMENTS DRAWER */}
      {openCommentsPostId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-[#141824] w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-4 shadow-xl border border-[#E3E8EF] dark:border-white/10 max-h-[70vh] flex flex-col justify-between animate-slide-up">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E3E8EF] dark:border-white/10">
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#4787F2]" />
                <h3 className="text-xs font-bold text-[#17181C] dark:text-white">Comments</h3>
              </div>
              <button onClick={() => setOpenCommentsPostId(null)} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1">
              {(postComments[openCommentsPostId] || []).map((comm) => (
                <div key={comm.id} className="p-2.5 bg-[#F4F6FB] dark:bg-[#1A2130] rounded-xl text-xs space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#17181C] dark:text-white text-[11px]">{comm.author}</span>
                    <span className="text-[9px] text-[#687182] dark:text-neutral-400">{comm.time}</span>
                  </div>
                  <p className="text-[#4A5260] dark:text-neutral-300 text-[11px]">{comm.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E3E8EF] dark:border-white/10 flex gap-1.5">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddComment(openCommentsPostId);
                }}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-1.5 rounded-full border border-[#E3E8EF] dark:border-white/15 text-xs outline-none focus:border-[#4787F2] dark:bg-[#1A2130] dark:text-white"
              />
              <button
                onClick={() => handleAddComment(openCommentsPostId)}
                className="p-1.5 rounded-full bg-[#4787F2] text-white"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 RESPONSIVE MULTI-COLUMN CONTAINER (Mobile App on Phone, Expansive 3-Column on Desktop) */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-6 flex justify-center gap-6 items-start">
        {/* =========================================================================
            LEFT COLUMN (Desktop Navigation & Territory Rail - Visible on lg+)
            ========================================================================= */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 space-y-4 sticky top-20">
          {/* Quick Profile Summary Card */}
          <div className="ios-glass-card rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar src={user?.avatar_url || undefined} name={user?.full_name || 'Consumer Guest'} size="md" />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#17181C] dark:text-white truncate">
                  {user?.full_name || 'Welcome to Adsspot'}
                </h4>
                <span className="text-[10px] text-[#4787F2] font-semibold block capitalize">
                  {user?.role || 'Guest Explorer'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E3E8EF] dark:border-white/10 flex items-center justify-between text-xs">
              <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Saved Spots</span>
              <span className="font-bold text-[#17181C] dark:text-white">{Object.keys(savedPosts).length}</span>
            </div>

            <Link
              href="/explore"
              className="w-full py-2 rounded-xl bg-[#4787F2] hover:bg-[#3373E0] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <span>Explore Interactive Map</span>
            </Link>
          </div>

          {/* Quick Category Navigation */}
          <div className="ios-glass-card rounded-2xl p-3.5 space-y-2">
            <span className="text-[10px] font-black uppercase text-[#687182] dark:text-neutral-400 px-1 block tracking-wider">
              Browse Categories
            </span>
            <div className="space-y-1">
              {SEED_CATEGORIES.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                    selectedCategory === cat.id
                      ? 'bg-[#4787F2] text-white font-bold'
                      : 'hover:bg-[#F4F6FB] dark:hover:bg-white/5 text-[#17181C] dark:text-neutral-200'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-70">→</span>
                </button>
              ))}
              <Link
                href="/b2b"
                className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-[#E14D2A] bg-[#FFF1EE] dark:bg-[#2A1016] hover:bg-[#FFE4DE] transition-colors"
              >
                <span>B2B Direct Factory Portal</span>
                <span className="text-[9px] bg-[#E14D2A] text-white px-1.5 rounded-full">1Cr+</span>
              </Link>
            </div>
          </div>

          {/* Territory & City Badge */}
          <div className="ios-glass-card rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#17181C] dark:text-white">
              <MapPin className="w-4 h-4 text-[#4787F2]" />
              <span>{locationState.city} Territory</span>
            </div>
            <p className="text-[11px] text-[#687182] dark:text-neutral-400">
              Covering pincodes {locationState.pincode}, 390001, 390020 with verified local stores.
            </p>
          </div>
        </aside>

        {/* =========================================================================
            CENTER COLUMN (Main Interactive Feed Stream - Mobile & Desktop)
            ========================================================================= */}
        <div className="w-full max-w-md sm:max-w-xl shrink-0 space-y-3.5">
          {/* 1. TOP LOCATION & SEARCH BAR — Glassmorphic Universal Search */}
          <div className="sticky top-0 z-30 ios-glass-card rounded-2xl p-3 shadow-sm space-y-2 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-[#17181C] dark:text-white font-bold min-w-0 flex-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#4787F2] shrink-0" />
                <span className="truncate">
                  {locationState.area}, {locationState.city}{' '}
                  <span className="text-neutral-400 font-normal">({locationState.pincode})</span>
                </span>
              </div>
              <span className="shrink-0 text-[10px] font-black text-[#E14D2A] bg-[#FFF1EE] dark:bg-[#2A1016] px-2.5 py-0.5 rounded-full border border-[#E14D2A]/30">
                🔥 3 Live Drops
              </span>
            </div>

            {/* Universal Search Bar */}
            <div className="relative">
              <div className="flex items-center bg-[#F4F6FB] dark:bg-[#171C28] border border-[#E3E8EF] dark:border-white/15 rounded-2xl px-3 py-2 shadow-2xs focus-within:border-[#4787F2] focus-within:ring-2 focus-within:ring-[#4787F2]/15 transition-all">
                <span className="text-neutral-400 mr-2">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search shops, thalis, doctors, B2B factories..."
                  className="w-full bg-transparent text-xs font-semibold text-[#17181C] dark:text-white placeholder:text-neutral-400 outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-neutral-400 text-xs font-bold hover:text-neutral-600 dark:hover:text-white">
                    ✕
                  </button>
                )}
              </div>

              {/* Grouped Universal Search Dropdown */}
              {isSearchFocused && searchQuery.trim() !== '' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#141824] border border-[#E3E8EF] dark:border-white/15 rounded-2xl shadow-xl overflow-hidden z-40 p-2 space-y-2 animate-fade-in max-h-80 overflow-y-auto">
                  <div>
                    <span className="text-[9px] font-black uppercase text-[#687182] dark:text-neutral-400 px-2 block">Verified Spots</span>
                    {SEED_BUSINESSES.filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map((biz) => (
                      <Link
                        key={biz.id}
                        href={`/card/${biz.slug}`}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F4F6FB] dark:hover:bg-white/5 text-xs font-bold text-[#17181C] dark:text-white transition-colors"
                      >
                        <span>{biz.name}</span>
                        <span className="text-[10px] text-[#4787F2] font-semibold">{biz.address}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-neutral-100 dark:border-white/10 pt-1">
                    <span className="text-[9px] font-black uppercase text-[#E14D2A] px-2 block">B2B Suppliers</span>
                    <Link
                      href={`/b2b?q=${encodeURIComponent(searchQuery)}`}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#FFF1EE] dark:bg-[#2A1016] hover:bg-[#FFE4DE] text-xs font-bold text-[#E14D2A] transition-colors"
                    >
                      <span>Search &quot;{searchQuery}&quot; in B2B Factory Portal</span>
                      <span className="text-[10px] font-black">1Cr+ →</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. STORIES RAIL */}
          <div className="ios-glass-card rounded-2xl py-3 border border-[#E3E8EF] dark:border-white/10 shadow-xs">
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 items-center">
              {/* Add story / User avatar */}
              <div
                onClick={() => showToast('Stories are exclusive to Elite Merchants (Max 1/day)')}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
              >
                <div className="relative w-[58px] h-[58px] rounded-[16px] border-2 border-dashed border-[#4787F2] p-0.5 flex items-center justify-center shrink-0 bg-[#EDF4FF]/60 dark:bg-[#4787F2]/10 group-hover:border-[#3972D4] transition-all group-active:scale-95">
                  <Avatar src={user?.avatar_url || undefined} name={user?.full_name} size="md" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#4787F2] text-white flex items-center justify-center border-2 border-white dark:border-neutral-900 shadow-sm">
                    <Plus className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
                <span className="text-[11px] text-neutral-600 dark:text-neutral-300 font-semibold tracking-tight">Your Story</span>
              </div>

              {/* Business Stories with Authentic 4-Segment Spot Ring */}
              {liveStories.map((story, idx) => (
                <div
                  key={story.id}
                  onClick={() => setActiveStoryIndex(idx)}
                  className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                >
                  <div className="transform group-hover:scale-105 group-active:scale-95 transition-transform drop-shadow-sm">
                    <StorySpotRing size={58} imageSrc={story.logo} alt={story.name} />
                  </div>
                  <span className="text-[11px] text-[#17181C] dark:text-neutral-100 font-bold truncate max-w-[62px] text-center leading-tight tracking-tight">
                    {story.name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

      {/* 2.5 🔥 SPOT DROPS FLASH HOURLY DEALS (Feature A) */}
      <div className="bg-gradient-to-r from-[#FFF5F2]/80 via-[#FFF1EE]/80 to-[#FFEFEA]/80 dark:from-[#251016]/90 dark:via-[#1F0C12]/90 dark:to-[#220E14]/90 p-3 border-b border-[#FECDD3] dark:border-rose-950/60 space-y-2 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-ping" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#9F1239] dark:text-rose-400">
              ⚡ Spot Drops — Hourly Flash Offers
            </h3>
          </div>
          <span className="text-[10px] font-bold text-[#E11D48] dark:text-rose-300 bg-white dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-[#FECDD3] dark:border-rose-800/40 shadow-2xs">
            Limited Stock
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {SPOT_DROPS.map((drop) => {
            const isClaimed = !!claimedDrops[drop.id];
            const pct = Math.round((drop.claimedCount / drop.totalClaims) * 100);

            return (
              <div
                key={drop.id}
                className="min-w-[260px] sm:min-w-[280px] ios-glass-card rounded-2xl p-3 border border-[#FECDD3] shadow-sm flex flex-col justify-between space-y-2 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-2.5">
                  <img src={drop.logo} alt={drop.businessName} className="w-10 h-10 rounded-xl object-cover border border-neutral-100" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-[#687182] font-semibold block truncate">{drop.businessName}</span>
                    <h4 className="text-xs font-black text-[#17181C] leading-tight truncate">{drop.title}</h4>
                    <span className="text-[9px] text-[#E11D48] font-bold">Ends in {drop.endTime}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-[#687182]">
                    <span>Claimed: {drop.claimedCount}/{drop.totalClaims}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#E14D2A] to-[#E11D48] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setClaimedDrops((prev) => ({ ...prev, [drop.id]: true }));
                    setActiveClaimModal(drop);
                  }}
                  className={`w-full py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-2xs ${
                    isClaimed
                      ? 'bg-[#EBF9EE] text-[#35AB4E] border border-[#35AB4E]/30'
                      : 'bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-xs'
                  }`}
                >
                  {isClaimed ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" /> Coupon Active ({drop.code})
                    </>
                  ) : (
                    <>
                      <span>Claim Spot Drop</span>
                      <Gift className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spot Drop Claim Modal */}
      {activeClaimModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="ios-glass-card bg-white/95 w-full max-w-sm rounded-3xl p-5 border border-white/80 shadow-2xl text-center space-y-4 animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-[#EBF9EE] text-[#35AB4E] flex items-center justify-center mx-auto shadow-sm">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-[#35AB4E] tracking-wider">Spot Drop Claimed!</span>
              <h3 className="text-base font-black text-[#17181C] mt-0.5">{activeClaimModal.title}</h3>
              <p className="text-xs text-[#687182] mt-1">{activeClaimModal.businessName} — {activeClaimModal.location}</p>
            </div>

            <div className="p-3 bg-[#F4F6FB] border border-dashed border-[#4787F2] rounded-2xl space-y-1">
              <span className="text-[10px] font-bold text-[#687182] block">Show this voucher code at store:</span>
              <span className="text-lg font-black text-[#4787F2] tracking-widest block font-mono">{activeClaimModal.code}</span>
            </div>

            <div className="flex gap-2">
              <a
                href={`https://wa.me/919876543210?text=Hi%20${encodeURIComponent(activeClaimModal.businessName)},%20I%20claimed%20the%20Spot%20Drop%20voucher%20${activeClaimModal.code}%20on%20Adsspot.`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-xs"
              >
                <span>WhatsApp Store</span>
              </a>
              <button
                onClick={() => setActiveClaimModal(null)}
                className="px-4 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-200"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CATEGORY PILLS */}
      <div className="py-2.5 px-3 sm:px-4 flex gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 sm:px-3.5 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#17181C] dark:bg-[#4787F2] text-white shadow-xs'
              : 'ios-glass-card text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white'
          }`}
        >
          All
        </button>
        {SEED_CATEGORIES.map((cat) => {
          if (cat.id === 'cat-b2b') {
            return (
              <Link
                key={cat.id}
                href="/b2b"
                className="px-3 sm:px-3.5 py-1 rounded-full text-xs font-black shrink-0 transition-all bg-[#FFF1EE] dark:bg-[#2A1016] text-[#E14D2A] dark:text-rose-400 border border-[#E14D2A]/30 dark:border-rose-800/40 hover:bg-[#FFE4DE] dark:hover:bg-[#38141D] flex items-center gap-1 shadow-2xs"
              >
                <span>B2b</span>
                <span className="bg-[#E14D2A] text-white text-[8px] px-1 rounded-full">1Cr+</span>
              </Link>
            );
          }

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 sm:px-3.5 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#17181C] dark:bg-[#4787F2] text-white shadow-xs'
                  : 'ios-glass-card text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* 4. POSTS WITH AUTHENTIC ICONS */}
      <div className="px-2.5 sm:px-3 pb-4 space-y-3.5">
        {filteredPosts.map((post) => {
          const fallbackBiz = SEED_BUSINESSES[0]!;
          const biz = SEED_BUSINESSES.find((b) => b.id === post.business_id) ?? fallbackBiz;
          const isLiked = !!likedPosts[post.id];
          const likesCount = likesCounts[post.id] ?? post.likes_count;
          const isFollowing = !!followingBiz[biz.id];
          const isSaved = !!savedPosts[post.id];
          const commentsCount = (postComments[post.id] || []).length + post.comments_count;

          return (
            <div
              key={post.id}
              className="ios-glass-card rounded-3xl overflow-hidden"
            >
              {/* Post Header with Compact Follow Icon Button */}
              <div className="p-3 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <Avatar src={biz.logo_url} name={biz.name} size="sm" isElite={biz.tier === 'elite'} />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/card/${biz.slug}`}
                      className="font-bold text-xs text-[#17181C] dark:text-neutral-100 hover:text-[#4787F2] dark:hover:text-[#4787F2] leading-snug block break-words"
                    >
                      {biz.name}
                    </Link>
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      <span className="truncate">{biz.address}</span>
                      {biz.trusted && (
                        <span className="text-[#35AB4E] dark:text-[#4ade80] font-bold flex items-center gap-0.5 shrink-0">
                          <ShieldCheck className="w-3 h-3 text-[#35AB4E] dark:text-[#4ade80]" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Minimalist Follow Icon Button */}
                <button
                  onClick={() => handleToggleFollow(biz.id, biz.name)}
                  title={isFollowing ? 'Following' : 'Follow'}
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isFollowing
                      ? 'bg-[#EBF9EE] dark:bg-[#13301D] text-[#35AB4E] dark:text-[#4ade80] border border-[#35AB4E]/30 dark:border-[#4ade80]/30 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      : 'bg-[#EDF4FF] dark:bg-[#172642] text-[#4787F2] dark:text-[#93C5FD] hover:bg-[#D9E8FF] dark:hover:bg-[#1E335A] border border-[#4787F2]/20 active:scale-95'
                  }`}
                >
                  {isFollowing ? (
                    <UserCheck className="w-4 h-4" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Post Media (4:3 Aspect Ratio for clean scaling on all phones) */}
              <div
                className="relative w-full aspect-[4/3] overflow-hidden cursor-pointer bg-neutral-100 dark:bg-neutral-900"
                onDoubleClick={() => handleDoubleTapPost(post.id)}
              >
                <img
                  src={post.image_urls[0]}
                  alt="Post"
                  className="w-full h-full object-cover"
                />

                {doubleTapHeart === post.id && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
                    <Heart className="w-16 h-16 text-white fill-red-500 stroke-red-500 drop-shadow-xl" />
                  </div>
                )}
              </div>

              {/* Minimalist Action Bar with Authentic WhatsApp and Card Icons */}
              <div className="p-3 pb-1.5 flex items-center justify-between gap-2 text-neutral-700 dark:text-neutral-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className="flex items-center gap-1 text-xs font-semibold transition-transform active:scale-125"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isLiked ? 'text-red-500 fill-red-500' : 'hover:text-red-500'
                      }`}
                    />
                    <span className={isLiked ? 'text-red-500 font-bold' : 'text-neutral-700 dark:text-neutral-200'}>{likesCount}</span>
                  </button>

                  <button
                    onClick={() => setOpenCommentsPostId(post.id)}
                    className="flex items-center gap-1 text-xs font-semibold hover:text-[#4787F2] dark:hover:text-[#4787F2]"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{commentsCount}</span>
                  </button>

                  <button onClick={() => handleToggleSave(post.id)} className="hover:text-[#4787F2] dark:hover:text-[#4787F2]">
                    <Bookmark
                      className={`w-5 h-5 ${isSaved ? 'text-[#4787F2] fill-[#4787F2]' : ''}`}
                    />
                  </button>

                  <button onClick={() => showToast('Post link copied!')} className="hover:text-[#4787F2] dark:hover:text-[#4787F2]">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Direct Visiting Card and Authentic WhatsApp Icons */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/card/${biz.slug}`}
                    title="Digital Visiting Card"
                    className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 flex items-center justify-center transition-all active:scale-95 shadow-xs"
                  >
                    <QrCode className="w-4.5 h-4.5 text-neutral-700 dark:text-neutral-200" />
                  </Link>

                  <a
                    href={`https://wa.me/${biz.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(biz.name)},%20I%20saw%20your%20post%20on%20Adsspot!`}
                    target="_blank"
                    rel="noreferrer"
                    title="Chat on WhatsApp"
                    className="w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center transition-all active:scale-95 shadow-xs"
                  >
                    <WhatsAppIcon size={18} className="text-white" />
                  </a>
                </div>
              </div>

              {/* Post Caption */}
              <div className="px-3 pb-3 space-y-1">
                <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed break-words">
                  <span className="font-bold text-[#17181C] dark:text-white mr-1">{biz.name}</span>
                  {post.caption}
                </p>

                <button
                  onClick={() => setOpenCommentsPostId(post.id)}
                  className="text-[11px] text-neutral-400 dark:text-neutral-400 font-semibold hover:text-[#4787F2] dark:hover:text-[#4787F2] block"
                >
                  View all {commentsCount} comments
                </button>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* =========================================================================
          RIGHT COLUMN (Desktop Spotlight & Live Drops Rail - Visible on md+)
          ========================================================================= */}
      <aside className="hidden md:flex flex-col w-72 lg:w-80 shrink-0 space-y-4 sticky top-20">
        {/* Elite Spotlight Card */}
        <div className="ios-glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-[#F2B604] tracking-wider flex items-center gap-1">
              <span>👑</span> Elite Spotlight
            </span>
            <span className="text-[9px] bg-[#EBF9EE] text-[#35AB4E] px-2 py-0.5 rounded-full font-bold">
              Verified
            </span>
          </div>

          <div className="space-y-2.5">
            {SEED_BUSINESSES.filter((b) => b.tier === 'elite').slice(0, 3).map((eliteBiz) => (
              <div key={eliteBiz.id} className="flex items-center justify-between p-2 rounded-xl bg-[#F4F6FB] dark:bg-white/5 hover:bg-[#EDF4FF]/50 transition-all group">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar src={eliteBiz.logo_url} name={eliteBiz.name} size="sm" isElite={true} />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-[#17181C] dark:text-white truncate group-hover:text-[#4787F2]">
                      {eliteBiz.name}
                    </h5>
                    <span className="text-[10px] text-[#687182] dark:text-neutral-400 truncate block">
                      {eliteBiz.address}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/b/${eliteBiz.slug}`}
                  className="px-2.5 py-1 rounded-full bg-[#4787F2] text-white text-[10px] font-bold shrink-0 hover:bg-[#3373E0] shadow-xs"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Download App QR Code Card */}
        <div className="ios-glass-card rounded-2xl p-4 text-center space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EDF4FF] dark:bg-[#4787F2]/20 text-[#4787F2] flex items-center justify-center mx-auto">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-[#17181C] dark:text-white">Experience on Mobile</h4>
            <p className="text-[11px] text-[#687182] dark:text-neutral-400 mt-0.5">
              Scan with phone camera for GPS exploration &amp; daily story drops.
            </p>
          </div>
          <Link
            href="/download"
            className="w-full py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:opacity-90 transition-all"
          >
            <span>Get APK &amp; PWA App</span>
          </Link>
        </div>

        {/* Merchant Onboarding Card */}
        <div className="ios-glass-card rounded-2xl p-4 space-y-2 bg-gradient-to-br from-[#4787F2]/10 to-transparent border border-[#4787F2]/20">
          <span className="text-[10px] font-black uppercase text-[#4787F2] tracking-wider block">Grow Your Store</span>
          <h4 className="text-xs font-black text-[#17181C] dark:text-white">Are you a Business Owner?</h4>
          <p className="text-[11px] text-[#687182] dark:text-neutral-400">
            List your shop, launch festival banners, and get discovered by thousands in your pincode.
          </p>
          <Link
            href="/onboard"
            className="w-full py-2 rounded-xl bg-[#4787F2] hover:bg-[#3373E0] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95 block text-center mt-2"
          >
            Claim Your Spot Free →
          </Link>
        </div>
      </aside>
    </div>
  </div>
  );
}
