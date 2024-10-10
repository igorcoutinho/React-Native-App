import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.brandSecondaryDark,
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 100,
  },
  logo: {
    height: 184,
    resizeMode: 'contain',
    width: 184,
  },
});
