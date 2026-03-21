import { Colors } from '@constants/colors';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from 'src/features/auth/hooks/useAuth';

type RowProps = { label: string; value: string };

const Row = ({ label, value }: RowProps) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export const ProfileInfoCard = () => {
  const { user } = useAuth();
  const [dealerCode, setDealerCode] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    if (user) {
      setDealerCode(user.dealer_code);
      setPosition(user.position);
      setPhone(user.phone);
      setEmail(user.email);
    }
  }, [user]);

  return (
    <View style={styles.card}>
      <Row label="Код ДЦ" value={dealerCode} />
      <View style={styles.divider} />
      <Row label="Должность" value={position} />
      <View style={styles.divider} />
      <Row label="Телефон" value={phone} />
      <View style={styles.divider} />
      <Row label="Почта" value={email} />
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
