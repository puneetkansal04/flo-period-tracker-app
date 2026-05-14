import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { LinearGradient } from 'expo-linear-gradient';

export default function PremiumModal({ visible, onClose, onSubscribe }: {
  visible: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}) {
  const features = [
    { icon: 'calendar', title: 'Advanced cycle predictions' },
    { icon: 'body', title: 'Daily health insights' },
    { icon: 'bar-chart', title: 'Symptom analysis' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <LinearGradient
            colors={[Colors.primary + '20', Colors.white]}
            style={styles.gradient}
          />
          
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.crownContainer}>
              <Ionicons name="ribbon" size={40} color={Colors.orange} />
            </View>
            <Text style={styles.title}>Go Premium</Text>
            <Text style={styles.subtitle}>Unlock all features and get the most out of Serene Cycle.</Text>
          </View>

          <View style={styles.features}>
            {[
              { icon: 'calendar-outline', title: 'Advanced cycle predictions', sub: 'Know exactly when your period starts' },
              { icon: 'stats-chart-outline', title: 'Daily health insights', sub: 'Personalized tips for your cycle phase' },
              { icon: 'analytics-outline', title: 'Symptom analysis', sub: 'Deep dive into your body patterns' },
              { icon: 'shield-checkmark-outline', title: 'Privacy & Security', sub: 'Your data is 100% private and safe' },
            ].map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name={f.icon as any} size={24} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureSub}>{f.sub}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.subscribeBtn} onPress={onSubscribe}>
            <Text style={styles.subscribeText}>Start My Free Trial</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.maybeLater} onPress={onClose}>
            <Text style={styles.maybeLaterText}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: Spacing.xl,
    paddingBottom: Spacing['5xl'],
    position: 'relative',
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: 0, left: 0, right: 0, height: 200,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: 8 },
  sectionIconBg: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  sectionIcon: { fontSize: 20 },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  crownContainer: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.orange + '15',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 24, fontWeight: '800', color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22,
  },
  features: {
    marginBottom: Spacing['2xl'],
    gap: Spacing.md,
  },
  featureIconContainer: { 
    width: 44, height: 44, borderRadius: 12, 
    backgroundColor: Colors.primary + '10', 
    alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md 
  },
  featureTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  featureSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  subscribeBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  subscribeText: {
    color: Colors.white, fontSize: 16, fontWeight: '700',
  },
  maybeLater: {
    alignItems: 'center',
  },
  maybeLaterText: {
    fontSize: 14, color: Colors.textMuted, fontWeight: '600',
  },
});
