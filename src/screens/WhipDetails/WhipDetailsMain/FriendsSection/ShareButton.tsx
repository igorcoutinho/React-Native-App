import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Alert, Share, ShareAction } from 'react-native';
import { BaseButton } from '../../../../components/BaseButton';
import { Colors } from '../../../../theme/colors';

export const ShareButton = ({
  onDismiss,
  onShared,
  whipName,
  hash,
}: {
  onDismiss?: () => void;
  onShared?: (result: ShareAction) => void;
  whipName: string;
  hash: string;
}) => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Hey! Let's whip together in ${whipName}. Click here to join: whipapp://goto/invite/${hash}?name=${encodeURI(
          whipName,
        )}`,
      });
      if (result.action === Share.sharedAction) {
        onShared?.(result);
      } else if (result.action === Share.dismissedAction) {
        onDismiss?.();
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };
  return (
    <BaseButton flatten rounded variant="primary" onPress={onShare}>
      <FontAwesomeIcon icon={faLink} color={Colors.white} />
    </BaseButton>
  );
};
