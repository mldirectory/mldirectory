
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

    // Find state from city search or direct state search
    let targetState = '';
    
    // Check if search term matches a state directly
    const stateMatch = stores.find(store => 
      store.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (stateMatch) {
      targetState = stateMatch.state;
    } else {
      // Check if search term matches a city, then get its state
      const cityMatch = stores.find(store => 
        store.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (cityMatch) {
        targetState = cityMatch.state;
      }
    }
    
    // If we found a state, show all stores in that state
    const filtered = targetState ? 
      stores.filter(store => store.state.toLowerCase() === targetState.toLowerCase()) :
      [];

    setFilteredStores(filtered);
    setHasSearched(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Large, Prominent Search Section */}
      <Card className="mb-8 bg-white/90 backdrop-blur-sm border-red-200 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-2xl md:text-3xl text-gray-800 flex items-center justify-center gap-3">
            <Search className="w-8 h-8 text-red-500" />
            Find The Best Liquidation Stores Near You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Enter city, state, or zip code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 h-14 text-lg border-red-200 focus:border-red-400 focus:ring-red-400 rounded-xl"
            />
            <Button 
              onClick={handleSearch}
              className="h-14 px-8 md:px-12 text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Stores
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
        {(hasSearched ? filteredStores : []).map((store) => (
          <Card key={store.id} className="bg-white/80 backdrop-blur-sm border-red-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-full flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{store.name}</h4>
                  <p className="text-gray-600 mb-3 leading-relaxed">
                    {store.address}<br />
                    {store.city}, {store.state} {store.zipCode}
                  </p>
                  
                  <div className="space-y-2">
                    {store.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-red-500" />
                        <a 
                          href={`tel:${store.phone}`}
                          className="text-sm text-red-600 hover:text-red-800 hover:underline font-medium transition-colors duration-200"
                        >
                          {store.phone}
                        </a>
                      </div>
                    )}
                    {store.hours && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-red-500" />
                        <span className="text-sm">{store.hours}</span>
                      </div>
                    )}
                  </div>

                  <Button 
                    className="mt-4 w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
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
        <Card className="bg-white/80 backdrop-blur-sm border-red-100 text-center p-8">
          <CardContent>
            <MapPin className="w-16 h-16 text-red-300 mx-auto mb-4" />
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
