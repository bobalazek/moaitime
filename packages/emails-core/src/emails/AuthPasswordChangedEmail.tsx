import { Body } from '@react-email/body';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Preview } from '@react-email/preview';
import { Text } from '@react-email/text';

import { globalStyles } from '../GlobalStyles';
import EmailFooter from '../partials/EmailFooter';
import EmailHeader from '../partials/EmailHeader';

export interface AuthPasswordChangedEmailProps {
  userDisplayName: string;
}

export const AuthPasswordChangedEmail = ({
  userDisplayName = 'Stranger',
}: AuthPasswordChangedEmailProps) => (
  <Html>
    <Head />
    <Preview>Your password was successfully changed</Preview>
    <Body style={globalStyles.body}>
      <Container style={globalStyles.container}>
        <EmailHeader />
        <Text style={globalStyles.paragraph}>Hi {userDisplayName},</Text>
        <Text style={globalStyles.paragraph}>
          Your password was successfully changed. If you did not request this change, please contact
          us immediately.
        </Text>
        <EmailFooter />
      </Container>
    </Body>
  </Html>
);

export default AuthPasswordChangedEmail;
