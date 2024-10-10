import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { getHeaderTitle } from '@react-navigation/elements';
import React from 'react';
import { BaseHeader } from '../BaseHeader';
import { NotificationButton } from '../NotificationButton';
const WhipappIconWhite = require('../../assets/whipappIconWhite.svg').default;

interface ITabsHeaderProps extends BottomTabHeaderProps {}

export const TabsHeader = ({
  options,
  route,
}: ITabsHeaderProps): React.ReactNode => {
  return (
    <BaseHeader
      rightAccessory={<NotificationButton />}
      leftAccessory={<WhipappIconWhite height={26} width={26} />}
      title={getHeaderTitle(options, route.name)}
    />
  );
};
