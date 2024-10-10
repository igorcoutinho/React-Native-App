import React from 'react';
import { View } from 'react-native';
import { FontSize } from '../../theme/typography';
import { FormFieldTitle } from '../form/FormFieldTitle';
import { InputText } from '../form/InputText';

interface TextAreaProps {
    maxLength?: number;
    disabled?: boolean;
    text?: string;
    setText?: (value: string) => void;
    showCount?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
    maxLength = 500,
    disabled = false,
    text,
    setText,
    showCount = false,
}) => {

    const handleChangeText = (newText: string) => {
        if (newText.length <= maxLength || newText.length < text.length) {
            setText(newText);
        }
    };

    return (
        <View>
            <View
                style={{
                    flexDirection: 'row',
                    gap: 10,
                    overflow: 'hidden',
                    paddingHorizontal: 10,
                    alignItems: 'center',

                }}
            >
                <InputText
                    multiline
                    keyboardType="default"
                    disabled={disabled}
                    onChange={value => handleChangeText(value)}
                    value={text}
                    style={{
                        height: 50,
                        opacity: disabled ? 0.5 : 1,
                        width: '100%',
                        fontSize: FontSize.regular,
                        marginTop: 10,
                    }}
                />
            </View>

            {showCount &&
                <View style={{ flexDirection: 'row', marginLeft: 4, marginTop: 4, paddingHorizontal: 10, }}>
                    <FormFieldTitle title={`${text ? text.length : '0'} / ${maxLength}`} />
                </View>
            }
        </View>
    );
};

export default TextArea;
