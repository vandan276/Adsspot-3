import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import {
  AuthProvider,
  useAuth,
  SEED_BUSINESSES,
  SEED_POSTS,
  SEED_CATEGORIES,
} from '@adsspot/api';
import { colors } from '@adsspot/ui';
import { SplashScreen } from './SplashScreen';
import {
  Home,
  Wallet,
  Bookmark,
  User,

  Heart,
  MessageCircle,
  Share2,
  ShieldCheck,
  Crown,
  MapPin,
  Plus,
  Search,
  Check,
  AdsspotBrandLockupNative,
  AdsspotLogoMarkNative,
} from './icons';






interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class MobileErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Mobile App ErrorBoundary caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF5F5', padding: 20, justifyContent: 'center' }}>
          <View style={{ backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#FED7D7' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#E53E3E', marginBottom: 10 }}>
              Mobile Runtime Error Caught
            </Text>
            <Text style={{ fontSize: 14, color: '#2D3748', marginBottom: 10, fontWeight: '600' }}>
              {this.state.error?.toString()}
            </Text>
            <ScrollView style={{ maxHeight: 200, backgroundColor: '#EDF2F7', padding: 10, borderRadius: 8 }}>
              <Text style={{ fontSize: 11, fontFamily: 'monospace', color: '#4A5568' }}>
                {this.state.errorInfo?.componentStack || this.state.error?.stack}
              </Text>
            </ScrollView>
          </View>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

function MobileAppInner() {
  const { user, role, switchPersona, personas } = useAuth();
  const [showSplash, setShowSplash] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'wallet' | 'explore' | 'saved' | 'profile'>('home');
  const [panelMode, setPanelMode] = useState<'consumer' | 'merchant' | 'sm'>('consumer');
  
  // Interactive state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [likesCounts, setLikesCounts] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    SEED_POSTS.forEach((p) => {
      init[p.id] = p.likes_count;
    });
    return init;
  });
  const [followingBiz, setFollowingBiz] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [activeStory, setActiveStory] = useState<{ name: string; logo: string; image: string; tier: string } | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(1540.0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isMerchant = role === 'merchant';
  const isSM = role === 'sm';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleToggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const isLiked = !prev[postId];
      setLikesCounts((c) => ({
        ...c,
        [postId]: (c[postId] || 0) + (isLiked ? 1 : -1),
      }));
      return { ...prev, [postId]: isLiked };
    });
  };

  const handleToggleFollow = (bizId: string, bizName: string) => {
    setFollowingBiz((prev) => {
      const isFollowing = !prev[bizId];
      showToast(isFollowing ? `Following ${bizName}` : `Unfollowed ${bizName}`);
      return { ...prev, [bizId]: isFollowing };
    });
  };

  const handleToggleSave = (postId: string) => {
    setSavedPosts((prev) => {
      const isSaved = !prev[postId];
      showToast(isSaved ? 'Saved to Bookmarks' : 'Removed from Bookmarks');
      return { ...prev, [postId]: isSaved };
    });
  };

  const handleAddFunds = (amount: number) => {
    setWalletBalance((b) => b + amount);
    showToast(`Added ₹${amount} to Adsspot Wallet!`);
  };

  if (showSplash) {
    return (
      <SafeAreaView style={styles.container}>
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </SafeAreaView>
    );
  }

  const filteredPosts = SEED_POSTS.filter((post) => {
    const biz = SEED_BUSINESSES.find((b) => b.id === post.business_id);
    if (!biz) return true;
    const matchCat = selectedCategory === 'all' || biz.category_id === selectedCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      biz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.caption.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Story Viewer Modal */}
      <Modal visible={!!activeStory} transparent animationType="fade">
        <View style={styles.storyModalBackdrop}>
          <View style={styles.storyModalContent}>
            {/* Story Top Progress Bar */}
            <View style={styles.storyProgressRail}>
              <View style={styles.storyProgressBar} />
            </View>

            {/* Story Header */}
            <View style={styles.storyModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Image source={{ uri: activeStory?.logo }} style={styles.storyModalAvatar} />
                <View>
                  <Text style={styles.storyModalAuthor}>{activeStory?.name}</Text>
                  <Text style={styles.storyModalTime}>Elite Story • 2h ago</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setActiveStory(null)} style={styles.storyCloseBtn}>
                <Text style={styles.storyCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Story Media Image */}
            <Image source={{ uri: activeStory?.image }} style={styles.storyModalImage} />

            {/* Story Footer CTA */}
            <View style={styles.storyModalFooter}>
              <TouchableOpacity
                onPress={() => {
                  setActiveStory(null);
                  showToast('Offer claim code sent via SMS!');
                }}
                style={styles.storyClaimBtn}
              >
                <Text style={styles.storyClaimText}>Claim 20% Off Festival Coupon</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 1. DEV PERSONA SWITCHER BAR */}
      <View style={styles.devBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.devBarScroll}>
          <TouchableOpacity onPress={() => setShowSplash(true)} style={styles.splashChip}>
            <Text style={styles.splashChipText}>✨ Splash</Text>
          </TouchableOpacity>

          <Text style={styles.devBarLabel}>⚡ Role:</Text>
          {personas.map((p) => {
            const isSelected = user?.id === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => {
                  switchPersona(p.id);
                  if (p.role === 'merchant') setPanelMode('merchant');
                  else if (p.role === 'sm') setPanelMode('sm');
                  else setPanelMode('consumer');
                  showToast(`Switched to ${p.name} (${p.role})`);
                }}
                style={[styles.devChip, isSelected && styles.devChipActive]}
              >
                <Text style={[styles.devChipText, isSelected && styles.devChipTextActive]}>
                  {p.role === 'merchant' ? `Merch (${p.tier})` : p.role.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 2. TOP BRAND HEADER WITH AUTHENTIC UNIFIED VECTOR LOGO */}
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <AdsspotBrandLockupNative height={34} />
          <View style={styles.locationPill}>
            <MapPin size={10} color={colors.spotBlue} />
            <Text style={styles.locationText}>Fort, Mumbai</Text>
          </View>
        </View>



        {/* Header Right Actions */}
        <View style={styles.headerRight}>
          {(isMerchant || isSM) && (
            <TouchableOpacity
              onPress={() => setPanelMode(panelMode === 'consumer' ? (isMerchant ? 'merchant' : 'sm') : 'consumer')}
              style={[
                styles.modeToggle,
                panelMode !== 'consumer' && { backgroundColor: isMerchant ? colors.festivalYellowLight : colors.spotBlueLight },
              ]}
            >
              <Text
                style={[
                  styles.modeToggleText,
                  { color: panelMode !== 'consumer' ? (isMerchant ? '#A06E00' : colors.spotBlueDark) : colors.inkMuted },
                ]}
              >
                {panelMode === 'consumer' ? (isMerchant ? 'Merchant Studio' : 'SM Field Ops') : 'Feed View'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => setActiveTab('profile')}>
            <Image
              source={{ uri: user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. MAIN TAB CONTENT */}
      {activeTab === 'home' && (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={16} color="#687182" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search shops, sweets, jewellery..."
                placeholderTextColor="#687182"
                style={styles.searchInput}
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={{ color: '#687182', fontSize: 14 }}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* STORIES RAIL (Strictly Elite Businesses) */}
          <View style={styles.storiesSection}>
            <Text style={styles.sectionHeading}>Elite Stories &amp; Daily Highlights</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesScroll}>
              {/* Add Story / Your Status */}
              <TouchableOpacity
                onPress={() => {
                  if (user?.role === 'merchant' && user.business_profile?.tier === 'elite') {
                    showToast('Merchant Story Upload Panel Opened');
                  } else {
                    showToast('Stories are exclusive to Elite Membership Tier');
                  }
                }}
                style={styles.storyItem}
              >
                <View style={[styles.storyAvatarWrapper, styles.storyAvatarAdd]}>
                  <Image
                    source={{ uri: user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' }}
                    style={styles.storyImage}
                  />
                  <View style={styles.addBadge}>
                    <Plus size={10} color="#FFFFFF" />
                  </View>
                </View>
                <Text style={styles.storyName} numberOfLines={1}>
                  {user?.role === 'merchant' && user.business_profile?.tier === 'elite' ? 'Add Story' : 'Your Feed'}
                </Text>
              </TouchableOpacity>

              {/* Elite Business Stories */}
              {SEED_BUSINESSES.map((biz) => (
                <TouchableOpacity
                  key={biz.id}
                  onPress={() => {
                    setActiveStory({
                      name: biz.name,
                      logo: biz.logo_url || '',
                      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
                      tier: biz.tier,
                    });
                  }}
                  style={styles.storyItem}
                >
                  <View style={[styles.storyAvatarWrapper, biz.tier === 'elite' && styles.storyRingBorder]}>
                    <Image source={{ uri: biz.logo_url || '' }} style={styles.storyImage} />
                    {biz.tier === 'elite' && (
                      <View style={styles.eliteBadgePill}>
                        <Crown size={8} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                  <Text style={styles.storyName} numberOfLines={1}>
                    {biz.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* EXPLORE CATEGORIES QUICK RAIL */}
          <View style={styles.categoriesSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
              <TouchableOpacity
                onPress={() => setSelectedCategory('all')}
                style={[styles.categoryChip, selectedCategory === 'all' && styles.categoryChipActive]}
              >
                <Text style={[styles.categoryChipText, selectedCategory === 'all' && styles.categoryChipTextActive]}>
                  All
                </Text>
              </TouchableOpacity>
              {SEED_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                  >
                    <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* FEED POSTS */}
          <View style={styles.feedSection}>
            {filteredPosts.map((post) => {
              const fallbackBiz = SEED_BUSINESSES[0]!;
              const biz = SEED_BUSINESSES.find((b) => b.id === post.business_id) ?? fallbackBiz;
              const isLiked = !!likedPosts[post.id];
              const likesCount = likesCounts[post.id] ?? post.likes_count;
              const isFollowing = !!followingBiz[biz.id];
              const isSaved = !!savedPosts[post.id];

              return (
                <View key={post.id} style={styles.postCard}>
                  {/* Post Header */}
                  <View style={styles.postHeader}>
                    <View style={styles.postAuthor}>
                      <Image source={{ uri: biz.logo_url || '' }} style={styles.postAvatar} />
                      <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Text style={styles.postAuthorName}>{biz.name}</Text>
                          {biz.trusted && (
                            <View style={styles.trustedPill}>
                              <ShieldCheck size={10} color="#1B6A2D" />
                              <Text style={styles.trustedText}>Trusted</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.postLocation}>{biz.address}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleToggleFollow(biz.id, biz.name)}
                      style={[styles.followBtn, isFollowing && styles.followingBtn]}
                    >
                      <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                        {isFollowing ? 'Following' : 'Follow'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Post Image */}
                  <Image source={{ uri: post.image_urls[0] }} style={styles.postImage} />

                  {/* Post Actions Row */}
                  <View style={styles.postActions}>
                    <View style={styles.postActionsLeft}>
                      {/* Like Button */}
                      <TouchableOpacity
                        onPress={() => handleToggleLike(post.id)}
                        style={styles.actionBtn}
                      >
                        <Heart
                          size={20}
                          color={isLiked ? '#E53E3E' : colors.ink}
                          fill={isLiked ? '#E53E3E' : 'none'}
                        />
                        <Text style={[styles.actionCount, isLiked && { color: '#E53E3E' }]}>
                          {likesCount}
                        </Text>
                      </TouchableOpacity>

                      {/* Comment Button */}
                      <TouchableOpacity
                        onPress={() => showToast(`Opening comments for ${biz.name}...`)}
                        style={styles.actionBtn}
                      >
                        <MessageCircle size={20} color={colors.ink} />
                        <Text style={styles.actionCount}>{post.comments_count}</Text>
                      </TouchableOpacity>

                      {/* Bookmark Save */}
                      <TouchableOpacity
                        onPress={() => handleToggleSave(post.id)}
                        style={styles.actionBtn}
                      >
                        <Bookmark
                          size={19}
                          color={isSaved ? colors.spotBlue : colors.ink}
                          fill={isSaved ? colors.spotBlue : 'none'}
                        />
                      </TouchableOpacity>

                      {/* Share Button */}
                      <TouchableOpacity
                        onPress={() => showToast(`Post link copied to clipboard!`)}
                        style={styles.actionBtn}
                      >
                        <Share2 size={19} color={colors.ink} />
                      </TouchableOpacity>
                    </View>

                    {biz.tier === 'elite' && (
                      <View style={styles.eliteTag}>
                        <Crown size={12} color={colors.deepCrimson} />
                        <Text style={styles.eliteTagText}>Elite Verified</Text>
                      </View>
                    )}
                  </View>

                  {/* Post Caption */}
                  <Text style={styles.postCaption}>{post.caption}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* WALLET TAB */}
      {activeTab === 'wallet' && (
        <ScrollView style={styles.content} contentContainerStyle={{ padding: 16, paddingBottom: 110 }}>
          {/* Wallet Card */}
          <View style={styles.walletCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.walletCardLabel}>Adsspot Unified Cash Balance</Text>
              <ShieldCheck size={16} color="#35AB4E" />
            </View>
            <Text style={styles.walletBalanceText}>₹{walletBalance.toFixed(2)}</Text>
            <Text style={styles.walletSubText}>Available for Local Store Offers &amp; Banners</Text>

            {/* Quick Top-Up Chips */}
            <View style={styles.topUpRow}>
              <TouchableOpacity onPress={() => handleAddFunds(500)} style={styles.topUpChip}>
                <Text style={styles.topUpChipText}>+ ₹500</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAddFunds(1000)} style={styles.topUpChip}>
                <Text style={styles.topUpChipText}>+ ₹1,000</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAddFunds(2500)} style={styles.topUpChip}>
                <Text style={styles.topUpChipText}>+ ₹2,500</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Linked Bank & Actions */}
          <View style={styles.walletSectionBox}>
            <Text style={styles.boxHeading}>Linked Bank &amp; UPI</Text>
            <View style={styles.bankItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.bankIconWrap}>
                  <Wallet size={18} color="#4787F2" />
                </View>
                <View>
                  <Text style={styles.bankName}>HDFC Bank •••• 4892</Text>
                  <Text style={styles.bankIfsc}>IFSC: HDFC0000128 • Primary</Text>
                </View>
              </View>
              <View style={styles.verifiedPill}>
                <Text style={styles.verifiedPillText}>Verified</Text>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.walletSectionBox}>
            <Text style={styles.boxHeading}>Recent Transactions</Text>
            <View style={styles.txRow}>
              <View>
                <Text style={styles.txTitle}>Wallet Recharge (UPI)</Text>
                <Text style={styles.txDate}>Today, 3:45 PM</Text>
              </View>
              <Text style={[styles.txAmount, { color: '#35AB4E' }]}>+ ₹500.00</Text>
            </View>
            <View style={styles.txRow}>
              <View>
                <Text style={styles.txTitle}>Royal Heritage Jewellers Offer</Text>
                <Text style={styles.txDate}>Yesterday, 6:12 PM</Text>
              </View>
              <Text style={[styles.txAmount, { color: '#981837' }]}>- ₹250.00</Text>
            </View>
            <View style={styles.txRow}>
              <View>
                <Text style={styles.txTitle}>Cashback Bonus</Text>
                <Text style={styles.txDate}>22 Aug 2026</Text>
              </View>
              <Text style={[styles.txAmount, { color: '#35AB4E' }]}>+ ₹150.00</Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* EXPLORE TAB */}
      {activeTab === 'explore' && (
        <ScrollView style={styles.content} contentContainerStyle={{ padding: 16, paddingBottom: 110 }}>
          <Text style={styles.tabHeaderTitle}>Explore Hyperlocal Stores</Text>
          <Text style={styles.tabHeaderSub}>Fort, Mumbai 400001 • 24 Verified Spots</Text>

          {/* Categories Grid */}
          <View style={styles.exploreGrid}>
            {SEED_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => {
                  setSelectedCategory(cat.id);
                  setActiveTab('home');
                  showToast(`Showing ${cat.name} stores`);
                }}
                style={styles.exploreGridItem}
              >
                <Text style={styles.exploreGridName}>{cat.name}</Text>
                <Text style={styles.exploreGridCount}>12 Shops Near You</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Featured Stores Directory */}
          <Text style={[styles.sectionHeading, { marginTop: 20 }]}>Top Rated in Fort</Text>
          {SEED_BUSINESSES.map((biz) => (
            <View key={biz.id} style={styles.directoryCard}>
              <Image source={{ uri: biz.logo_url || '' }} style={styles.directoryLogo} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.directoryName}>{biz.name}</Text>
                  {biz.trusted && (
                    <View style={styles.trustedPill}>
                      <ShieldCheck size={10} color="#1B6A2D" />
                      <Text style={styles.trustedText}>Trusted</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.directoryDesc} numberOfLines={1}>{biz.description}</Text>
                <Text style={styles.directoryAddress}>{biz.address}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* SAVED TAB */}
      {activeTab === 'saved' && (
        <ScrollView style={styles.content} contentContainerStyle={{ padding: 16, paddingBottom: 110 }}>
          <Text style={styles.tabHeaderTitle}>Your Saved Bookmarks</Text>
          <Text style={styles.tabHeaderSub}>Saved businesses, offers, and festival banners</Text>

          {Object.keys(savedPosts).length === 0 ? (
            <View style={styles.emptyBox}>
              <Bookmark size={32} color="#687182" />
              <Text style={styles.emptyTitle}>No Bookmarks Saved Yet</Text>
              <Text style={styles.emptySub}>Tap the bookmark ribbon on any feed post to save it for later.</Text>
              <TouchableOpacity onPress={() => setActiveTab('home')} style={styles.exploreCtaBtn}>
                <Text style={styles.exploreCtaText}>Browse Home Feed</Text>
              </TouchableOpacity>
            </View>
          ) : (
            SEED_POSTS.filter((p) => savedPosts[p.id]).map((post) => (
              <View key={post.id} style={styles.postCard}>
                <Image source={{ uri: post.image_urls[0] }} style={{ width: '100%', height: 180 }} />
                <View style={{ padding: 12 }}>
                  <Text style={styles.postCaption}>{post.caption}</Text>
                  <TouchableOpacity onPress={() => handleToggleSave(post.id)} style={{ alignSelf: 'flex-start', marginTop: 6 }}>
                    <Text style={{ color: '#E53E3E', fontSize: 12, fontWeight: '700' }}>Remove Bookmark</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <ScrollView style={styles.content} contentContainerStyle={{ padding: 16, paddingBottom: 110 }}>
          {/* User Profile Card */}
          <View style={styles.profileCard}>
            <Image
              source={{ uri: user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' }}
              style={styles.profileAvatar}
            />
            <Text style={styles.profileName}>{user?.full_name}</Text>
            <Text style={styles.profilePhone}>{user?.phone}</Text>

            <View style={styles.roleBadgeBox}>
              <Text style={styles.roleBadgeText}>ROLE: {user?.role.toUpperCase()}</Text>
            </View>
          </View>

          {/* Fast Switch Persona Panel */}
          <View style={styles.walletSectionBox}>
            <Text style={styles.boxHeading}>Quick Switch Persona Account</Text>
            {personas.map((p) => {
              const isActive = user?.id === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => {
                    switchPersona(p.id);
                    showToast(`Switched to ${p.name}`);
                  }}
                  style={[styles.personaRow, isActive && styles.personaRowActive]}
                >
                  <View>
                    <Text style={[styles.personaName, isActive && { color: '#4787F2' }]}>{p.name}</Text>
                    <Text style={styles.personaRole}>{p.description}</Text>
                  </View>
                  {isActive && <Check size={16} color="#4787F2" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* 4. SIGNATURE FLOATING BOTTOM NAVIGATION (Raised Explore Center) */}
      <View style={styles.floatingNavContainer}>
        <View style={styles.floatingNav}>
          {/* Home */}
          <TouchableOpacity
            onPress={() => setActiveTab('home')}
            style={[styles.navItem, activeTab === 'home' && styles.navItemActive]}
          >
            <Home size={20} color={activeTab === 'home' ? colors.spotBlue : colors.inkMuted} />
            <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>Home</Text>
          </TouchableOpacity>

          {/* Wallet */}
          <TouchableOpacity
            onPress={() => setActiveTab('wallet')}
            style={[styles.navItem, activeTab === 'wallet' && styles.navItemActive]}
          >
            <Wallet size={20} color={activeTab === 'wallet' ? colors.spotBlue : colors.inkMuted} />
            <Text style={[styles.navLabel, activeTab === 'wallet' && styles.navLabelActive]}>Wallet</Text>
          </TouchableOpacity>

          {/* Raised Center ● Explore Action with Authentic Logo Mark */}
          <TouchableOpacity
            onPress={() => setActiveTab('explore')}
            style={styles.raisedCenterBtn}
            activeOpacity={0.9}
          >
            <View style={[styles.raisedCenterInner, activeTab === 'explore' && styles.raisedCenterInnerActive]}>
              <AdsspotLogoMarkNative size={26} />
            </View>
            <Text style={[styles.exploreLabel, activeTab === 'explore' && styles.exploreLabelActive]}>● Explore</Text>
          </TouchableOpacity>


          {/* Saved */}
          <TouchableOpacity
            onPress={() => setActiveTab('saved')}
            style={[styles.navItem, activeTab === 'saved' && styles.navItemActive]}
          >
            <Bookmark size={20} color={activeTab === 'saved' ? colors.spotBlue : colors.inkMuted} />
            <Text style={[styles.navLabel, activeTab === 'saved' && styles.navLabelActive]}>Saved</Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity
            onPress={() => setActiveTab('profile')}
            style={[styles.navItem, activeTab === 'profile' && styles.navItemActive]}
          >
            <User size={20} color={activeTab === 'profile' ? colors.spotBlue : colors.inkMuted} />
            <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <MobileErrorBoundary>
      <AuthProvider>
        <MobileAppInner />
      </AuthProvider>
    </MobileErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    maxWidth: 480,
    width: '100%',
    minHeight: '100vh' as any,
    alignSelf: 'center',
    position: 'relative',
  },
  toast: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 99,
    backgroundColor: '#17181C',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 9999,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  devBar: {
    backgroundColor: '#17181C',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#26272B',
  },
  devBarScroll: {
    alignItems: 'center',
    gap: 6,
  },
  devBarLabel: {
    color: '#F2B604',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  splashChip: {
    backgroundColor: '#32343A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#4787F2',
  },
  splashChipText: {
    color: '#4787F2',
    fontSize: 10,
    fontWeight: '800',
  },
  devChip: {
    backgroundColor: '#26272B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  devChipActive: {
    backgroundColor: '#4787F2',
  },
  devChipText: {
    color: '#CDD5DF',
    fontSize: 10,
    fontWeight: '600',
  },
  devChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E3E8EF',
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
    fontFamily: '"DIN Alternate", "DIN Condensed", "Impact", "Plus Jakarta Sans", sans-serif' as any,
  },

  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    fontSize: 10,
    color: '#687182',
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeToggle: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#F4F6FB',
    borderWidth: 1,
    borderColor: '#E3E8EF',
  },
  modeToggleText: {
    fontSize: 10,
    fontWeight: '700',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#EDF4FF',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E3E8EF',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#17181C',
    paddingVertical: 0,
  },

  storiesSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E8EF',
    marginTop: 6,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#17181C',
    paddingHorizontal: 16,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  storiesScroll: {
    paddingHorizontal: 12,
    gap: 12,
  },
  storyItem: {
    alignItems: 'center',
    width: 68,
  },
  storyAvatarWrapper: {
    width: 58,
    height: 58,
    borderRadius: 14,
    padding: 2,
    backgroundColor: '#E3E8EF',
    position: 'relative',
  },
  storyAvatarAdd: {
    backgroundColor: '#EDF4FF',
  },
  storyRingBorder: {
    backgroundColor: '#4787F2',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  addBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#4787F2',
    borderRadius: 9999,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  eliteBadgePill: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#981837',
    borderRadius: 9999,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyName: {
    fontSize: 10,
    color: '#17181C',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  categoriesSection: {
    paddingVertical: 10,
    backgroundColor: '#F4F6FB',
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#E3E8EF',
  },
  categoryChipActive: {
    backgroundColor: '#4787F2',
    borderColor: '#4787F2',
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A5260',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  feedSection: {
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 12,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3E8EF',
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  postAuthorName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#17181C',
  },
  trustedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#EBF9EE',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 9999,
  },
  trustedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1B6A2D',
  },
  postLocation: {
    fontSize: 11,
    color: '#687182',
    fontWeight: '500',
  },
  followBtn: {
    backgroundColor: '#EDF4FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  followingBtn: {
    backgroundColor: '#4787F2',
  },
  followBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4787F2',
  },
  followingBtnText: {
    color: '#FFFFFF',
  },
  postImage: {
    width: '100%',
    height: 260,
    backgroundColor: '#E3E8EF',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  postActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#17181C',
  },
  eliteTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FBECEF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  eliteTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#981837',
  },
  postCaption: {
    fontSize: 12,
    color: '#17181C',
    lineHeight: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  floatingNavContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  floatingNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: '#E3E8EF',
    shadowColor: '#17181C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 6,
  },
  navItemActive: {
    transform: [{ scale: 1.05 }],
  },
  navLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#687182',
  },
  navLabelActive: {
    color: '#4787F2',
    fontWeight: '800',
  },
  raisedCenterBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
  },
  raisedCenterInner: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E3E8EF',
    shadowColor: '#17181C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  raisedCenterInnerActive: {
    borderColor: '#4787F2',
    backgroundColor: '#EDF4FF',
  },
  exploreLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#17181C',
    marginTop: 2,
  },
  exploreLabelActive: {
    color: '#4787F2',
  },

  walletCard: {
    backgroundColor: '#17181C',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  walletCardLabel: {
    fontSize: 11,
    color: '#A0AEC0',
    fontWeight: '600',
  },
  walletBalanceText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 6,
  },
  walletSubText: {
    fontSize: 11,
    color: '#718096',
  },
  topUpRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  topUpChip: {
    backgroundColor: '#26272B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#32343A',
  },
  topUpChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F2B604',
  },
  walletSectionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E3E8EF',
    marginBottom: 16,
  },
  boxHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#17181C',
    marginBottom: 12,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bankIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EDF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#17181C',
  },
  bankIfsc: {
    fontSize: 10,
    color: '#687182',
  },
  verifiedPill: {
    backgroundColor: '#EBF9EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  verifiedPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1B6A2D',
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6FB',
  },
  txTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#17181C',
  },
  txDate: {
    fontSize: 10,
    color: '#687182',
  },
  txAmount: {
    fontSize: 13,
    fontWeight: '800',
  },
  tabHeaderTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#17181C',
  },
  tabHeaderSub: {
    fontSize: 12,
    color: '#687182',
    marginBottom: 16,
  },
  exploreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exploreGridItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E3E8EF',
  },
  exploreGridName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#17181C',
  },
  exploreGridCount: {
    fontSize: 10,
    color: '#687182',
    marginTop: 4,
  },
  directoryCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E3E8EF',
    marginBottom: 10,
  },
  directoryLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  directoryName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#17181C',
  },
  directoryDesc: {
    fontSize: 11,
    color: '#4A5260',
  },
  directoryAddress: {
    fontSize: 10,
    color: '#687182',
    marginTop: 2,
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3E8EF',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#17181C',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: '#687182',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  exploreCtaBtn: {
    backgroundColor: '#4787F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  exploreCtaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3E8EF',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 18,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#17181C',
  },
  profilePhone: {
    fontSize: 12,
    color: '#687182',
    marginTop: 2,
  },
  roleBadgeBox: {
    backgroundColor: '#EDF4FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    marginTop: 10,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4787F2',
  },
  personaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6FB',
  },
  personaRowActive: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 6,
  },
  personaName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#17181C',
  },
  personaRole: {
    fontSize: 10,
    color: '#687182',
  },
  storyModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyModalContent: {
    width: '90%',
    maxWidth: 420,
    height: '75%',
    backgroundColor: '#17181C',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  storyProgressRail: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 2,
    overflow: 'hidden',
  },
  storyProgressBar: {
    height: '100%',
    width: '65%',
    backgroundColor: '#4787F2',
  },
  storyModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  storyModalAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
  },
  storyModalAuthor: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  storyModalTime: {
    color: '#A0AEC0',
    fontSize: 10,
  },
  storyCloseBtn: {
    padding: 6,
  },
  storyCloseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  storyModalImage: {
    flex: 1,
    width: '100%',
    backgroundColor: '#26272B',
  },
  storyModalFooter: {
    padding: 16,
    backgroundColor: '#17181C',
  },
  storyClaimBtn: {
    backgroundColor: '#4787F2',
    paddingVertical: 12,
    borderRadius: 9999,
    alignItems: 'center',
  },
  storyClaimText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
