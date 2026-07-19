import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import {
  MapPin,
  Plus,
  Home,
  Briefcase,
  Trash2,
  Edit2,
  X,
  Phone,
  Loader2,
} from 'lucide-react';
import {
  useAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from '@/api/hooks/address.hooks';

type AddressType = 'Home' | 'Work' | 'Other';

interface Address {
  id: string;
  name: string;
  mobile: string;
  pincode: string;
  locality: string;
  address: string;
  city: string;
  state: string;
  type: AddressType;
  isDefault: boolean;
}

const STATES = [
  'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Telangana', 'Uttar Pradesh', 'West Bengal',
];

const typeConfig: Record<AddressType, { icon: any; color: string }> = {
  Home: { icon: Home, color: 'bg-blue-50 text-blue-600' },
  Work: { icon: Briefcase, color: 'bg-amber-50 text-amber-600' },
  Other: { icon: MapPin, color: 'bg-gray-100 text-gray-600' },
};

export default function SavedAddresses() {
  const { data: dbAddresses = [], isLoading } = useAddressesQuery();
  const addAddressMutation = useAddAddressMutation();
  const updateAddressMutation = useUpdateAddressMutation();
  const deleteAddressMutation = useDeleteAddressMutation();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({ type: 'Home' });

  const addresses: Address[] = useMemo(
    () =>
      dbAddresses.map((addr) => ({
        id: addr.id,
        name: addr.name,
        mobile: addr.mobile,
        pincode: addr.pincode,
        locality: addr.locality || '',
        address: addr.address,
        city: addr.city,
        state: addr.state,
        type: addr.type === 'HOME' ? 'Home' : addr.type === 'WORK' ? 'Work' : 'Other',
        isDefault: addr.isDefault,
      })),
    [dbAddresses]
  );

  const handleAddNew = () => {
    setFormData({ type: 'Home' });
    setIsAddingNew(true);
    setEditingId(null);
  };

  const handleEdit = (addr: Address) => {
    setFormData(addr);
    setIsAddingNew(true);
    setEditingId(addr.id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this address?')) {
      deleteAddressMutation.mutate(id, {
        onError: (err) => alert(err instanceof Error ? err.message : 'Failed to delete address'),
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isSaving = addAddressMutation.isPending || updateAddressMutation.isPending;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name || '',
      mobile: formData.mobile || '',
      pincode: formData.pincode || '',
      locality: formData.locality || '',
      address: formData.address || '',
      city: formData.city || '',
      state: formData.state || '',
      type: (formData.type?.toUpperCase() as 'HOME' | 'WORK' | 'OTHER') || 'HOME',
      isDefault: formData.isDefault || false,
      longitude: null,
      latitude: null,
    };
    if (editingId) {
      updateAddressMutation.mutate(
        { id: editingId, payload },
        {
          onSuccess: () => { setIsAddingNew(false); setFormData({ type: 'Home' }); setEditingId(null); },
          onError: (err) => alert(err instanceof Error ? err.message : 'Failed to update address'),
        }
      );
    } else {
      addAddressMutation.mutate(payload, {
        onSuccess: () => { setIsAddingNew(false); setFormData({ type: 'Home' }); setEditingId(null); },
        onError: (err) => alert(err instanceof Error ? err.message : 'Failed to add address'),
      });
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm bg-[#F7F8FA] border border-gray-200 rounded-xl text-black placeholder-gray-300 focus:bg-white focus:border-black focus:outline-none transition-all';
  const labelClass = 'block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5';

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-black mx-auto" />
            <p className="text-sm text-gray-400">Loading addresses…</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F7F8FA] text-black pb-20">
        {/* Hero */}
        <div className="bg-white border-b border-gray-100 pt-28 pb-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-black">Saved Addresses</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your delivery locations</p>
            </div>
            {!isAddingNew && (
              <button
                onClick={handleAddNew}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-900 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New
              </button>
            )}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-4">
          {/* Add / Edit Form */}
          <AnimatePresence>
            {isAddingNew && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-bold text-black">
                    {editingId ? 'Edit Address' : 'New Address'}
                  </h2>
                  <button onClick={() => setIsAddingNew(false)} className="text-gray-400 hover:text-black transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <input required name="name" value={formData.name || ''} onChange={handleInputChange} className={inputClass} placeholder="John Doe" />
                    </div>
                    <div>
                      <label className={labelClass}>Mobile Number</label>
                      <input required name="mobile" value={formData.mobile || ''} onChange={handleInputChange} className={inputClass} placeholder="10-digit number" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Pincode</label>
                      <input required name="pincode" value={formData.pincode || ''} onChange={handleInputChange} className={inputClass} placeholder="e.g. 834001" />
                    </div>
                    <div>
                      <label className={labelClass}>Locality</label>
                      <input required name="locality" value={formData.locality || ''} onChange={handleInputChange} className={inputClass} placeholder="Area / locality" />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Street Address</label>
                    <textarea required name="address" value={formData.address || ''} onChange={handleInputChange} rows={2} className={`${inputClass} resize-none`} placeholder="Flat no, building, street…" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>City</label>
                      <input required name="city" value={formData.city || ''} onChange={handleInputChange} className={inputClass} placeholder="City" />
                    </div>
                    <div>
                      <label className={labelClass}>State</label>
                      <select required name="state" value={formData.state || ''} onChange={handleInputChange} className={inputClass}>
                        <option value="">Select State</option>
                        {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Type selector */}
                  <div>
                    <label className={labelClass}>Address Type</label>
                    <div className="flex gap-3">
                      {(['Home', 'Work', 'Other'] as AddressType[]).map((type) => {
                        const cfg = typeConfig[type];
                        return (
                          <label
                            key={type}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer text-sm font-semibold transition-all ${
                              formData.type === type
                                ? 'bg-black text-white border-black'
                                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'
                            }`}
                          >
                            <input type="radio" name="type" value={type} checked={formData.type === type} onChange={handleInputChange} className="hidden" />
                            <cfg.icon className="w-3.5 h-3.5" />
                            {type}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-900 disabled:opacity-50 transition-colors"
                    >
                      {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      {editingId ? 'Update Address' : 'Save Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="flex-1 py-2.5 bg-[#F7F8FA] border border-gray-200 text-black text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Address list */}
          {addresses.length === 0 && !isAddingNew ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl"
            >
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-bold text-black mb-1">No addresses saved</h3>
              <p className="text-sm text-gray-400 mb-5">Add a delivery address to get started.</p>
              <button
                onClick={handleAddNew}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-900 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Address
              </button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr, i) => {
                const cfg = typeConfig[addr.type] || typeConfig.Other;
                return (
                  <motion.div
                    key={addr.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon badge */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                        <cfg.icon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-sm font-bold text-black">{addr.name}</h3>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {addr.type}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {addr.address}{addr.locality ? `, ${addr.locality}` : ''}
                        </p>
                        <p className="text-sm text-gray-600">
                          {addr.city}, {addr.state} — <span className="font-semibold text-black">{addr.pincode}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5">
                          <Phone className="w-3 h-3" />
                          {addr.mobile}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() => handleEdit(addr)}
                          className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(addr.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
