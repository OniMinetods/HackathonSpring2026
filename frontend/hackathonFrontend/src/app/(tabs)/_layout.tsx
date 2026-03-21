import { Tabs } from 'expo-router';
import { Colors } from '../../shared/constants/colors';
import {
  HomeIcon,
  ProfileIcon,
  RatingIcon,
  TasksIcon,
} from '../../shared/lib/icons';

import { StyleSheet, Text } from 'react-native';

export default function TabLayout() {
  const navItems = {
    index: { label: 'Главная', Icon: HomeIcon },
    rating: { label: 'Рейтинг', Icon: RatingIcon },
    tasks: { label: 'Задачи', Icon: TasksIcon },
    profile: { label: 'Профиль', Icon: ProfileIcon },
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primaryGreenFirst,
        tabBarInactiveTintColor: Colors.primaryGrey,
        tabBarStyle: {
          backgroundColor: Colors.primaryDark,
          borderTopWidth: 1,
          borderTopColor: Colors.primaryGreenFirst,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={[styles.navText, focused && styles.activeNavText]}>
              {navItems.index.label}
            </Text>
          ),
          tabBarIcon: ({ color, size, focused }) => {
            const Icon = navItems.index.Icon;

            return (
              <Icon
                width={size}
                height={size}
                color={focused ? Colors.primaryGreenFirst : Colors.primaryGrey}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="rating"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.navText, focused && styles.activeNavText]}>
              {navItems.rating.label}
            </Text>
          ),
          tabBarIcon: ({ size, focused }) => {
            const Icon = navItems.rating.Icon;

            return (
              <Icon
                width={size}
                height={size}
                color={focused ? Colors.primaryGreenFirst : Colors.primaryGrey}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.navText, focused && styles.activeNavText]}>
              {navItems.tasks.label}
            </Text>
          ),
          tabBarIcon: ({ size, focused }) => {
            const Icon = navItems.tasks.Icon;

            return (
              <Icon
                width={size}
                height={size}
                color={focused ? Colors.primaryGreenFirst : Colors.primaryGrey}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.navText, focused && styles.activeNavText]}>
              {navItems.profile.label}
            </Text>
          ),
          tabBarIcon: ({ size, focused }) => {
            const Icon = navItems.profile.Icon;

            return (
              <Icon
                width={size}
                height={size}
                color={focused ? Colors.primaryGreenFirst : Colors.primaryGrey}
              />
            );
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: Colors.primaryDark,
    borderTopWidth: 1,
    borderTopColor: Colors.primaryGreenFirst,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: Colors.primaryGrey,
  },
  activeNavText: {
    color: Colors.primaryGreenFirst,
    fontWeight: '600',
  },
});
