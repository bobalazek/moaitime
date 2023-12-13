import { Text } from '@react-email/text';

import { globalStyles } from '../GlobalStyles';

export default function EmailHeader() {
  return <Text style={{ ...globalStyles.textCenter, ...globalStyles.logoText }}>MoaiTime</Text>;
}
