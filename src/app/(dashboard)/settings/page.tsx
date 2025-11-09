"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNotifications } from "@/hooks/use-notifications";

interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  preferredTime: string;
  dailyDigest: boolean;
}

export default function SettingsPage() {
  const { permission, requestPermission, isLoading: isRequestingPermission } = useNotifications();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    pushEnabled: false,
    emailEnabled: false,
    preferredTime: "09:00",
    dailyDigest: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch("/api/notifications/preferences");
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (error) {
      toast.error("Failed to load preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        toast.success("Preferences saved successfully");
      } else {
        toast.error("Failed to save preferences");
      }
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      const response = await fetch("/api/notifications/test", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        if (data.note) {
          toast.info(data.note);
        }
      } else {
        toast.error("Failed to send test notification");
      }
    } catch (error) {
      toast.error("Failed to send test notification");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Configure how you want to receive care reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive browser push notifications
                {permission === 'denied' && ' (Permission denied)'}
                {permission === 'default' && ' (Permission required)'}
              </p>
            </div>
            <Switch
              id="push"
              checked={preferences.pushEnabled}
              disabled={permission !== 'granted'}
              onCheckedChange={async (checked) => {
                if (checked && permission !== 'granted') {
                  const result = await requestPermission();
                  if (result.success) {
                    setPreferences({ ...preferences, pushEnabled: true });
                  }
                } else {
                  setPreferences({ ...preferences, pushEnabled: checked });
                }
              }}
            />
          </div>
          
          {permission === 'default' && (
            <Button
              variant="outline"
              size="sm"
              onClick={requestPermission}
              disabled={isRequestingPermission}
            >
              {isRequestingPermission ? 'Requesting...' : 'Enable Push Notifications'}
            </Button>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email reminders for care tasks
              </p>
            </div>
            <Switch
              id="email"
              checked={preferences.emailEnabled}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, emailEnabled: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Preferred Notification Time</Label>
            <Input
              id="time"
              type="time"
              value={preferences.preferredTime}
              onChange={(e) =>
                setPreferences({ ...preferences, preferredTime: e.target.value })
              }
            />
            <p className="text-sm text-muted-foreground">
              Time when you prefer to receive daily reminders
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="digest">Daily Digest</Label>
              <p className="text-sm text-muted-foreground">
                Receive a daily summary of all tasks
              </p>
            </div>
            <Switch
              id="digest"
              checked={preferences.dailyDigest}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, dailyDigest: checked })
              }
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={savePreferences} disabled={isSaving} className="flex-1">
              {isSaving ? "Saving..." : "Save Preferences"}
            </Button>
            <Button
              variant="outline"
              onClick={sendTestNotification}
              disabled={!preferences.pushEnabled && !preferences.emailEnabled}
            >
              Send Test
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            • Push notifications require browser permission and work when the app is open
          </p>
          <p>
            • Email notifications are sent to your registered email address
          </p>
          <p>
            • Daily digest sends a summary of all tasks due that day
          </p>
          <p>
            • Notifications are sent based on your care schedule times
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
