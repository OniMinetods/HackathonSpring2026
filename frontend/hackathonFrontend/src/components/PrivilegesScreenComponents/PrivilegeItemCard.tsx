import { Colors } from '@constants/colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { PrivilegeItem } from 'src/features/privileges/model/privilegeTypes';

export type PrivilegeItemCardProps = {
  item: PrivilegeItem;
};

export const PrivilegeItemCard = ({ item }: PrivilegeItemCardProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rub = item.financialRub.toLocaleString('ru-RU');

  return (
    <View style={styles.shell}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle} numberOfLines={2}>
            {item.title}
          </Text>
          {!open ? (
            <Text style={styles.headerMeta} numberOfLines={1}>
              {rub} ₽ · {item.statusText}
            </Text>
          ) : null}
        </View>
        <Text style={styles.chevron}>{open ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      {open ? (
        <View style={styles.body}>
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
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  shell: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: Colors.primaryDark,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerTextCol: {
    flex: 1,
    gap: 4,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  headerMeta: {
    color: Colors.primaryGrey,
    fontSize: 13,
  },
  chevron: {
    color: Colors.primaryGreenFourth,
    fontSize: 14,
    width: 22,
    textAlign: 'center',
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    gap: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
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
    marginTop: 2,
  },
  btnOutlineText: {
    textAlign: 'center',
    color: Colors.primaryGreenFourth,
    fontSize: 16,
    fontWeight: '600',
  },
});
