import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { dataService, LearningArticle } from '@aquasustain/shared';
import { COLORS } from '../theme/colors';

export const LearningScreen: React.FC = () => {
  const articles = dataService.getArticles();
  const user = dataService.getCurrentUser();
  const lang = user.preferredLanguage;

  const [selectedArticle, setSelectedArticle] = useState<LearningArticle | null>(null);

  if (selectedArticle) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setSelectedArticle(null)}
          >
            <Text style={styles.backText}>&larr; Back to Guides</Text>
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.articleCat}>
              {selectedArticle.category.replace('_', ' ')}
            </Text>
            <Text style={styles.articleTitle}>
              {selectedArticle.title[lang] || selectedArticle.title.en}
            </Text>
            <Text style={styles.articleAuthor}>
              By {selectedArticle.author} ({selectedArticle.authorRole})
            </Text>

            <Text style={styles.articleBody}>
              {selectedArticle.contentMarkdown[lang] || selectedArticle.contentMarkdown.en}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Knowledge Center</Text>
          <Text style={styles.subtitle}>Field guides in English, Telugu and Hindi</Text>
        </View>

        {articles.map((art) => (
          <TouchableOpacity
            key={art.id}
            style={styles.card}
            onPress={() => setSelectedArticle(art)}
          >
            <Text style={styles.articleCat}>
              {art.category.replace('_', ' ')} • {art.readingTimeMinutes} min
            </Text>
            <Text style={styles.articleCardTitle}>
              {art.title[lang] || art.title.en}
            </Text>
            <Text style={styles.articleCardSummary} numberOfLines={2}>
              {art.summary[lang] || art.summary.en}
            </Text>
            <Text style={styles.readMoreText}>Read Guide &rarr;</Text>
          </TouchableOpacity>
        ))}
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
  backBtn: { marginBottom: 4 },
  backText: { color: COLORS.teal, fontSize: 12, fontWeight: '700' },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  articleCat: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.teal,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  articleTitle: { fontSize: 18, fontWeight: '800', color: COLORS.primary, lineHeight: 24 },
  articleAuthor: { fontSize: 10, color: COLORS.textSecondary, marginTop: 4, marginBottom: 12 },
  articleBody: { fontSize: 12, color: COLORS.textPrimary, lineHeight: 20 },
  articleCardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginTop: 2 },
  articleCardSummary: { fontSize: 11, color: COLORS.textSecondary, marginTop: 4, lineHeight: 16 },
  readMoreText: { fontSize: 11, fontWeight: '700', color: COLORS.teal, marginTop: 8 },
});
