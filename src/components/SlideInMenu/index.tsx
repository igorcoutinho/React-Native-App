import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bold, Paragraph } from '../../components/Typography';
import { Colors } from '../../theme/colors';
import { LineSeparator } from '../elements/LineSeparator';
const Stack = createStackNavigator();

export const SlideInMenu = React.forwardRef(
  (
    {
      options,
      renderTrigger,
      triggerTitle,
    }: {
      options: {
        leftAccessory?: React.ReactNode;
        color?: Colors;
        label: string;
        hideOption?: boolean;
        onPress?: () => void;
      }[];
      renderTrigger?:
      | React.ReactNode
      | (({
        open,
        close,
      }: {
        open: () => void;
        close: () => void;
      }) => React.ReactNode);

      triggerTitle?: string;
    },
    ref: any,
  ) => {
    const menuRef = React.useRef<any>(null);
    const insets = useSafeAreaInsets();

    const open = React.useCallback(
      () => menuRef?.current?.open(),
      [menuRef?.current],
    );

    const close = React.useCallback(
      () => menuRef?.current?.close(),
      [menuRef?.current],
    );

    const trigger =
      typeof renderTrigger === 'function'
        ? renderTrigger({ open, close })
        : renderTrigger;

    if (options.length === 0) {
      return trigger;
    }

    return (
      <Menu
        ref={innerRef => {
          menuRef.current = innerRef;
          if (ref) {
            if (typeof ref === 'function') {
              ref(innerRef);
            } else {
              ref.current = innerRef;
            }
          }
        }}
        renderer={renderers.SlideInMenu}
      >
        <MenuTrigger
          customStyles={{
            TriggerTouchableComponent: TouchableOpacity,
            triggerTouchable: {
              activeOpacity: 0.6,
            },
          }}
        >
          {trigger}
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsWrapper: {
              marginHorizontal: 30,
              padding: 20,
              paddingBottom: 20,
              paddingTop: 25,
              borderRadius: 12,
              backgroundColor: Colors.white,
            },
            optionsContainer: {
              backgroundColor: 'transparent',
              paddingBottom: insets.bottom + 30,
            },
          }}
        >
          <Paragraph
            align="center"
            size="medium"
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{ marginBottom: 4 }}
          >
            <Bold>{triggerTitle || 'Options'}</Bold>
          </Paragraph>
          <LineSeparator />
          {options.map((option, index) => (
            !option.hideOption &&
            <TouchableOpacity
              key={index}
              activeOpacity={0.4}
              onPress={() => {
                menuRef.current.close();
                option.onPress?.();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 5,
                gap: 5,
                padding: 5,
                paddingHorizontal: 10,
                borderRadius: 12,
              }}
            >
              {option.leftAccessory}
              <Paragraph
                color={option.color || Colors.paragraph}
                style={{
                  marginLeft: 10,
                }}
              >
                {option.label}
              </Paragraph>
            </TouchableOpacity>
          ))}
          <LineSeparator />
          <TouchableOpacity
            activeOpacity={0.4}
            onPress={() => {
              menuRef.current.close();
            }}
            style={{
              alignItems: 'center',
              padding: 5,
              paddingHorizontal: 10,
              borderRadius: 12,
            }}
          >
            <Paragraph color={Colors.blue}>Cancel</Paragraph>
          </TouchableOpacity>
        </MenuOptions>
      </Menu>
    );
  },
);
