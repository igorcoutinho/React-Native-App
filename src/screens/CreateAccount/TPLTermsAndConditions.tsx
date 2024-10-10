import { faMinus, faPlus, faRefresh } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { View } from 'react-native';
import Pdf from 'react-native-pdf';
import { BaseButton, BaseButtonIcon } from '../../components/BaseButton';
import { Dialog } from '../../components/Dialog';

export const TPLTermsAndConditions = React.forwardRef((_, ref) => {
  const DialogRef = React.useRef<any>(null);
  const [scale, setScale] = React.useState(1);

  React.useImperativeHandle(
    ref,
    () => {
      return {
        onDismiss: DialogRef.current?.onDismiss,
        onOpen: DialogRef.current?.onOpen,
      };
    },
    [DialogRef],
  );

  const closeDialog = React.useCallback(
    () => DialogRef?.current?.onDismiss(),
    [DialogRef],
  );

  return (
    <Dialog ref={DialogRef}>
      <Pdf
        source={{
          cache: true,
          uri: 'https://firebasestorage.googleapis.com/v0/b/whipapp-f3728.appspot.com/o/TPLTermsAndConditionsFinal.pdf?alt=media&token=7a8ffa30-4b6c-4a92-9e54-90ab7e92e724',
        }}
        scale={scale}
        style={{
          flex: 1,
          height: '100%',
          width: '100%',
        }}
      />
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 14,
          padding: 15,
        }}
      >
        <BaseButtonIcon
          icon={faPlus}
          onPress={() => setScale(scale + 0.1)}
          variant="primary"
        />
        <BaseButtonIcon
          icon={faMinus}
          onPress={() => setScale(scale > 1 ? scale - 0.1 : 1)}
          variant="primary"
        />
        <BaseButtonIcon
          icon={faRefresh}
          onPress={() => setScale(1)}
          variant="primary"
        />
        <BaseButton onPress={closeDialog} variant="muted" flatten>
          Close
        </BaseButton>
      </View>
    </Dialog>
  );
});
