import React from 'react';
import { Linking, TouchableWithoutFeedback, View } from 'react-native';
import {
  MainContainer,
  ScrollableContainer,
} from '../../components/MainContainer';
import { Bold, Heading, Paragraph } from '../../components/Typography';
import { Colors } from '../../theme/colors';
const PrivacyPolicyIllustration =
  require('../../assets/privacyPolicyIllustration.svg').default;

const OpenURL = ({ url, children }: { url: string; children: string }) => (
  <TouchableWithoutFeedback
    onPress={() => {
      Linking.openURL(url);
    }}
  >
    <Paragraph color={Colors.blue}>{children}</Paragraph>
  </TouchableWithoutFeedback>
);

export const SettingsPrivacyPolicy = () => {
  return (
    <MainContainer>
      <ScrollableContainer>
        <View style={{ alignItems: 'center' }}>
          <PrivacyPolicyIllustration
            height={120}
            style={{ marginBottom: 26 }}
          />
        </View>

        <View style={{ gap: 10, marginBottom: 26 }}>
          <Heading>Privacy Policy</Heading>
          <Paragraph>
            This policy explains when and why we collect personal information
            about you, how we use it, the conditions under which we may disclose
            it to others and how we keep it secure.
            {'\n\n'}
            TPL is committed to safeguarding the privacy of your information. By
            “your data”, "your personal data”, and “your information” we mean
            any personal data about you which you or third parties provide to
            us.
            {'\n\n'}
            We may change this Policy from time to time so please check this
            page regularly to ensure that you’re happy with any changes.
          </Paragraph>
        </View>
        <View style={{ gap: 10 }}>
          <Heading>Who are we?</Heading>
          <Paragraph>
            Transact Payments Limited (“TPL”, “we”, “our” or “us”) is the issuer
            of your card and is the Data Controller for the personal data which
            you provide to us in relation to the card only. TPL is an e-money
            institution, authorized and regulated by the Gibraltar Financial
            Services Commission. Our registered office address is 6.20 World
            Trade Center, 6 Bayside Road, Gibraltar, GX11 1AA and our registered
            company number is 108217. {'\n\n'}Enfuce is the Program Manager of
            your card and is a Data Processor of the personal data which you
            provide to us in relation to the card.
          </Paragraph>
          <Heading>How do we collect your personal data?</Heading>
          <Paragraph>
            We collect information from you when you apply online or via a
            mobile application for a payments card which is issued by us. We
            also collect information when you use your card to make
            transactions. We may also process information from Program Manager,
            other third party payment partners and service providers. We also
            obtain information from third parties (such as fraud prevention
            agencies) who may check your personal data against any information
            listed on an Electoral Register and/or other databases. When we
            process your personal data we rely on legal bases in accordance with
            data protection law and this privacy policy. For more information
            see: On what legal basis do we process your personal data?
          </Paragraph>
          <Heading>
            On what legal basis do we process your personal data?
          </Heading>
          <Paragraph
            style={{
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid',
            }}
          >
            Contract
          </Paragraph>
          <Paragraph>
            Your provision of your personal data and our processing of that data
            is necessary for each of us to carry out our obligations under the
            contract (known as the Cardholder Agreement or Cardholder Terms &
            Conditions or similar) which we enter into when you sign up for our
            payment services. At times, the processing may be necessary so that
            we can take certain steps, or at your request, prior to entering
            into that contract, such as verifying your details or eligibility
            for the payment services. If you fail to provide the personal data
            which we request, we cannot enter into a contract to provide payment
            services to you or will take steps to terminate any contract which
            we have entered into with you.
          </Paragraph>
          <Paragraph
            style={{
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid',
            }}
          >
            Legal/Regulatory
          </Paragraph>
          <Paragraph>
            We may also process your personal data to comply with our legal or
            regulatory obligations.
          </Paragraph>
          <Paragraph
            style={{
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid',
            }}
          >
            Legitimate Interests
          </Paragraph>
          <Paragraph>
            We, or a third party, may have a legitimate interest to process your
            personal data, for example:
          </Paragraph>
          <Paragraph>
            - To analyze and improve the security of our business;
          </Paragraph>
          <Paragraph>
            - To anonymise personal data and subsequently use anonymized
            information.
          </Paragraph>
          <Heading>What type of personal data is collected from you?</Heading>
          <Paragraph>
            When you apply for a card, we, or our partners or service providers,
            collect the following information from you: full name, physical
            address, email address, mobile phone number, phone number, date of
            birth, gender, login details, IP address, identity and address
            verification documents.
            {'\n\n'}
            When you use your card to make transactions, we store that
            transactional and financial information. This includes the date,
            amount, currency, card number, card name, account balances and name
            of the merchant, creditor or supplier (for example a supermarket or
            retailer). We also collect information relating to the payments
            which are made to/from your account.
          </Paragraph>
          <Heading>How is your personal data used?</Heading>
          <Paragraph>
            We use your personal data to:
            {'\n\n'}- set up your account, including processing your application
            for a card, creating your account, verifying your identity and
            printing your card.
            {'\n\n'}- maintain and administer your account, including processing
            your financial payments, processing the correspondence between us,
            monitoring your account for fraud and providing a secure internet
            environment for the transmission of our services.
            {'\n\n'}- comply with our regulatory requirements, including
            anti-money laundering obligations.
            {'\n\n'}- improve our services, including creating anonymous data
            from your personal data for analytical use, including for the
            purposes of training, testing and system development.
          </Paragraph>
          <Heading>Who do we share your information with?</Heading>
          <Paragraph>
            When we use third party service partners, we have a contract in
            place that requires them to keep your information secure and
            confidential.
            {'\n\n'}
            We may receive and pass your information to the following categories
            of entity:
            {'\n\n'}- identity verification agencies to undertake required
            verification, regulatory and fraud prevention checks;
            {'\n\n'}- information security services organizations, web
            application hosting providers, mail support providers, network
            backup service providers and software/platform developers;
            {'\n\n'}- document destruction providers;
            {'\n\n'}- Mastercard, Visa, digital payment service partners or any
            third party providers involved in processing the financial
            transactions that you make;
            {'\n\n'}- anyone to whom we lawfully transfer or may transfer our
            rights and duties under this agreement;
            {'\n\n'}- any third party as a result of any restructure, sale or
            acquisition of TPL or any associated entity, provided that any
            recipient uses your information for the same purposes as it was
            originally supplied to us and/or used by us.
            {'\n\n'}- regulatory and law enforcement authorities, whether they
            are outside or inside of the United Kingdom (UK) or European
            Economic Area (EEA), where the law requires us to do so.
          </Paragraph>
          <Heading>Sending personal data overseas</Heading>
          <Paragraph>
            To deliver services to you, it is sometimes necessary for us to
            share your personal information outside the UK/Gibraltar e.g.:{' '}
            {'\n\n'}· with service providers located outside these areas;
            {'\n\n'}· if you are based outside these areas;{'\n\n'}· where there
            is an international dimension to the services we are providing to
            you.
            {'\n\n'}
            These transfers are subject to special rules under Gibraltar data
            protection law.{'\n\n'}
            These countries do not have the same data protection laws as
            Gibraltar. We will, however, ensure the transfer complies with data
            protection law and all personal information will be secure. We will
            send your data to countries where the Gibraltar Government has made
            a ruling of adequacy, meaning that they have ruled that the
            legislative framework in the country provides an adequate level of
            data protection for your personal information. You can find out more
            about adequacy regulations{' '}
            <OpenURL url="https://ec.europa.eu/info/law/law-topic/data-protection/data-transfers-outside-eu/adequacy-protection-personal-data-non-eu-countries_en">
              here
            </OpenURL>{' '}
            and{' '}
            <OpenURL url="https://www.gov.uk/government/publications/uk-approach-to-international-data-transfers/international-data-transfers-building-trust-delivering-growth-and-firing-up-innovation">
              here
            </OpenURL>{' '}
            .{'\n\n'}
            Where we send your data to a country where no adequacy decision has
            been made, our standard practice is to use standard data protection
            contract clauses that have been approved by the United Kingdom
            government and/or the European Commission. You can obtain a copy of
            the European Commission’s document{' '}
            <OpenURL url="https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj">
              here
            </OpenURL>{' '}
            and the UK’s document{' '}
            <OpenURL url="https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fico.org.uk%2Fmedia%2Ffor-organisations%2Fdocuments%2F4019535%2Faddendum-international-data-transfer.docx&wdOrigin=BROWSELINK">
              here
            </OpenURL>{' '}
            .{'\n\n'}
            If you would like further information, please contact our Data
            Protection Officer on the details below.
          </Paragraph>
          <Heading>How long do we store your personal data?</Heading>
          <Paragraph>
            We will store your information for a period of five years after our
            business relationship ends in order that we can comply with our
            obligations under applicable legislation such as anti-money
            laundering and anti-fraud regulations. If any applicable legislation
            or changes to this require us to retain your data for a longer or
            shorter period of time, we shall retain it for that period. We will
            not retain your data for longer than is necessary.
          </Paragraph>

          <Heading>Your rights regarding your personal data?</Heading>
          <Paragraph>
            You have certain rights regarding the personal data which we
            process: {'\n\n'}- You may request a copy of some or all of it.
            {'\n'}- You may ask us to rectify any data which we hold which you
            believe to be inaccurate.{'\n'}- You may ask us to erase your
            personal data (where applicable).
            {'\n'}- You may ask us to restrict the processing of your personal
            data.
            {'\n'}- You may object to the processing of your personal data
            (where applicable).{'\n'}- You may ask for the right to data
            portability.
            {'\n'}- If you would like us to carry out any of the above, please
            email your request to the Data Protection Officer at{' '}
            <OpenURL url="mailto:DPO@transactpaymentsltd.com">
              DPO@transactpaymentsltd.com
            </OpenURL>
            .
          </Paragraph>

          <Heading>How is your information protected?</Heading>
          <Paragraph>
            We recognise the importance of protecting and managing your personal
            data. Any personal data we process will be treated with appropriate
            care and security. {'\n\n'}
            These are some of the security measures we have in place:{'\n\n'}•
            We use a variety of physical and technical measures to keep your
            personal data safe. {'\n'}• We have detailed information and
            security policies to ensure the confidentiality, integrity, and
            availability of information.
            {'\n'}• Your data is stored securely on computer systems with
            control over access on a limited basis. {'\n'}• Our staff receives
            data protection and information security training on a regular
            basis.{'\n'}• We use encryption to protect data at rest and make it
            anonymous where applicable. {'\n'}• We have adequate security
            controls to protect our IT infrastructure and staff computers
            including but not limited to Identity and Access Management,
            Firewalls, VPN, Antivirus, Advanced Email Threat Protection and
            more. {'\n'}• We conduct regular audits such as PCI-DSS to ensure we
            are following adequate security controls to protect your data.
            {'\n\n'}
            While we take all reasonable steps to ensure that your personal data
            will be kept secure from unauthorised access, we cannot guarantee it
            will be secure during transmission by you to the applicable mobile
            app, website or other services over the internet. However, once we
            receive your information, we make appropriate efforts to ensure its
            security on our systems. {'\n'}
          </Paragraph>

          <Heading>How is your information protected?</Heading>
          <Paragraph>
            We hope that our Data Protection Officer can resolve any query or
            concern you may raise about our use of your personal information.
            {'\n\n'}
            The{' '}
            <OpenURL url="http://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32016R0679&from=EN">
              General Data Protection Regulation
            </OpenURL>{' '}
            also gives you right to lodge a complaint with a supervisory
            authority, in particular in the European Union (or European Economic
            Area) state where you work, normally live or where any alleged
            infringement of data protection laws occurred. The supervisory
            authority in Gibraltar is the Gibraltar Regulatory Authority. Their
            contact details are as follows:
            {'\n\n'}
            Gibraltar Regulatory Authority, {'\n\n'}
            2nd floor, Eurotowers 4, 1 Europort Road, Gibraltar.{'\n\n'}
            (+350) 20074636/(+350) 20072166{' '}
            <OpenURL url="mailto:info@gra.gi">info@gra.gi</OpenURL>
          </Paragraph>

          <Heading>Other websites</Heading>
          <Paragraph>
            Our website may contain links to other websites. This privacy policy
            applies only to our website‚ so we encourage you to read the privacy
            statements on the other websites you visit. We cannot be responsible
            for the privacy policies and practices of other sites even if you
            access them using links from our website.
          </Paragraph>

          <Heading>Changes to our Privacy Policy</Heading>
          <Paragraph>
            We keep our Privacy Policy under review and we regularly update it
            to keep up with business demands and privacy regulation. We will
            inform you about any such changes. This Privacy Policy was last
            updated on 14th June 2023.
          </Paragraph>

          <Heading>How to contact us</Heading>
          <Paragraph>
            If you have any questions about our Privacy Policy or the personal
            information which we hold about you or, please send an email to our
            Data Protection Officer at{' '}
            <OpenURL url="to:DPO@transactpaymentsltd.com">
              DPO@transactpaymentsltd.com
            </OpenURL>{' '}
            .
          </Paragraph>
        </View>
        <View style={{ marginBottom: 30, marginTop: 10 }}>
          <Paragraph color={Colors.mutedDark}>
            <Bold>Document Version: 1.0</Bold>
          </Paragraph>
        </View>
      </ScrollableContainer>
    </MainContainer>
  );
};
