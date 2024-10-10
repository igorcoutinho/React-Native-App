import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { storage } from '../..';
import { MainContainer } from '../../components/MainContainer';
import { ModalHeader } from '../../components/ModalHeader';
import { InternalNavigationNames } from '../../navigation/types';
import { safeJsonParse, safeJsonString } from '../../utils/utilities';
import { IVerificationFormData, VerificationForm } from './VerificationForm';

export const KYCManualVerification = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const onSubmit = async (formData: IVerificationFormData) => {
    await storage.set('accountAttachments', safeJsonString(formData));
    navigation.navigate(InternalNavigationNames.Tabs, {
      screen: 'Account',
    });
  };

  const savedInformation =
    safeJsonParse(storage.getString('accountAttachments')) || {};

  return (
    <>
      <ModalHeader />
      <MainContainer>
        <VerificationForm
          initialValues={savedInformation}
          onSubmit={onSubmit}
        />
      </MainContainer>
    </>
  );
};
