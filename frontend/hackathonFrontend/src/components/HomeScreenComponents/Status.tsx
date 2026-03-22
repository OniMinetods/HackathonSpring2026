import { Colors } from '@constants/colors';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { UserStatus } from 'src/features/auth/api/authTypes';
import { useAuth } from 'src/features/auth/hooks/useAuth';
import { getNextStatus, numberParser } from 'src/shared/functions';
import { getStatusColor } from 'src/shared/functions/getStatusColor';
import { StatusIcon } from 'src/shared/lib/icons';

export const Status = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<UserStatus>('silver');
  const [pointsNeeded, setPointsNeeded] = useState<number>(0);

  useEffect(() => {
    if (user?.status) setStatus(user.status);
    if (user?.points_to_next_status)
      setPointsNeeded(user.points_to_next_status);
  }, [user]);

  const getLevelThreshold = (status: UserStatus) => {
    switch (status) {
      case 'silver':
        return 70;
      case 'gold':
        return 90;
      case 'platinum':
        return 90;
      default:
        return 70;
    }
  };

  const levelConfig = {
    silver: { min: 0, max: 70 },
    gold: { min: 70, max: 90 },
    platinum: { min: 90, max: 100 }, // max можно увеличить, например 200
  };

  const getProgress = () => {
    if (!user?.total_points || !user?.status) return 0;

    const currentPoints = user.total_points;
    const config = levelConfig[user.status];

    if (!config) return 0;

    const pointsInLevel = Math.min(
      Math.max(currentPoints - config.min, 0),
      config.max - config.min,
    );

    const levelRange = config.max - config.min;

    // Прогресс в процентах от 0 до 100
    return (pointsInLevel / levelRange) * 100;
  };

  // Использование
  const progress = getProgress();

  const Icon = StatusIcon;

  return (
    <Pressable
      onPress={() => router.push('/privileges')}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.statusContainer}>
        <Icon color={getStatusColor(status)} />
        <View style={styles.statusTextCol}>
          <Text style={styles.statusText}>
            {status[0].toLocaleUpperCase() + status.slice(1)}
          </Text>

          {status !== 'platinum' && (
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
          )}
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {status !== 'platinum'
            ? `До ${getNextStatus(status)} осталось ${pointsNeeded} ${numberParser(pointsNeeded)}`
            : `Вы достигли максимального уровня`}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  pressed: {
    opacity: 0.92,
  },
  statusTextCol: {
    flex: 1,
    gap: 4,
  },
  statusText: {
    color: Colors.white,
    fontSize: 36,
    fontWeight: 'bold',
  },
  text: {
    color: Colors.white,
    fontSize: 18,
    lineHeight: 24,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  textContainer: {},
  progressBackground: {
    height: 10,
    backgroundColor: Colors.primaryGrey,
    borderRadius: 5,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
});
