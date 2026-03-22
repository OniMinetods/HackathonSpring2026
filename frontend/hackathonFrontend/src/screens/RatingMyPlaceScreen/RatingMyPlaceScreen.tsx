import { RatingDealerTop } from '@components/RatingScreenComponents/RatingDealerTop';
import { RatingMyRank } from '@components/RatingScreenComponents/RatingMyRank';
import { RatingRegionTop } from '@components/RatingScreenComponents/RatingRegionTop';
import { Colors } from '@constants/colors';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from 'src/features/auth/hooks/useAuth';
import { fetchDealerCenterRating } from 'src/features/rating/api/dealerCenterRatingApi';
import type { DealerCenterRatingResponse } from 'src/features/rating/api/dealerCenterRatingTypes';

export default function RatingMyPlaceScreen() {
  const router = useRouter();
  const { token, refreshProfile } = useAuth();
  const [data, setData] = useState<DealerCenterRatingResponse | null>(null);
  const [highlightUserId, setHighlightUserId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token?.trim()) {
      setError('Нет авторизации');
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const freshUser = await refreshProfile();
      const rating = await fetchDealerCenterRating(token);
      setData(rating);
      if (freshUser?.id != null) {
        setHighlightUserId(freshUser.id);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [token, refreshProfile]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const hasDealer = Boolean((data?.dealer_code ?? '').trim());
  const myRank = data?.my_rank ?? null;
  const top10 = data?.top_10 ?? [];
  const dealerTotals = data?.dealer_totals_top ?? [];
  const myDealerCode = (data?.dealer_code ?? '').trim();

  return (
    <ImageBackground
      style={styles.background}
      source={require('../../shared/lib/public/img/sberBackground.png')}
      resizeMode="cover"
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
        <Text style={styles.screenTitle}>Мое место в компании</Text>
        {error && !loading && (
          <Text style={styles.errorBanner}>{error}</Text>
        )}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <RatingMyRank loading={loading} myRank={myRank} />
          <RatingDealerTop
            loading={loading}
            rows={top10}
            currentUserId={highlightUserId}
            hasDealerCode={hasDealer}
          />
          <RatingRegionTop
            loading={loading}
            rows={dealerTotals}
            myDealerCode={myDealerCode}
          />
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
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
    marginBottom: 16,
  },
  errorBanner: {
    color: '#ff8a80',
    fontSize: 14,
    marginBottom: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    gap: 12,
  },
});
