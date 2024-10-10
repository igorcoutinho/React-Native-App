import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.appBackgroundColor,
    bottom: 0,
    left: 0,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    position: 'absolute',
    width: '100%',
    borderTopColor: Colors.greyXLight,
    borderTopWidth: 1,
  },
  wrapper: {
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
    width: '100%',
  },
});
