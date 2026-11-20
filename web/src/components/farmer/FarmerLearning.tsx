import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LearningArticle } from '@aquasustain/shared';
import {
  BookOpen,
  Search,
  Clock,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Share2,
  Bookmark,
  Sparkles,
} from 'lucide-react';

export const FarmerLearning: React.FC = () => {
  const { articles, language, t } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<LearningArticle | null>(null);

  const categories = [
    { id: 'all', label: t('categoryAll') },
    { id: 'water_management', label: t('categoryWater') },
    { id: 'feed_management', label: t('categoryFeed') },
    { id: 'disease_awareness', label: t('categoryDisease') },
    { id: 'sustainable_aquaculture', label: t('categorySustainable') },
    { id: 'pond_maintenance', label: t('categoryMaintenance') },
    { id: 'waste_management', label: t('categoryWaste') },
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCat = activeCategory === 'all' || art.category === activeCategory;
    const titleText = art.title[language] || art.title.en;
    const summaryText = art.summary[language] || art.summary.en;
    const matchesSearch =
      titleText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summaryText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* If an article is selected, display the full Article Reader */}
      {selectedArticle ? (
        <div className="aqua-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedArticle(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-ocean-700 hover:text-ocean-900 transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </button>

          {/* Article Header */}
          <div className="space-y-3 pb-6 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 uppercase">
                {selectedArticle.category.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{selectedArticle.readingTimeMinutes} min read</span>
              </span>
              {selectedArticle.verifiedByExpert && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified by {selectedArticle.expertName}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-ocean-900 font-heading leading-tight">
              {selectedArticle.title[language] || selectedArticle.title.en}
            </h1>

            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              {selectedArticle.summary[language] || selectedArticle.summary.en}
            </p>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
              <span>
                By <strong className="text-ocean-900">{selectedArticle.author}</strong> • {selectedArticle.authorRole}
              </span>
              <span>Published {selectedArticle.publishedDate}</span>
            </div>
          </div>

          {/* Article Body Content */}
          <div className="prose prose-slate max-w-none text-sm text-slate-800 leading-relaxed space-y-4">
            <div
              className="whitespace-pre-line leading-relaxed font-normal"
              style={{
                fontFamily:
                  language === 'te'
                    ? '"Noto Sans Telugu", sans-serif'
                    : language === 'hi'
                    ? '"Noto Sans Devanagari", sans-serif'
                    : 'inherit',
              }}
            >
              {selectedArticle.contentMarkdown[language] || selectedArticle.contentMarkdown.en}
            </div>
          </div>

          {/* Tags & Action Bar */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedArticle.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium">
                  #{tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => setSelectedArticle(null)}
              className="px-4 py-2 bg-ocean-700 text-white rounded-xl text-xs font-bold hover:bg-ocean-800 transition"
            >
              Done Reading
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Main Hub Header */}
          <div className="bg-gradient-to-r from-ocean-800 to-ocean-700 p-6 sm:p-8 rounded-2xl text-white shadow-card space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-ocean-100 border border-white/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Multilingual Knowledge Base</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
              {t('learningTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-ocean-100 max-w-2xl leading-relaxed">
              {t('learningSubtitle')}
            </p>

            {/* Search Input */}
            <div className="pt-2 max-w-md">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, diseases, DO management, FCR..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-white text-ocean-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ocean-500 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeCategory === c.id
                    ? 'bg-ocean-800 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Article Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => {
              const title = article.title[language] || article.title.en;
              const summary = article.summary[language] || article.summary.en;

              return (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="aqua-card-interactive p-5 cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 uppercase tracking-wide">
                        {article.category.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readingTimeMinutes} min</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-ocean-900 font-heading leading-snug">
                      {title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">
                      By <strong>{article.author}</strong>
                    </span>

                    <span className="inline-flex items-center gap-1 font-bold text-ocean-600 hover:text-ocean-800">
                      <span>{t('readArticle')}</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
