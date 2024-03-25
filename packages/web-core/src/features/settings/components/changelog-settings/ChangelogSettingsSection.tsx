import Markdown from 'react-markdown';

import { useAuthStore } from '../../../auth/state/authStore';
import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useChangelogEntriesQuery } from '../../hooks/useChangelogEntriesQuery';

export default function ChangelogSettingsSection() {
  const { auth } = useAuthStore();
  const { isLoading, error, data } = useChangelogEntriesQuery();

  const settings = auth?.user?.settings;
  if (!settings) {
    return null;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data) {
    return <ErrorAlert error={error} />;
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        {data.map((entry) => (
          <div key={entry.slug}>
            <h3 className="text-2xl font-bold">{entry.title}</h3>
            <h4 className="mb-4 text-gray-400">{new Date(entry.date).toLocaleDateString()}</h4>
            <div className="prose prose-sm dark:prose-invert">
              <Markdown>{entry.content}</Markdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
