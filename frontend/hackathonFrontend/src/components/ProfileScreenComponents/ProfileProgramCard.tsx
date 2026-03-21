import { Colors } from '@constants/colors';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UserStatus } from 'src/features/auth/api/authTypes';
import { useAuth } from 'src/features/auth/hooks/useAuth';
import { formatTimeIn } from 'src/shared/functions';
import { getStatusColor } from 'src/shared/functions/getStatusColor';

export const ProfileProgramCard = () => {
  const { user } = useAuth();

  const [dateJoined, setDateJoined] = useState('');
  const [status, setStatus] = useState<UserStatus>('silver');

  useEffect(() => {
    if (user) {
      setDateJoined(user.date_joined);
      setStatus(user?.status);
    }
  });

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Уровень привилегий</Text>
        <Text
          style={{
            color: getStatusColor(status),
            fontSize: 22,
            fontWeight: 'bold',
          }}
        >
          {status[0].toLocaleUpperCase() + status.slice(1)}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>В программе</Text>
        <Text style={styles.value}>{formatTimeIn(dateJoined)}</Text>
      </View>
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
  value: {
    color: Colors.white,
    fontSize: 22,
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
