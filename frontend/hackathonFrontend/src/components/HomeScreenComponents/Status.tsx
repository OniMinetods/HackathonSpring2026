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

  // Минимальный прогресс: points / target
  const progress = user?.volume_points
    ? Math.min(user.volume_points / 300, 1) // 1000 — пример цели
    : 30; // Заглушка на progressBar

  const Icon = StatusIcon;

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Icon color={getStatusColor()} />
        <View style={{ flex: 1 }}>
          <Text style={styles.statusText}>
            {status[0].toLocaleUpperCase() + status.slice(1)}
          </Text>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: Colors.primaryGreenFourth,
                },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {`До ${getNextStatus(status)} осталось ${user?.volume_points || user?.total_points} ${numberParser(0)}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.black50,
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
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  textContainer: {},
  progressBackground: {
    height: 10,
    backgroundColor: Colors.primaryGrey,
    borderRadius: 5,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
});
