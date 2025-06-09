import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";

export type Address = {
  _id: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
};

type Props = {
  savedAddresses: Address[];
  selectedAddressId: string;
  shippingAddress: Address;
  showAddressForm: boolean;
  editingAddress: Address | null;
  addressLoading: boolean;
  handleEditAddress: (addr: Address) => void;
  handleDeleteAddress: (id: string) => void;
  handleAddressChange: (field: string, value: string) => void;
  handleAddOrEditAddress: (e: React.FormEvent) => void;
  setShowAddressForm: (show: boolean) => void;
  setEditingAddress: (addr: Address | null) => void;
  setShippingAddress: (addr: Address) => void;
  setSelectedAddressId: (id: string) => void;
  userName: string;
};

export function ShippingAddressSection({
  savedAddresses,
  selectedAddressId,
  shippingAddress,
  showAddressForm,
  editingAddress,
  addressLoading,
  handleEditAddress,
  handleDeleteAddress,
  handleAddressChange,
  handleAddOrEditAddress,
  setShowAddressForm,
  setEditingAddress,
  setShippingAddress,
  setSelectedAddressId,
  userName,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {addressLoading && <div className="text-sm text-gray-500">Loading addresses...</div>}
        {savedAddresses.length > 0 && !showAddressForm && !addressLoading && (
          <div className="space-y-3">
            {savedAddresses.map((addr) => (
              <div key={addr._id} className="flex items-start space-x-2 p-2 rounded border hover:border-primary transition justify-between">
                <label className="flex-1 flex items-start space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="shippingAddress"
                    checked={selectedAddressId === addr._id}
                    onChange={() => {
                      setSelectedAddressId(addr._id);
                      setShippingAddress(addr);
                    }}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">{addr.fullName}</div>
                    <div className="text-sm text-gray-600">
                      {addr.address}, {addr.city}, {addr.state}, {addr.postalCode}, {addr.country}
                      <br />
                      Phone: {addr.phone}
                    </div>
                  </div>
                </label>
                <div className="flex flex-col space-y-1 ml-4">
                  <Button size="sm" variant="outline" onClick={() => handleEditAddress(addr)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteAddress(addr._id)}>Delete</Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => {
              setShowAddressForm(true);
              setEditingAddress(null);
              setShippingAddress({ _id: '', fullName: userName, address: '', city: '', state: '', postalCode: '', country: 'India', phone: '' });
            }}>
              + Add New Address
            </Button>
          </div>
        )}
        {(showAddressForm || savedAddresses.length === 0) && !addressLoading && (
          <form className="space-y-4" onSubmit={handleAddOrEditAddress}>
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={shippingAddress.fullName}
                onChange={(e) => handleAddressChange("fullName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={shippingAddress.address}
                onChange={(e) => handleAddressChange("address", e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={shippingAddress.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={shippingAddress.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={shippingAddress.phone}
                  onChange={(e) => handleAddressChange("phone", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button type="submit" disabled={addressLoading}>{editingAddress ? 'Save Address' : 'Add Address'}</Button>
              <Button type="button" onClick={() => { setShowAddressForm(false); setEditingAddress(null); }} variant="outline">Cancel</Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
