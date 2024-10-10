import React from 'react';
import { useUser } from '../../states/User';
import { AccountOverview } from './components/AccountOverview';
import { RegistrationFlow } from './components/RegistrationFlow';

export const Account = () => {
  const { user } = useUser();
  const verified = user?.account?.verification?.verified;
  return (
    <>
      {!verified ? <RegistrationFlow /> : null}
      {verified ? <AccountOverview /> : null}
    </>
  );
};
