import { Colors } from '@constants/colors';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UserStatus } from 'src/features/auth/api/authTypes';
import { useAuth } from 'src/features/auth/hooks/useAuth';
import { getNextStatus, numberParser } from 'src/shared/functions';
import { StatusIcon } from 'src/shared/lib/icons';

export const Status = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<UserStatus>('silver');

  useEffect(() => {
    if (user?.status) setStatus(user.status);
  }, [user]);

  const getStatusColor = () => {
    switch (status) {
      case 'silver':
        return Colors.silver;
      case 'gold':
        return Colors.gold;
      case 'platinum':
        return Colors.platinum;
    }
  };

  const Icon = StatusIcon;

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Icon color={getStatusColor()} />
        <View>
          <Text style={styles.statusText}>
            {status[0].toLocaleUpperCase() + status.slice(1)}
          </Text>
          <Text>ProgressBar</Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text
          style={styles.text}
        >{`До ${getNextStatus(status)} осталось ${user?.volume_points || user?.total_points} ${numberParser(0)}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
    padding: 20,
    gap: 20,
  },
  statusText: {
    color: Colors.white,
    fontSize: 46,
  },
  text: {
    color: Colors.white,
    fontSize: 24,
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  textContainer: {},
});
