import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { SafeAreaView as SafeAreaContext } from 'react-native-safe-area-context';

export default function ArticleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const title = params.title as string || 'Article';
  const category = params.category as string || 'Education';
  const emoji = params.emoji as string || '📚';

  return (
    <SafeAreaContext style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="bookmark-outline" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="share-outline" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.emojiHero}>{emoji}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.authorRow}>
          <View style={styles.authorAvatar} />
          <View>
            <Text style={styles.authorName}>Medical Advisory Board</Text>
            <Text style={styles.dateText}>Reviewed by Dr. Smith · 3 min read</Text>
          </View>
        </View>

        <Text style={styles.body}>
          Understanding your body is the first step towards better health. {title} is an important topic because it directly affects your day-to-day well-being and overall cycle health.
          {"\n\n"}
          When you log your symptoms daily, our algorithm learns your unique patterns. This allows us to provide highly personalized predictions and insights tailored specifically to you.
          {"\n\n"}
          According to recent clinical studies, women who track their cycles are significantly more aware of hormonal fluctuations.
          {"\n\n"}
          **What can you do?**
          {"\n"}• Stay hydrated.
          {"\n"}• Maintain a balanced diet.
          {"\n"}• Consult your healthcare provider if you experience severe discomfort.
        </Text>

        <TouchableOpacity style={styles.premiumBanner} onPress={() => router.push('/paywall')}>
          <Text style={styles.premiumBannerText}>Unlock full medical reports with Serene Premium</Text>
          <Ionicons name="lock-closed" size={16} color={Colors.white} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaContext>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
  },
  iconBtn: { padding: Spacing.sm },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  scroll: { padding: Spacing.xl },
  emojiHero: { fontSize: 64, marginBottom: Spacing.md },
  categoryBadge: {
    alignSelf: 'flex-start', backgroundColor: Colors.primaryBg,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  categoryText: { color: Colors.primary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  title: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary, marginBottom: Spacing.lg, lineHeight: 34 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl },
  authorAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.lightGray },
  authorName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  dateText: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  body: { fontSize: 16, color: Colors.textSecondary, lineHeight: 26, marginBottom: Spacing.xl },
  premiumBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.primary, padding: Spacing.lg, borderRadius: BorderRadius.xl,
  },
  premiumBannerText: { color: Colors.white, fontSize: 14, fontWeight: '700', flex: 1, marginRight: Spacing.md },
});
