import { Colors } from '@constants/colors';
import { StyleSheet, Text, View } from 'react-native';

type RowProps = { label: string; value: string };

const Row = ({ label, value }: RowProps) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export const ProfileInfoCard = () => {
  return (
    <View style={styles.card}>
      <Row label="Код ДЦ" value="MSK-042" />
      <View style={styles.divider} />
      <Row label="Должность" value="Менеджер по продажам" />
      <View style={styles.divider} />
      <Row label="Телефон" value="+7 (900) 000-00-00" />
      <View style={styles.divider} />
      <Row label="Почта" value="i.ivanov@example.com" />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.black50,
    borderRadius: 20,
    padding: 20,
    gap: 0,
  },
  row: {
    paddingVertical: 12,
    gap: 6,
  },
  label: {
    color: Colors.primaryGrey,
    fontSize: 14,
  },
  value: {
    color: Colors.white,
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
