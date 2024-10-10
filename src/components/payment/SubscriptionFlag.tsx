import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useWhipContext } from "../../states/Whip";
import { Colors } from "../../theme/colors";
import { Bold, Paragraph } from "../Typography";
import { Section } from "../elements/Section";

export const SubscriptionFlag = () => {
  const { whip } = useWhipContext();

  const subscriptionActive = whip.subscription?.status === 'ACTIVE';
  const subscriptionPending = whip.subscription?.status === 'PENDING' || whip.subscription?.status === undefined;
  const subscriptionExpired = whip.subscription?.status === 'EXPIRED';

  return (
    <>
      {subscriptionPending ? (
        <Section direction="row">
          <FontAwesomeIcon color={Colors.attention} icon={faCircle} size={14} />
          <Paragraph size="small" color={Colors.mutedDark}>
            Whip Monthly Charge Pending!
          </Paragraph>
        </Section>
      ) : null}
      {subscriptionActive ? (
        <Section direction="row">
          <FontAwesomeIcon color={Colors.success} icon={faCircle} size={14} />
          <Paragraph size="small" color={Colors.mutedDark}>
            <Bold>Whip Monthly Charge Active {':)'}</Bold>
          </Paragraph>
        </Section>
      ) : null}
      {subscriptionExpired ? (
        <Section direction="row">
          <FontAwesomeIcon color={Colors.danger} icon={faCircle} size={14} />
          <Paragraph size="small" color={Colors.mutedDark}>
            <Bold>Whip Monthly Charge Expired {':('}</Bold>
          </Paragraph>
        </Section>
      ) : null}
    </>
  );
};
