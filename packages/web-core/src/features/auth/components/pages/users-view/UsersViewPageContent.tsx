import { CalendarIcon } from 'lucide-react';

import { PublicUser } from '@moaitime/shared-common';

const UsersViewPageContent = ({ user }: { user: PublicUser }) => {
  const joinedAtString = new Date(user.createdAt).toLocaleDateString('default', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="container py-4" data-test="users-view--content">
      <div className="flex items-center gap-6">
        {user.avatarImageUrl && (
          <div>
            <img src={user.avatarImageUrl} alt="Avatar" className="h-20 w-20 rounded-full" />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <h2 className="text-5xl font-bold">{user.displayName}</h2>
          <h3 className="text-muted-foreground text-2xl">{user.username}</h3>
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} /> <span>Joined {joinedAtString}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersViewPageContent;
