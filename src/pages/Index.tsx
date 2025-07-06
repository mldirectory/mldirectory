
import { useState, useEffect } from 'react';
import { MapPin, Search, Shield, Award, Truck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StoreLocator from '@/components/StoreLocator';
import AdminPanel from '@/components/AdminPanel';
import FeaturedBrands from '@/components/FeaturedBrands';
import AuthDialog from '@/components/AuthDialog';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  hours: string;
}

const ADMIN_EMAIL = 'mattresslocatorsite@gmail.com';

const Index = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  // Set up authentication
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Hide admin panel if user logs out or is not admin
        if (!session?.user || session.user.email !== ADMIN_EMAIL) {
          setShowAdmin(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load stores from Supabase
  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching stores:', error);
        return;
      }

      // Transform the data to match our Store interface
      const transformedStores = data.map(store => ({
        id: store.id,
        name: store.name,
        address: store.address,
        city: store.city,
        state: store.state,
        zipCode: store.zip_code,
        phone: store.phone || '',
        hours: store.hours || '',
      }));

      setStores(transformedStores);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const addStore = async (store: Omit<Store, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .insert([{
          name: store.name,
          address: store.address,
          city: store.city,
          state: store.state,
          zip_code: store.zipCode,
          phone: store.phone,
          hours: store.hours,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding store:', error);
        alert('Error adding store. Please try again.');
        return;
      }

      // Add the new store to the local state
      const newStore = {
        id: data.id,
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        phone: data.phone || '',
        hours: data.hours || '',
      };

      setStores(prev => [newStore, ...prev]);
      console.log('Store added successfully!');
    } catch (error) {
      console.error('Error adding store:', error);
      alert('Error adding store. Please try again.');
    }
  };

  const removeStore = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing store:', error);
        alert('Error removing store. Please try again.');
        return;
      }

      // Remove the store from local state
      setStores(prev => prev.filter(store => store.id !== id));
      console.log('Store removed successfully!');
    } catch (error) {
      console.error('Error removing store:', error);
      alert('Error removing store. Please try again.');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="text-pink-500 w-6 h-6" />
            <span className="font-bold text-gray-800">Store Locator</span>
          </div>
          <div className="flex items-center gap-4">
            <AuthDialog user={user} onSignOut={handleSignOut} />
            {isAdmin && (
              <Button 
                onClick={() => setShowAdmin(!showAdmin)}
                variant="outline"
                className="border-pink-200 text-pink-600 hover:bg-pink-50"
              >
                {showAdmin ? 'Hide Admin' : 'Admin Panel'}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Smaller Logo */}
      <section className="relative py-8 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/50 via-yellow-100/50 to-cyan-100/50"></div>
        <div className="container mx-auto relative z-10">
          <div className="mb-4">
            <img 
              src="/lovable-uploads/821af3f6-f657-4e76-9204-2bee6c21c100.png" 
              alt="Mattress Liquidators Logo" 
              className="mx-auto w-full max-w-md h-auto drop-shadow-lg"
            />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3 leading-tight">
            Find Your Perfect
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500"> Mattress</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
            Premium mattresses at liquidation prices. Save up to 80% off retail with our unbeatable selection.
          </p>
        </div>
      </section>

      {/* Store Locator Section - Right below logo */}
      <section className="py-8 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Find Your Nearest Store
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Locate the closest Mattress Liquidators store near you and discover incredible savings.
            </p>
          </div>
          <StoreLocator stores={stores} />
        </div>
      </section>

      {/* Admin Panel - Only show for authenticated admin */}
      {showAdmin && isAdmin && (
        <section className="py-8 px-4 bg-white/70 backdrop-blur-sm border-y border-pink-100">
          <div className="container mx-auto">
            <AdminPanel onAddStore={addStore} stores={stores} onRemoveStore={removeStore} />
          </div>
        </section>
      )}

      {/* Quick Stats */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/60 backdrop-blur-sm border-pink-100">
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">80%</div>
                <div className="text-sm text-gray-600">Off Retail</div>
              </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border-yellow-100">
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">100+</div>
                <div className="text-sm text-gray-600">Top Brands</div>
              </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border-cyan-100">
              <CardContent className="p-4 text-center">
                <Truck className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">Free</div>
                <div className="text-sm text-gray-600">Delivery</div>
              </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border-pink-100">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-50/50 via-white to-yellow-50/50">
        <div className="container mx-auto">
          <FeaturedBrands />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-6">
            <img 
              src="/lovable-uploads/821af3f6-f657-4e76-9204-2bee6c21c100.png" 
              alt="Mattress Liquidators Logo" 
              className="mx-auto w-64 h-auto opacity-80"
            />
          </div>
          <p className="text-gray-400 mb-4">
            © 2024 Mattress Liquidators. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Quality mattresses at unbeatable prices. Visit your local store today!
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
