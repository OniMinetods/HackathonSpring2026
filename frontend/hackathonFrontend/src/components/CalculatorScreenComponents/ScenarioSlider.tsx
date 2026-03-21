import { Colors } from '@constants/colors';
import Slider from '@react-native-community/slider';
import { StyleSheet, Text, View } from 'react-native';

export type ScenarioSliderProps = {
  label: string;
  hint: string;
  value: number;
  minimumValue: number;
  maximumValue: number;
  step: number;
  valueSuffix?: string;
  onValueChange: (value: number) => void;
};

export const ScenarioSlider = ({
  label,
  hint,
  value,
  minimumValue,
  maximumValue,
  step,
  valueSuffix = '',
  onValueChange,
}: ScenarioSliderProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.titles}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.hint}>{hint}</Text>
        </View>
        <Text style={styles.value}>
          {value}
          {valueSuffix}
        </Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={Colors.primaryGreenFourth}
        maximumTrackTintColor={Colors.primaryGrey}
        thumbTintColor={Colors.white}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  titles: {
    flex: 1,
    gap: 4,
  },
  label: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
  hint: {
    color: Colors.primaryGrey,
    fontSize: 14,
  },
  value: {
    color: Colors.primaryGreenFourth,
    fontSize: 20,
    fontWeight: 'bold',
    minWidth: 56,
    textAlign: 'right',
  },
  slider: {
    width: '100%',
    height: 44,
  },
});
