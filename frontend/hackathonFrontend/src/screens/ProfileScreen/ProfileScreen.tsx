import { ProfileIdentity } from '@components/ProfileScreenComponents/ProfileIdentity'

import { ProfileInfoCard } from '@components/ProfileScreenComponents/ProfileInfoCard'

import { ProfileProgramCard } from '@components/ProfileScreenComponents/ProfileProgramCard'

import { Colors } from '@constants/colors'

import { useFocusEffect } from '@react-navigation/native'

import { useRouter } from 'expo-router'

import { useCallback } from 'react'

import {
  ImageBackground,

  ScrollView,

  StyleSheet,

  Text,

  TouchableOpacity,

  View,
} from 'react-native'

import { useAuth } from 'src/features/auth/hooks/useAuth'

import { BellIcon } from 'src/shared/lib/icons'



export default function ProfileScreen() {

  const Icon = BellIcon;

  const router = useRouter();

  const { refreshProfile } = useAuth();



  useFocusEffect(

    useCallback(() => {

      void refreshProfile();

    }, [refreshProfile]),

  );



  return (

    <ImageBackground

      style={styles.background}

      source={require('../../shared/lib/public/img/sberBackground.png')}

      resizeMode="cover"

    >

      <View style={styles.container}>

        <View style={styles.header}>

          <Text style={styles.title}>Профиль</Text>

          <TouchableOpacity>

            <Icon />

          </TouchableOpacity>

        </View>

        <ScrollView

          style={styles.scroll}

          contentContainerStyle={styles.scrollContent}

          showsVerticalScrollIndicator={false}

        >

          <ProfileIdentity />

          <TouchableOpacity

            style={styles.financialCta}

            onPress={() => router.push('/financial-effect')}

            activeOpacity={0.85}

          >

            <Text style={styles.financialCtaTitle}>Личный финансовый эффект</Text>

            <Text style={styles.financialCtaSub}>

              Доход от бонусов, ипотека, кэшбэк, ДМС

            </Text>

            <Text style={styles.financialCtaArrow}>›</Text>

          </TouchableOpacity>

          <ProfileInfoCard />

          <ProfileProgramCard />

        </ScrollView>

      </View>

    </ImageBackground>

  );

}



const styles = StyleSheet.create({

  background: {

    flex: 1,

    width: '100%',

    height: '100%',

  },

  container: {

    paddingTop: 50,

    paddingHorizontal: 12,

    flex: 1,

    backgroundColor: Colors.black50,

    gap: 12,

  },

  header: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

  },

  title: {

    fontSize: 24,

    fontWeight: 'bold',

    color: Colors.white,

  },

  scroll: {

    flex: 1,

  },

  scrollContent: {

    paddingBottom: 24,

    gap: 12,

  },

  financialCta: {

    backgroundColor: Colors.primaryDark,

    borderRadius: 20,

    padding: 18,

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.08)',

  },

  financialCtaTitle: {

    color: Colors.white,

    fontSize: 18,

    fontWeight: '700',

    marginBottom: 4,

  },

  financialCtaSub: {

    color: Colors.primaryGrey,

    fontSize: 14,

    paddingRight: 24,

  },

  financialCtaArrow: {

    position: 'absolute',

    right: 14,

    top: '50%',

    marginTop: -16,

    color: Colors.primaryGreenFourth,

    fontSize: 32,

    fontWeight: '300',

  },

});

