import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  animatedContainer: {
    backgroundColor: Colors.brandSecondary,
    borderRadius: 12,
  },
  container: {
    borderRadius: 12,
    height: 180,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  image: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
    width: '100%',
  },
  balanceContainer: {
    backgroundColor: 'rgba(0, 0, 0, .6)',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  nameContainer: {
    backgroundColor: 'rgba(0, 0, 0, .6)',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    zIndex: 1,
    flexDirection: 'row',
  },
});
