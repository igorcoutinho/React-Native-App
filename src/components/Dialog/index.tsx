/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Modal, Platform, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';

export const Dialog = React.forwardRef(function Dialog(
  {
    children,
    onRequestClose,
  }: {
    children:
      | unknown
      | React.ReactElement
      | ((props: { onDismiss: () => void }) => React.ReactElement);
    onRequestClose?: () => void;
  },
  ref: React.Ref<any>,
) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [show, setShow] = React.useState(false);

  const isIos = Platform.OS === 'ios';

  React.useEffect(() => {
    if (modalVisible) {
      setShow(true);
      return;
    }
    const timeout = setTimeout(
      () => {
        setShow(false);
      },
      isIos ? 130 : 0,
    );
    return () => {
      clearTimeout(timeout);
    };
  }, [modalVisible]);

  const onDismiss = () => setModalVisible(false);

  React.useImperativeHandle(
    ref,
    () => {
      return {
        onDismiss,
        onOpen() {
          setModalVisible(true);
        },
      };
    },
    [setModalVisible],
  );

  return (
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={show}
      style={{ flex: 1 }}
      onRequestClose={() => {
        onRequestClose?.();
        setModalVisible(!show);
      }}
    >
      <View
        style={{
          ...styles.container,
          paddingBottom: isIos ? insets.bottom + 10 : 0,
          paddingTop: isIos ? insets.top + 20 : 0,
        }}
      >
        {modalVisible ? (
          <Animated.View
            entering={isIos ? FadeIn.delay(230) : undefined}
            exiting={isIos ? FadeOut.duration(200) : undefined}
            style={{
              ...styles.background,
              height,
              width,
            }}
          />
        ) : null}
        <View
          style={{
            ...styles.content,
            borderRadius: isIos ? 22 : 0,
            width: isIos ? width - 20 : width,
          }}
        >
          {typeof children === 'function'
            ? children({
                onDismiss,
              })
            : children}
        </View>
      </View>
    </Modal>
  );
});
