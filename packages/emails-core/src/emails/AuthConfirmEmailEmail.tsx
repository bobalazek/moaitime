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

// It is NOT a typo! It is an Email (suffix), that is mean to ConfirmEmail in the Auth (prefix) feature!
export interface AuthConfirmEmailEmailProps {
  userDisplayName: string;
  confirmEmailUrl: string;
}

export const AuthConfirmEmailEmail = ({
  userDisplayName = 'Stranger',
  confirmEmailUrl = '',
}: AuthConfirmEmailEmailProps) => (
  <Html>
    <Head />
    <Preview>Did not confirm your email yet? No worries, we got you!</Preview>
    <Body style={globalStyles.body}>
      <Container style={globalStyles.container}>
        <EmailHeader />
        <Text style={globalStyles.paragraph}>Hi {userDisplayName},</Text>
        <Text style={globalStyles.paragraph}>
          Did not confirm your email yet? No worries, we got you!
        </Text>
        <Section style={globalStyles.textCenter}>
          <Button style={globalStyles.button} href={confirmEmailUrl}>
            Confirm your Email
          </Button>
        </Section>
        <EmailFooter />
      </Container>
    </Body>
  </Html>
);

export default AuthConfirmEmailEmail;
