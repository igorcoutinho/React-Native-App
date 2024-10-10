import { faContactBook } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { FlatList } from 'react-native';
import Contacts from 'react-native-contacts';
import { BaseButton } from '../../components/BaseButton';
import { Paragraph } from '../../components/Typography';
import { Colors } from '../../theme/colors';
import { Size } from '../../theme/sizes';
import { useContactsPermission } from '../../utils/permission';
import { EmptyState } from '../EmptyState';
import { FloatingBottom } from '../FloatingBottom';
import { MainContainer } from '../MainContainer';
import { HeaderWithImage } from '../elements/HeaderWithImage';
import { Box, Section } from '../elements/Section';
import { Spacer } from '../elements/Spacer';
import { ContactItem } from './ContactItem';
const ContactSearchIllustration =
  require('../../assets/contactSearchIllustration.svg').default;

export const ContactsPicker = ({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: (contacts: Contacts.Contact[]) => void;
}) => {
  const permission = useContactsPermission();
  const [data, setData] = React.useState([]);
  const [selected, setSelected] = React.useState<Contacts.Contact[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (permission.granted) {
      Contacts.getAll().then(contacts => {
        setLoading(false);
        setData(contacts);
      });
    }
  }, [permission.granted]);

  const handleSelectedList = (item: Contacts.Contact) => {
    if (selected.find(s => s.recordID === item.recordID)) {
      setSelected(selected.filter(s => s.recordID !== item.recordID));
      return;
    }
    setSelected([...selected, item]);
  };

  const selectedIds = selected.map(s => s.recordID);

  return (
    <>
      <MainContainer paddingBottom={0}>
        <HeaderWithImage
          title="Contacts"
          renderImage={<ContactSearchIllustration height={120} />}
          description="You can select one or more contacts."
        />
        <FlatList<Contacts.Contact>
          data={data.filter(c => c.phoneNumbers.length > 0)}
          extraData={selected.map(s => s.recordID)}
          ItemSeparatorComponent={() => <Spacer size={Size.xSmall} />}
          ListFooterComponent={() => <Spacer size={Size.xLarge} />}
          refreshing={loading || permission.checking}
          ListEmptyComponent={() => (
            <EmptyState
              placeholderImage={faContactBook}
              label={
                permission.ready && !loading && data.length === 0
                  ? 'No contacts available'
                  : 'Allow access your contacts to continue'
              }
              renderCTA={
                permission.ready && !loading ? (
                  <BaseButton
                    variant="secondary"
                    flatten
                    onPress={() => permission.requestContactsPermission()}
                  >
                    Request Permission
                  </BaseButton>
                ) : null
              }
            />
          )}
          renderItem={({ item }) => (
            <ContactItem
              data={item}
              onPress={selectedPhoneNumber => {
                handleSelectedList({
                  ...item,
                  phoneNumbers: [selectedPhoneNumber],
                });
              }}
              selectedId={selectedIds.find(s => s === item.recordID)}
            />
          )}
        />
      </MainContainer>
      <FloatingBottom defaultPadding>
        <Section>
          <Box>
            <Paragraph
              size="small"
              align="center"
              color={Colors.mutedDark}
              style={{ fontWeight: selected.length > 0 ? 'bold' : 'normal' }}
            >
              {`${String(selected.length)} ${
                selected.length === 1 ? 'Contact' : 'Contacts'
              } selected`}
            </Paragraph>
          </Box>
          <Section direction="row">
            <BaseButton grow onPress={() => onConfirm?.(selected)}>
              Confirm
            </BaseButton>
            <BaseButton variant="muted" onPress={onCancel}>
              Cancel
            </BaseButton>
          </Section>
        </Section>
      </FloatingBottom>
    </>
  );
};
