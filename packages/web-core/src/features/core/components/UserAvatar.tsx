import { PublicUser } from '@moaitime/shared-common';

export const UserAvatarInner = ({ user, sizePx = 64 }: { user: PublicUser; sizePx?: number }) => {
  if (!user.avatarImageUrl) {
    const character = user.displayName.slice(0, 1).toUpperCase();

    return (
      <div
        className="flex select-none items-center justify-center rounded-full bg-gray-200 font-bold text-gray-950"
        style={{
          width: sizePx,
          height: sizePx,
          fontSize: sizePx / 1.5,
        }}
      >
        {character}
      </div>
    );
  }

  return (
    <div
      className="rounded-full bg-cover"
      style={{
        width: sizePx,
        height: sizePx,
        backgroundImage: `url(${user.avatarImageUrl})`,
      }}
    />
  );
};

export const UserAvatar = ({ user, sizePx = 64 }: { user: PublicUser; sizePx?: number }) => {
  const now = new Date();
  const isOnline =
    user.lastActiveAt && now.getTime() - new Date(user.lastActiveAt).getTime() < 5 * 60 * 1000;

  return (
    <div className="relative">
      <UserAvatarInner user={user} sizePx={sizePx} />
      {isOnline && (
        <div
          className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-white"
          style={{
            width: sizePx / 4,
            height: sizePx / 4,
          }}
        >
          <div
            className="rounded-full bg-green-500"
            style={{
              width: sizePx / 4 - 4,
              height: sizePx / 4 - 4,
            }}
          />
        </div>
      )}
    </div>
  );
};
