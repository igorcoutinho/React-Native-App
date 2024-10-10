import React from 'react';
import { View } from 'react-native';
import { Gap, Size } from '../../theme/sizes';
import { Heading, Paragraph } from '../Typography';
import { Section } from './Section';

export const HeaderWithImage = ({
  description,
  renderImage,
  title,
}: {
  description?: string | React.ReactNode;
  renderImage?: any;
  title?: string;
}) => {
  return (
    <Section gap={Gap.medium} spaceVertical={Size.medium}>
      {renderImage ? (
        <View style={{ alignItems: 'center' }}>{renderImage}</View>
      ) : null}
      <Section gap={Gap.x2Small}>
        <Heading>{title}</Heading>
        {typeof description === 'string' ? (
          <Paragraph>{description}</Paragraph>
        ) : (
          description
        )}
      </Section>
    </Section>
  );
};
