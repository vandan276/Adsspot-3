import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { AuthProvider, useAuth, SEED_BUSINESSES, SEED_POSTS, SEED_CATEGORIES } from '@adsspot/api';
import { colors } from '@adsspot/ui';
import {
  Home,
  Wallet,
  Compass,
  Bookmark,
  User,
  Heart,
  MessageCircle,
  Share2,
  ShieldCheck,
  Crown,
  MapPin,
  Plus,
} from 'lucide-react';

function MobileAppInner() {
  const { user, role, switchPersona, personas } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'wallet' | 'explore' | 'saved' | 'profile'>('home');
  const [panelMode, setPanelMode] = useState<'consumer' | 'merchant' | 'sm'>('consumer');

  const isMerchant = role === 'merchant';
  const isSM = role === 'sm';

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. DEV PERSONA SWITCHER BAR */}
      <View style={styles.devBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.devBarScroll}>
          <Text style={styles.devBarLabel}>⚡ Fast Role:</Text>
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

      {/* 2. TOP BRAND HEADER */}
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>A</Text>
          </View>
          <View>
            <Text style={styles.logoTitle}>
              Ads<Text style={{ color: colors.spotBlue }}>spot</Text>
            </Text>
            <View style={styles.locationPill}>
              <MapPin size={10} color={colors.spotBlue} />
              <Text style={styles.locationText}>Fort, Mumbai 400001</Text>
            </View>
          </View>
        </View>

        {/* User Avatar with 12px rounded square */}
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

          <Image
            source={{ uri: user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* 3. MAIN CONTENT CONTAINER */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* STORIES RAIL (Strictly Elite Businesses) */}
        <View style={styles.storiesSection}>
          <Text style={styles.sectionHeading}>Elite Stories &amp; Daily Highlights</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesScroll}>
            {/* Add Story / Your Status */}
            <View style={styles.storyItem}>
              <View style={[styles.storyAvatarWrapper, styles.storyAvatarAdd]}>
                <Image
                  source={{ uri: user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' }}
                  style={styles.storyImage}
                />
                <View style={styles.addBadge}>
                  <Plus size={12} color="#FFFFFF" />
                </View>
              </View>
              <Text style={styles.storyName} numberOfLines={1}>
                {user?.role === 'merchant' && user.business_profile?.tier === 'elite' ? 'Add Story' : 'Your Feed'}
              </Text>
            </View>

            {/* Elite Business Stories */}
            {SEED_BUSINESSES.map((biz) => (
              <View key={biz.id} style={styles.storyItem}>
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
              </View>
            ))}
          </ScrollView>
        </View>

        {/* EXPLORE CATEGORIES QUICK RAIL */}
        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {SEED_CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryChip}>
                <Text style={styles.categoryChipText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FEED POSTS */}
        <View style={styles.feedSection}>
          {SEED_POSTS.map((post) => {
            const fallbackBiz = SEED_BUSINESSES[0]!;
            const biz = SEED_BUSINESSES.find((b) => b.id === post.business_id) ?? fallbackBiz;
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

                  <TouchableOpacity style={styles.followBtn}>
                    <Text style={styles.followBtnText}>Follow</Text>
                  </TouchableOpacity>
                </View>

                {/* Post Image */}
                <Image source={{ uri: post.image_urls[0] }} style={styles.postImage} />

                {/* Post Actions Row */}
                <View style={styles.postActions}>
                  <View style={styles.postActionsLeft}>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Heart size={20} color={colors.ink} />
                      <Text style={styles.actionCount}>{post.likes_count}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                      <MessageCircle size={20} color={colors.ink} />
                      <Text style={styles.actionCount}>{post.comments_count}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
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

          {/* Raised Center ● Explore Action */}
          <TouchableOpacity
            onPress={() => setActiveTab('explore')}
            style={styles.raisedCenterBtn}
            activeOpacity={0.9}
          >
            <View style={styles.raisedCenterInner}>
              <Compass size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.exploreLabel}>● Explore</Text>
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
    <AuthProvider>
      <MobileAppInner />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    maxWidth: 480,
    marginHorizontal: 'auto',
    width: '100%',
    height: '100%',
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
    gap: 8,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#17181C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#17181C',
    letterSpacing: -0.5,
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
    borderRadius: 12, // STRICT: 12px rounded square
    backgroundColor: '#EDF4FF',
  },
  content: {
    flex: 1,
  },
  storiesSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E8EF',
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
    shadowColor: '#4787F2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12, // STRICT: 12px rounded square
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
  categoryChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A5260',
  },
  feedSection: {
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 12,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16, // STRICT: 16px card radius
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
    borderRadius: 12, // STRICT: 12px rounded square
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
  followBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4787F2',
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
    borderRadius: 9999,
    backgroundColor: '#4787F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#4787F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  exploreLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4787F2',
    marginTop: 2,
  },
});
