import { CalculatorCurrentStatus } from '@components/CalculatorScreenComponents/CalculatorCurrentStatus';
import { ScenarioOutcomeCard } from '@components/CalculatorScreenComponents/ScenarioOutcomeCard';
import { ScenarioSlider } from '@components/CalculatorScreenComponents/ScenarioSlider';
import { Colors } from '@constants/colors';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { UserStatus } from 'src/features/auth/api/authTypes';
import { useAuth } from 'src/features/auth/hooks/useAuth';
import { computeScenario } from 'src/features/calculator/lib/scenarioModel';

const MAX_DEALS = 15;
const MAX_VOLUME_MILLION = 30;
const MAX_SHARE_STEPS = 10;
const MAX_PRODUCTS = 12;

export default function CalculatorForm() {
  const router = useRouter();
  const { user } = useAuth();
  const basePoints = user?.total_points ?? 0;
  const currentStatus = (user?.status ?? 'silver') as UserStatus;

  const [extraDeals, setExtraDeals] = useState(0);
  const [extraVolumeMillion, setExtraVolumeMillion] = useState(0);
  const [extraShareSteps, setExtraShareSteps] = useState(0);
  const [extraProducts, setExtraProducts] = useState(0);

  const outcome = useMemo(
    () =>
      computeScenario(basePoints, {
        extraDeals,
        extraVolumeMillion,
        extraShareSteps,
        extraProducts,
      }),
    [
      basePoints,
      extraDeals,
      extraVolumeMillion,
      extraShareSteps,
      extraProducts,
    ],
  );

  return (
    <ImageBackground
      style={styles.background}
      source={require('../../../shared/lib/public/img/sberBackground.png')}
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
        <Text style={styles.screenTitle}>Сценарный калькулятор</Text>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <CalculatorCurrentStatus status={currentStatus} />
          <Text style={styles.sectionLabel}>Интерактивный режим</Text>
          <ScenarioSlider
            label="Сделки"
            hint="+1 сделка к плану"
            value={extraDeals}
            minimumValue={0}
            maximumValue={MAX_DEALS}
            step={1}
            onValueChange={(v) => setExtraDeals(Math.round(v))}
          />
          <ScenarioSlider
            label="Объём"
            hint="+1 млн ₽ профинансированного объёма"
            value={extraVolumeMillion}
            minimumValue={0}
            maximumValue={MAX_VOLUME_MILLION}
            step={1}
            onValueChange={(v) => setExtraVolumeMillion(Math.round(v))}
          />
          <ScenarioSlider
            label="Доля банка"
            hint="+5% доли в портфеле за шаг"
            value={extraShareSteps}
            minimumValue={0}
            maximumValue={MAX_SHARE_STEPS}
            step={1}
            valueSuffix=" ×5%"
            onValueChange={(v) => setExtraShareSteps(Math.round(v))}
          />
          <ScenarioSlider
            label="Доп. продукты"
            hint="+1 дополнительный продукт"
            value={extraProducts}
            minimumValue={0}
            maximumValue={MAX_PRODUCTS}
            step={1}
            onValueChange={(v) => setExtraProducts(Math.round(v))}
          />
          <ScenarioOutcomeCard
            ratingPoints={outcome.projectedPoints}
            projectedStatus={outcome.projectedStatus}
            yearlyIncomeRub={outcome.yearlyIncomeRub}
            mortgageSavingsRub={outcome.mortgageSavingsRub}
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
  sectionLabel: {
    fontSize: 16,
    color: Colors.primaryGrey,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    gap: 12,
  },
});
