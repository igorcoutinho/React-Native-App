import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert } from 'react-native';
import { storage } from '../..';
import { MainContainer } from '../../components/MainContainer';
import { ModalHeader } from '../../components/ModalHeader';
import { InternalNavigationNames } from '../../navigation/types';
import { useUser } from '../../states/User';
import { cleanExtraBlankSpaces, safeJsonParse, safeJsonString } from '../../utils/utilities';
import { IRegistrationFormData, RegistrationForm } from './RegistrationForm';

export const CreateAccount = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { user } = useUser();

  const onSubmit = async (formData: IRegistrationFormData) => {
    try {
      await storage.set('accountData', safeJsonString(formData));
      navigation.navigate(InternalNavigationNames.Tabs, {
        screen: 'Account',
      });
    } catch (error) {
      Alert.alert('Error', 'We cannot save your Account data.');
    }
  };

  const savedInformation =
    safeJsonParse<any>(storage.getString('accountData')) || {};

  const userInfo = {
    email: user?.email || '',
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: cleanExtraBlankSpaces(user?.displayName?.split(' ').slice(1).join(' ') || ''),
    phoneNumber: user?.phoneNumber || '',
  };

  // const mock = {
  //   addressLine1: "42 Riefield Road",
  //   addressLine2: "",
  //   city: "London",
  //   flatNumber: "",
  //   houseNumber: 42,
  //   postalCode: "SE92QB",
  //   agreedToTerms: true,
  //   dob: new Date('1981-10-31T03:24:00'),
  //   email: "lisasansom@hotmail.co.uk",
  //   firstName: "lisa",
  //   lastName: "sansom",
  //   phoneNumber: "+447775644743",
  //   sourceOfFunds: "salary",
  // }

  // console.log(mock);
  // console.log(savedInformation)
  return (
    <>
      <ModalHeader />
      <MainContainer>
        <RegistrationForm
          initialValues={
            {
              ...userInfo,
              ...savedInformation,
              // ...mock,
            } as unknown as IRegistrationFormData
          }
          onSubmit={onSubmit}
        />
      </MainContainer>
    </>
  );
};
