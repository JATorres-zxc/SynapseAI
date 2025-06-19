import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout, updateUser, deactivateAccount } = useAuth();
  const [name, setName] = useState(user?.username || '');
  const [deactivateConfirmName, setDeactivateConfirmName] = useState('');
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Name cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUpdating(true);
      await updateUser({ username: name });
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeactivateAccount = async () => {
    if (deactivateConfirmName === user?.username) {
      try {
        await deactivateAccount();
        toast({
          title: 'Account Deactivated',
          description: 'Your account has been deactivated',
        });
        logout();
        onClose();
        setShowDeactivateDialog(false);
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to deactivate account',
          variant: 'destructive',
        });
      }
    }
  };

  const canDeactivate = deactivateConfirmName === user?.username;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </DialogTitle>
          <DialogDescription>
            Update your profile information and account settings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Change Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="rounded-xl"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={handleSaveProfile} 
              className="rounded-xl"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
            
            {/* Deactivate Account */}
            <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="rounded-xl">
                  Deactivate Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently deactivate your account
                    and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                
                <div className="space-y-2 py-4">
                  <Label htmlFor="confirm-name">
                    Type your username <strong>{user?.username}</strong> to confirm:
                  </Label>
                  <Input
                    id="confirm-name"
                    value={deactivateConfirmName}
                    onChange={(e) => setDeactivateConfirmName(e.target.value)}
                    placeholder="Enter your username"
                    className="rounded-xl"
                  />
                </div>
                
                <AlertDialogFooter>
                  <AlertDialogCancel 
                    className="rounded-xl"
                    onClick={() => setDeactivateConfirmName('')}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="rounded-xl bg-destructive hover:bg-destructive/90"
                    onClick={handleDeactivateAccount}
                    disabled={!canDeactivate}
                  >
                    Deactivate Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;