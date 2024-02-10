import { useAuthStore } from '../../../auth/state/authStore';

export default function ChangelogSettingsSection() {
  const { auth } = useAuthStore();
  const settings = auth?.user?.settings;
  if (!settings) {
    return null;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-400">
        What is happening with MoaiTime? What have we been working on?
      </p>
      <div className="flex flex-col gap-4">TODO</div>
    </div>
  );
}
