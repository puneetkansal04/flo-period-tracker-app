import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PostDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const title = params.title as string || 'Post';
  const author = params.author as string || 'Anonymous';
  const content = params.content as string || 'No content';
  const likes = parseInt(params.likes as string) || 0;
  
  const [isLiked, setIsLiked] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discussion</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="ellipsis-horizontal" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.authorRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{author[0]}</Text>
          </View>
          <View>
            <Text style={styles.authorName}>{author}</Text>
            <Text style={styles.timeText}>Just now</Text>
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setIsLiked(!isLiked)}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} color={isLiked ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.actionText, isLiked && {color: Colors.primary}]}>{likes + (isLiked ? 1 : 0)}</Text>
          </TouchableOpacity>
          <View style={styles.actionBtn}>
            <Ionicons name="chatbubble-outline" size={22} color={Colors.textSecondary} />
            <Text style={styles.actionText}>0</Text>
          </View>
        </View>

        <View style={styles.divider} />
        <Text style={styles.noComments}>No comments yet. Be the first!</Text>
      </ScrollView>

      <View style={styles.inputWrap}>
        <TextInput placeholder="Add a comment..." style={styles.input} placeholderTextColor={Colors.textMuted} />
        <TouchableOpacity style={styles.sendBtn} onPress={() => router.push('/paywall')}>
          <Ionicons name="send" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 17, fontWeight: '600', color: Colors.textPrimary },
  iconBtn: { padding: Spacing.sm },
  scroll: { padding: Spacing.xl },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.white, fontWeight: '700', fontSize: 18 },
  authorName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  timeText: { fontSize: 12, color: Colors.textSecondary },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  content: { fontSize: 16, color: Colors.textSecondary, lineHeight: 24, marginBottom: Spacing.xl },
  footer: { flexDirection: 'row', gap: Spacing.xl },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '500' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.lg },
  noComments: { textAlign: 'center', color: Colors.textMuted, marginTop: Spacing.lg },
  inputWrap: { flexDirection: 'row', padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border, gap: Spacing.md, alignItems: 'center' },
  input: { flex: 1, backgroundColor: Colors.offWhite, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.lg, paddingVertical: 12, fontSize: 15 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', paddingLeft: 4 }
});
