import React from 'react';
import { Image, Text, View } from 'react-native';
import { Images } from '../../../../theme/images';
import { styles } from './styles';

export const SignInHeader = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) => {
  return (
    <View style={styles.container}>
      <Image source={Images.whipAppLogo} alt="Whip Logo" style={styles.logo} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subTitle}>{subTitle}</Text>
    </View>
  );
};
