import { useState } from 'react';

import { Button, sonnerToast, Textarea } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import { useSettingsStore } from '../../state/settingsStore';

export default function FeedbackSettingsSection() {
  const { auth } = useAuthStore();
  const { addFeedbackEntry } = useSettingsStore();
  const [message, setMessage] = useState('');

  const settings = auth?.user?.settings;
  if (!settings) {
    return null;
  }

  const onSubmitButtonClick = async () => {
    try {
      await addFeedbackEntry({
        message,
      });

      sonnerToast.success(`Feedback sent`, {
        description: `Thank you for making MoaiTime better! You are the real MVP!`,
      });

      setMessage('');
    } catch (error) {
      // Already handled
    }
  };

  return (
    <div>
      <div>
        <Textarea
          id="feedback-message"
          placeholder="Type your message here ..."
          rows={8}
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <div className="mt-4 flex items-center justify-end">
          <Button onClick={onSubmitButtonClick}>Submit</Button>
        </div>
      </div>
    </div>
  );
}
