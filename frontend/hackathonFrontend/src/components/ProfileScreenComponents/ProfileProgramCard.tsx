import { Colors } from '@constants/colors';
import { StyleSheet, Text, View } from 'react-native';

export const ProfileProgramCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Уровень привилегий</Text>
        <Text style={styles.badge}>Gold</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>В программе</Text>
        <Text style={styles.value}>8 месяцев</Text>
      </View>
      <Text style={styles.caption}>Дата регистрации: 12.07.2025</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: Colors.primaryGrey,
    fontSize: 16,
  },
  badge: {
    color: Colors.gold,
    fontSize: 22,
    fontWeight: 'bold',
  },
  value: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  caption: {
    color: Colors.primaryGrey,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
