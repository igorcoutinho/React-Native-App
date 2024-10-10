import { format } from 'date-fns';
import React from 'react';
import { Box, Section } from '../../components/elements/Section';
import { Spacer } from '../../components/elements/Spacer';
import { SlideInMenu } from '../../components/SlideInMenu';
import { Heading, Paragraph } from '../../components/Typography';
import {
  INotification, INotificationActionType
} from '../../states/Notifications/types';
import { Colors } from '../../theme/colors';
import { Gap } from '../../theme/sizes';
import { FontSize } from '../../theme/typography';

export const InboxListItem = ({ item, onRenderBody, onRenderBottomRight, onPress, customOptions }: {
  item: INotification;
  onRenderBody?: (item: INotification) => React.ReactNode;
  onRenderBottomRight?: (item: INotification) => React.ReactNode;
  onPress?: (event: {
    action: string;
    data: any;
  }) => void;
  customOptions?: (item: INotification) => {
    label: string;
    onPress: (item: INotification) => void;
  }[] | {
    label: string;
    onPress: (item: INotification) => void;
  }[];
}) => {

  const options: any = [
    ...(item.actionType === INotificationActionType.INVITE ? [{
      label: 'View Notification',
      onPress: () => onPress({ action: 'view', data: item }),
    }] : []),
    {
      label: 'Mark as Read',
      onPress: () => onPress({ action: 'hide', data: item }),
      hideOption: item.read
    },
    {
      label: 'Remove Notification',
      onPress: () => onPress({ action: 'remove', data: item }),
    },
    ...((typeof customOptions === 'function' ? customOptions(item) : customOptions) || [])
  ];
  const renderTrigger = () => {
    return (
      <Box color={Colors.light} grow>
        <Section gap={Gap.x2Small}>
          <Section gap={0}>
            <Heading size={FontSize.small}>{item.title}</Heading>
            <Paragraph size={FontSize.small}>{onRenderBody ? onRenderBody(item) : item.body}</Paragraph>
          </Section>
          <Spacer size={Gap.xSmall} />
          {onRenderBottomRight ? onRenderBottomRight(item) : null}
          {item?.createdAt?.toDate ? (
            <Paragraph size={FontSize.small}>
              {format(item?.createdAt?.toDate(), 'dd/MM/yyyy HH:mm')}
            </Paragraph>
          ) : null}
        </Section>
      </Box>
    );
  };

  if (!onPress) {
    return renderTrigger();
  }

  return (
    <SlideInMenu
      triggerTitle="Notification Options"
      options={options}
      renderTrigger={renderTrigger()}
    />
  );

};
