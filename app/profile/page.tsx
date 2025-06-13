"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/components/providers"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { User } from "lucide-react"

// Simple Modal component
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl p-6 min-w-[320px] max-w-[90vw] relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" aria-label="Close modal">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        {children}
      </div>
    </div>
  );
}

// Extend User type to include avatar for local typing
interface LocalUser {
  avatar?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  role?: string;
}

export default function ProfilePage() {
  // Modal state for change password
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  })

  useEffect(() => {
    if (user) {
      fetchUserProfile()
    }
  }, [user])

  // Handle avatar file change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  // Handle avatar click (to open file dialog)
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setFormData({
          name: data.name || "",
          email: data.email || "",
          avatar: data.avatar || "",
          phone: data.phone || "",
          address: data.address || {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "", 
          },
        })
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let body: any = { ...formData };
      if (avatarFile) {
        // Read file as base64 and submit
        const reader = new FileReader();
        const fileReadPromise = new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
        reader.readAsDataURL(avatarFile);
        body.avatar = await fileReadPromise;
      }
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const updated = await response.json();
        setFormData((prev) => ({ ...prev, avatar: updated.avatar || prev.avatar }));
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        })
        setAvatarFile(null);
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Please Login</h1>
            <p className="text-gray-600">You need to be logged in to view your profile.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-2 py-6 md:py-12">
        <section className="w-full max-w-3xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-100 p-0 md:p-10 md:pt-8">
          <h1 className="text-4xl font-black text-blue-800 mb-10 text-center tracking-tight drop-shadow-sm">My Profile</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Avatar Uploader */}
            <div className="flex flex-col items-center md:items-start gap-6 col-span-1 md:col-span-2">
              <div className="relative group">
                <div className="bg-gradient-to-tr from-blue-200 via-blue-100 to-blue-50 p-1 rounded-full">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt={formData.name || "User avatar"}
                      className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-xl transition-all duration-200"
                    />
                  ) : (
                    <span className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-gray-100 flex items-center justify-center text-blue-300 border-4 border-white shadow-xl">
                      <User className="w-16 h-16" />
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    aria-label="Change avatar"
                    className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg border-2 border-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6 6m2-2a2.828 2.828 0 11-4-4l2-2a2.828 2.828 0 114 4l-2 2z" />
                    </svg>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <span className="block text-xs text-gray-500 mt-2 text-center">Click the camera to update your avatar</span>
              </div>
            </div>

            {/* Personal Info */}
            <div className="space-y-6">
              <div className="relative">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => handleInputChange("name", e.target.value)}
                  className="peer pt-6 pb-2"
                  required
                />
                <Label htmlFor="name" className="absolute left-3 top-2 text-gray-600 text-xs transition-all peer-focus:top-1 peer-focus:text-blue-700 peer-focus:text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400">Full Name</Label>
              </div>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="peer pt-6 pb-2 bg-gray-100 cursor-not-allowed"
                />
                <Label htmlFor="email" className="absolute left-3 top-2 text-gray-600 text-xs transition-all peer-focus:top-1 peer-focus:text-blue-700 peer-focus:text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400">Email</Label>
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div className="relative">
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={e => handleInputChange("phone", e.target.value)}
                  className="peer pt-6 pb-2"
                />
                <Label htmlFor="phone" className="absolute left-3 top-2 text-gray-600 text-xs transition-all peer-focus:top-1 peer-focus:text-blue-700 peer-focus:text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400">Phone Number</Label>
              </div>
            </div>

            {/* Address Info */}
            <div className="space-y-6">
              <div className="relative">
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={e => handleAddressChange("street", e.target.value)}
                  className="peer pt-6 pb-2"
                />
                <Label htmlFor="street" className="absolute left-3 top-2 text-gray-600 text-xs transition-all peer-focus:top-1 peer-focus:text-blue-700 peer-focus:text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400">Street Address</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={e => handleAddressChange("city", e.target.value)}
                    className="peer pt-6 pb-2"
                  />
                  <Label htmlFor="city" className="absolute left-3 top-2 text-gray-600 text-xs transition-all peer-focus:top-1 peer-focus:text-blue-700 peer-focus:text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400">City</Label>
                </div>
                <div className="relative">
                  <Input
                    id="state"
                    value={formData.address.state}
                    onChange={e => handleAddressChange("state", e.target.value)}
                    className="peer pt-6 pb-2"
                  />
                  <Label htmlFor="state" className="absolute left-3 top-2 text-gray-600 text-xs transition-all peer-focus:top-1 peer-focus:text-blue-700 peer-focus:text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400">State</Label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    id="zipCode"
                    value={formData.address.zipCode}
                    onChange={e => handleAddressChange("zipCode", e.target.value)}
                    className="peer pt-6 pb-2"
                  />
                  <Label htmlFor="zipCode" className="absolute left-3 top-2 text-gray-600 text-xs transition-all peer-focus:top-1 peer-focus:text-blue-700 peer-focus:text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400">ZIP Code</Label>
                </div>
                <div className="relative">
                  <Input
                    id="country"
                    value={formData.address.country}
                    onChange={e => handleAddressChange("country", e.target.value)}
                    className="peer pt-6 pb-2"
                  />
                  <Label htmlFor="country" className="absolute left-3 top-2 text-gray-600 text-xs transition-all peer-focus:top-1 peer-focus:text-blue-700 peer-focus:text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400">Country</Label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-center mt-8">
              <Button
                type="submit"
                disabled={loading}
                className="px-8 py-3 text-lg rounded-xl font-bold shadow-lg bg-gradient-to-tr from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 transition-all"
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                )}
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="my-10 border-t border-blue-100"></div>

          {/* Account Settings */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <User className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-lg font-semibold">Account Type</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="capitalize text-blue-700 font-medium text-base">{user.role}</span>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 21a8.38 8.38 0 01-7.5-4.472A8.38 8.38 0 014.5 21" />
                </svg>
                <CardTitle className="text-lg font-semibold">Security</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <span className="text-gray-700 text-sm">Change your password for better account security.</span>
                  <Button variant="outline" className="w-max mt-2" type="button" onClick={() => setShowPasswordModal(true)}>Change Password</Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </section>
      </main>
    {/* Change Password Modal */}
    <Modal open={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
      <h2 className="text-xl font-bold mb-4 text-blue-700">Change Password</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setPwLoading(true);
          if (pwForm.next !== pwForm.confirm) {
            toast({ title: 'Error', description: 'Passwords do not match.', variant: 'destructive' });
            setPwLoading(false);
            return;
          }
          try {
            // Replace with your real API endpoint
            const res = await fetch('/api/user/change-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
            });
            if (res.ok) {
              toast({ title: 'Password changed', description: 'Your password was updated successfully.' });
              setShowPasswordModal(false);
              setPwForm({ current: '', next: '', confirm: '' });
            } else {
              const data = await res.json();
              toast({ title: 'Error', description: data?.message || 'Failed to change password.', variant: 'destructive' });
            }
          } catch (err) {
            toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
          } finally {
            setPwLoading(false);
          }
        }}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="current-pw">Current Password</Label>
          <Input id="current-pw" type="password" autoComplete="current-password" required value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="new-pw">New Password</Label>
          <Input id="new-pw" type="password" autoComplete="new-password" required value={pwForm.next} onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="confirm-pw">Confirm New Password</Label>
          <Input id="confirm-pw" type="password" autoComplete="new-password" required value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} />
        </div>
        <div className="flex gap-3 mt-6">
          <Button type="submit" className="flex-1" disabled={pwLoading}>{pwLoading ? 'Saving...' : 'Change Password'}</Button>
          <Button type="button" variant="outline" className="flex-1" onClick={() => setShowPasswordModal(false)} disabled={pwLoading}>Cancel</Button>
        </div>
      </form>
    </Modal>
  </div>
  )
}
