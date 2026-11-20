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
import { AssessmentInput, AssessmentResult } from '@aquasustain/shared';
import { COLORS } from '../theme/colors';

export const PondAssessmentScreen: React.FC = () => {
  const ponds = dataService.getPonds();
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const [formData, setFormData] = useState<AssessmentInput>({
    pondId: ponds[0]?.id || 'pond-01',
    waterTemperatureC: 28.5,
    ph: 7.9,
    dissolvedOxygenMgL: 5.6,
    transparencyCm: 35,
    ammoniaPpm: 0.1,
    feedIntakeCondition: 'Normal',
    stockBehaviour: 'Active and Schooling',
    mortalityObservations: 'None',
    waterColor: 'Light Green (Diatom)',
    aerationHoursPerDay: 14,
    wasteSludgeStatus: 'Clean / Skimmed',
  });

  const handleRunAssessment = () => {
    try {
      const res = dataService.runAssessment(formData);
      setResult(res);
      setStep(3);
    } catch (e) {
      Alert.alert('Error', 'Failed to run assessment calculation');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Pond Diagnostic Engine</Text>
          <Text style={styles.subtitle}>
            Multi-factor assessment based on Coastal Aquaculture Authority guidelines.
          </Text>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicatorRow}>
          <View style={[styles.stepBadge, step === 1 && styles.stepBadgeActive]}>
            <Text style={[styles.stepText, step === 1 && styles.stepTextActive]}>1. Water</Text>
          </View>
          <View style={[styles.stepBadge, step === 2 && styles.stepBadgeActive]}>
            <Text style={[styles.stepText, step === 2 && styles.stepTextActive]}>2. Biology</Text>
          </View>
          <View style={[styles.stepBadge, step === 3 && styles.stepBadgeActive]}>
            <Text style={[styles.stepText, step === 3 && styles.stepTextActive]}>3. Result</Text>
          </View>
        </View>

        {/* STEP 1: Water Chemistry */}
        {step === 1 && (
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>Water Chemistry Parameters</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dissolved Oxygen (DO) [mg/L]</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(formData.dissolvedOxygenMgL)}
                onChangeText={(v) => setFormData({ ...formData, dissolvedOxygenMgL: parseFloat(v) || 0 })}
              />
              <Text style={styles.hint}>Optimal: 5.0 - 8.5 mg/L</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Water pH Value</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(formData.ph)}
                onChangeText={(v) => setFormData({ ...formData, ph: parseFloat(v) || 0 })}
              />
              <Text style={styles.hint}>Optimal: 7.5 - 8.5</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Water Temperature (°C)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(formData.waterTemperatureC)}
                onChangeText={(v) => setFormData({ ...formData, waterTemperatureC: parseFloat(v) || 0 })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Secchi Transparency (cm)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(formData.transparencyCm)}
                onChangeText={(v) => setFormData({ ...formData, transparencyCm: parseFloat(v) || 0 })}
              />
              <Text style={styles.hint}>Optimal: 30 - 45 cm</Text>
            </View>

            <TouchableOpacity style={styles.btnPrimary} onPress={() => setStep(2)}>
              <Text style={styles.btnText}>Next: Biological Observations &rarr;</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: Biology & Behaviour */}
        {step === 2 && (
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>Stock Behaviour & Feeding</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Aerator Hours / Day</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(formData.aerationHoursPerDay)}
                onChangeText={(v) => setFormData({ ...formData, aerationHoursPerDay: parseFloat(v) || 0 })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Ammonia TAN (ppm)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(formData.ammoniaPpm || 0.1)}
                onChangeText={(v) => setFormData({ ...formData, ammoniaPpm: parseFloat(v) || 0 })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Check Tray Feed Intake</Text>
              <View style={styles.pillSelectorRow}>
                {['Normal', 'Slightly Reduced (-15%)', 'Refusing Feed'].map((cond) => (
                  <TouchableOpacity
                    key={cond}
                    style={[
                      styles.pillBtn,
                      formData.feedIntakeCondition === cond && styles.pillBtnActive,
                    ]}
                    onPress={() => setFormData({ ...formData, feedIntakeCondition: cond as any })}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        formData.feedIntakeCondition === cond && styles.pillTextActive,
                      ]}
                    >
                      {cond.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.btnSecondary} onPress={() => setStep(1)}>
                <Text style={styles.btnSecondaryText}>&larr; Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnPrimary, { flex: 1 }]} onPress={handleRunAssessment}>
                <Text style={styles.btnText}>Evaluate Health Score</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 3: Results */}
        {step === 3 && result && (
          <View style={styles.card}>
            <View style={styles.resultScoreBox}>
              <Text style={styles.resultScoreNum}>{result.overallScore}</Text>
              <Text style={styles.resultScoreSub}>/ 100 Pond Health Score</Text>
              <View style={styles.resultBadge}>
                <Text style={styles.resultBadgeText}>{result.status} Condition</Text>
              </View>
            </View>

            <Text style={styles.sectionHeaderTitle}>Factors Affecting Score</Text>
            {result.limitingFactors.map((factor, idx) => (
              <Text key={idx} style={styles.limitingItem}>• {factor}</Text>
            ))}

            <Text style={[styles.sectionHeaderTitle, { marginTop: 14 }]}>
              Actionable Recommendations
            </Text>
            {result.recommendations.map((rec) => (
              <View key={rec.id} style={styles.recBox}>
                <Text style={styles.recTitle}>{rec.title}</Text>
                <Text style={styles.recDesc}>{rec.description}</Text>
                <Text style={styles.recWhy}>Why: {rec.whyThisMatters}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.btnSecondary, { marginTop: 14 }]}
              onPress={() => setStep(1)}
            >
              <Text style={styles.btnSecondaryText}>Run Another Assessment</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 16, gap: 14 },
  header: { marginBottom: 4 },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  subtitle: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  stepIndicatorRow: { flexDirection: 'row', gap: 8 },
  stepBadge: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
  },
  stepBadgeActive: { backgroundColor: COLORS.teal },
  stepText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  stepTextActive: { color: COLORS.white },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardSectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginBottom: 12 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  hint: { fontSize: 10, color: COLORS.teal, marginTop: 2 },
  pillSelectorRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  pillBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  pillBtnActive: { backgroundColor: COLORS.teal, borderColor: COLORS.teal },
  pillText: { fontSize: 10, fontWeight: '600', color: COLORS.textSecondary },
  pillTextActive: { color: COLORS.white, fontWeight: '700' },
  btnPrimary: {
    backgroundColor: COLORS.teal,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { color: COLORS.white, fontWeight: '700', fontSize: 12 },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  btnSecondary: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnSecondaryText: { color: COLORS.primary, fontWeight: '700', fontSize: 12 },
  resultScoreBox: {
    backgroundColor: '#DDF3EC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  resultScoreNum: { fontSize: 36, fontWeight: '900', color: COLORS.primary },
  resultScoreSub: { fontSize: 11, fontWeight: '700', color: COLORS.darkTeal },
  resultBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 6,
  },
  resultBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: '700' },
  sectionHeaderTitle: { fontSize: 12, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  limitingItem: { fontSize: 11, color: '#92400E', marginVertical: 1 },
  recBox: {
    backgroundColor: '#F8FAF9',
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recTitle: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  recDesc: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2 },
  recWhy: { fontSize: 10, color: COLORS.teal, marginTop: 4, fontStyle: 'italic' },
});
