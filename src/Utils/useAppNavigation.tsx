import { useNavigation, NavigationProp } from '@react-navigation/native';

// Generic Hook to accept a RouteParamList type
export const useAppNavigation = <T extends object>() => {
  return useNavigation<NavigationProp<T>>();
};