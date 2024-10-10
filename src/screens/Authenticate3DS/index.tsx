import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React from 'react';
import { Alert } from 'react-native';
import { useAuthScreenLocker } from '../../components/AuthScreenLocker';
import { BaseButton } from '../../components/BaseButton';
import { FloatingBottom } from '../../components/FloatingBottom';
import { MainContainer } from '../../components/MainContainer';
import { Section } from '../../components/elements/Section';
import { InternalNavigationNames } from '../../navigation/types';
import { useAuthenticate3DSMutation } from '../../queries/Misc/useAuthenticate3DSMutation';
import { useAuthenticate3DSQuery } from '../../queries/Misc/useAuthenticate3DSQuery';
import { useUser } from '../../states/User';
import { useAppStateFocus } from '../../utils/hooks/useAppStateFocus';
import { TicketInformation } from './TicketInformation';

export const Authenticate3DS = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<any>>();

  const { status, showAuthScreen } = useAuthScreenLocker();
  const { isSignedIn } = useUser();

  const { user } = useUser();

  const ticketId = route?.params?.ticketId;

  const authenticate3DSTicketQuery = useAuthenticate3DSQuery({
    enabled: !!ticketId && status === 'success',
    ticketId,
  });

  const authenticate3DSMutation = useAuthenticate3DSMutation({
    onError: () => {
      Alert.alert('3DS Secure Authentication', 'Authentication cancelled or expired. Please repeat the transaction and try to authenticate again.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate(InternalNavigationNames.Tabs, {
              screen: 'MyWhips',
            });
          },
        },
      ]);
    },
    onSuccess: () => {
      Alert.alert('3DS Secure Authentication', 'Transaction authenticated! Please continue the operation at the merchant site.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate(InternalNavigationNames.Tabs, {
              screen: 'MyWhips',
            });
          },
        },
      ]);
    },
    sessionId: authenticate3DSTicketQuery.data?.metadata?.sessionId,
    userId: user?.uid,
  });

  useAppStateFocus(showAuthScreen, isSignedIn);

  React.useEffect(() => {
    if (status === 'success') { }
    if (status === 'error') {
      Alert.alert('3DS Secure Authentication', 'Authentication failed. Please try again.');
      showAuthScreen();
    }
    if (status === 'cancelled') {
      authenticate3DSMutation.mutate({
        result: 'FAIL'
      });
    }
  }, [status]);

  return (
    <>
      <MainContainer paddingBottom={0}>
        <TicketInformation data={authenticate3DSTicketQuery.data} isLoading={authenticate3DSMutation.isPending} />
      </MainContainer>
      <FloatingBottom>
        <Section direction='row'>
          <BaseButton
            disabled={authenticate3DSMutation.isPending}
            grow
            onPress={() => {
              authenticate3DSMutation.mutate({
                result: 'SUCCESS',
              });
            }}
          >
            Confirm Transaction
          </BaseButton>
          <BaseButton
            disabled={authenticate3DSMutation.isPending}
            variant="muted"
            onPress={() => {
              authenticate3DSMutation.mutate({
                result: 'FAIL',
              });
            }}
          >
            Leave
          </BaseButton>
        </Section>
      </FloatingBottom >
    </>
  );
};
