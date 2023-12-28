import { Body } from '@react-email/body';
import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';

import { globalStyles } from '../GlobalStyles';
import EmailFooter from '../partials/EmailFooter';
import EmailHeader from '../partials/EmailHeader';

export interface AuthAccountDeletionEmailProps {
  userDisplayName: string;
  deleteAccountUrl: string;
}

export const AuthAccountDeletionEmail = ({
  userDisplayName = 'Stranger',
  deleteAccountUrl = '',
}: AuthAccountDeletionEmailProps) => (
  <Html>
    <Head />
    <Preview>The productivity platform you always wanted</Preview>
    <Body style={globalStyles.body}>
      <Container style={globalStyles.container}>
        <EmailHeader />
        <Text style={globalStyles.paragraph}>Hi {userDisplayName},</Text>
        <Text style={globalStyles.paragraph}>
          Oh, we are so sorry to see you go. Hope that our paths will cross again in the future.
          Stay awesome!
        </Text>
        <Section style={globalStyles.textCenter}>
          <Button style={globalStyles.button} href={deleteAccountUrl}>
            Delete My Account
          </Button>
        </Section>
        <EmailFooter />
      </Container>
    </Body>
  </Html>
);

export default AuthAccountDeletionEmail;
