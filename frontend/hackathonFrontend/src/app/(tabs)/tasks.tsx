import { useRefreshProfileOnFocus } from 'src/features/auth/hooks/useRefreshProfileOnFocus';
import TasksScreen from '../../screens/TasksScreen/TasksScreen';

export default function TasksTab() {
  useRefreshProfileOnFocus();
  return <TasksScreen />;
}
