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

export interface AuthPasswordlessLoginEmailProps {
  userDisplayName: string;
  passwordlessLoginUrl: string;
  code: string;
}

export const AuthPasswordlessLoginEmail = ({
  userDisplayName = 'Stranger',
  passwordlessLoginUrl = '',
  code = '123456',
}: AuthPasswordlessLoginEmailProps) => (
  <Html>
    <Head />
    <Preview>The productivity platform you always wanted</Preview>
    <Body style={globalStyles.body}>
      <Container style={globalStyles.container}>
        <EmailHeader />
        <Text style={globalStyles.paragraph}>Hi {userDisplayName},</Text>
        <Text style={globalStyles.paragraph}>
          Want to log in quickly? No worries, we got you! Use the code below or the link to log in.!
        </Text>
        <Text style={globalStyles.paragraph}>Code: {code}</Text>
        <Section style={globalStyles.textCenter}>
          <Button style={globalStyles.button} href={passwordlessLoginUrl}>
            Magic Login Link
          </Button>
        </Section>
        <EmailFooter />
      </Container>
    </Body>
  </Html>
);

export default AuthPasswordlessLoginEmail;
