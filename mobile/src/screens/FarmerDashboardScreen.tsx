import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { dataService } from '@aquasustain/shared';
import { getTranslation } from '@aquasustain/shared';
import { COLORS } from '../theme/colors';

interface Props {
  navigation: any;
}

export const FarmerDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [user, setUser] = useState(dataService.getCurrentUser());
  const [farms, setFarms] = useState(dataService.getFarms());
  const [ponds, setPonds] = useState(dataService.getPonds());
  const [selectedPondId, setSelectedPondId] = useState(ponds[0]?.id || '');
  const [waterReadings, setWaterReadings] = useState(dataService.getWaterReadings());
  const [assessments, setAssessments] = useState(dataService.getAssessments());
  const [feedRecords, setFeedRecords] = useState(dataService.getFeedRecords());
  const [reminders, setReminders] = useState(dataService.getReminders());
  const [weather, setWeather] = useState(dataService.getWeather());

  const refresh = () => {
    setUser(dataService.getCurrentUser());
    setFarms(dataService.getFarms());
    const allPonds = dataService.getPonds();
    setPonds(allPonds);
    setWaterReadings(dataService.getWaterReadings());
    setAssessments(dataService.getAssessments());
    setFeedRecords(dataService.getFeedRecords());
    setReminders(dataService.getReminders());
    setWeather(dataService.getWeather());
  };

  useEffect(() => {
    const unsub = dataService.subscribe(refresh);
    return () => unsub();
  }, []);

  const lang = user.preferredLanguage;
  const t = (k: string) => getTranslation(lang, k);

  const activePond = ponds.find((p) => p.id === selectedPondId) || ponds[0];
  const latestAssessment = assessments[0];
  const latestReading = waterReadings[0];
  const pendingReminders = reminders.filter((r) => r.status === 'Pending').slice(0, 2);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Header Card */}
        <View style={styles.headerCard}>
          <Text style={styles.headerSubtitle}>
            {farms[0]?.name || 'Aqua Farm'} • {user.village}
          </Text>
          <Text style={styles.headerTitle}>
            {t('welcomeGreeting')}, {user.name}
          </Text>
          <Text style={styles.headerTagline}>
            Smart Aquaculture. Better Pond Management.
          </Text>

          {/* Quick Stats Pill Bar */}
          <View style={styles.statsPillRow}>
            <View style={styles.statsPill}>
              <Text style={styles.statsPillNum}>{ponds.length}</Text>
              <Text style={styles.statsPillLabel}>Ponds</Text>
            </View>
            <View style={styles.statsPill}>
              <Text style={styles.statsPillNum}>
                {latestReading ? latestReading.dissolvedOxygenMgL : '5.6'}
              </Text>
              <Text style={styles.statsPillLabel}>mg/L DO</Text>
            </View>
            <View style={styles.statsPill}>
              <Text style={styles.statsPillNum}>95 kg</Text>
              <Text style={styles.statsPillLabel}>Feed Today</Text>
            </View>
          </View>
        </View>

        {/* Quick Action Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('quickActionsTitle')}</Text>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: COLORS.teal }]}
            onPress={() => navigation.navigate('Assessment')}
          >
            <Text style={styles.actionIcon}>🩺</Text>
            <Text style={styles.actionTitle}>{t('actionAssessPond')}</Text>
            <Text style={styles.actionDesc}>Run diagnosis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: '#0284C7' }]}
            onPress={() => navigation.navigate('WaterQuality')}
          >
            <Text style={styles.actionIcon}>💧</Text>
            <Text style={styles.actionTitle}>{t('actionAddReading')}</Text>
            <Text style={styles.actionDesc}>DO & pH testing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: '#D99A38' }]}
            onPress={() => navigation.navigate('Feed')}
          >
            <Text style={styles.actionIcon}>⚖️</Text>
            <Text style={styles.actionTitle}>{t('actionRecordFeed')}</Text>
            <Text style={styles.actionDesc}>Check-trays</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: '#64748B' }]}
            onPress={() => navigation.navigate('Expenses')}
          >
            <Text style={styles.actionIcon}>💰</Text>
            <Text style={styles.actionTitle}>{t('actionAddExpense')}</Text>
            <Text style={styles.actionDesc}>Cost tracking</Text>
          </TouchableOpacity>
        </View>

        {/* Pond Assessment Health Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>{t('latestAssessmentTitle')}</Text>
            <View style={styles.badgeSuccess}>
              <Text style={styles.badgeText}>
                {latestAssessment ? latestAssessment.status : 'Optimal'}
              </Text>
            </View>
          </View>

          <View style={styles.scoreRow}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNum}>
                {latestAssessment ? latestAssessment.overallScore : 88}
              </Text>
              <Text style={styles.scoreSub}>/ 100</Text>
            </View>

            <View style={styles.scoreDetails}>
              <Text style={styles.scorePondName}>
                {activePond ? activePond.name : 'Pond A-1'}
              </Text>
              <Text style={styles.scoreLimiting}>
                {latestAssessment?.limitingFactors[0] || 'Parameters balanced'}
              </Text>
              <TouchableOpacity
                style={styles.inlineLinkBtn}
                onPress={() => navigation.navigate('Assessment')}
              >
                <Text style={styles.inlineLinkText}>View Diagnostics &rarr;</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Coastal Weather Advisory Alert */}
        <View style={styles.weatherAlert}>
          <Text style={styles.weatherAlertTitle}>
            ⚠️ {t('weatherAlertTitle')}
          </Text>
          <Text style={styles.weatherAlertMsg}>
            {weather.advisories[0]?.message[lang] || weather.advisories[0]?.message.en}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Weather')}
            style={styles.weatherLink}
          >
            <Text style={styles.weatherLinkText}>View 5-Day Farm Forecast &rarr;</Text>
          </TouchableOpacity>
        </View>

        {/* Priority Reminders */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>{t('upcomingRemindersTitle')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Reminders')}>
              <Text style={styles.link}>{t('actionViewAll')}</Text>
            </TouchableOpacity>
          </View>

          {pendingReminders.map((rem) => (
            <View key={rem.id} style={styles.remItem}>
              <Text style={styles.remIcon}>📅</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.remTitle}>{rem.title}</Text>
                <Text style={styles.remSub}>Due {rem.dueDate} at {rem.dueTime}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 16, gap: 16 },
  headerCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 18,
  },
  headerSubtitle: {
    color: COLORS.mint,
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  headerTagline: {
    color: '#DDF3EC',
    fontSize: 12,
    marginTop: 2,
  },
  statsPillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  statsPill: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  statsPillNum: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  statsPillLabel: {
    color: '#DDF3EC',
    fontSize: 10,
    marginTop: 2,
  },
  sectionHeader: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionBtn: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actionDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  badgeSuccess: {
    backgroundColor: '#DDF3EC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: COLORS.darkTeal,
    fontSize: 10,
    fontWeight: '700',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#DDF3EC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.teal,
  },
  scoreNum: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  scoreSub: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  scoreDetails: {
    flex: 1,
  },
  scorePondName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  scoreLimiting: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  inlineLinkBtn: {
    marginTop: 6,
  },
  inlineLinkText: {
    color: COLORS.teal,
    fontSize: 11,
    fontWeight: '700',
  },
  weatherAlert: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  weatherAlertTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  weatherAlertMsg: {
    fontSize: 11,
    color: '#78350F',
    marginTop: 4,
    lineHeight: 16,
  },
  weatherLink: {
    marginTop: 8,
  },
  weatherLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  link: {
    color: COLORS.teal,
    fontSize: 11,
    fontWeight: '700',
  },
  remItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  remIcon: {
    fontSize: 16,
  },
  remTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  remSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
});
