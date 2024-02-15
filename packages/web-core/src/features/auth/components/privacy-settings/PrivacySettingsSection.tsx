import { Label } from '../../../../../../web-ui/src/components/label';
import { sonnerToast } from '../../../../../../web-ui/src/components/sonner-toast';
import { Switch } from '../../../../../../web-ui/src/components/switch';
import { useAuthStore } from '../../state/authStore';

export default function PrivacySettingsSection() {
  const { auth, updateAccountPrivacy } = useAuthStore();
  if (!auth) {
    return null;
  }

  const isPrivate = auth.user.isPrivate;

  const onPrivacyChange = async () => {
    try {
      await updateAccountPrivacy(!isPrivate);

      sonnerToast.success('Privacy settings updated', {
        description: 'Your privacy settings have been updated successfully!',
      });
    } catch (error) {
      // Already handled
    }
  };

  return (
    <div>
      <p className="mb-4 text-sm text-gray-400">
        No worries if you are a little more shy to the outside world!
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <Switch id="settings-isPrivate" checked={isPrivate} onCheckedChange={onPrivacyChange} />
          <Label htmlFor="settings-isPrivate" className="ml-2">
            Is Private?
          </Label>
        </div>
        <p className="text-xs text-gray-400">
          Should we set your account to private? This will prevent you from showing up in the global
          user search and you will also need to confirm every follow you get.
        </p>
      </div>
    </div>
  );
}
