import { faCrown, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Image, Pressable, PressableProps, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { IWhip } from '../../states/Whip/types';
import { Colors } from '../../theme/colors';
import { Bold, Paragraph } from '../Typography';
import { StatusIndicator } from '../elements/StatusIndicator';
import { styles } from './styles';

export const WhipItem = ({
  attachment,
  color = Colors.brandSecondaryDark,
  isNew,
  name,
  archived,
  onPress,
  isOwner,
}: IWhip & PressableProps) => {
  return (
    <View>
      <Animated.View
        entering={FadeInDown}
        style={{ ...styles.animatedContainer }}
      >
        <Pressable
          onPress={onPress}
          style={({ pressed }) => ({
            ...styles.container,
            backgroundColor: color || Colors.brand,
            opacity: onPress && pressed ? 0.6 : 1,
          })}
        >
          {name ? (
            <View style={styles.nameContainer}>
              <View
                style={{
                  position: 'absolute',
                  top: 5,
                  left: 5,
                  zIndex: 1000,
                  backgroundColor: isOwner
                    ? Colors.brand
                    : Colors.brandSecondary,
                  padding: 6,
                  borderRadius: 50,
                }}
              >
                {isOwner ? (
                  <FontAwesomeIcon color={Colors.white} icon={faCrown} />
                ) : (
                  <FontAwesomeIcon color={Colors.white} icon={faUserFriends} />
                )}
              </View>
              <Paragraph color={Colors.white} style={{ marginLeft: 30 }}>
                <Bold>{name}</Bold>
              </Paragraph>
              {isNew ? <StatusIndicator /> : null}
            </View>
          ) : null}
          {attachment ? (
            <Image style={styles.image} source={{ uri: attachment }} />
          ) : null}
        </Pressable>
      </Animated.View>
    </View>
  );
};
