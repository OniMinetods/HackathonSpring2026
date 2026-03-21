import { RatingDealerTop } from '@components/RatingScreenComponents/RatingDealerTop';
import { RatingMyRank } from '@components/RatingScreenComponents/RatingMyRank';
import { RatingRegionTop } from '@components/RatingScreenComponents/RatingRegionTop';
import { Colors } from '@constants/colors';
import { useRouter } from 'expo-router';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RatingMyPlaceScreen() {
  const router = useRouter();

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
            <Text style={styles.back}>← Назад</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.screenTitle}>Мое место в компании</Text>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <RatingMyRank />
          <RatingDealerTop />
          <RatingRegionTop />
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
    fontSize: 17,
    fontWeight: '600',
  },
  screenTitle: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    gap: 12,
  },
});
