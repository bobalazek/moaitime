import { Body } from '@react-email/body';
import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';

export interface AuthWelcomeEmailProps {
  userDisplayName: string;
  verifyEmailUrl: string;
}

export const AuthWelcomeEmail = ({
  userDisplayName = 'Stranger',
  verifyEmailUrl = '',
}: AuthWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>The productivity platform you always wanted</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>Hi {userDisplayName},</Text>
        <Text style={paragraph}>
          Welcome to MyZenBulld, the productivity platform you always wanted.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={verifyEmailUrl}>
            Verify your Email
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          The MyZenBuddy team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>221B Baker Street, London, United Kingdom</Text>
      </Container>
    </Body>
  </Html>
);

export default AuthWelcomeEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
};

const btnContainer = {
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#5F51E8',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};
