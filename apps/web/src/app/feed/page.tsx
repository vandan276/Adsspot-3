'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  useAuth,
  SEED_BUSINESSES,
  SEED_POSTS,
  SEED_CATEGORIES,
  toggleLikePost,
  addCommentToPost,
  fetchPostComments,
  toggleSavePost,
  toggleFollowBusiness,
} from '@adsspot/api';
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
  Copy,
  Check,
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

export default function MobileFeedPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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

  // Stories Player State
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState<number>(0);
  const [storyReactions, setStoryReactions] = useState<{ id: string; emoji: string }[]>([]);

  // Comments Sheet State
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);

  // Share Modal & Link Copy state
  const [openSharePost, setOpenSharePost] = useState<{ id: string; bizName: string; caption: string; slug: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
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
          if (activeStoryIndex < STORY_DATA.length - 1) {
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
  }, [activeStoryIndex]);

  const handleToggleLike = async (postId: string) => {
    const isCurrentlyLiked = !!likedPosts[postId];
    const newLikedState = !isCurrentlyLiked;

    // Optimistic UI update
    setLikedPosts((prev) => {
      const nextMap = { ...prev, [postId]: newLikedState };
      const key = user ? `adsspot_likes_${user.id}` : 'adsspot_likes_guest';
      localStorage.setItem(key, JSON.stringify(nextMap));
      return nextMap;
    });

    setLikesCounts((c) => ({
      ...c,
      [postId]: (c[postId] || 0) + (newLikedState ? 1 : -1),
    }));

    if (user?.id) {
      await toggleLikePost(user.id, postId, isCurrentlyLiked);
    }
  };

  const handleDoubleTapPost = (postId: string) => {
    if (!likedPosts[postId]) {
      handleToggleLike(postId);
    }
    setDoubleTapHeart(postId);
    setTimeout(() => setDoubleTapHeart(null), 800);
  };

  const handleToggleFollow = async (bizId: string, bizName: string) => {
    const isCurrentlyFollowing = !!followingBiz[bizId];
    const newFollowingState = !isCurrentlyFollowing;

    setFollowingBiz((prev) => ({ ...prev, [bizId]: newFollowingState }));
    showToast(newFollowingState ? `Following ${bizName}` : `Unfollowed ${bizName}`);

    if (user?.id) {
      await toggleFollowBusiness(user.id, bizId, isCurrentlyFollowing);
    }
  };

  // Helper function to format comment timestamps into readable relative time (e.g., 4:48 PM)
  const formatCommentTime = (rawTime?: string, timestamp?: number) => {
    if (timestamp) {
      const diffSecs = Math.floor((Date.now() - timestamp) / 1000);
      if (diffSecs < 30) return 'Just now';
      if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
      if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
      return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    if (rawTime && rawTime !== 'Just now') return rawTime;
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Load comments from localStorage & Cloud whenever comments drawer opens
  useEffect(() => {
    if (!openCommentsPostId) return;
    const targetPostId: string = openCommentsPostId;

    // 1. First load local cached comments for this post
    const stored = localStorage.getItem('adsspot_comments_data');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed[targetPostId]) {
          setPostComments((prev) => ({
            ...prev,
            [targetPostId]: parsed[targetPostId],
          }));
        }
      } catch {}
    }

    // 2. Fetch Cloud Comments from Supabase and merge
    async function loadCloudComments() {
      const cloudComments = await fetchPostComments(targetPostId);
      if (cloudComments && cloudComments.length > 0) {
        const formatted = cloudComments.map((c) => ({
          id: c.id,
          author: c.user?.full_name || 'Verified User',
          text: c.content,
          time: new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: new Date(c.created_at).getTime(),
        }));
        setPostComments((prev) => {
          const existing = prev[targetPostId] || [];
          const merged = [...existing];
          formatted.forEach((fc) => {
            if (!merged.some((m) => m.id === fc.id)) {
              merged.push(fc);
            }
          });
          return { ...prev, [targetPostId]: merged };
        });
      }
    }
    loadCloudComments();
  }, [openCommentsPostId]);

  // Load all stored local comments on initial page load so comment count badges are instantly accurate
  useEffect(() => {
    const stored = localStorage.getItem('adsspot_comments_data');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          setPostComments(parsed);
        }
      } catch {}
    }
  }, []);

  // Load user liked posts from localStorage and calculate exact like count
  useEffect(() => {
    const key = user ? `adsspot_likes_${user.id}` : 'adsspot_likes_guest';
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed: Record<string, boolean> = JSON.parse(stored);
        setLikedPosts(parsed);
        
        // Recalculate exact total counts considering persisted user likes
        setLikesCounts((prev) => {
          const nextCounts = { ...prev };
          SEED_POSTS.forEach((p) => {
            const initialSeedCount = p.likes_count;
            if (parsed[p.id]) {
              nextCounts[p.id] = initialSeedCount + 1;
            } else {
              nextCounts[p.id] = initialSeedCount;
            }
          });
          return nextCounts;
        });
      } catch {}
    }
  }, [user]);

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

  const handleToggleSave = async (postId: string) => {
    if (!user) {
      showToast('Please sign in to bookmark deals.');
      return;
    }
    const isCurrentlySaved = !!savedPosts[postId];
    const newSavedState = !isCurrentlySaved;

    setSavedPosts((prev) => {
      const nextMap = { ...prev, [postId]: newSavedState };
      const activeIds = Object.keys(nextMap).filter((k) => nextMap[k]);
      localStorage.setItem(`adsspot_saved_${user.id}`, JSON.stringify(activeIds));
      return nextMap;
    });

    showToast(newSavedState ? 'Saved to Bookmarks' : 'Removed from Bookmarks');

    await toggleSavePost(user.id, postId, isCurrentlySaved);
  };

  const handleAddComment = async (postId: string) => {
    if (!newCommentText.trim()) return;
    const text = newCommentText.trim();
    setNewCommentText('');

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newCommentObj = {
      id: `comm-${Date.now()}`,
      author: user?.full_name || 'Aarav Sharma',
      text,
      time: formattedTime,
      timestamp: Date.now(),
    };

    setPostComments((prev) => {
      const nextMap = {
        ...prev,
        [postId]: [...(prev[postId] || []), newCommentObj],
      };
      localStorage.setItem('adsspot_comments_data', JSON.stringify(nextMap));
      return nextMap;
    });

    showToast('Comment posted!');

    if (user?.id) {
      await addCommentToPost(user.id, postId, text);
    }
  };

  const handleSendStoryReaction = (emoji: string) => {
    const reactionId = `react-${Date.now()}`;
    setStoryReactions((prev) => [...prev, { id: reactionId, emoji }]);
    setTimeout(() => {
      setStoryReactions((prev) => prev.filter((r) => r.id !== reactionId));
    }, 1500);
  };

  const handleSharePost = async (post: { id: string; caption: string }, biz: { name: string; slug: string }) => {
    // On desktop browsers, navigator.share often opens the OS Mail client app.
    // We open our rich custom Adsspot Share Sheet Modal for explicit social platform options (WhatsApp, X, FB, Telegram, Copy Link).
    setCopiedLink(false);
    setOpenSharePost({ id: post.id, bizName: biz.name, caption: post.caption, slug: biz.slug });
  };

  const filteredPosts = SEED_POSTS.filter((post) => {
    const biz = SEED_BUSINESSES.find((b) => b.id === post.business_id);
    if (!biz) return true;
    return selectedCategory === 'all' || biz.category_id === selectedCategory;
  });

  const currentActiveStory = activeStoryIndex !== null ? STORY_DATA[activeStoryIndex] : null;

  return (
    <div className="flex-1 bg-[#F8FAFC] pb-28 max-w-md mx-auto w-full min-h-screen relative overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 transform -translate-x-1/2 z-50 bg-[#17181C] text-white text-[11px] font-semibold px-3.5 py-2 rounded-full shadow-lg flex items-center gap-1.5 border border-neutral-700 animate-fade-in whitespace-nowrap">
          <CheckCircle className="w-3.5 h-3.5 text-[#35AB4E]" />
          {toastMessage}
        </div>
      )}

      {/* 🌟 IMMERSIVE FULL-SCREEN STORY VIEWER */}
      {currentActiveStory && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-0 sm:p-4">
          <div className="relative w-full h-full sm:h-[88vh] sm:max-w-sm bg-[#17181C] sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
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
            <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5">
              {STORY_DATA.map((s, idx) => (
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

            {/* Story Header */}
            <div className="relative z-30 flex items-center justify-between px-4 pt-7 pb-3 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
              <div className="flex items-center gap-2.5">
                <img src={currentActiveStory.logo} alt={currentActiveStory.name} className="w-9 h-9 rounded-xl object-cover border-2 border-white/60 shadow-md" />
                <div>
                  <h4 className="text-xs font-extrabold text-white leading-tight flex items-center gap-1.5">
                    {currentActiveStory.name}
                    {currentActiveStory.tag && (
                      <span className="bg-[#4787F2] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full">
                        {currentActiveStory.tag}
                      </span>
                    )}
                  </h4>
                  <span className="text-[10px] text-neutral-300 font-medium">
                    {currentActiveStory.location} • {currentActiveStory.time}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveStoryIndex(null)}
                className="text-white hover:bg-white/20 p-1.5 rounded-full bg-black/40 backdrop-blur-md transition-colors"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Story Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src={currentActiveStory.image}
                alt="Story"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />
            </div>

            {/* Tap Zones */}
            <div
              className="absolute left-0 top-16 bottom-32 w-1/3 z-20 cursor-pointer"
              onClick={() => {
                if (activeStoryIndex! > 0) setActiveStoryIndex(activeStoryIndex! - 1);
              }}
            />
            <div
              className="absolute right-0 top-16 bottom-32 w-1/3 z-20 cursor-pointer"
              onClick={() => {
                if (activeStoryIndex! < STORY_DATA.length - 1) setActiveStoryIndex(activeStoryIndex! + 1);
                else setActiveStoryIndex(null);
              }}
            />

            {/* Story Caption & Action */}
            <div className="relative z-30 p-4 space-y-3 bg-gradient-to-t from-black via-black/80 to-transparent">
              <p className="text-xs text-white leading-relaxed font-medium bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg">
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

      {/* 🌟 SHARE OPTIONS MODAL */}
      {openSharePost && (
        <div className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-[#E3E8EF] animate-slide-up space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E8EF]">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#4787F2]" />
                <h3 className="text-sm font-extrabold text-[#17181C]">Share Post</h3>
              </div>
              <button
                onClick={() => setOpenSharePost(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Share to Socials</span>
              <div className="grid grid-cols-4 gap-3 pt-2">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out ${openSharePost.bizName} on Adsspot: "${openSharePost.caption}"\nhttps://adsspot.in/card/${openSharePost.slug}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-all active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md">
                    <WhatsAppIcon size={20} className="text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-700 group-hover:text-[#25D366]">WhatsApp</span>
                </a>

                {/* X / Twitter */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${openSharePost.bizName} on Adsspot: "${openSharePost.caption}"`)}&url=${encodeURIComponent(`https://adsspot.in/card/${openSharePost.slug}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-black/5 hover:bg-black/10 transition-all active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#17181C] text-white flex items-center justify-center shadow-md font-black text-xs">
                    𝕏
                  </div>
                  <span className="text-[10px] font-bold text-neutral-700">X (Twitter)</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://adsspot.in/card/${openSharePost.slug}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 transition-all active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md font-bold text-sm">
                    f
                  </div>
                  <span className="text-[10px] font-bold text-neutral-700 group-hover:text-[#1877F2]">Facebook</span>
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(`https://adsspot.in/card/${openSharePost.slug}`)}&text=${encodeURIComponent(`Check out ${openSharePost.bizName} on Adsspot!`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-[#229ED9]/10 hover:bg-[#229ED9]/20 transition-all active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#229ED9] text-white flex items-center justify-center shadow-md font-bold text-xs">
                    ✈
                  </div>
                  <span className="text-[10px] font-bold text-neutral-700 group-hover:text-[#229ED9]">Telegram</span>
                </a>
              </div>
            </div>

            {/* Direct Link Copy Box */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Direct Web Link</span>
              <div className="flex items-center gap-2 p-2 bg-[#F8FAFC] rounded-2xl border border-[#E3E8EF]">
                <input
                  type="text"
                  readOnly
                  value={`https://adsspot.in/card/${openSharePost.slug}`}
                  className="flex-1 bg-transparent text-xs text-neutral-700 outline-none truncate px-1 font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    const shareUrl = `https://adsspot.in/card/${openSharePost.slug}`;
                    navigator.clipboard.writeText(shareUrl);
                    setCopiedLink(true);
                    showToast('Link copied to clipboard!');
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    copiedLink
                      ? 'bg-[#35AB4E] text-white'
                      : 'bg-[#4787F2] hover:bg-[#3972D4] text-white active:scale-95'
                  }`}
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 COMMENTS DRAWER */}
      {openCommentsPostId && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl p-4 pb-24 sm:pb-4 shadow-2xl border border-[#E3E8EF] max-h-[80vh] flex flex-col justify-between animate-slide-up">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E3E8EF]">
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#4787F2]" />
                <h3 className="text-xs font-bold text-[#17181C]">Comments</h3>
              </div>
              <button onClick={() => setOpenCommentsPostId(null)} className="text-neutral-400 hover:text-neutral-700 p-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1 min-h-[140px]">
              {(postComments[openCommentsPostId] || []).length === 0 ? (
                <div className="text-center py-8 text-neutral-400 text-xs font-medium">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                (postComments[openCommentsPostId] || []).map((comm: any) => (
                  <div key={comm.id} className="p-2.5 bg-[#F4F6FB] rounded-xl text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#17181C] text-[11px]">{comm.author}</span>
                      <span className="text-[9px] text-[#687182]">{formatCommentTime(comm.time, comm.timestamp)}</span>
                    </div>
                    <p className="text-[#4A5260] text-[11px]">{comm.text}</p>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-[#E3E8EF] flex items-center gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddComment(openCommentsPostId);
                }}
                placeholder="Write a comment..."
                className="flex-1 px-3.5 py-2.5 rounded-full border border-[#E3E8EF] text-xs outline-none focus:border-[#4787F2] text-[#17181C] placeholder:text-neutral-400 bg-[#F8FAFC]"
              />
              <button
                type="button"
                onClick={() => handleAddComment(openCommentsPostId)}
                className="w-9 h-9 rounded-full bg-[#4787F2] hover:bg-[#3972D4] text-white flex items-center justify-center shrink-0 cursor-pointer transition-all active:scale-95 shadow-xs"
                title="Post Comment"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. TOP LOCATION STATUS BAR */}
      <div className="bg-white px-3 sm:px-4 py-2.5 border-b border-[#E3E8EF] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-[#17181C] font-bold min-w-0 flex-1 truncate">
          <MapPin className="w-3.5 h-3.5 text-[#4787F2] shrink-0" />
          <span className="truncate">
            {locationState.area}, {locationState.city}{' '}
            <span className="text-neutral-400 font-normal">{locationState.pincode}</span>
          </span>
        </div>
        <span className="shrink-0 text-[10px] font-bold text-[#1D53B8] bg-[#EDF4FF] px-2.5 py-0.5 rounded-full border border-[#4787F2]/20">
          {filteredPosts.length} Live Spots
        </span>
      </div>

      {/* 2. STORIES RAIL */}
      <div className="bg-white py-3 border-b border-[#E3E8EF] shadow-xs">
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 items-center">
          {/* Add story / User avatar */}
          <div
            onClick={() => showToast('Stories are exclusive to Elite Merchants (Max 1/day)')}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div className="relative w-[58px] h-[58px] rounded-[16px] border-2 border-dashed border-[#4787F2] p-0.5 flex items-center justify-center shrink-0 bg-[#EDF4FF]/60 group-hover:border-[#3972D4] transition-all group-active:scale-95">
              <Avatar src={user?.avatar_url || undefined} name={user?.full_name} size="md" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#4787F2] text-white flex items-center justify-center border-2 border-white shadow-sm">
                <Plus className="w-3 h-3 stroke-[3]" />
              </div>
            </div>
            <span className="text-[11px] text-neutral-600 font-semibold tracking-tight">Your Story</span>
          </div>

          {/* Business Stories with Authentic 4-Segment Spot Ring (from adsspot-story-avatar-default.svg) */}
          {STORY_DATA.map((story, idx) => (
            <div
              key={story.id}
              onClick={() => setActiveStoryIndex(idx)}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div className="transform group-hover:scale-105 group-active:scale-95 transition-transform drop-shadow-sm">
                <StorySpotRing size={58} imageSrc={story.logo} alt={story.name} />
              </div>
              <span className="text-[11px] text-[#17181C] font-bold truncate max-w-[62px] text-center leading-tight tracking-tight">
                {story.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CATEGORY PILLS */}
      <div className="py-2.5 px-3 sm:px-4 flex gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 sm:px-3.5 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#17181C] text-white shadow-xs'
              : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
          }`}
        >
          All
        </button>
        {SEED_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 sm:px-3.5 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#17181C] text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            {cat.name}
          </button>
        ))}
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
              className="bg-white rounded-2xl overflow-hidden border border-[#E3E8EF] shadow-sm"
            >
              {/* Post Header with Compact Follow Icon Button */}
              <div className="p-3 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <Avatar src={biz.logo_url} name={biz.name} size="sm" isElite={biz.tier === 'elite'} />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/card/${biz.slug}`}
                      className="font-bold text-xs text-[#17181C] hover:text-[#4787F2] leading-snug block break-words"
                    >
                      {biz.name}
                    </Link>
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 mt-0.5">
                      <span className="truncate">{biz.address}</span>
                      {biz.trusted && (
                        <span className="text-[#35AB4E] font-bold flex items-center gap-0.5 shrink-0">
                          <ShieldCheck className="w-3 h-3 text-[#35AB4E]" /> Verified
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
                      ? 'bg-[#EBF9EE] text-[#35AB4E] border border-[#35AB4E]/30 hover:bg-neutral-100'
                      : 'bg-[#EDF4FF] text-[#4787F2] hover:bg-[#D9E8FF] border border-[#4787F2]/20 active:scale-95'
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
                className="relative w-full aspect-[4/3] overflow-hidden cursor-pointer bg-neutral-100"
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
              <div className="p-3 pb-1.5 flex items-center justify-between gap-2 text-neutral-700">
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
                    <span className={isLiked ? 'text-red-500 font-bold' : 'text-neutral-700'}>{likesCount}</span>
                  </button>

                  <button
                    onClick={() => setOpenCommentsPostId(post.id)}
                    className="flex items-center gap-1 text-xs font-semibold hover:text-[#4787F2]"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{commentsCount}</span>
                  </button>

                  <button onClick={() => handleToggleSave(post.id)} className="hover:text-[#4787F2]">
                    <Bookmark
                      className={`w-5 h-5 ${isSaved ? 'text-[#4787F2] fill-[#4787F2]' : ''}`}
                    />
                  </button>

                  <button onClick={() => handleSharePost(post, biz)} className="hover:text-[#4787F2]" title="Share Post">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Direct Visiting Card and Authentic WhatsApp Icons */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/card/${biz.slug}`}
                    title="Digital Visiting Card"
                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-all active:scale-95 shadow-xs"
                  >
                    <QrCode className="w-4.5 h-4.5 text-neutral-700" />
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
                <p className="text-xs text-neutral-800 leading-relaxed break-words">
                  <span className="font-bold text-[#17181C] mr-1">{biz.name}</span>
                  {post.caption}
                </p>

                <button
                  onClick={() => setOpenCommentsPostId(post.id)}
                  className="text-[11px] text-neutral-400 font-semibold hover:text-[#4787F2] block"
                >
                  View all {commentsCount} comments
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
