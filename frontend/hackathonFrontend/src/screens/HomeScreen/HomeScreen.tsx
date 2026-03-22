import { FinancialForecast } from '@components/HomeScreenComponents/FinancialForecast';
import { SpeedStepUp, Status } from '@components/index';
import { Colors } from '@constants/colors';
import { useRouter } from 'expo-router';
// import { useRouter } from 'expo-router';
import {
  Button,
  // Button,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BellIcon } from 'src/shared/lib/icons';

export default function HomeScreen() {
  const router = useRouter();
  const goToLogin = () => {
    router.push('/login');
  };

  const Icon = BellIcon;

  return (
    <ImageBackground
      style={styles.background}
      source={require('../../shared/lib/public/img/sberBackground.png')}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Главная</Text>
          <TouchableOpacity>
            <Icon />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Status />
          <FinancialForecast />
          <SpeedStepUp />
          <Button title="Перейти в Login" onPress={goToLogin} />
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
    marginBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
  sectionLabel: {
    fontSize: 16,
    color: Colors.primaryGrey,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    gap: 12,
  },
});
