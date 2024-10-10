import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Linking, View } from 'react-native';
import { BaseButton, BaseButtonInline } from '../../components/BaseButton';
import { MainContainer } from '../../components/MainContainer';
import { Bold, Heading, Paragraph } from '../../components/Typography';
import { Colors } from '../../theme/colors';
const SupportIllustration =
  require('../../assets/supportIllustration.svg').default;

export const supportEmail = 'help@mywhipapp.com';
// https://mywhipapp.com/contact-us/

export const SettingsSupport = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <MainContainer>
      <View style={{ alignItems: 'center' }}>
        <SupportIllustration height={120} style={{ marginBottom: 26 }} />
      </View>

      <View style={{ gap: 10, marginBottom: 26 }}>
        <Heading>How can we help you?</Heading>
        <Paragraph>Check it out how you can get in touch with us.</Paragraph>
      </View>

      <View style={{ gap: 10, marginBottom: 26 }}>
        <Paragraph>
          <Bold>Send us an email</Bold>
        </Paragraph>
        <BaseButton
          alignSelf="flex-start"
          flatten
          onPress={() => {
            Linking.openURL(
              `mailto:${supportEmail}?subject=Support%20Request&body=Dear%20WhipApp%20Team,`,
            );
          }}
        >
          help@mywhipapp.com
        </BaseButton>
      </View>
      <View style={{ gap: 10, marginBottom: 26 }}>
        <Paragraph>
          <Bold>Or contact us at our website</Bold>
        </Paragraph>
        <BaseButton
          alignSelf="flex-start"
          flatten
          onPress={() => {
            Linking.openURL('https://mywhipapp.com/contact-us/');
          }}
        >
          https://mywhipapp.com/contact-us
        </BaseButton>
      </View>


      <View style={{ gap: 10, marginBottom: 36 }}>
        <Paragraph>
          <Bold>Or contact us at support number</Bold>
        </Paragraph>
        <BaseButton
          alignSelf="flex-start"
          flatten
        // onPress={() => {
        //   Linking.openURL('https://mywhipapp.com/contact-us/');
        // }}
        >
          0330 133 8220
        </BaseButton>
      </View>
      <View style={{ gap: 5, paddingBottom: 20 }}>
        <Paragraph color={Colors.brandSecondaryDark}>
          Did you see our FAQs?
        </Paragraph>
        <BaseButtonInline
          alignSelf="flex-start"
          onPress={() => navigation.navigate('SettingsFAQs')}
        >
          Check it out our FAQs page here
        </BaseButtonInline>
      </View>
    </MainContainer>
  );
};
