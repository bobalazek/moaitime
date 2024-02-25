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

export interface SocialUserInvitationEmailProps {
  invitedByUserDisplayName: string;
  registerUrl: string;
}

export const SocialUserInvitationEmail = ({
  invitedByUserDisplayName = 'Stranger',
  registerUrl = '',
}: SocialUserInvitationEmailProps) => (
  <Html>
    <Head />
    <Preview>The productivity platform you always wanted</Preview>
    <Body style={globalStyles.body}>
      <Container style={globalStyles.container}>
        <EmailHeader />
        <Text style={globalStyles.paragraph}>Hi there,</Text>
        <Text style={globalStyles.paragraph}>
          Congratulations! You have been invited by <b>{invitedByUserDisplayName}</b> to join their
          the MoaiTime platform.
        </Text>
        <Section style={globalStyles.textCenter}>
          <Button style={globalStyles.button} href={registerUrl}>
            Register Account
          </Button>
        </Section>
        <EmailFooter />
      </Container>
    </Body>
  </Html>
);

export default SocialUserInvitationEmail;
