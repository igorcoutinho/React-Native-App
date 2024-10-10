import React from 'react';
import { Alert } from 'react-native';
import { analytics, storage } from '../../../';
import { useAccountUpdateMutation } from '../../../queries/Account/useAccountUpdateMutation';
import { useUser } from '../../../states/User';
import { safeJsonParse } from '../../../utils/utilities';
import { IRegistrationFormData } from '../../CreateAccount/RegistrationForm';
import { RegistrationConference } from './RegistrationConference';
import { RegistrationError } from './RegistrationError';
import { RegistrationInconclusive } from './RegistrationInconclusive';
import { RegistrationProcessing } from './RegistrationProcessing';
import { RegistrationWelcome } from './RegistrationWelcome';

export const RegistrationFlow = () => {
  const { user } = useUser();

  const exists = !!user?.account && !!user?.account?.verification;
  const inconclusive = user?.account?.verification?.inconclusive;
  const verified = user?.account?.verification?.verified;
  const error = user?.account?.verification?.error;
  const logs = user?.account?.verification?.logs;

  const processing = user?.account?.status === 'PROCESSING';

  const accountUpdateMutation = useAccountUpdateMutation({
    onSuccess: async () => {
      try {
        await analytics().logEvent('account_registration_attempt', {
          userId: user?.uid,
        });
      } catch (error) { }
    },
  });

  const handleSubmit = () => {
    try {
      const account = safeJsonParse<IRegistrationFormData>(
        storage.getString('accountData'),
      );
      const attachments: any = safeJsonParse(
        storage.getString('accountAttachments'),
      );

      const { address, ...rest } = account;

      rest.phoneNumber = account.phoneNumber.replace(/\s/g, '');
      rest.dob = new Date(account.dob);

      const attachmentsPayload = attachments
        ? {
          document: {
            documentType: attachments?.document?.documentType,
            files: [attachments?.document?.image.uri],
          },
          selfie: {
            files: [attachments?.selfie?.image.uri],
          },
        }
        : null;

      const {
        addressLine1,
        addressLine2,
        city,
        flatNumber,
        houseName,
        houseNumber,
        postalCode,
      } = address;

      accountUpdateMutation.mutate({
        account: {
          address: {
            addressLine1: addressLine1 || '',
            addressLine2: addressLine2 || '',
            city: city || '',
            flatNumber: flatNumber || null,
            houseName: houseName || null,
            houseNumber: houseNumber || null,
            postalCode: postalCode || '',
          },
          ...rest,
        },
        attachments: attachmentsPayload,
      });
    } catch (error) {
      Alert.alert('Error', 'An error occurred, please try again');
    }
  };

  const step1Error = error?.find?.(
    (e: any) => e.type === 'BasicVerificationFailed',
  );

  const step2Errors = error?.filter?.(
    (e: any) => e.type !== 'BasicVerificationFailed',
  );

  const containStep2Errors = step2Errors?.length > 0;

  return (
    <>
      {processing ? (
        <RegistrationProcessing />
      ) : (
        <>
          {!exists ? (
            <RegistrationWelcome onPressToSubmit={handleSubmit} />
          ) : null}
          {inconclusive && !containStep2Errors ? (
            <RegistrationInconclusive onPressToSubmit={handleSubmit} logs={logs} />
          ) : null}
          {containStep2Errors && !step1Error ? (
            <RegistrationConference
              onPressToSubmit={handleSubmit}
              errors={step2Errors}
            />
          ) : null}
          {!containStep2Errors && step1Error && !inconclusive ? (
            <RegistrationError onPressToSubmit={handleSubmit} logs={logs} />
          ) : null}
        </>
      )}
    </>
  );
};
