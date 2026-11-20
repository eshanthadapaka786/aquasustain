import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { dataService } from '@aquasustain/shared';
import { COLORS } from '../theme/colors';

export const WeatherScreen: React.FC = () => {
  const weather = dataService.getWeather();
  const user = dataService.getCurrentUser();
  const lang = user.preferredLanguage;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Coastal Weather Station</Text>
          <Text style={styles.subtitle}>{weather.location}, {weather.state}</Text>
        </View>

        {/* Current Telemetry Card */}
        <View style={styles.mainCard}>
          <Text style={styles.tempNum}>{weather.current.tempC}°C</Text>
          <Text style={styles.conditionText}>{weather.current.condition}</Text>
          <Text style={styles.feelsLike}>Feels like {weather.current.feelsLikeC}°C</Text>

          <View style={styles.metricGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{weather.current.humidityPercent}%</Text>
              <Text style={styles.metricLabel}>Humidity</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{weather.current.windSpeedKmh} km/h</Text>
              <Text style={styles.metricLabel}>Wind</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{weather.current.rainfall24hMm} mm</Text>
              <Text style={styles.metricLabel}>Rainfall</Text>
            </View>
          </View>
        </View>

        {/* 5-Day Forecast */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>5-Day Forecast</Text>
          {weather.forecast.map((day) => (
            <View key={day.date} style={styles.forecastRow}>
              <Text style={styles.forecastDay}>{day.dayLabel}</Text>
              <Text style={styles.forecastCond}>{day.condition}</Text>
              <Text style={styles.forecastTemp}>{day.maxTempC}° / {day.minTempC}°</Text>
              <Text style={styles.forecastRain}>{day.rainProbabilityPercent}%</Text>
            </View>
          ))}
        </View>

        {/* Coastal Farm Advisories */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Aquaculture Advisories</Text>
          {weather.advisories.map((adv) => (
            <View key={adv.id} style={styles.advBox}>
              <Text style={styles.advTitle}>⚠️ {adv.title[lang] || adv.title.en}</Text>
              <Text style={styles.advMsg}>{adv.message[lang] || adv.message.en}</Text>
              <Text style={styles.advImpact}>
                Impact: {adv.aquacultureImpact[lang] || adv.aquacultureImpact.en}
              </Text>
            </View>
          ))}
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
  mainCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  tempNum: { fontSize: 44, fontWeight: '900', color: COLORS.white },
  conditionText: { fontSize: 14, fontWeight: '700', color: COLORS.mint, marginTop: 2 },
  feelsLike: { fontSize: 11, color: '#DDF3EC', marginTop: 2 },
  metricGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: 14,
  },
  metricItem: { flex: 1, alignItems: 'center' },
  metricVal: { fontSize: 14, fontWeight: '800', color: COLORS.white },
  metricLabel: { fontSize: 9, color: '#DDF3EC', marginTop: 2 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 10 },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  forecastDay: { width: 70, fontSize: 11, fontWeight: '700', color: COLORS.primary },
  forecastCond: { flex: 1, fontSize: 10, color: COLORS.textSecondary },
  forecastTemp: { width: 60, fontSize: 11, fontWeight: '700', color: COLORS.primary, textAlign: 'right' },
  forecastRain: { width: 45, fontSize: 10, fontWeight: '700', color: COLORS.teal, textAlign: 'right' },
  advBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  advTitle: { fontSize: 11, fontWeight: '800', color: '#92400E' },
  advMsg: { fontSize: 10, color: '#78350F', marginTop: 4, lineHeight: 15 },
  advImpact: { fontSize: 10, color: '#B45309', marginTop: 4, fontWeight: '700' },
});
