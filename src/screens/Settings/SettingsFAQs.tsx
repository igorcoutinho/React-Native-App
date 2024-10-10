import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { BaseButtonInline } from '../../components/BaseButton';
import { MainContainer } from '../../components/MainContainer';
import { Heading, Paragraph } from '../../components/Typography';
import { Colors } from '../../theme/colors';
import { faqs } from './faqs';
const FAQsIllustration = require('../../assets/faqs.svg').default;

export const SettingsFAQs = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [activeSections, setActiveSections] = React.useState<number[]>([0]);
  return (
    <MainContainer>
      <View style={{ alignItems: 'center' }}>
        <FAQsIllustration height={120} style={{ marginBottom: 26 }} />
      </View>

      <View style={{ gap: 10, marginBottom: 26 }}>
        <Heading>Welcome to our FAQs</Heading>
        <Paragraph>
          Feel free to find a solution to your problem here. You can also check
          it out our Support page.
        </Paragraph>
      </View>

      <Accordion
        renderAsFlatList
        activeSections={activeSections}
        sections={faqs}
        underlayColor="transparent"
        renderFooter={() => <View style={{ height: 10 }} />}
        renderHeader={(content, index, isActive) => (
          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                backgroundColor: '#F2f2f2',
                borderRadius: 12,
                flex: 1,
                padding: 15,
                paddingVertical: 10,
              }}
            >
              <Heading
                size="small"
                color={
                  isActive ? Colors.brandSecondaryDark : Colors.brandSecondary
                }
                style={{ flex: 1 }}
              >
                {content.title}
              </Heading>
            </View>
            <View
              style={{
                backgroundColor: '#F2f2f2',
                borderRadius: 12,
                justifyContent: 'center',
                padding: 15,
                paddingVertical: 10,
              }}
            >
              <FontAwesomeIcon
                color={isActive ? Colors.brandSecondaryDark : Colors.mutedDark}
                icon={isActive ? faChevronUp : faChevronDown}
              />
            </View>
          </View>
        )}
        renderContent={content => (
          <View
            style={{
              backgroundColor: '#F2f2f2',
              borderRadius: 12,
              flex: 1,
              marginTop: 5,
              padding: 15,
              paddingVertical: 10,
            }}
          >
            <Paragraph size="small">{content.content}</Paragraph>
          </View>
        )}
        onChange={active => setActiveSections(active)}
      />
      <View style={{ gap: 5, margin: 20, paddingBottom: 20 }}>
        <Paragraph align="center" color={Colors.brandSecondaryDark}>
          Still need help?
        </Paragraph>
        <BaseButtonInline
          onPress={() => navigation.navigate('SettingsSupport')}
        >
          Check it out our Support page here
        </BaseButtonInline>
      </View>
    </MainContainer>
  );
};
