import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  image: {
    width: width,
    height: width * 0.7,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingTop: 12,
    paddingLeft: 33,
    paddingRight: 23,
    lineHeight: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E3EAF5',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  activeDot: {
    width: 33,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.brand,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
  },
});
