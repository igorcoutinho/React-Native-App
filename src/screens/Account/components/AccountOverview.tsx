import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { storage } from '../../..';
import { DialogV2 } from '../../../components/DialogV2';
import { MainContainer } from '../../../components/MainContainer';
import { useTabsBarBottomSize } from '../../../components/TabsBar';
import { Spacer } from '../../../components/elements/Spacer';
import { useAccountHistoryQuery } from '../../../queries/Account/useAccountHistoryQuery';
import { useUser } from '../../../states/User';
import { Size } from '../../../theme/sizes';
import { FabButton } from '../../MyWhips/components';
import { HistorySection } from '../../WhipDetails/WhipDetailsMain/HistorySection';
import { Balance } from '../components';
import { AccountHelpDialog } from './AccountHelpDialog';

export const AccountOverview = () => {
  const [visible, setVisible] = React.useState(false);
  const navigation = useNavigation<NavigationProp<any>>();
  const { user } = useUser();

  const accountHistoryQuery = useAccountHistoryQuery({
    enabled: !!user?.uid,
    userId: user?.uid,
  });

  React.useEffect(() => {
    storage.delete('accountData');
    storage.delete('accountAttachments');
  }, []);

  return (
    <MainContainer paddingBottom={useTabsBarBottomSize()}>
      {/* <OnboardingAccount /> */}
      {/* <AccountBanner
        name={user?.displayName}
        onPress={() => navigation.navigate('AccountSettings')}
        since={format(user?.account?.createdAt?.toDate(), 'dd/MM/yyyy')}
        status="verified"
      /> */}
      <Spacer size={Size.large} />
      <Balance onPressHelp={() => setVisible(true)} />
      <DialogV2 visible={visible}>
        <AccountHelpDialog onPressToDismiss={() => setVisible(false)} />
      </DialogV2>
      <HistorySection history={accountHistoryQuery.data} userId={user.uid} />
      <FabButton />
    </MainContainer>
  );
};
