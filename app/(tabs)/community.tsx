import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MOCK_POSTS = [
  {
    id: 1,
    author: 'Anonymous',
    avatarColor: Colors.blueLight,
    time: '2h ago',
    title: 'Is this normal PMS or should I be worried?',
    content: 'I usually get mild cramps before my period, but this month it\'s been completely different and I feel exhausted. Anyone else experience sudden changes?',
    likes: 45,
    comments: 12,
    topic: 'Symptoms',
  },
  {
    id: 2,
    author: 'Secret User',
    avatarColor: Colors.greenLight,
    time: '5h ago',
    title: 'Trying to conceive - feeling overwhelmed',
    content: 'We\'ve been trying for 6 months now. It\'s hard to see pregnancy announcements everywhere when we\'re struggling. Just needed to vent in a safe space.',
    likes: 128,
    comments: 34,
    topic: 'TTC Journey',
  },
  {
    id: 3,
    author: 'Anonymous',
    avatarColor: Colors.orangeLight,
    time: '1d ago',
    title: 'First time using a menstrual cup!',
    content: 'Okay ladies, I finally did it and it\'s life changing! There is a learning curve but I highly recommend sticking with it.',
    likes: 210,
    comments: 45,
    topic: 'Period Care',
  }
];

export default function CommunityScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('For You');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Secret Chats</Text>
        <TouchableOpacity style={styles.premiumIcon} onPress={() => router.push('/paywall')}>
          <Text style={styles.premiumText}>✨</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textMuted} />
          <TextInput 
            placeholder="Search discussions..." 
            style={styles.searchInput}
            placeholderTextColor={Colors.textMuted}
          />
        </View>
      </View>

      <View style={styles.tabsRow}>
        {['For You', 'Trending', 'Following', 'My Chats'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Create post prompt */}
        <TouchableOpacity style={styles.createPostCard} onPress={() => router.push('/paywall')}>
          <View style={styles.createPostAvatar}><Text style={{color: Colors.white, fontWeight: '700'}}>A</Text></View>
          <Text style={styles.createPostText}>Ask an anonymous question...</Text>
          <Ionicons name="image-outline" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        {/* Posts */}
        {MOCK_POSTS.map(post => (
          <TouchableOpacity key={post.id} style={styles.postCard} activeOpacity={0.9} onPress={() => router.push(`/post-detail?title=${encodeURIComponent(post.title)}&content=${encodeURIComponent(post.content)}&author=${encodeURIComponent(post.author)}&likes=${post.likes}`)}>
            <View style={styles.postHeader}>
              <View style={styles.postAuthorInfo}>
                <View style={[styles.postAvatar, { backgroundColor: post.avatarColor }]} />
                <View>
                  <Text style={styles.postAuthor}>{post.author}</Text>
                  <Text style={styles.postTime}>{post.time} · {post.topic}</Text>
                </View>
              </View>
              <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textMuted} />
            </View>
            
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent} numberOfLines={3}>{post.content}</Text>
            
            <View style={styles.postFooter}>
              <View style={styles.actionBtn}>
                <Ionicons name="heart-outline" size={20} color={Colors.textSecondary} />
                <Text style={styles.actionText}>{post.likes}</Text>
              </View>
              <View style={styles.actionBtn}>
                <Ionicons name="chatbubble-outline" size={18} color={Colors.textSecondary} />
                <Text style={styles.actionText}>{post.comments}</Text>
              </View>
              <View style={{flex: 1}} />
              <Ionicons name="bookmark-outline" size={20} color={Colors.textSecondary} />
            </View>
          </TouchableOpacity>
        ))}
        
        <View style={{height: 40}} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/paywall')}>
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  premiumIcon: {
    backgroundColor: Colors.textPrimary,
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center'
  },
  premiumText: { fontSize: 18 },
  searchContainer: { backgroundColor: Colors.white, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.offWhite, borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    gap: Spacing.sm,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  tab: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.md },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.primary },
  scroll: { padding: Spacing.base },
  createPostCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: Spacing.md,
    gap: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  createPostAvatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center'
  },
  createPostText: { flex: 1, color: Colors.textSecondary, fontSize: 15 },
  postCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, marginBottom: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  postAuthorInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  postAvatar: { width: 40, height: 40, borderRadius: 20 },
  postAuthor: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  postTime: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  postTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  postContent: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.md },
  postFooter: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  }
});
