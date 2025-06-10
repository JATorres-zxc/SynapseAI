
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.username || '');
  const [status, setStatus] = useState('Online');
  const [birthday, setBirthday] = useState<Date>();
  const [deactivateConfirmName, setDeactivateConfirmName] = useState('');
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

  const handleSaveProfile = () => {
    // TODO: Implement profile update logic
    console.log('Saving profile:', { name, status, birthday });
    onClose();
  };

  const handleDeactivateAccount = () => {
    if (deactivateConfirmName === user?.username) {
      // TODO: Implement account deactivation logic
      console.log('Deactivating account');
      logout();
      onClose();
      setShowDeactivateDialog(false);
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

          {/* Change Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select your status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Online">🟢 Online</SelectItem>
                <SelectItem value="Away">🟡 Away</SelectItem>
                <SelectItem value="Do Not Disturb">🔴 Do Not Disturb</SelectItem>
                <SelectItem value="Offline">⚫ Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Birthday */}
          <div className="space-y-2">
            <Label>Birthday</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-xl",
                    !birthday && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthday ? format(birthday, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthday}
                  onSelect={setBirthday}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <Button onClick={handleSaveProfile} className="rounded-xl">
              Save Changes
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
                    This action cannot be undone. This will permanently delete your account
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
                    className="rounded-xl"
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
