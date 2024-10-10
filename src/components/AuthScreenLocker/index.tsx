import {
  faCheckCircle,
  faEye,
  faEyeSlash,
  faLock,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import FirebaseAuth from '@react-native-firebase/auth';
import React from 'react';
import { Image, Modal, NativeModules, Pressable, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { Images } from '../../theme/images';
import { Gap, Size } from '../../theme/sizes';
import { BaseButton } from '../BaseButton';
import { Heading, Paragraph } from '../Typography';
import { Box, Section } from '../elements/Section';
import { InputText } from '../form/InputText';
import { styles } from './styles';

const AuthScreenLockerContext = React.createContext<{
  status: 'error' | 'success' | 'cancelled' | 'standby';
  showAuthScreen: () => void;
}>(null);

const { MySharedStorage } = NativeModules;

export const AuthScreenLocker = ({
  onCancel,
  onError,
  onSuccess,
}: {
  onCancel?: () => void;
  onError: (error: any) => void;
  onSuccess: () => void;
}) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState('');
  const [status, setStatus] = React.useState<
    'standby' | 'confirmed' | 'failed'
  >('standby');

  const handlePasswordConfirmation = async () => {
    setIsLoading(true);
    try {
      await FirebaseAuth().signInWithEmailAndPassword(
        FirebaseAuth().currentUser.email,
        password,
      );
      if (password) {
        await MySharedStorage?.setValue(String(password), 'userPassword');
      }
      console.log('handlePasswordConfirmation in AuthScreenLocker: Success!');
      onSuccess?.();
      setStatus('confirmed');
    } catch (error: any) {
      console.log('handlePasswordConfirmation in AuthScreenLocker: ', error);
      onError?.(error);
      setStatus('failed');
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Box
          align="center"
          color={Colors.appBackgroundColor}
          fullWidth
          gap={Gap.regular}
          space={Size.xLarge}
        >
          {status === 'standby' ? (
            <Image
              source={Images.whipAppLogo}
              alt="Whip Logo"
              style={{
                height: 110,
                resizeMode: 'contain',
                width: 110,
              }}
            />
          ) : null}
          {status === 'confirmed' ? (
            <FontAwesomeIcon
              icon={faCheckCircle}
              color={Colors.success}
              size={110}
            />
          ) : null}
          {status === 'failed' ? (
            <FontAwesomeIcon
              icon={faTimesCircle}
              color={Colors.danger}
              size={110}
            />
          ) : null}
          <Section gap={0}>
            <Heading align="center" size="medium">
              Password Required!
            </Heading>
            <Paragraph align="center" size="small">
              Please enter your password to continue.
            </Paragraph>
          </Section>
          <InputText
            autoComplete="current-password"
            onChange={value => setPassword(value)}
            placeholder="MyP@ssword!"
            secureTextEntry={!showPassword ? true : false}
            value={password}
            leftIcon={faLock}
            disabled={isLoading}
            rightAccessory={
              <Pressable onPress={() => setShowPassword(showState => !showState)}>
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  color={Colors.brandSecondary}
                />
              </Pressable>
            }
          />
          <Section direction="row">
            <BaseButton
              disabled={password.length <= 5 || isLoading}
              grow
              onPress={() => handlePasswordConfirmation()}
            >
              Confirm
            </BaseButton>
            <BaseButton variant="muted" onPress={onCancel}>
              Cancel
            </BaseButton>
          </Section>
        </Box>
      </View>
    </Modal>
  );
};

export function AuthScreenLockerContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = React.useState<
    'error' | 'success' | 'cancelled' | 'standby'
  >('standby');
  const [show, setShow] = React.useState(false);

  return (
    <AuthScreenLockerContext.Provider
      value={{
        status,
        showAuthScreen: () => {
          setShow(true);
        },
      }}
    >
      {show ? (
        <AuthScreenLocker
          onError={() => {
            setStatus('error');
            setTimeout(() => {
              setStatus('standby');
            }, 300);
          }}
          onSuccess={() => {
            setShow(false);
            setStatus('success');
            setTimeout(() => {
              setStatus('standby');
            }, 300);
          }}
          onCancel={() => {
            setShow(false);
            setStatus('cancelled');
            setTimeout(() => {
              setStatus('standby');
            }, 300);
          }}
        />
      ) : null}
      {children}
    </AuthScreenLockerContext.Provider>
  );
}

export const useAuthScreenLocker = () => {
  const context = React.useContext(AuthScreenLockerContext);
  return context;
};
