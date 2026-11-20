import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { dataService } from '@aquasustain/shared';
import { COLORS } from '../theme/colors';

export const FeedScreen: React.FC = () => {
  const ponds = dataService.getPonds();
  const [feedRecords, setFeedRecords] = useState(dataService.getFeedRecords());
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({
    pondId: ponds[0]?.id || 'pond-01',
    date: new Date().toISOString().split('T')[0],
    feedSlot: 'Morning (06:00)' as any,
    feedBrand: 'CP Grower 35%',
    feedType: 'Grower (1.4mm-1.8mm)' as any,
    quantityKg: 35,
    unitPricePerKg: 88,
    checkTrayObservation: 'Clean (Nominal)' as any,
  });

  const handleSaveFeed = () => {
    const pond = ponds.find((p) => p.id === form.pondId);
    try {
      dataService.addFeedRecord({
        ...form,
        pondName: pond?.name || 'Selected Pond',
      });
      setFeedRecords(dataService.getFeedRecords());
      setShowAdd(false);
      Alert.alert('Saved', 'Feed log recorded successfully');
    } catch (e) {
      Alert.alert('Error', 'Failed to save feed');
    }
  };

  const todayKg = feedRecords
    .filter((f) => f.date === form.date)
    .reduce((sum, item) => sum + item.quantityKg, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Feed & FCR Control</Text>
            <Text style={styles.subtitle}>Daily check-tray tracking</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAdd(!showAdd)}
          >
            <Text style={styles.addBtnText}>{showAdd ? 'Cancel' : '+ Record Feed'}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick KPI */}
        <View style={styles.kpiBox}>
          <Text style={styles.kpiNum}>{todayKg} kg</Text>
          <Text style={styles.kpiLabel}>Feed Dispatched Today</Text>
        </View>

        {showAdd && (
          <View style={styles.card}>
            <Text style={styles.formTitle}>Record Pond Feed Slot</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quantity (kg) *</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(form.quantityKg)}
                onChangeText={(v) => setForm({ ...form, quantityKg: parseFloat(v) || 0 })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Feed Brand / Formula</Text>
              <TextInput
                style={styles.input}
                value={form.feedBrand}
                onChangeText={(v) => setForm({ ...form, feedBrand: v })}
              />
            </View>

            <TouchableOpacity style={styles.btnPrimary} onPress={handleSaveFeed}>
              <Text style={styles.btnText}>Save Feed Record</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Recent Feed Records</Text>
          {feedRecords.map((f) => (
            <View key={f.id} style={styles.feedRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.feedPond}>{f.pondName}</Text>
                <Text style={styles.feedSlot}>{f.feedSlot} • {f.date}</Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.feedKg}>{f.quantityKg} kg</Text>
                <Text style={styles.feedCost}>₹{f.totalCost}</Text>
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
  container: { padding: 16, gap: 14 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  subtitle: { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },
  addBtn: {
    backgroundColor: COLORS.teal,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 11 },
  kpiBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  kpiNum: { fontSize: 26, fontWeight: '800', color: '#92400E' },
  kpiLabel: { fontSize: 11, fontWeight: '700', color: '#B45309', marginTop: 2 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formTitle: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 10 },
  cardHeader: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 10 },
  inputGroup: { marginBottom: 10 },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 3 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  btnPrimary: {
    backgroundColor: COLORS.teal,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  btnText: { color: COLORS.white, fontWeight: '700', fontSize: 12 },
  feedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  feedPond: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  feedSlot: { fontSize: 10, color: COLORS.textSecondary, marginTop: 1 },
  feedKg: { fontSize: 12, fontWeight: '800', color: COLORS.primary },
  feedCost: { fontSize: 10, color: COLORS.teal, fontWeight: '700' },
});
