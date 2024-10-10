import { faAddressBook, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { View } from 'react-native';
import Contacts from 'react-native-contacts';
import Toast from 'react-native-toast-message';
import { BaseButton } from '../../../../components/BaseButton';
import { DialogV2 } from '../../../../components/DialogV2';
import { Section } from '../../../../components/elements/Section';
import { SearchFriends } from '../../../../components/SearchFriends';
import { SlideInMenu } from '../../../../components/SlideInMenu';
import { Paragraph } from '../../../../components/Typography';
import { useViewLocker } from '../../../../components/ViewLocker';
import { useWhipAddFriendsMutation } from '../../../../queries/Whip/useWhipAddFriendsMutation';
import { useUser } from '../../../../states/User';
import { IUser } from '../../../../states/User/types';
import { useWhipContext } from '../../../../states/Whip';
import { IWhipFriend } from '../../../../states/Whip/types';
import { Colors } from '../../../../theme/colors';
import { Gap } from '../../../../theme/sizes';
import { getNameFromContact } from '../../../../utils/utilities';
import { IInviteFriendFormData, InviteFriendForm } from './InviteFriendForm';

export const InviteFriendFlow = ({ onFinish }: { onFinish?: () => void }) => {
  const { whip, friends } = useWhipContext();
  const { toggleLocker } = useViewLocker();
  const { user } = useUser();

  const [visible, setVisible] = React.useState(false);
  const [manualVisible, setManualVisible] = React.useState(false);
  const [fromSearchFriend, setFromSearchFriend] = React.useState(false);
  const [selectedContact, setSelectedContact] = React.useState(
    [] as Contacts.Contact[],
  );

  const whipAddFriendsMutation = useWhipAddFriendsMutation({
    whipId: whip?.id,
    onError: () => {
      toggleLocker(false);
    },
    onSuccess: () => {
      toggleLocker(false);
      onFinish?.();
    },
  });

  const handleConfirmation = React.useCallback(
    (contact: IInviteFriendFormData) => {
      toggleLocker(true);
      if (
        friends.find(
          (f: IWhipFriend) =>
            String(f.email).toLowerCase() ===
            String(contact.email).toLowerCase(),
        )
      ) {
        toggleLocker(false);
        Toast.show({
          type: 'info',
          text1: 'That friend is already added.',
        });
        return;
      }
      if (
        String(contact.email).toLowerCase() === user.email.toLocaleLowerCase()
        || String(contact.email).toLowerCase() === user.account?.email?.toLocaleLowerCase()
      ) {
        toggleLocker(false);
        Toast.show({
          type: 'info',
          text1: `You can't invite yourself to whip.`,
        });
        return;
      }

      contact.email = String(contact.email).toLowerCase();
      whipAddFriendsMutation.mutate([contact] as IWhipFriend[]);
    },
    [friends],
  );

  return (
    <View>
      <SlideInMenu
        triggerTitle="Invite Friend"
        options={[
          {
            leftAccessory: (
              <FontAwesomeIcon icon={faAddressBook} color={Colors.mutedDark} />
            ),
            label: 'Search Friends',
            onPress: () => setVisible(true),
          },
          {
            leftAccessory: (
              <FontAwesomeIcon icon={faUserPlus} color={Colors.mutedDark} />
            ),
            label: 'Create Invitation',
            onPress: () => {
              setSelectedContact([]);
              setManualVisible(true);
            },
          },
        ]}
        renderTrigger={({ open }) => (
          <BaseButton flatten onPress={open}>
            <Section direction="row" align="center" gap={Gap.xSmall}>
              <Paragraph color={Colors.white}>Invite</Paragraph>
            </Section>
          </BaseButton>
        )}
      />

      <DialogV2 visible={visible}>
        <SearchFriends
          onCancel={() => setVisible(false)}
          onConfirm={(user: IUser, fromSearchFriend: boolean) => {
            setFromSearchFriend(fromSearchFriend);
            setVisible(false);
            setTimeout(() => {
              setManualVisible(true);
              const contact: Contacts.Contact = {
                displayName: user?.displayName,
                recordID: user?.uid,
                backTitle: '',
                company: '',
                emailAddresses: [{ label: 'email', email: user?.email }],
                familyName: '',
                givenName: user?.displayName,
                middleName: '',
                jobTitle: '',
                phoneNumbers: [{ label: 'phone', number: user?.phoneNumber }],
                hasThumbnail: false,
                thumbnailPath: '',
                isStarred: false,
                postalAddresses: [],
                prefix: '',
                suffix: '',
                department: '',
                birthday: undefined,
                imAddresses: [],
                urlAddresses: [],
                note: ''
              }
              setSelectedContact([contact]);
            }, 600);
          }}
        />
      </DialogV2>

      <DialogV2 visible={manualVisible} autoHeight>
        <InviteFriendForm
          onCancel={() => setManualVisible(false)}
          onConfirm={formData => {
            setManualVisible(false);
            handleConfirmation(formData);
            setFromSearchFriend(false);
          }}
          values={{
            email: selectedContact[0]?.emailAddresses[0]?.email,
            displayName: getNameFromContact(selectedContact[0]),
          }}
          fromSearchFriend={fromSearchFriend}
        />
      </DialogV2>
    </View>
  );
};

