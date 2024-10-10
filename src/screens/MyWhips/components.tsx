import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { HStack } from '@gluestack-ui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { ListRenderItemInfo, Platform, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BaseButton, BaseButtonIcon } from '../../components/BaseButton';
import { LineSeparator } from '../../components/elements/LineSeparator';
import { EmptyState } from '../../components/EmptyState';
import { InputSelect } from '../../components/form/InputSelect';
import { Paragraph } from '../../components/Typography';
import { WhipItem } from '../../components/WhipItem';
import { InternalNavigationNames } from '../../navigation/types';
import { IWhip, WhipFilterButton } from '../../states/Whip/types';
import { Colors } from '../../theme/colors';
import { Gap } from '../../theme/sizes';
import { styles } from './styles';

export const ItemSeparator = () => (
  <View
    style={{
      height: 20,
    }}
  />
);

export const renderItem = (
  info: ListRenderItemInfo<IWhip>,
  onPress: () => void,
) => <WhipItem key={info.item.id} {...info.item} onPress={onPress} />;

export const renderEmptyState = (isLoading: boolean, onPress: () => void) => (
  <EmptyState
    label="No Whips created"
    placeholderImage={faTicket}
    renderCTA={
      isLoading ? null : (
        <BaseButton
          onPress={onPress}
          style={{ width: 200 }}
          flatten
          aria-label="Let's create your first Whip"
          variant="secondary"
        >
          Create a Whip
        </BaseButton>
      )
    }
  />
);

export const FabButton = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const insets = useSafeAreaInsets();

  return (
    <BaseButtonIcon
      onPress={() =>
        navigation.navigate(InternalNavigationNames.CreateWhipModal)
      }
      variant="secondary"
      style={{
        ...styles.fabButton,
        bottom: insets.bottom + 88,
      }}
    />
  );
};

export const WhipsFilter = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      }}
    >
      <View
        style={{
          width: 200,
        }}
      >
        <InputSelect
          onChange={value => console.log(value)}
          options={[
            { label: 'Salary', value: 'salary' },
            { label: 'Savings', value: 'savings' },
            { label: 'Investments Proceeds', value: 'investments' },
            { label: 'Family Gift', value: 'family' },
            { label: 'Property/Car Sale', value: 'property-car-sale' },
          ]}
          placeholder="Filter By"
          value={'Salary'}
        />
      </View>

      <HStack alignItems="center">
        <Paragraph>My Whips</Paragraph>
        <Switch
          trackColor={{
            false: Colors.grey,
            true: Colors.brandSecondary,
          }}
          thumbColor={Colors.brandSecondaryDark}
          ios_backgroundColor={Colors.grey}
          onValueChange={value => console.log(value)}
          value={Boolean(true)}
          style={{
            transform:
              Platform.OS === 'ios'
                ? [{ scaleX: 0.6 }, { scaleY: 0.6 }]
                : [{ scaleX: 1 }, { scaleY: 1 }],
          }}
        />
      </HStack>
    </View>
  );
};

interface WhipFilterButtonsProps {
  buttons: WhipFilterButton[];
  selectedIndex: WhipFilterButton;
  onPress: (index: WhipFilterButton) => void;
}

const WhipFilterButtons: React.FC<WhipFilterButtonsProps> = ({ buttons, selectedIndex, onPress }) => {
  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: Gap.small }}>
        {buttons.map((button) => (
          <BaseButton
            key={button}
            onPress={() => onPress(button)}
            selected={selectedIndex === button}
            flatten
            variant={button === 'Archived' ? 'muted' : 'primary'}
            alignSelf='flex-end'
          >
            {button}
          </BaseButton>
        ))}
      </View>
      <LineSeparator />
    </>
  );
};

export default WhipFilterButtons;
