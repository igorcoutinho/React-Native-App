import React from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';

const FloatingBottomContext = React.createContext<{
  value: number;
  update: (size: number) => void;
}>({
  value: null,
  update: null,
});

export const FloatingBottom = ({
  animated,
  children,
  defaultPadding = false,
}: {
  animated?: boolean;
  children: React.ReactNode;
  defaultPadding?: boolean;
}) => {
  const insets = useSafeAreaInsets();
  const { update } = React.useContext(FloatingBottomContext);
  return (
    <Animated.View
      entering={animated ? FadeInDown.delay(60).duration(230) : null}
      onLayout={({ nativeEvent }) => {
        const { height } = nativeEvent.layout;
        update?.(height);
      }}
      style={{
        backgroundColor: Colors.appBackgroundColor,
        borderTopColor: Colors.light,
        borderTopWidth: 1,
        // bottom: 0,
        // left: 0,
        paddingHorizontal: 30,
        paddingTop: 30,
        // position: 'absolute',
        width: '100%',
        paddingBottom: defaultPadding ? 30 : insets.bottom + 30,
      }}
    >
      {children}
    </Animated.View>
  );
};

export function FloatingBottomContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [value, setValue] = React.useState(null);
  return (
    <FloatingBottomContext.Provider value={{ value, update: setValue }}>
      {children}
    </FloatingBottomContext.Provider>
  );
}

export const useFloatingBottomSize = (diff?: number) => {
  const { value } = React.useContext(FloatingBottomContext);
  return value + (diff || 0);
};
