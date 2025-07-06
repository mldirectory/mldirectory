
import { useState } from 'react';
import { Search, MapPin, Phone, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Store } from '@/pages/Index';

interface StoreLocatorProps {
  stores: Store[];
}

const StoreLocator = ({ stores }: StoreLocatorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredStores([]);
      setHasSearched(false);
      return;
    }

    const filtered = stores.filter(store => 
      store.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.zipCode.includes(searchTerm) ||
      store.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredStores(filtered);
    setHasSearched(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Section */}
      <Card className="mb-8 bg-white/80 backdrop-blur-sm border-pink-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-gray-800 flex items-center justify-center gap-2">
            <Search className="w-6 h-6 text-pink-500" />
            Store Locator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 max-w-lg mx-auto">
            <Input
              type="text"
              placeholder="Enter city, state, or zip code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
            />
            <Button 
              onClick={handleSearch}
              className="bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white px-8"
            >
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {hasSearched && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {filteredStores.length > 0 
              ? `Found ${filteredStores.length} store${filteredStores.length === 1 ? '' : 's'} near "${searchTerm}"`
              : `No stores found near "${searchTerm}"`
            }
          </h3>
        </div>
      )}

      {/* Store Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {(hasSearched ? filteredStores : stores.slice(0, 4)).map((store) => (
          <Card key={store.id} className="bg-white/80 backdrop-blur-sm border-pink-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-pink-500 to-yellow-500 p-3 rounded-full flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{store.name}</h4>
                  <p className="text-gray-600 mb-3 leading-relaxed">
                    {store.address}<br />
                    {store.city}, {store.state} {store.zipCode}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-pink-500" />
                      <span className="text-sm">{store.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-pink-500" />
                      <span className="text-sm">{store.hours}</span>
                    </div>
                  </div>

                  <Button 
                    className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white"
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(`${store.address}, ${store.city}, ${store.state} ${store.zipCode}`)}`)}
                  >
                    Get Directions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!hasSearched && stores.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-pink-100 text-center p-8">
          <CardContent>
            <MapPin className="w-16 h-16 text-pink-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Stores Available</h3>
            <p className="text-gray-600">
              Store locations will appear here once they are added through the admin panel.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StoreLocator;
