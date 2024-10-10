import React from 'react';
import { Colors } from '../../theme/colors';
import { Heading } from '../Typography';

export const FormFieldTitle = ({ title }: { title: string }) => {
  return title ? (
    <Heading
      color={Colors.brandSecondary}
      size="xSmall"
      style={{
        textTransform: 'uppercase',
      }}
    >
      {title}
    </Heading>
  ) : null;
};
