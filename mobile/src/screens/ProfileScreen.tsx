import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { dataService, LanguageCode } from '@aquasustain/shared';
import { COLORS } from '../theme/colors';

export const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState(dataService.getCurrentUser());

  const handleLanguageChange = (lang: LanguageCode) => {
    dataService.setLanguage(lang);
    setUser(dataService.getCurrentUser());
    Alert.alert('Language Updated', `Switched language to ${lang.toUpperCase()}`);
  };

  const handleReset = () => {
    Alert.alert('Reset Data', 'Reset session data to demonstration baseline?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          dataService.resetToDemoData();
          setUser(dataService.getCurrentUser());
          Alert.alert('Done', 'Session reset to initial baseline');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Farmer Account & Settings</Text>
          <Text style={styles.subtitle}>Verified Coastal Aquaculture Producer</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userSub}>{user.phone}</Text>
              <Text style={styles.userLoc}>{user.village}, {user.district}</Text>
            </View>
          </View>
        </View>

        {/* Language Selection */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Language Selection (భాష / भाषा)</Text>
          <Text style={styles.cardSub}>
            AquaSustain is fully localized for coastal farmers.
          </Text>

          <View style={styles.langGrid}>
            {[
              { code: 'en' as LanguageCode, label: 'English', sub: 'Default' },
              { code: 'te' as LanguageCode, label: 'తెలుగు (Telugu)', sub: 'ఆంధ్రప్రదేశ్' },
              { code: 'hi' as LanguageCode, label: 'हिंदी (Hindi)', sub: 'उत्तर भारत' },
            ].map((item) => {
              const isSelected = user.preferredLanguage === item.code;
              return (
                <TouchableOpacity
                  key={item.code}
                  style={[styles.langBtn, isSelected && styles.langBtnActive]}
                  onPress={() => handleLanguageChange(item.code)}
                >
                  <Text style={[styles.langText, isSelected && styles.langTextActive]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.langSub, isSelected && styles.langSubActive]}>
                    {item.sub}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Reset Demo Data Button */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Demonstration Session Control</Text>
          <Text style={styles.cardSub}>
            AquaSustain runs on a local state service layer. You can reset anytime.
          </Text>

          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetBtnText}>Restore Initial Demo Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 16, gap: 14 },
  header: { marginBottom: 2 },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  subtitle: { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: COLORS.white, fontSize: 20, fontWeight: '800' },
  userName: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  userSub: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  userLoc: { fontSize: 11, color: COLORS.teal, marginTop: 2, fontWeight: '600' },
  cardHeader: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  cardSub: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2, marginBottom: 10 },
  langGrid: { gap: 8 },
  langBtn: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  langBtnActive: {
    backgroundColor: '#DDF3EC',
    borderColor: COLORS.teal,
  },
  langText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  langTextActive: { color: COLORS.darkTeal, fontWeight: '800' },
  langSub: { fontSize: 10, color: COLORS.textSecondary },
  langSubActive: { color: COLORS.teal, fontWeight: '700' },
  resetBtn: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 6,
  },
  resetBtnText: { color: '#991B1B', fontWeight: '700', fontSize: 12 },
});
