import { Label } from '../../../../../../web-ui/src/components/label';
import { sonnerToast } from '../../../../../../web-ui/src/components/sonner-toast';
import { Switch } from '../../../../../../web-ui/src/components/switch';
import { useAuthStore } from '../../state/authStore';

export default function PrivacySettingsSection() {
  const { auth, updateAccount } = useAuthStore();
  if (!auth) {
    return null;
  }

  const isPrivate = auth.user.isPrivate;

  const onPrivacyChange = async () => {
    try {
      await updateAccount({
        isPrivate: !isPrivate,
      });

      sonnerToast.success('Privacy settings updated', {
        description: 'Your privacy settings have been updated successfully!',
      });
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  return (
    <div>
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
