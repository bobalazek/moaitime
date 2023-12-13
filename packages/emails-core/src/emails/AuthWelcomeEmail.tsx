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

export interface AuthWelcomeEmailProps {
  userDisplayName: string;
  confirmEmailUrl: string;
}

export const AuthWelcomeEmail = ({
  userDisplayName = 'Stranger',
  confirmEmailUrl = '',
}: AuthWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>The productivity platform you always wanted</Preview>
    <Body style={globalStyles.body}>
      <Container style={globalStyles.container}>
        <EmailHeader />
        <Text style={globalStyles.paragraph}>Hi {userDisplayName},</Text>
        <Text style={globalStyles.paragraph}>
          Welcome to MoaiTime, the productivity platform that you always wanted, but never knew it
          existed!
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

export default AuthWelcomeEmail;
