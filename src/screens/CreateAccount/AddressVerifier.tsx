import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect } from 'react';
import { BaseButton } from '../../components/BaseButton';
import { LineSeparator } from '../../components/elements/LineSeparator';
import { Section } from '../../components/elements/Section';
import { Spacer } from '../../components/elements/Spacer';
import { Bold, Heading, Paragraph } from '../../components/Typography';
import { resetUseLookupAddressQuery, useLookupAddressQuery } from '../../queries/Account/useLookupAddressQuery';
import { Colors } from '../../theme/colors';
import { Gap, Size } from '../../theme/sizes';

export interface IAddressVerifierData {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  flatNumber?: string | null;
  houseName?: string | null;
  houseNumber?: string | null;
  postalCode?: string;
}

export const AddressVerifier = ({
  onConfirm,
  onCancel,
  address,
}: {
  onConfirm: (address?: IAddressVerifierData) => void;
  onCancel: () => void;
  address?: IAddressVerifierData;
}) => {
  const lookupAddressQuery = useLookupAddressQuery({
    address,
    enabled: true,
  });

  useEffect(() => {
    return () => {
      console.log(';lkj');
      resetUseLookupAddressQuery();
    }
  }, []);

  console.log('address', address, JSON.stringify(lookupAddressQuery.data, null, 2));

  const streetAddress = lookupAddressQuery.data?.addressComponents?.find((component) => component.componentType === 'route');
  const streetNumber = lookupAddressQuery.data?.addressComponents?.find((component) => component.componentType === 'street_number');
  const city = lookupAddressQuery.data?.addressComponents?.find((component) => component.componentType === 'postal_town');
  const postalCode = lookupAddressQuery.data?.addressComponents?.find((component) => component.componentType === 'postal_code');

  const missingCity = lookupAddressQuery.data?.missingComponentTypes?.includes('postal_town');
  const missingPostalCode = lookupAddressQuery.data?.missingComponentTypes?.includes('postal_code');
  const missingStreetAddress = lookupAddressQuery.data?.missingComponentTypes?.includes('route');
  const missingStreetNumber = lookupAddressQuery.data?.missingComponentTypes?.includes('street_number');

  const houseName = address?.houseName;
  const flatNumber = address?.flatNumber;

  const checkIfThereIsMissingComponent = missingCity || missingPostalCode || missingStreetAddress || missingStreetNumber;
  const checkIfThereIsThereAnyConfirmationLevelUnconfirmed = lookupAddressQuery.data?.addressComponents?.some((component) => component.confirmationLevel !== 'CONFIRMED');

  if (lookupAddressQuery.isLoading) {
    return (
      <Section space={Size.xLarge}>
        <Section>
          <Heading>Confirm your Address to Proceed</Heading>
        </Section>
        <LineSeparator />
        <Paragraph size={Size.small}>
          <Bold>Verifying...</Bold>
        </Paragraph>
        <Spacer size={Size.x2Small} />
      </Section>
    );
  }

  return (
    <Section space={Size.xLarge}>
      <Section>
        <Heading>Confirm your Address to Proceed</Heading>
      </Section>
      <LineSeparator />
      <Paragraph size={Size.small}>
        <Bold>{lookupAddressQuery.data?.address}</Bold>
      </Paragraph>
      <LineSeparator />

      {checkIfThereIsMissingComponent || checkIfThereIsThereAnyConfirmationLevelUnconfirmed ? (
        <Paragraph color={Colors.danger} size={Size.small}>
          <Bold>There are one or more inconsistencies with your address, please correct to proceed.</Bold>
        </Paragraph>
      ) : (
        <Paragraph color={Colors.success} size={Size.small}>
          <Bold>All good with your address, confirm to proceed!</Bold>
        </Paragraph>
      )}

      <Section>
        {flatNumber && (
          <Section direction="row" gap={Gap.xSmall} style={{ alignItems: 'center' }}>
            <Paragraph size={Size.small}>
              <Bold>Flat Number:</Bold> {flatNumber}
            </Paragraph>
            <FontAwesomeIcon icon={faCheckCircle} color={Colors.success} size={Size.small} />
          </Section>
        )}
        {houseName && (
          <Section direction="row" gap={Gap.xSmall} style={{ alignItems: 'center' }}>
            <Paragraph size={Size.small}>
              <Bold>House Name:</Bold> {houseName}
            </Paragraph>
            <FontAwesomeIcon icon={faCheckCircle} color={Colors.success} size={Size.small} />
          </Section>
        )}
        {streetNumber && (
          <Section direction="row" gap={Gap.xSmall} style={{ alignItems: 'center' }}>
            <Paragraph size={Size.small}>
              <Bold>Street Number:</Bold> {streetNumber.componentName}
            </Paragraph>
            {streetNumber.confirmationLevel === 'CONFIRMED' && (
              <FontAwesomeIcon icon={faCheckCircle} color={Colors.success} size={Size.small} />
            )}
            {streetNumber.confirmationLevel === 'UNCONFIRMED_BUT_PLAUSIBLE' && (
              <FontAwesomeIcon icon={faExclamationCircle} color={Colors.attention} size={Size.small} />
            )}
          </Section>
        )}
        {missingStreetNumber && (
          <Paragraph size={Size.small} color={Colors.danger}>
            <Bold>House Number:</Bold> House Number is missing or invalid.
          </Paragraph>
        )}
        {streetAddress && (
          <Section direction="row" gap={Gap.xSmall} style={{ alignItems: 'center' }}>
            <Paragraph size={Size.small}>
              <Bold>Address:</Bold> {streetAddress.componentName}
            </Paragraph>
            {streetAddress.confirmationLevel === 'CONFIRMED' && (
              <FontAwesomeIcon icon={faCheckCircle} color={Colors.success} size={Size.small} />
            )}
            {streetAddress.confirmationLevel === 'UNCONFIRMED_BUT_PLAUSIBLE' && (
              <FontAwesomeIcon icon={faExclamationCircle} color={Colors.attention} size={Size.small} />
            )}
          </Section>
        )}
        {missingStreetAddress && (
          <Paragraph size={Size.small} color={Colors.danger}>
            <Bold>Address:</Bold> Address is missing or invalid.
          </Paragraph>
        )}
        {city && (
          <Section direction="row" gap={Gap.xSmall} style={{ alignItems: 'center' }}>
            <Paragraph size={Size.small}>
              <Bold>City:</Bold> {city.componentName}
            </Paragraph>
            {city.confirmationLevel === 'CONFIRMED' && (
              <FontAwesomeIcon icon={faCheckCircle} color={Colors.success} size={Size.small} />
            )}
            {city.confirmationLevel === 'UNCONFIRMED_BUT_PLAUSIBLE' && (
              <FontAwesomeIcon icon={faExclamationCircle} color={Colors.attention} size={Size.small} />
            )}
          </Section>
        )}
        {missingCity && (
          <Paragraph size={Size.small} color={Colors.danger}>
            <Bold>City:</Bold> City is missing or invalid.
          </Paragraph>
        )}
        {postalCode && (
          <Section direction="row" gap={Gap.xSmall} style={{ alignItems: 'center' }}>
            <Paragraph size={Size.small}>
              <Bold>Postal Code:</Bold> {postalCode.componentName}
            </Paragraph>
            {postalCode.confirmationLevel === 'CONFIRMED' && (
              <FontAwesomeIcon icon={faCheckCircle} color={Colors.success} size={Size.small} />
            )}
            {postalCode.confirmationLevel === 'UNCONFIRMED_BUT_PLAUSIBLE' && (
              <FontAwesomeIcon icon={faExclamationCircle} color={Colors.attention} size={Size.small} />
            )}
          </Section>
        )}
        {missingPostalCode && (
          <Paragraph size={Size.small} color={Colors.danger}>
            <Bold>Postal Code:</Bold> Postal Code is missing or invalid.
          </Paragraph>
        )}
      </Section>
      <Spacer size={Size.x2Small} />
      <Section direction="row">
        {checkIfThereIsMissingComponent || checkIfThereIsThereAnyConfirmationLevelUnconfirmed ? (
          <BaseButton grow variant="danger" onPress={onCancel}>
            Correct Address
          </BaseButton>
        ) : (
          <BaseButton grow onPress={() => onConfirm(address)}>
            Confirm Address
          </BaseButton>
        )}
        <BaseButton variant="muted" onPress={onCancel}>
          Cancel
        </BaseButton>
      </Section>
    </Section>
  );
};
