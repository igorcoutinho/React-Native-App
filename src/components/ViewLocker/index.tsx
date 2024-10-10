import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { styles } from './styles';

export const ViewLockerContext = React.createContext<{
  toggleLocker: (value: boolean) => void;
  isLocked: boolean;
}>({
  toggleLocker: () => {},
  isLocked: false,
});

export const ViewLocker = ({
  showLoading = true,
}: {
  showLoading?: boolean;
}) => {
  return (
    <View style={styles.container}>
      {showLoading ? <ActivityIndicator size="large" color="#FFFFFF" /> : null}
    </View>
  );
};

export function ViewLockerContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLocker, setShowLocker] = React.useState<boolean>(false);
  return (
    <ViewLockerContext.Provider
      value={{
        toggleLocker: value => {
          setShowLocker(value);
        },
        isLocked: showLocker,
      }}
    >
      {showLocker ? <ViewLocker showLoading={true} /> : null}
      {children}
    </ViewLockerContext.Provider>
  );
}

export const useViewLocker = () => {
  const context = React.useContext(ViewLockerContext);
  return context;
};
