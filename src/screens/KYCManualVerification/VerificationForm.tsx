import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import * as yup from 'yup';
import { BaseButton } from '../../components/BaseButton';
import { DialogV2 } from '../../components/DialogV2';
import { Heading, Paragraph } from '../../components/Typography';
import { Box, Section } from '../../components/elements/Section';
import { Spacer } from '../../components/elements/Spacer';
import { FileUploader } from '../../components/form/FileUploader';
import { FormField } from '../../components/form/FormField';
import { FormWrapper } from '../../components/form/FormWrapper';
import { SelfiePicker } from '../../components/form/SelfiePicker';
import { Size } from '../../theme/sizes';
const SelfieIllustration =
  require('../../assets/selfieIllustration.svg').default;

export interface IVerificationFormData {
  document?: {
    documentType: string;
    image: {
      base64: string;
      fileName: string;
      type: string;
      uri: string;
    };
  };
  selfie?: {
    image: {
      base64: string;
      fileName: string;
      type: string;
      uri: string;
    };
  };
}

const validateDocument = yup
  .mixed()
  .test(
    'documentObject',
    'Document image and document type are required.',
    (document: any) => {
      return document?.documentType && document?.image;
    },
  )
  .required();

const validateSelfie = yup
  .mixed()
  .test('selfieObject', 'Selfie is required.', (selfie: any) => {
    return selfie?.image;
  })
  .required('Selfie is required.');

const validationSchema = yup
  .object({
    document: validateDocument,
    selfie: validateSelfie,
  })
  .required();

export const VerificationForm = ({
  initialValues,
  onSubmit,
}: {
  initialValues?: IVerificationFormData;
  onSubmit: (formData: IVerificationFormData) => void;
}) => {
  const [visible, setVisible] = React.useState(false);

  const { control, handleSubmit } = useForm<IVerificationFormData>({
    defaultValues: {
      document: initialValues?.document || null,
      selfie: initialValues?.selfie || null,
    },
    resolver: yupResolver(validationSchema) as any,
  });

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)} buttonLabel="Save">
      <View style={{ gap: 16 }}>
        <View style={{ alignItems: 'center' }}>
          <SelfieIllustration height={120} style={{ marginBottom: 10 }} />
        </View>
        <View style={{ gap: 10, marginBottom: 10 }}>
          <Heading>Manual Verification</Heading>
          <Paragraph>
            Please take a selfie and send a photo of your ID.
          </Paragraph>
          <BaseButton
            variant="secondary"
            flatten
            onPress={() => setVisible(true)}
            fullWidth
          >
            Please view instructions here
          </BaseButton>
        </View>
        <FormField
          control={control}
          name="selfie"
          title="Selfie"
          validationSchema={validateSelfie}
          render={fieldProps => (
            <SelfiePicker
              value={fieldProps.value}
              onChange={fieldProps.onChange}
            />
          )}
        />
        <FormField
          control={control}
          name="document"
          title="Your ID"
          validationSchema={validateDocument}
          render={fieldProps => (
            <FileUploader
              value={fieldProps.value}
              onChange={fieldProps.onChange}
            />
          )}
        />
        <DialogV2
          autoHeight
          visible={visible}
          onRequestClose={() => setVisible(false)}
        >
          <>
            <Box space={Size.xLarge} color="transparent">
              <Section>
                <Heading>
                  See the instructions below:
                </Heading>
                <Paragraph>
                  The selfie should be clear and show your whole face.
                </Paragraph>
                <Paragraph>
                  Upload a clear photo of the front of your ID. Make sure your face is visible and the photo is not hiding any piece of information.
                </Paragraph>
                <Paragraph>
                  We are going to compare the image of your ID with the selfie you provide.
                </Paragraph>
              </Section>
              <Spacer size={Size.large} />
              <BaseButton
                variant="muted"
                onPress={() => setVisible(false)}
                fullWidth
              >
                Got it!
              </BaseButton>
            </Box>
          </>
        </DialogV2>
      </View>
    </FormWrapper>
  );
};
