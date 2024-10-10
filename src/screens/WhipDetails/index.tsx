import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { WhipContextProvider } from '../../states/Whip';
import { WhipNavigator } from './WhipNavigator';

export const WhipDetails = () => {
  const route = useRoute<RouteProp<any>>();
  return (
    <WhipContextProvider whipId={route.params?.whipId}>
      <WhipNavigator />
    </WhipContextProvider>
  );
};
