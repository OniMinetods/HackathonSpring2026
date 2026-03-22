import { GreenStackButton } from '@components/GreenStackButton';
import { Colors } from '@constants/colors';
import { useRouter } from 'expo-router';
import type { PrivilegeItem } from 'src/features/privileges/model/privilegesData';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type PrivilegeItemCardProps = {
  item: PrivilegeItem;
};

export const PrivilegeItemCard = ({ item }: PrivilegeItemCardProps) => {
  const router = useRouter();
  const rub = item.financialRub.toLocaleString('ru-RU');

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.field}>
        <Text style={styles.label}>Краткое описание</Text>
        <Text style={styles.value}>{item.description}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Финансовый эффект</Text>
        <Text style={styles.money}>{rub} ₽</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Статус</Text>
        <Text style={styles.status}>{item.statusText}</Text>
      </View>
      <TouchableOpacity
        style={styles.btnOutline}
        onPress={() =>
          router.push({
            pathname: '/privilege-detail',
            params: {
              id: item.id,
              title: item.title,
            },
          })
        }
        activeOpacity={0.85}
      >
        <Text style={styles.btnOutlineText}>Узнать подробнее</Text>
      </TouchableOpacity>
      <GreenStackButton title="Рассчитать новый статус" href="/calculator" />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
    padding: 18,
    gap: 14,
  },
  title: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  field: {
    gap: 4,
  },
  label: {
    color: Colors.primaryGrey,
    fontSize: 13,
  },
  value: {
    color: Colors.white,
    fontSize: 15,
    lineHeight: 22,
  },
  money: {
    color: Colors.primaryGreenFourth,
    fontSize: 20,
    fontWeight: '700',
  },
  status: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: Colors.primaryGreenFirst,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  btnOutlineText: {
    textAlign: 'center',
    color: Colors.primaryGreenFourth,
    fontSize: 16,
    fontWeight: '600',
  },
});
