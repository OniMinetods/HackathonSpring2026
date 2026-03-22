import { GreenStackButton } from '@components/GreenStackButton';
import { Colors } from '@constants/colors';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from 'src/features/auth/hooks/useAuth';
import {
  fetchDailyResultToday,
  saveDailyResultToday,
} from 'src/features/tasks/api/dailyResultApi';

function parseVolume(v: string): number {
  const n = parseFloat(v.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function parseIntSafe(v: string): number {
  const n = parseInt(v.replace(/\D/g, ''), 10);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

export default function DayResultsScreen() {
  const router = useRouter();
  const { token } = useAuth();

  const [deals, setDeals] = useState('0');
  const [volume, setVolume] = useState('0');
  const [products, setProducts] = useState('0');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedHint, setSavedHint] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token?.trim()) {
      setError('Войдите в аккаунт.');
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const d = await fetchDailyResultToday(token);
      setDeals(String(d.deals_count ?? 0));
      const vol =
        typeof d.credit_volume_million === 'number'
          ? d.credit_volume_million
          : parseFloat(String(d.credit_volume_million ?? 0));
      setVolume(String(Number.isFinite(vol) ? vol : 0));
      setProducts(String(d.extra_products_count ?? 0));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const onSave = async () => {
    if (!token?.trim()) {
      return;
    }
    setSaving(true);
    setError(null);
    setSavedHint(null);
    try {
      await saveDailyResultToday(token, {
        deals_count: parseIntSafe(deals),
        credit_volume_million: parseVolume(volume),
        extra_products_count: parseIntSafe(products),
      });
      setSavedHint('Сохранено');
      setTimeout(() => setSavedHint(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось сохранить');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require('../shared/lib/public/img/sberBackground.png')}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.root}>
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.back}>Назад</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.screenTitle}>Результаты дня</Text>
          <Text style={styles.lead}>
            Внесите фактические показатели за сегодня
          </Text>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color={Colors.primaryGreenFourth} />
            </View>
          ) : (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {error && <Text style={styles.error}>{error}</Text>}
              <Field
                label="Оформлено сделок за день, шт."
                value={deals}
                onChangeText={setDeals}
                keyboardType="number-pad"
              />
              <Field
                label="Объём кредитов в день, млн руб."
                value={volume}
                onChangeText={setVolume}
                keyboardType="decimal-pad"
              />
              <Field
                label="Оформлено доп. продуктов за день, шт."
                value={products}
                onChangeText={setProducts}
                keyboardType="number-pad"
              />
              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={() => void onSave()}
                disabled={saving}
                activeOpacity={0.85}
              >
                {saving ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.saveBtnText}>Сохранить</Text>
                )}
              </TouchableOpacity>
              {savedHint && (
                <Text style={styles.savedHint}>{savedHint}</Text>
              )}
              <View style={styles.detailWrap}>
                <GreenStackButton title="Детализация" href="/rating-detail" />
              </View>
              <Text style={styles.detailHint}>
                Переход к экрану «Детализация рейтинга»
              </Text>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType: 'number-pad' | 'decimal-pad';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor={Colors.primaryGrey}
        placeholder="0"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  flex: { flex: 1 },
  root: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 12,
    backgroundColor: Colors.black50,
  },
  topBar: {
    marginBottom: 8,
  },
  back: {
    color: Colors.primaryGreenFourth,
    fontSize: 20,
    fontWeight: '600',
  },
  screenTitle: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lead: {
    color: Colors.primaryGrey,
    fontSize: 15,
    marginBottom: 16,
  },
  center: {
    paddingVertical: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    gap: 14,
  },
  error: {
    color: '#ff8a80',
    fontSize: 15,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    color: Colors.primaryGrey,
    fontSize: 15,
  },
  input: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  saveBtn: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 18,
    backgroundColor: Colors.primaryGreenFirst,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
  savedHint: {
    color: Colors.primaryGreenFourth,
    fontSize: 15,
    textAlign: 'center',
  },
  detailWrap: {
    marginTop: 12,
  },
  detailHint: {
    color: Colors.primaryGrey,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
});
