import { useState } from 'react';
import { Plus, Trash2, Store as StoreIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { Store } from '@/pages/Index';

interface AdminPanelProps {
  onAddStore: (store: Omit<Store, 'id'>) => void;
  stores: Store[];
  onRemoveStore: (id: string) => void;
}

const AdminPanel = ({ onAddStore, stores, onRemoveStore }: AdminPanelProps) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    hours: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
      alert('Please fill in all required fields');
      return;
    }

    onAddStore(formData);
    
    // Reset form
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      hours: '',
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <StoreIcon className="w-8 h-8 text-pink-500" />
          Admin Panel
        </h2>
        <p className="text-gray-600">Manage your store locations</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Add Store Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-pink-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-600">
              <Plus className="w-5 h-5" />
              Add New Store
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Store Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Mattress Liquidators Downtown"
                  className="border-pink-200 focus:border-pink-400"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g., 123 Main Street"
                  className="border-pink-200 focus:border-pink-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g., Los Angeles"
                    className="border-pink-200 focus:border-pink-400"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g., CA"
                    className="border-pink-200 focus:border-pink-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode">Zip Code *</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="e.g., 90210"
                    className="border-pink-200 focus:border-pink-400"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g., (555) 123-4567"
                    className="border-pink-200 focus:border-pink-400"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="hours">Hours</Label>
                <Input
                  id="hours"
                  name="hours"
                  value={formData.hours}
                  onChange={handleInputChange}
                  placeholder="e.g., Mon-Sat 9AM-8PM, Sun 11AM-6PM"
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Store
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Store List */}
        <Card className="bg-white/80 backdrop-blur-sm border-pink-100">
          <CardHeader>
            <CardTitle className="text-pink-600">
              Current Stores ({stores.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stores.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <StoreIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No stores added yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {stores.map((store) => (
                  <div key={store.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-pink-100">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{store.name}</div>
                      <div className="text-sm text-gray-600">
                        {store.address}, {store.city}, {store.state} {store.zipCode}
                      </div>
                      {store.phone && (
                        <div className="text-sm text-gray-600">{store.phone}</div>
                      )}
                    </div>
                    <Button
                      onClick={() => onRemoveStore(store.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
