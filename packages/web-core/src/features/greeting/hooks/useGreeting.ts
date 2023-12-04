import { useAuthStore } from '../../auth/state/authStore';
import { useGreetingStore } from '../state/greetingStore';

export const useGreeting = () => {
  const { greeting } = useGreetingStore();
  const { auth } = useAuthStore();

  if (!greeting) {
    return null;
  }

  const text = greeting.text.replace('{displayName}', auth?.user?.displayName ?? 'Stranger');
  const newGreeting = {
    ...greeting,
    text,
  };

  return newGreeting;
};
