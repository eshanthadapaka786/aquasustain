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

export const ExpensesScreen: React.FC = () => {
  const farms = dataService.getFarms();
  const [expenses, setExpenses] = useState(dataService.getExpenses());
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({
    farmId: farms[0]?.id || 'farm-01',
    date: new Date().toISOString().split('T')[0],
    category: 'Feed' as any,
    amount: 12000,
    description: '',
    vendorName: 'Agro Agency',
    paymentMode: 'UPI' as any,
  });

  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  const handleSave = () => {
    const farm = farms.find((f) => f.id === form.farmId);
    try {
      dataService.addExpense({
        ...form,
        farmName: farm?.name || 'Selected Farm',
      });
      setExpenses(dataService.getExpenses());
      setShowAdd(false);
      Alert.alert('Saved', 'Expense transaction logged');
    } catch (e) {
      Alert.alert('Error', 'Failed to save expense');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Farm Expenses</Text>
            <Text style={styles.subtitle}>Production cost accounting</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAdd(!showAdd)}
          >
            <Text style={styles.addBtnText}>{showAdd ? 'Cancel' : '+ Add'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalNum}>₹{total.toLocaleString('en-IN')}</Text>
          <Text style={styles.totalLabel}>Total Operational Expenditure</Text>
        </View>

        {showAdd && (
          <View style={styles.card}>
            <Text style={styles.formTitle}>Record Farm Expense</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount (₹) *</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(form.amount)}
                onChangeText={(v) => setForm({ ...form, amount: parseFloat(v) || 0 })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={styles.input}
                value={form.description}
                onChangeText={(v) => setForm({ ...form, description: v })}
                placeholder="e.g. Probiotics and minerals"
              />
            </View>

            <TouchableOpacity style={styles.btnPrimary} onPress={handleSave}>
              <Text style={styles.btnText}>Save Expense</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Recent Expense Records</Text>
          {expenses.map((exp) => (
            <View key={exp.id} style={styles.expRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.expDesc}>{exp.description}</Text>
                <Text style={styles.expSub}>{exp.category} • {exp.date}</Text>
              </View>
              <Text style={styles.expAmount}>₹{exp.amount.toLocaleString('en-IN')}</Text>
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
  totalBox: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  totalNum: { fontSize: 26, fontWeight: '800', color: COLORS.primary },
  totalLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, marginTop: 2 },
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
  expRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  expDesc: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  expSub: { fontSize: 10, color: COLORS.textSecondary, marginTop: 1 },
  expAmount: { fontSize: 13, fontWeight: '800', color: COLORS.primary },
});
