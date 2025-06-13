"use client";

import { useEffect, useState, useRef } from "react";
import { SellerHeader } from "@/components/seller-header";

interface SellerProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  role: string;
  coins?: number;
  referralCode?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function SellerProfilePage() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [form, setForm] = useState<Partial<SellerProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile on mount
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/seller/profile");
        if (!res.ok) throw new Error((await res.json()).message || "Failed to fetch profile");
        const data = await res.json();
        setProfile(data.user);
        setForm({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || "",
          address: {
            street: data.user.address?.street || "",
            city: data.user.address?.city || "",
            state: data.user.address?.state || "",
            zipCode: data.user.address?.zipCode || "",
            country: data.user.address?.country || "",
          },
        });
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Handle form changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addrKey = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [addrKey]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  // Handle avatar file change
  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle avatar click (to open file dialog)
  function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  // Handle form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const body: any = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      };
      if (avatarFile && avatarPreview) {
        body.avatar = avatarPreview;
      } else if (profile?.avatar && !avatarFile) {
        body.avatar = profile.avatar;
      }
      const res = await fetch("/api/seller/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");
      setProfile(data.user);
      setSuccess("Profile updated successfully!");
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <SellerHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h1 className="text-3xl font-extrabold mb-8 text-gray-800 tracking-tight">
            Seller Profile
          </h1>
          {loading ? (
            <div className="flex justify-center py-16">
              <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></span>
            </div>
          ) : error ? (
            <div className="text-red-600 mb-4 text-center">{error}</div>
          ) : profile ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Avatar and Name */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  {(avatarPreview || profile?.avatar) ? (
                    <img
                      src={avatarPreview || profile?.avatar}
                      alt={form.name || profile?.name}
                      className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover shadow-lg transition-all duration-150"
                    />
                  ) : (
                    <span className="w-24 h-24 rounded-full border-4 border-blue-200 bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg">
                      <svg
                        className="w-14 h-14 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-label="Default avatar"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  )}
                  {/* Overlay for avatar upload */}
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                    title="Change avatar"
                  >
                    <span className="text-white text-xs bg-black/60 rounded px-2 py-1 pointer-events-none">
                      Change
                    </span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    name="name"
                    value={form.name || ""}
                    onChange={handleChange}
                    className="text-2xl font-semibold border-b border-blue-200 focus:outline-none focus:border-blue-500 bg-transparent w-full"
                    required
                  />
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">{profile.role?.toUpperCase()}</span>
                    {profile.isVerified && (
                      <span className="inline-block px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded font-medium">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-semibold block mb-1 text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded px-3 py-2 mt-1 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded px-3 py-2 mt-1 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="Phone number"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="font-semibold block mb-2 text-gray-700">Address</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="address.street"
                    value={form.address?.street || ""}
                    onChange={handleChange}
                    className="border border-gray-200 rounded px-3 py-2"
                    placeholder="Street"
                  />
                  <input
                    type="text"
                    name="address.city"
                    value={form.address?.city || ""}
                    onChange={handleChange}
                    className="border border-gray-200 rounded px-3 py-2"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    name="address.state"
                    value={form.address?.state || ""}
                    onChange={handleChange}
                    className="border border-gray-200 rounded px-3 py-2"
                    placeholder="State"
                  />
                  <input
                    type="text"
                    name="address.zipCode"
                    value={form.address?.zipCode || ""}
                    onChange={handleChange}
                    className="border border-gray-200 rounded px-3 py-2"
                    placeholder="ZIP Code"
                  />
                  <input
                    type="text"
                    name="address.country"
                    value={form.address?.country || ""}
                    onChange={handleChange}
                    className="border border-gray-200 rounded px-3 py-2"
                    placeholder="Country"
                  />
                </div>
              </div>

              <hr className="my-4" />

              {/* Meta Info */}
              <div className="flex flex-wrap gap-8 text-sm text-gray-600">
                <div>
                  <div className="font-semibold">Joined</div>
                  <div>
                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Last updated</div>
                  <div>
                    {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "—"}
                  </div>
                </div>
              </div>

              {/* Save Button and Feedback */}
              <div className="pt-2 flex flex-col items-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                  disabled={saving}
                >
                  {saving && (
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
                  {saving ? "Saving..." : "Update Profile"}
                </button>
                {success && <div className="text-green-600 mt-2">{success}</div>}
                {error && <div className="text-red-600 mt-2">{error}</div>}
              </div>
            </form>
          ) : (
            <div className="text-center text-gray-500 py-12">No profile data found.</div>
          )}
        </div>
      </div>
    </div>
  );
}