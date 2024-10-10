import { useToast } from '@gluestack-ui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { analytics } from '../..';
import { MainContainer } from '../../components/MainContainer';
import { ModalHeader } from '../../components/ModalHeader';
import { ToastComponent } from '../../components/Toast';
import { useViewLocker } from '../../components/ViewLocker';
import { InternalNavigationNames } from '../../navigation/types';
import { useWhipCreateMutation } from '../../queries/Whip/useWhipCreateMutation';
import { IWhipFormData, WhipForm } from './WhipForm';

export const CreateWhip = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const toast = useToast();

  const { toggleLocker } = useViewLocker();

  const handleCloseModal = (newWhipId?: string) => {
    navigation.navigate(InternalNavigationNames.Tabs, {
      params: { newWhipId },
      screen: 'MyWhips',
    });
  };

  const useCreateWhip = useWhipCreateMutation({
    onError: error => {
      toggleLocker(false);
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastComponent action="error" toastId={id} message={error.message} />
        ),
      });
    },
    onSuccess: async newWhip => {
      toggleLocker(false);
      try {
        await analytics().logEvent('whip_created', {
          whipId: newWhip?.id,
          whipName: newWhip?.name,
        });
      } catch (error) { }
      handleCloseModal(newWhip.id);
    },
  });

  const onSubmit = (formData: IWhipFormData) => {
    toggleLocker(true);
    useCreateWhip.mutate({
      body: {
        attachment: formData.category.image,
        endAt: formData.infinity ? null : formData.dates.end,
        name: formData.name,
        startAt: formData.infinity ? null : formData.dates.start,
        type: formData.category.type,
      },
      shouldOptimisticUpdate: true,
    });
  };

  return (
    <>
      <ModalHeader />
      <MainContainer>
        {/* <WhatIsAWhip /> */}
        <WhipForm onSubmit={onSubmit} disabled={useCreateWhip.isPending} onCancel={
          () => handleCloseModal()
        } />
      </MainContainer>
    </>
  );
};
