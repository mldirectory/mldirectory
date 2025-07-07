
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
      {/* Admin access for adding stores */}
      {user?.email === ADMIN_EMAIL && (
        <div className="fixed top-4 right-4 z-50">
          <AuthDialog user={user} onSignOut={handleSignOut} />
          <Button 
            onClick={() => setShowAdmin(!showAdmin)}
            variant="outline"
            className="ml-2 border-pink-200 text-pink-600 hover:bg-pink-50"
          >
            {showAdmin ? 'Hide Admin' : 'Admin Panel'}
          </Button>
        </div>
      )}

      {/* Logo Section */}
      <section className="relative py-8 px-4 text-center">
        <div className="container mx-auto">
          <div className="mb-8">
            <img 
              src="/lovable-uploads/821af3f6-f657-4e76-9204-2bee6c21c100.png" 
              alt="Mattress Liquidators Logo" 
              className="mx-auto w-full max-w-md h-auto drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Store Locator Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <StoreLocator stores={stores} />
        </div>
      </section>

      {/* Admin Panel - Only show for authenticated admin */}
      {showAdmin && user?.email === ADMIN_EMAIL && (
        <section className="py-8 px-4 bg-white/70 backdrop-blur-sm border-y border-pink-100">
          <div className="container mx-auto">
            <AdminPanel onAddStore={addStore} stores={stores} onRemoveStore={removeStore} />
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
