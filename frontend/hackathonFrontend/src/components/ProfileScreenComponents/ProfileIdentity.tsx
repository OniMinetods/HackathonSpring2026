import { Colors } from '@constants/colors';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from 'src/features/auth/hooks/useAuth';

export const ProfileIdentity = () => {
  const { user } = useAuth();

  const [fullname, setFullname] = useState<string>('');

  useEffect(() => {
    if (user) {
      setFullname(user.full_name);
    }
  });

  return (
    <View style={styles.wrap}>
      <Text style={styles.name}>{fullname}</Text>
      <Text style={styles.sub}>Идентификация через Sber ID</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginVertical: 8,
    gap: 8,
  },
  name: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  sub: {
    color: Colors.primaryGrey,
    fontSize: 16,
  },
});
