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

export const RemindersScreen: React.FC = () => {
  const [reminders, setReminders] = useState(dataService.getReminders());
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Water Quality Testing' as any,
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '06:00',
    priority: 'High' as any,
  });

  const handleToggle = (id: string) => {
    dataService.toggleReminderStatus(id);
    setReminders(dataService.getReminders());
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      Alert.alert('Required', 'Please enter a reminder title');
      return;
    }
    dataService.addReminder(form);
    setReminders(dataService.getReminders());
    setShowAdd(false);
    setForm({
      title: '',
      description: '',
      category: 'Water Quality Testing',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '06:00',
      priority: 'High',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Reminders & Tasks</Text>
            <Text style={styles.subtitle}>Pond maintenance schedules</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAdd(!showAdd)}
          >
            <Text style={styles.addBtnText}>{showAdd ? 'Cancel' : '+ New Task'}</Text>
          </TouchableOpacity>
        </View>

        {showAdd && (
          <View style={styles.card}>
            <Text style={styles.formTitle}>Create Task Reminder</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={form.title}
                onChangeText={(v) => setForm({ ...form, title: v })}
                placeholder="e.g. Test morning DO"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Due Date</Text>
              <TextInput
                style={styles.input}
                value={form.dueDate}
                onChangeText={(v) => setForm({ ...form, dueDate: v })}
              />
            </View>

            <TouchableOpacity style={styles.btnPrimary} onPress={handleSave}>
              <Text style={styles.btnText}>Save Reminder</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardHeader}>My Reminders</Text>
          {reminders.map((rem) => {
            const isDone = rem.status === 'Completed';

            return (
              <TouchableOpacity
                key={rem.id}
                style={[styles.remRow, isDone && { opacity: 0.5 }]}
                onPress={() => handleToggle(rem.id)}
              >
                <View style={[styles.checkbox, isDone && styles.checkboxDone]}>
                  {isDone && <Text style={styles.checkMark}>✓</Text>}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.remTitle, isDone && { textDecorationLine: 'line-through' }]}>
                    {rem.title}
                  </Text>
                  <Text style={styles.remMeta}>
                    Due {rem.dueDate} at {rem.dueTime} • {rem.category}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
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
  remRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: COLORS.teal,
  },
  checkMark: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '900',
  },
  remTitle: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  remMeta: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2 },
});
