import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  badgeContainer: {
    width: 46,
    height: 46,
    justifyContent: 'center',
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 3,
  },
  badgeIconContainer: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    position: 'absolute',
    zIndex: 100,
    bottom: -3,
    right: -3,
  },
  manageAccountIcon: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    position: 'absolute',
    backgroundColor: Colors.brandSecondary,
    right: 10,
    top: 10,
    zIndex: 10,
  },
});
