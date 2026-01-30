"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Save,
  Trash2,
  Download,
  LogOut,
  Key,
  CreditCard,
  Zap,
  Crown,
  Check,
  AlertTriangle,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  TrendingUp,
  DollarSign,
  Clock,
  Calendar,
  ChevronRight,
  Pencil,
  Upload,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [saving, setSaving] = useState(false)

  // Profile state
  const [profile, setProfile] = useState({
    name: "Piyush",
    username: "piyush_trades",
    email: "piyush@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Passionate trader focused on tech stocks and swing trading. Learning every day! 📈",
    location: "New York, USA",
    website: "https://piyush.dev",
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    tradeAlerts: true,
    priceAlerts: true,
    achievementAlerts: true,
    leaderboardAlerts: false,
    communityMentions: true,
    weeklyDigest: true,
    marketNews: false,
    soundEnabled: true,
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showPortfolio: false,
    showTrades: true,
    showAchievements: true,
    allowFollowers: true,
    showOnLeaderboard: true,
    activityStatus: true,
  })

  // Trading preferences
  const [trading, setTrading] = useState({
    defaultOrderType: "market",
    confirmTrades: true,
    riskWarnings: true,
    defaultStopLoss: "5",
    defaultTakeProfit: "10",
    currency: "USD",
    timezone: "America/New_York",
  })

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="trading" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Trading</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Upload a new avatar or choose from our defaults
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/avatars/user.png" alt="Profile" />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">PJ</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and public profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                    <Input
                      id="username"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    placeholder="https://"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  {profile.bio.length}/250 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Password & Security */}
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>
                Update your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <div></div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <Label>Two-Factor Authentication</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Connected Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>
                Manage your connected social accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DA1F2]/10">
                    <svg className="h-5 w-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">X (Twitter)</p>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4285F4]/10">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Google</p>
                    <p className="text-sm text-green-600">Connected as piyush@gmail.com</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-red-500">Disconnect</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#333]/10 dark:bg-white/10">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">GitHub</p>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* General */}
              <div className="space-y-4">
                <h4 className="font-medium">General</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailNotifications: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, pushNotifications: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sound Effects</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sounds for notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.soundEnabled}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, soundEnabled: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Trading */}
              <div className="space-y-4">
                <h4 className="font-medium">Trading</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Trade Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when your trades are executed
                      </p>
                    </div>
                    <Switch
                      checked={notifications.tradeAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, tradeAlerts: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Price Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when stocks hit your price targets
                      </p>
                    </div>
                    <Switch
                      checked={notifications.priceAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, priceAlerts: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Market News</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about important market news
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketNews}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, marketNews: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Gamification */}
              <div className="space-y-4">
                <h4 className="font-medium">Gamification</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Achievement Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when you unlock achievements
                      </p>
                    </div>
                    <Switch
                      checked={notifications.achievementAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, achievementAlerts: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Leaderboard Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about your ranking changes
                      </p>
                    </div>
                    <Switch
                      checked={notifications.leaderboardAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, leaderboardAlerts: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Social */}
              <div className="space-y-4">
                <h4 className="font-medium">Social</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Community Mentions</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone mentions you
                      </p>
                    </div>
                    <Switch
                      checked={notifications.communityMentions}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, communityMentions: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a weekly summary of your activity
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, weeklyDigest: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your profile and activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow others to view your profile
                    </p>
                  </div>
                  <Switch
                    checked={privacy.profilePublic}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, profilePublic: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Portfolio Value</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your portfolio value on your profile
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showPortfolio}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, showPortfolio: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Trade History</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow others to see your trades
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showTrades}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, showTrades: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Achievements</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your achievements publicly
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showAchievements}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, showAchievements: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Followers</Label>
                    <p className="text-sm text-muted-foreground">
                      Let other users follow your activity
                    </p>
                  </div>
                  <Switch
                    checked={privacy.allowFollowers}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, allowFollowers: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Appear on Leaderboard</Label>
                    <p className="text-sm text-muted-foreground">
                      Show your ranking on public leaderboards
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showOnLeaderboard}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, showOnLeaderboard: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Activity Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Show when you're online
                    </p>
                  </div>
                  <Switch
                    checked={privacy.activityStatus}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, activityStatus: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data & Export */}
          <Card>
            <CardHeader>
              <CardTitle>Data & Export</CardTitle>
              <CardDescription>
                Download or delete your account data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Export Your Data</p>
                    <p className="text-sm text-muted-foreground">
                      Download all your data in JSON format
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Export</Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                <div className="flex items-center gap-3">
                  <Trash2 className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-red-500">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                </div>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trading Tab */}
        <TabsContent value="trading" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trading Preferences</CardTitle>
              <CardDescription>
                Customize your default trading settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Default Order Type</Label>
                  <Select
                    value={trading.defaultOrderType}
                    onValueChange={(value) =>
                      setTrading({ ...trading, defaultOrderType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market Order</SelectItem>
                      <SelectItem value="limit">Limit Order</SelectItem>
                      <SelectItem value="stop">Stop Order</SelectItem>
                      <SelectItem value="stop-limit">Stop-Limit Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={trading.currency}
                    onValueChange={(value) =>
                      setTrading({ ...trading, currency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Stop-Loss (%)</Label>
                  <Input
                    type="number"
                    value={trading.defaultStopLoss}
                    onChange={(e) =>
                      setTrading({ ...trading, defaultStopLoss: e.target.value })
                    }
                    min="1"
                    max="50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Default Take-Profit (%)</Label>
                  <Input
                    type="number"
                    value={trading.defaultTakeProfit}
                    onChange={(e) =>
                      setTrading({ ...trading, defaultTakeProfit: e.target.value })
                    }
                    min="1"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={trading.timezone}
                    onValueChange={(value) =>
                      setTrading({ ...trading, timezone: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                      <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Safety Settings</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Confirm Trades</Label>
                    <p className="text-sm text-muted-foreground">
                      Show confirmation dialog before executing trades
                    </p>
                  </div>
                  <Switch
                    checked={trading.confirmTrades}
                    onCheckedChange={(checked) =>
                      setTrading({ ...trading, confirmTrades: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Risk Warnings</Label>
                    <p className="text-sm text-muted-foreground">
                      Show warnings for high-risk trades
                    </p>
                  </div>
                  <Switch
                    checked={trading.riskWarnings}
                    onCheckedChange={(checked) =>
                      setTrading({ ...trading, riskWarnings: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Subscription
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/20">
                    <Zap className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">Free Plan</p>
                      <Badge variant="secondary">Current</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Basic features with limited trades
                    </p>
                  </div>
                </div>
                <Button className="gap-2">
                  <Crown className="h-4 w-4" />
                  Upgrade to Pro
                </Button>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">10</p>
                  <p className="text-xs text-muted-foreground">Trades/Day</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-muted-foreground">Watchlist Items</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">Basic</p>
                  <p className="text-xs text-muted-foreground">Charts</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">15min</p>
                  <p className="text-xs text-muted-foreground">Data Delay</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Customize the appearance of the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors",
                    theme === "light"
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-muted/50 hover:bg-muted"
                  )}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white border shadow-sm">
                    <Sun className="h-6 w-6 text-yellow-500" />
                  </div>
                  <span className="font-medium">Light</span>
                  {theme === "light" && (
                    <Badge className="bg-primary/20 text-primary">Active</Badge>
                  )}
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors",
                    theme === "dark"
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-muted/50 hover:bg-muted"
                  )}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 border border-slate-700">
                    <Moon className="h-6 w-6 text-slate-300" />
                  </div>
                  <span className="font-medium">Dark</span>
                  {theme === "dark" && (
                    <Badge className="bg-primary/20 text-primary">Active</Badge>
                  )}
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors",
                    theme === "system"
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-muted/50 hover:bg-muted"
                  )}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-white to-slate-900 border">
                    <Monitor className="h-6 w-6 text-slate-500" />
                  </div>
                  <span className="font-medium">System</span>
                  {theme === "system" && (
                    <Badge className="bg-primary/20 text-primary">Active</Badge>
                  )}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Chart Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Chart Preferences</CardTitle>
              <CardDescription>
                Customize how charts are displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Default Chart Type</Label>
                  <Select defaultValue="candlestick">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="candlestick">Candlestick</SelectItem>
                      <SelectItem value="line">Line</SelectItem>
                      <SelectItem value="bar">Bar</SelectItem>
                      <SelectItem value="area">Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Timeframe</Label>
                  <Select defaultValue="1d">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1 Minute</SelectItem>
                      <SelectItem value="5m">5 Minutes</SelectItem>
                      <SelectItem value="15m">15 Minutes</SelectItem>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="4h">4 Hours</SelectItem>
                      <SelectItem value="1d">1 Day</SelectItem>
                      <SelectItem value="1w">1 Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Chart Color Scheme</Label>
                <div className="grid grid-cols-4 gap-3">
                  <button className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-primary bg-primary/5">
                    <div className="flex gap-1">
                      <div className="h-4 w-4 rounded bg-green-500" />
                      <div className="h-4 w-4 rounded bg-red-500" />
                    </div>
                    <span className="text-xs">Classic</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-transparent bg-muted/50 hover:bg-muted">
                    <div className="flex gap-1">
                      <div className="h-4 w-4 rounded bg-blue-500" />
                      <div className="h-4 w-4 rounded bg-orange-500" />
                    </div>
                    <span className="text-xs">Modern</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-transparent bg-muted/50 hover:bg-muted">
                    <div className="flex gap-1">
                      <div className="h-4 w-4 rounded bg-emerald-500" />
                      <div className="h-4 w-4 rounded bg-rose-500" />
                    </div>
                    <span className="text-xs">Vibrant</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-transparent bg-muted/50 hover:bg-muted">
                    <div className="flex gap-1">
                      <div className="h-4 w-4 rounded bg-cyan-500" />
                      <div className="h-4 w-4 rounded bg-pink-500" />
                    </div>
                    <span className="text-xs">Neon</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Adjust display preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Show more content with reduced spacing
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable animations and transitions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>High Contrast Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Increase contrast for better visibility
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Logout Section */}
      <Card className="border-red-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
            </div>
            <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
