import { StyleSheet } from 'react-native';
import { Colors } from '../../../../theme/colors';
import { FontFamily, FontSize } from '../../../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  title: {
    fontSize: FontSize.large,
    fontFamily: FontFamily.default,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
  },
  subTitle: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
    marginTop: 5,
  },
  logo: {
    height: 110,
    resizeMode: 'contain',
    width: 110,
  },
});
