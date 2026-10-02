import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';

const commands = [
  {
    id: 'stash',
    title: 'git stash',
    badge: 'حفظ مؤقت',
    summary: 'يحفظ تغييراتك الحالية مؤقتًا دون فقدانها.',
    usage: `git stash

git stash save "WIP: feature in progress"
git stash -u
git stash --staged
git stash list
git stash pop
`,
    explanation: `تستخدم هذه الأوامر لإخفاء التغييرات الحالية مؤقتاً، ثم استعادتها لاحقاً عند الحاجة. مفيدة إذا كنت تريد التبديل إلى فرع آخر دون الالتزام بالتغييرات الحالية.`,
    example: `# لديك تغييرات غير ملتزمة
# تريد الانتقال إلى فرع آخر

git stash

git checkout main
# إصلاح الخلل

git checkout feature-branch
git stash pop
`,
  },
  {
    id: 'cherry-pick',
    title: 'git cherry-pick',
    badge: 'تطبيق Commit محدد',
    summary: 'يطبق commit محدد من فرع إلى فرع آخر.',
    usage: `git cherry-pick <commit-hash>
git cherry-pick <commit1> <commit2>
git cherry-pick -n <commit-hash>
git cherry-pick --continue
git cherry-pick --abort
`,
    explanation: `تستخدم cherry-pick عند رغبتك في أخذ تعديل معين من فرع دون دمج كامل الفرع. مناسب جدًا في حالة وجود fix واحد تريد نقله إلى فرع آخر.`,
    example: `git log develop --oneline

git checkout feature-branch
git cherry-pick abc123def

# إذا كانت هناك تعارضات:
git status
git add <file>
git cherry-pick --continue
`,
  },
  {
    id: 'revert',
    title: 'git revert',
    badge: 'إلغاء آمن',
    summary: 'ينشئ commit جديدًا يلغي تغييرات commit سابق.',
    usage: `git revert <commit-hash>
git revert HEAD
git revert -n <commit-hash>
git revert --continue
git revert --abort
`,
    explanation: `revert آمن جدًا على الفروع المشتركة لأنه لا يغير التاريخ، بل يضيف commit جديدًا يعكس الإلغاء. استخدمه عندما تريد إلغاء commit تم دفعه بالفعل إلى remote.`,
    example: `git log --oneline

git revert abc123

# إذا أردت إلغاء عدة commits:
git revert HEAD~2..HEAD

git push origin main
`,
  },
  {
    id: 'reset',
    title: 'git reset',
    badge: 'تحريك HEAD',
    summary: 'يغير نقطة المؤشر HEAD ويمكنه مسح التغييرات حسب الخيار.',
    usage: `git reset --soft HEAD~1
git reset --mixed HEAD~1
git reset --hard HEAD~3
git reset HEAD <file>
git reset <commit-hash> -- <file>
`,
    explanation: `reset قوي جدًا، ويمكن استخدامه لتعديل التاريخ المحلي. soft: يحافظ على التغييرات في staging، mixed: يزيل staging، hard: يحذف كل شيء نهائياً.`,
    example: `# إلغاء آخر commit مع الاحتفاظ بالتغييرات

git reset --soft HEAD~1

# التراجع إلى commit سابق تماماً

git reset --hard HEAD~3

# إلغاء staging لملف محدد
git reset HEAD app.js
`,
  },
];

export default function App() {
  const [selectedId, setSelectedId] = useState(commands[0].id);

  const selected = commands.find((cmd) => cmd.id === selectedId) || commands[0];

  const handleCopy = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('تم النسخ', 'تم نسخ الأمر بنجاح');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Git Master</Text>
        <Text style={styles.subtitle}>دليل أوامر Git المتقدمة</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>الأوامر الأساسية</Text>
        </View>

        {commands.map((cmd) => {
          const active = cmd.id === selectedId;
          return (
            <TouchableOpacity
              key={cmd.id}
              style={[styles.commandCard, active && styles.commandCardActive]}
              onPress={() => setSelectedId(cmd.id)}
              activeOpacity={0.9}
            >
              <View style={styles.cardHeaderRow}>
                <Text style={styles.commandTitle}>{cmd.title}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cmd.badge}</Text>
                </View>
              </View>
              <Text style={styles.summary}>{cmd.summary}</Text>
            </TouchableOpacity>
          );
        })}

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>{selected.title}</Text>
          <Text style={styles.detailText}>{selected.explanation}</Text>

          <View style={styles.box}>
            <View style={styles.boxHeader}>
              <Text style={styles.boxTitle}>الاستخدام</Text>
              <TouchableOpacity onPress={() => handleCopy(selected.usage)} style={styles.copyButton}>
                <Text style={styles.copyText}>نسخ</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.code}>{selected.usage}</Text>
          </View>

          <View style={styles.box}>
            <View style={styles.boxHeader}>
              <Text style={styles.boxTitle}>مثال عملي</Text>
              <TouchableOpacity onPress={() => handleCopy(selected.example)} style={styles.copyButton}>
                <Text style={styles.copyText}>نسخ</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.code}>{selected.example}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: 28,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#f8fafc',
    textAlign: 'right',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'right',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    textAlign: 'right',
    color: '#cbd5e1',
    fontSize: 18,
    fontWeight: '700',
  },
  commandCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  commandCardActive: {
    borderColor: '#38bdf8',
    backgroundColor: '#172554',
  },
  cardHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commandTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'right',
  },
  badge: {
    backgroundColor: '#0ea5e9',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700',
  },
  summary: {
    color: '#dbeafe',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'right',
  },
  detailCard: {
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  detailTitle: {
    color: '#f8fafc',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'right',
    marginBottom: 10,
  },
  detailText: {
    color: '#dbeafe',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'right',
    marginBottom: 18,
  },
  box: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  boxHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  boxTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
  },
  copyButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  copyText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  code: {
    color: '#bfdbfe',
    fontSize: 13,
    lineHeight: 22,
    fontFamily: 'monospace',
    textAlign: 'left',
  },
});
