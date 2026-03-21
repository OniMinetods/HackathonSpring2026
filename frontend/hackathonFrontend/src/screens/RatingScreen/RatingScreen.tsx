import { RatingDealerTop } from '@components/RatingScreenComponents/RatingDealerTop';
import { RatingMyRank } from '@components/RatingScreenComponents/RatingMyRank';
import { RatingRegionTop } from '@components/RatingScreenComponents/RatingRegionTop';
import { Colors } from '@constants/colors';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BellIcon } from 'src/shared/lib/icons';

export default function RatingScreen() {
  const Icon = BellIcon;

  return (
    <ImageBackground
      style={styles.background}
      source={require('../../shared/lib/public/img/sberBackground.png')}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Рейтинг</Text>
          <TouchableOpacity>
            <Icon />
          </TouchableOpacity>
        </View>
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
  container: {
    paddingTop: 50,
    paddingHorizontal: 12,
    flex: 1,
    backgroundColor: Colors.black50,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    gap: 12,
  },
});
