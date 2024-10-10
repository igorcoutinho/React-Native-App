import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Gap } from '../../theme/sizes';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  wrapper: {
    flexDirection: 'row',
    height: 130,
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    gap: Gap.small,
    position: 'relative',
  },
  selectable: {
    alignItems: 'center',
    backgroundColor: Colors.brandSecondary,
    borderRadius: 40,
    borderWidth: 2,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  selectableText: {
    marginTop: 4,
    textAlign: 'center',
  },
});
