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

export const WaterQualityScreen: React.FC = () => {
  const ponds = dataService.getPonds();
  const [readings, setReadings] = useState(dataService.getWaterReadings());
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({
    pondId: ponds[0]?.id || 'pond-01',
    dissolvedOxygenMgL: 5.8,
    ph: 8.0,
    temperatureC: 28.2,
    transparencyCm: 36,
    ammoniaPpm: 0.08,
    nitritePpm: 0.15,
    salinityPpt: 18.0,
    alkalinityPpm: 135,
    notes: 'Handheld probe test',
  });

  const handleSave = () => {
    const pond = ponds.find((p) => p.id === form.pondId);
    try {
      dataService.addWaterReading({
        ...form,
        pondName: pond?.name || 'Selected Pond',
      });
      setReadings(dataService.getWaterReadings());
      setShowAdd(false);
      Alert.alert('Success', 'Water quality test recorded');
    } catch (e) {
      Alert.alert('Error', 'Failed to save test reading');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Water Quality Testing</Text>
            <Text style={styles.subtitle}>Historical tests & parameters</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAdd(!showAdd)}
          >
            <Text style={styles.addBtnText}>{showAdd ? 'Cancel' : '+ New Test'}</Text>
          </TouchableOpacity>
        </View>

        {/* Add Form Accordion */}
        {showAdd && (
          <View style={styles.card}>
            <Text style={styles.formTitle}>Record New Water Test</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dissolved Oxygen (mg/L) *</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(form.dissolvedOxygenMgL)}
                onChangeText={(v) => setForm({ ...form, dissolvedOxygenMgL: parseFloat(v) || 0 })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>pH Value *</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(form.ph)}
                onChangeText={(v) => setForm({ ...form, ph: parseFloat(v) || 0 })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Temperature (°C)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(form.temperatureC)}
                onChangeText={(v) => setForm({ ...form, temperatureC: parseFloat(v) || 0 })}
              />
            </View>

            <TouchableOpacity style={styles.btnPrimary} onPress={handleSave}>
              <Text style={styles.btnText}>Save Test Record</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Readings List */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Recent Water Tests</Text>
          {readings.map((r) => (
            <View key={r.id} style={styles.readingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.readingPond}>{r.pondName}</Text>
                <Text style={styles.readingTime}>
                  {new Date(r.timestamp).toLocaleDateString()} at {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>

              <View style={styles.paramBox}>
                <Text style={styles.paramVal}>{r.dissolvedOxygenMgL} mg/L</Text>
                <Text style={styles.paramLabel}>DO</Text>
              </View>

              <View style={styles.paramBox}>
                <Text style={styles.paramVal}>{r.ph}</Text>
                <Text style={styles.paramLabel}>pH</Text>
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
  readingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  readingPond: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  readingTime: { fontSize: 10, color: COLORS.textSecondary, marginTop: 1 },
  paramBox: {
    backgroundColor: '#F8FAF9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  paramVal: { fontSize: 11, fontWeight: '800', color: COLORS.primary },
  paramLabel: { fontSize: 8, color: COLORS.textSecondary, fontWeight: '700' },
});
