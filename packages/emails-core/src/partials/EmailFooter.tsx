import { Hr } from '@react-email/hr';
import { Text } from '@react-email/text';

import { globalStyles } from '../GlobalStyles';

export default function EmailFooter() {
  return (
    <>
      <Text style={globalStyles.paragraph}>
        Best,
        <br />
        The MyZenBuddy Team
      </Text>
      <Hr style={globalStyles.hr} />
      <Text style={globalStyles.footer}>221B Baker Street, London, United Kingdom</Text>
    </>
  );
}
