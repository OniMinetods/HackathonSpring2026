import { RatingDetailSection } from '@components/RatingScreenComponents/RatingDetailSection';
import { Colors } from '@constants/colors';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from 'src/features/auth/hooks/useAuth';

export default function RatingDetailScreen() {
  const router = useRouter();
  const { refreshProfile } = useAuth();

  useFocusEffect(
    useCallback(() => {
      void refreshProfile();
    }, [refreshProfile]),
  );

  return (
    <ImageBackground
      style={styles.background}
      source={require('../shared/lib/public/img/sberBackground.png')}
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
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <RatingDetailSection />
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
    marginBottom: 12,
  },
  back: {
    color: Colors.primaryGreenFourth,
    fontSize: 20,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    gap: 12,
  },
});
