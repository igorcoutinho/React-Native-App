import { faImage } from '@fortawesome/free-solid-svg-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { BaseButton } from '../../../components/BaseButton';
import { LineSeparator } from '../../../components/elements/LineSeparator';
import { Section } from '../../../components/elements/Section';
import { Spacer } from '../../../components/elements/Spacer';
import { FloatingBottom } from '../../../components/FloatingBottom';
import { FileUploaderV2 } from '../../../components/form/FileUploaderV2';
import { FormFieldTitle } from '../../../components/form/FormFieldTitle';
import { InputText } from '../../../components/form/InputText';
import { MainContainer, ScrollableContainer } from '../../../components/MainContainer';
import { ModalHeader } from '../../../components/ModalHeader';
import { Bold, Heading, Paragraph } from '../../../components/Typography';
import { useViewLocker } from '../../../components/ViewLocker';
import { useWhipArchiveMutation } from '../../../queries/Whip/useWhipArchiveMutation';
import { useWhipChangeStatusMutation } from '../../../queries/Whip/useWhipChangeStatusMutation';
import { useWhipUpdateImageMutation } from '../../../queries/Whip/useWhipUpdateImageMutation';
import { useWhipContext } from '../../../states/Whip';
import { Colors } from '../../../theme/colors';
import { Gap, Size } from '../../../theme/sizes';


export const WhipConfigurations = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [isTouched, setIsTouched] = useState(false);

  const { toggleLocker } = useViewLocker();

  const { whip } = useWhipContext();

  const [whipName, setWhipName] = useState<string>();

  const [image, setImage] = React.useState<any>();

  const [whipStatus, setWhipStatus] = React.useState<boolean>(true);


  const whipUpdateImageMutation = useWhipUpdateImageMutation({
    onError: error => {
      toggleLocker(false);
      Toast.show({
        type: 'error',
        text1: 'Whip Edit Failed',
        text2: error.message,
      });
    },
    onSuccess: () => {
      toggleLocker(false);
      Toast.show({
        type: 'success',
        text1: 'Whip Edit Success',
        text2: 'If there are any discrepancies, please contact support.',
      });
    },
  });

  const updateWhipData = () => {

    if (image?.uri || whip.name !== whipName) {
      toggleLocker(true);
      try {
        if (image?.uri) {
          const attachmentPayload = image
            ? {
              document: {
                documentType: image?.type,
                path: image?.uri,
              },
            }
            : null;

          if (attachmentPayload) {
            whipUpdateImageMutation.mutate({
              id: whip.id,
              attachment: attachmentPayload,
              newWhipName: whipName
            });
          }
        }
        else if (whip.name !== whipName) {
          whipUpdateImageMutation.mutate({
            id: whip.id,
            newWhipName: whipName
          });
        }
      }
      catch (e) {
        toggleLocker(false);
      }
    }
  }

  React.useEffect(() => {
    if (whip) {
      setWhipName(whip.name);
      setImage(whip.attachment);
      if (whip.disabled) {
        setWhipStatus(false);
      }
    }
  }, [whip]);

  const whipArchiveMutation = useWhipArchiveMutation({
    onError: () => {
      Toast.show({ type: 'error', text1: 'Archive Whip failed' });
      toggleLocker(false);
    },
    onSuccess: () => {
      Toast.show({ type: 'success', text1: 'Whip archived successfully' });
      toggleLocker(false);
      navigation.navigate('MyWhips');
    },
  });

  const whipChangeStatusMutation = useWhipChangeStatusMutation({
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Change Whip status failed',
      });
      toggleLocker(false);
    },
    onSuccess: (status) => {
      toggleLocker(false);
      setWhipStatus(!status);
      Toast.show({
        type: 'success',
        text1: status ? 'Whip closed successfully' : 'Whip opened successfully',
      });
    },
  });

  const handleChangeWhipStatus = React.useCallback((value: boolean) => {
    const title = whipStatus ? 'Close Whip' : 'Open Whip';
    const message = whipStatus ? 'Are you sure you want to close this whip?' : 'Are you sure you want to open this whip?';
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          style: 'destructive',
        },
        {
          text: 'Accept',
          style: 'default',
          onPress: () => {
            toggleLocker(true);
            whipChangeStatusMutation.mutate({ whipId: whip?.id, status: value });
          },
        },
      ],
    );
  }, [whipStatus, whip?.id]);

  return (
    <>
      <ModalHeader onPress={() => navigation.navigate('MyWhips')} />
      <MainContainer>
        <ScrollableContainer>
          <Section>
            {!whip.balance && (
              <>
                <Section>
                  <Section gap={0}>
                    <Heading color={Colors.brandSecondary} size="small" style={{ textTransform: 'uppercase' }}>
                      Whip Options
                    </Heading>
                    <LineSeparator />
                  </Section>
                  <BaseButton
                    grow
                    variant="danger"
                    onPress={() => {
                      Alert.alert('Archive Whip', 'Are you sure you want to archive this whip? This action cannot be undone.', [
                        {
                          text: 'Proceed',
                          style: 'destructive',
                          onPress: async () => {
                            toggleLocker(true);
                            whipArchiveMutation.mutate({ whipId: whip.id });
                          },
                        },
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                      ]);
                    }}
                  >
                    Archive Whip
                  </BaseButton>
                </Section>
                <LineSeparator />
              </>
            )}
            <Section>
              <Section gap={0}>
                <Heading color={Colors.brandSecondary} size="small" style={{ textTransform: 'uppercase' }}>
                  Edit Whip
                </Heading>
                <Spacer size={Gap.xSmall} />
                <Paragraph size="xSmall" color={Colors.mutedDark}>
                  Whip Account ID: <Bold>{whip?.card?.accountId}</Bold>
                </Paragraph>
                <LineSeparator />
              </Section>
              {whip.isOwner ? (
                <>
                  <Section >
                    <FormFieldTitle title={'Whip Name'} />
                    <InputText
                      onChange={value => {
                        setIsTouched(true);
                        setWhipName(value);
                      }}
                      placeholder="Whip Name"
                      value={whipName}
                    />
                  </Section>
                  <Section >
                    <FormFieldTitle title={'Whip Image'} />
                    <FileUploaderV2
                      onChange={(imageData) => {
                        setIsTouched(true);
                        setImage(imageData);
                      }}
                      value={image?.uri || image}
                      showCameraButton
                      showGalleryButton
                      icon={faImage}
                      borderRadius={10}
                    />
                  </Section>
                  <Spacer size={Size.x2Small} />
                  <BaseButton
                    disabled={!isTouched || whipUpdateImageMutation.isPending}
                    onPress={() => updateWhipData()}
                  >
                    Save Changes
                  </BaseButton>
                </>
              ) : null}
            </Section>
          </Section>
        </ScrollableContainer>
      </MainContainer>
      <FloatingBottom>
        <Section>
          <BaseButton variant="muted" onPress={() => navigation.goBack()}>
            Back
          </BaseButton>
        </Section>
      </FloatingBottom>
    </>
  );
};
