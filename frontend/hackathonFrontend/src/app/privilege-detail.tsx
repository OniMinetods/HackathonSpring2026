import { Colors } from '@constants/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  PRIVILEGE_LONG_TEXT,
} from 'src/features/privileges/model/privilegesData';

export default function PrivilegeDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string | string[];
    title?: string | string[];
  }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const title = Array.isArray(params.title) ? params.title[0] : params.title;
  const body = id ? PRIVILEGE_LONG_TEXT[id] ?? '' : '';

  return (
    <ImageBackground
      style={styles.bg}
      source={require('../shared/lib/public/img/sberBackground.png')}
      resizeMode="cover"
    >
      <View style={styles.root}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Назад</Text>
        </TouchableOpacity>
        {title ? <Text style={styles.h1}>{title}</Text> : null}
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.body}>
            {body || 'Подробное описание появится позже.'}
          </Text>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
  root: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
    backgroundColor: Colors.black50,
    gap: 12,
  },
  back: {
    color: Colors.primaryGreenFourth,
    fontSize: 17,
    fontWeight: '600',
  },
  h1: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  scroll: { paddingBottom: 40 },
  body: {
    color: Colors.primaryGrey,
    fontSize: 16,
    lineHeight: 24,
  },
});
