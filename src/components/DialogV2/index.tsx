/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { styles } from './styles';

export const DialogV2 = ({
  autoHeight,
  children,
  maxHeight,
  onRequestClose,
  visible,
  delay,
}: {
  autoHeight?: boolean;
  children: React.ReactElement;
  maxHeight?: number;
  onRequestClose?: () => void;
  visible: boolean;
  delay?: number;
}) => {
  const [show, setShow] = React.useState(false);

  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isIos = Platform.OS === 'ios';

  React.useEffect(() => {
    let showTimeout: any = null;
    if (visible) {
      showTimeout = setTimeout(() => {
        setShow(true);
      }, delay || 0);
      return;
    }
    const hideTimeout = setTimeout(
      () => {
        setShow(false);
      },
      isIos ? 200 : 300,
    );
    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [visible]);

  return (
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={show}
      style={{ flex: 1 }}
      onRequestClose={onRequestClose}
    >
      <MenuProvider
        skipInstanceCheck
        customStyles={{ backdrop: { backgroundColor: 'black', opacity: 0.5 } }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            ...styles.container,
            paddingBottom: isIos ? insets.bottom + 10 : 0,
            paddingTop: isIos ? insets.top + 20 : 0,
          }}
        >
          {visible ? (
            <>
              <Animated.View
                entering={FadeIn.delay(200)}
                exiting={FadeOut}
                style={{
                  ...styles.background,
                  height,
                  width,
                  zIndex: 1,
                }}
              />
              <Animated.View
                entering={SlideInDown.duration(isIos ? 200 : 300)}
                exiting={SlideOutDown}
                style={{
                  ...styles.content,
                  borderRadius: isIos ? 24 : 0,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  width: isIos ? width - 20 : width,
                  maxHeight,
                  zIndex: 2,
                  flex: autoHeight ? null : 1,
                }}
              >
                <Toast topOffset={30} />
                {children}
              </Animated.View>
            </>
          ) : null}
        </KeyboardAvoidingView>
      </MenuProvider>
    </Modal>
  );
};
