import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { IWhipType } from './categories';
import { styles } from './styles';

export const WhipTypeSelector = ({
  onChange,
  selected,
  types,
}: {
  onChange: (selected: IWhipType) => void;
  selected: IWhipType;
  types: IWhipType[];
}) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal snapToInterval={270}>
        <View style={styles.wrapper}>
          {types &&
            types.map(item => {
              const isSelected = item.title === selected?.title;
              const imageStyles: any = {
                borderColor: isSelected
                  ? Colors.brandSecondary
                  : Colors.greyLight,
                height: isSelected ? 74 : 80,
                opacity: isSelected ? 0.8 : 1,
                resizeMode: 'contain',
                width: isSelected ? 74 : 80,
              };
              return (
                <Pressable
                  key={item.title}
                  onPress={() => onChange(item)}
                  style={{ alignItems: 'center' }}
                >
                  <View
                    style={{
                      ...styles.selectable,
                      borderColor: isSelected
                        ? Colors.brandSecondary
                        : Colors.greyLight,
                    }}
                  >
                    <Image source={item.icon} style={imageStyles} />
                  </View>
                  <Text
                    style={{
                      ...styles.selectableText,
                      fontSize: item.fontSize,
                    }}
                  >
                    {item.title}
                  </Text>
                </Pressable>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
};
