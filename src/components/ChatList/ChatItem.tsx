import React from 'react';
import { View } from 'react-native';
import { IWhipChat } from '../../states/Chat/types';
import { Colors } from '../../theme/colors';
import { Size } from '../../theme/sizes';
import { getAvatarInitials } from '../../utils/utilities';
import { Heading, Paragraph } from '../Typography';
import { Box } from '../elements/Section';
import { FormFieldTitle } from '../form/FormFieldTitle';

export const ChatItem = ({
  data,
}: {
  data: IWhipChat;
}) => {

  const initials = getAvatarInitials(data.email);
  const createAt = data?.createdAt;
  const displayName = data.displayName;
  const [date, setDate] = React.useState('');

  React.useEffect(() => {
    if (createAt instanceof Date) {
      setDate(createAt.toISOString());
    } else {
      const milliseconds = createAt.seconds * 1000 + Math.floor(createAt.nanoseconds / 1000000);
      const date = new Date(milliseconds);
      setDate(date.toLocaleString());
    }
  }, [])


  return (
    <View>
      <Heading
        color={Colors.brandSecondary}
        size="xSmall"
        style={{
          textTransform: 'capitalize',
        }}
      >
        {displayName}
      </Heading>
      <View
        style={{
          alignItems: 'center',
          backgroundColor: Colors.greyXLight,
          borderRadius: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 10,
        }}
      >
        <View
          style={{
            alignItems: 'flex-end',
            flex: 1,
            flexDirection: 'row',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

            <Box space={Size.x2Small} grow>
              <View >
                <Paragraph size="xSmall">{data.message}</Paragraph>
              </View>

            </Box>
          </View>
        </View>

      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <FormFieldTitle title={date} />
      </View>

    </View>

  );
};
