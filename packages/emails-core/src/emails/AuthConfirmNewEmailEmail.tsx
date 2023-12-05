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

// It is NOT a typo! It is an Email (suffix), that is mean to ConfirmNewEmail in the Auth (prefix) feature!
export interface AuthConfirmNewEmailEmailProps {
  userDisplayName: string;
  confirmEmailUrl: string;
}

export const AuthConfirmNewEmailEmail = ({
  userDisplayName = 'Stranger',
  confirmEmailUrl = '',
}: AuthConfirmNewEmailEmailProps) => (
  <Html>
    <Head />
    <Preview>Oh, got a new email? Nice!</Preview>
    <Body style={globalStyles.body}>
      <Container style={globalStyles.container}>
        <EmailHeader />
        <Text style={globalStyles.paragraph}>Hi {userDisplayName},</Text>
        <Text style={globalStyles.paragraph}>
          We just want to make sure that you are the owner of this email address. Is that alright
          with you?
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

export default AuthConfirmNewEmailEmail;
