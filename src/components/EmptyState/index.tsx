import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Colors } from '../../theme/colors';
import { Gap, Size } from '../../theme/sizes';
import { Paragraph } from '../Typography';
import { Section } from '../elements/Section';

export const EmptyState = ({
  label,
  placeholderImage,
  renderCTA,
}: {
  label: string;
  placeholderImage: IconProp;
  renderCTA?: React.ReactNode;
}) => {
  return (
    <Section align="center" gap={Gap.regular} space={Size.xLarge}>
      <Section align="center" gap={Gap.xSmall}>
        <FontAwesomeIcon
          color={Colors.muted}
          icon={placeholderImage}
          size={Size.x2Large}
        />
        <Paragraph color={Colors.mutedDark} size="small">
          {label}
        </Paragraph>
      </Section>
      {renderCTA}
    </Section>
  );
};
