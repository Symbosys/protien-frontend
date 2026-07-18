import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
    MapPin,
    Plus,
    MoreVertical,
    Home,
    Briefcase,
    Trash2,
    Edit2,
    Check,
    X,
    Phone
} from 'lucide-react';
import {
  useAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation
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

export default function SavedAddresses() {
    const { data: dbAddresses = [], isLoading, error } = useAddressesQuery();
    const addAddressMutation = useAddAddressMutation();
    const updateAddressMutation = useUpdateAddressMutation();
    const deleteAddressMutation = useDeleteAddressMutation();

    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Address>>({
        type: 'Home'
    });

    const addresses: Address[] = useMemo(() => {
        return dbAddresses.map((addr) => ({
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
        }));
    }, [dbAddresses]);

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
        if (window.confirm('Are you sure you want to delete this address?')) {
            deleteAddressMutation.mutate(id, {
                onError: (err) => {
                    alert(err instanceof Error ? err.message : 'Failed to delete address');
                }
            });
        }
    };

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
            type: (formData.type?.toUpperCase() as "HOME" | "WORK" | "OTHER") || "HOME",
            isDefault: formData.isDefault || false,
            longitude: null,
            latitude: null
        };

        if (editingId) {
            updateAddressMutation.mutate({ id: editingId, payload }, {
                onSuccess: () => {
                    setIsAddingNew(false);
                    setFormData({ type: 'Home' });
                    setEditingId(null);
                },
                onError: (err) => {
                    alert(err instanceof Error ? err.message : 'Failed to update address');
                }
            });
        } else {
            addAddressMutation.mutate(payload, {
                onSuccess: () => {
                    setIsAddingNew(false);
                    setFormData({ type: 'Home' });
                    setEditingId(null);
                },
                onError: (err) => {
                    alert(err instanceof Error ? err.message : 'Failed to add address');
                }
            });
        }
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="min-h-screen bg-background font-sans text-foreground pb-20 mt-40 flex items-center justify-center">
                    <div className="text-center space-y-2">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-muted-foreground text-sm">Loading saved addresses...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-background font-sans text-foreground pb-20 mt-40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">Saved Addresses</h1>
                            <p className="text-muted-foreground mt-1">Manage your delivery locations</p>
                        </div>
                        {!isAddingNew && (
                            <button
                                onClick={handleAddNew}
                                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Address
                            </button>
                        )}
                    </div>

                    {isAddingNew ? (
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm animate-fade-in">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-primary">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
                                <button onClick={() => setIsAddingNew(false)} className="text-muted-foreground hover:text-foreground">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Full Name</label>
                                        <input
                                            required
                                            name="name"
                                            value={formData.name || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Enter name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Mobile Number</label>
                                        <input
                                            required
                                            name="mobile"
                                            value={formData.mobile || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="10-digit mobile number"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Pincode</label>
                                        <input
                                            required
                                            name="pincode"
                                            value={formData.pincode || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Pincode"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Locality</label>
                                        <input
                                            required
                                            name="locality"
                                            value={formData.locality || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Locality"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Address (Area and Street)</label>
                                    <textarea
                                        required
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                        placeholder="Flat no, Building, Street, etc."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">City/District/Town</label>
                                        <input
                                            required
                                            name="city"
                                            value={formData.city || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">State</label>
                                        <select
                                            required
                                            name="state"
                                            value={formData.state || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        >
                                            <option value="">Select State</option>
                                            <option value="Maharashtra">Maharashtra</option>
                                            <option value="Karnataka">Karnataka</option>
                                            <option value="Delhi">Delhi</option>
                                            <option value="Tamil Nadu">Tamil Nadu</option>
                                            {/* Add more states as needed */}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Address Type</label>
                                    <div className="flex gap-4 pt-1">
                                        {['Home', 'Work', 'Other'].map((type) => (
                                            <label key={type} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.type === type
                                                ? 'bg-primary/10 border-primary text-primary'
                                                : 'bg-background border-input text-muted-foreground hover:border-primary/50'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value={type}
                                                    checked={formData.type === type}
                                                    onChange={handleInputChange}
                                                    className="hidden"
                                                />
                                                {type === 'Home' && <Home className="w-4 h-4" />}
                                                {type === 'Work' && <Briefcase className="w-4 h-4" />}
                                                {type === 'Other' && <MapPin className="w-4 h-4" />}
                                                <span className="text-sm font-medium">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4 border-t border-border">
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-all shadow-sm"
                                    >
                                        Save Address
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingNew(false)}
                                        className="flex-1 px-6 py-2.5 bg-background border border-border text-foreground text-sm font-medium rounded-xl hover:bg-muted transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {addresses.length === 0 ? (
                                <div className="text-center py-12 bg-card border border-dashed border-border rounded-2xl">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium text-foreground">No Addresses Saved</h3>
                                    <p className="text-muted-foreground mt-1 mb-6">Add a new address to manage your deliveries.</p>
                                    <button
                                        onClick={handleAddNew}
                                        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-all"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add New Address
                                    </button>
                                </div>
                            ) : (
                                addresses.map((addr) => (
                                    <div key={addr.id} className="group bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-primary/50 transition-all relative">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1">
                                                    {addr.type === 'Home' && <Home className="w-5 h-5 text-muted-foreground" />}
                                                    {addr.type === 'Work' && <Briefcase className="w-5 h-5 text-muted-foreground" />}
                                                    {addr.type === 'Other' && <MapPin className="w-5 h-5 text-muted-foreground" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-foreground">{addr.name}</h3>
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground uppercase tracking-wider border border-border">
                                                            {addr.type}
                                                        </span>
                                                        {addr.isDefault && (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-foreground leading-relaxed">
                                                        {addr.address}, {addr.locality}
                                                    </p>
                                                    <p className="text-sm text-foreground">
                                                        {addr.city}, {addr.state} - <span className="font-medium">{addr.pincode}</span>
                                                    </p>
                                                    <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                                                        <Phone className="w-3.5 h-3.5" /> {addr.mobile}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(addr)}
                                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(addr.id)}
                                                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                </div>
            </div>
        </MainLayout>
    );
}
