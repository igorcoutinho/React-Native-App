import { HStack, VStack } from '@gluestack-ui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, Image, StatusBar, Text, View } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BaseButton } from '../../components/BaseButton';
import { MainContainer } from '../../components/MainContainer';
import { PublicNavigationNames } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { Images } from '../../theme/images';
import { styles } from './styles';

export const WelcomeToWhipApp: React.FC = () => {
  const { width, height } = Dimensions.get('window');

  const navigation = useNavigation<NavigationProp<any>>();

  const insets = useSafeAreaInsets();

  const carouselRef = React.useRef<ICarouselInstance | null>(null);

  const [currentIndex, setCurrentIndex] = React.useState(0);

  const setCarouselRef = React.useCallback((ref: ICarouselInstance) => {
    if (ref) {
      carouselRef.current = ref;
    }
  }, []);

  const safePaddings = {
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
    paddingTop: insets.top,
  };

  const BOTTOM_BUTTONS_HEIGHT = 220;

  const slides = [
    {
      image: Images.swipe1,
      subTitle: 'Welcome to Whip App, the first social payment app',
      title: "Let's get started",
    },
    {
      image: Images.swipe2,
      subTitle:
        'Set up your next adventure, invite friends and family to participate in different Whips and keep memories alive',
      title: 'Start an event',
    },
  ];

  return (
    <MainContainer>
      <StatusBar
        animated
        barStyle="dark-content"
        backgroundColor={Colors.appBackgroundColor}
      />
      <Carousel
        ref={setCarouselRef}
        width={width - 40}
        height={height - BOTTOM_BUTTONS_HEIGHT}
        data={slides}
        pagingEnabled
        onSnapToItem={setCurrentIndex}
        renderItem={({ item }) => (
          <View style={safePaddings}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subTitle}>{item.subTitle}</Text>
          </View>
        )}
      />
      <VStack space="xl">
        <HStack justifyContent="center">
          {slides.map((_, index) => {
            if (index === currentIndex) {
              return <View key={index} style={styles.activeDot} />;
            }
            return <View key={index} style={styles.dot} />;
          })}
        </HStack>
        <VStack space="md">
          <BaseButton
            onPress={() => {
              navigation.removeListener;
              navigation.navigate(PublicNavigationNames.SignIn);
            }}
          >
            Login
          </BaseButton>
          <BaseButton
            variant="muted"
            onPress={() => {
              navigation.removeListener;
              navigation.navigate(PublicNavigationNames.SignUp);
            }}
          >
            Create Account
          </BaseButton>
        </VStack>
      </VStack>
    </MainContainer>
  );
};
