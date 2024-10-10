import { View } from "react-native";
import { BaseButton } from "../../components/BaseButton";
import { Gap } from "../../theme/sizes";

interface InviteFilterButtonsProps {
  buttons: string[];
  selectedButton: string;
  onPress: (value: string) => void;
}

const InviteFilterButtons: React.FC<InviteFilterButtonsProps> = ({ buttons, selectedButton, onPress }) => {
  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: Gap.small }}>
        {buttons.map((button) => (
          <BaseButton
            key={button}
            onPress={() => onPress(button)}
            selected={selectedButton === button}
            flatten
            alignSelf='flex-end'
            variant='secondary'
          >
            {button}
          </BaseButton>
        ))}
      </View>
    </>
  );
};

export default InviteFilterButtons;