import { TaskMonthItem } from '@components/TasksScreenComponents/TaskMonthItem';
import { Colors } from '@constants/colors';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BellIcon } from 'src/shared/lib/icons';

export default function TasksScreen() {
  const Icon = BellIcon;

  return (
    <ImageBackground
      style={styles.background}
      source={require('../../shared/lib/public/img/sberBackground.png')}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Задачи</Text>
          <TouchableOpacity>
            <Icon />
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionLabel}>Задачи месяца</Text>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TaskMonthItem
            title="Сделать 3 сделки"
            pointsHint="+4 балла"
            progress={2 / 3}
            deadline="Дедлайн: 31 марта"
            reward="Награда: +4 балла"
          />
          <TaskMonthItem
            title="Увеличить долю банка до 50%"
            pointsHint="+6 баллов"
            progress={0.42}
            deadline="Дедлайн: 15 апреля"
            reward="Награда: +6 баллов"
          />
          <TaskMonthItem
            title="Продать 2 доп. продукта"
            pointsHint="+3 балла"
            progress={0.5}
            deadline="Дедлайн: 28 марта"
            reward="Награда: +3 балла"
          />
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
  sectionLabel: {
    fontSize: 16,
    color: Colors.primaryGrey,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    gap: 12,
  },
});
