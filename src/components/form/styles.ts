import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { FontSize } from '../../theme/typography';

export const styles = StyleSheet.create({
  dateContainer: {
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderColor: 'transparent',
    borderRadius: 12,
    borderWidth: 2,
    color: Colors.paragraph,
    flex: 1,
    flexDirection: 'row',
    fontSize: FontSize.regular,
    height: 38,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  iosModalContent: {
    padding: 10,
    paddingHorizontal: 20,
  },
  inlineErrorText: {
    color: Colors.DANGER,
    fontSize: 12,
    marginTop: 5,
  },
  fieldTitle: {
    color: Colors.brandSecondary,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
