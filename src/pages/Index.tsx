
import { useState, useEffect } from 'react';
import { MapPin, Search, Shield, Award, Truck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StoreLocator from '@/components/StoreLocator';
import AdminPanel from '@/components/AdminPanel';
import FeaturedBrands from '@/components/FeaturedBrands';
import BenefitsSection from '@/components/BenefitsSection';
import WholesaleDialog from '@/components/WholesaleDialog';
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
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Set up authentication
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Hide admin panel if user logs out
        if (!session?.user) {
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

  // Load admin stores when user changes or admin panel is shown
  useEffect(() => {
    if (user && showAdmin) {
      fetchAdminStores();
    } else {
      // When not in admin mode, make sure we show all public stores
      fetchStores();
    }
  }, [user, showAdmin]);

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

  // Fetch stores for admin panel (filtered by user)
  const fetchAdminStores = async () => {
    try {
      let query = supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });

      // Master admin sees all stores, other users see only their own
      if (user?.email !== ADMIN_EMAIL) {
        query = query.eq('created_by', user?.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching admin stores:', error);
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
      console.error('Error fetching admin stores:', error);
    }
  };

  const addStore = async (store: Omit<Store, 'id'>) => {
    try {
      console.log('Adding store:', store);
      console.log('Current user:', user);
      
      if (!user?.id) {
        console.error('No user ID found');
        alert('You must be logged in to add a store.');
        return;
      }

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
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error adding store:', error);
        alert(`Error adding store: ${error.message}. Please try again.`);
        return;
      }

      console.log('Store added to database:', data);

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
      console.log('Store added successfully to local state!');
      alert('Store added successfully!');
      
      // Refresh admin stores after adding
      if (showAdmin) {
        fetchAdminStores();
      }
    } catch (error) {
      console.error('Unexpected error adding store:', error);
      alert(`Error adding store: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
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
      
      // Refresh admin stores after removing
      if (showAdmin) {
        fetchAdminStores();
      }
    } catch (error) {
      console.error('Error removing store:', error);
      alert('Error removing store. Please try again.');
    }
  };

  const updateStore = async (id: string, updatedStore: Omit<Store, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .update({
          name: updatedStore.name,
          address: updatedStore.address,
          city: updatedStore.city,
          state: updatedStore.state,
          zip_code: updatedStore.zipCode,
          phone: updatedStore.phone,
          hours: updatedStore.hours,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating store:', error);
        alert('Error updating store. Please try again.');
        return;
      }

      // Update the local state
      const transformedStore = {
        id: data.id,
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        phone: data.phone || '',
        hours: data.hours || '',
      };

      setStores(prev => prev.map(store => 
        store.id === id ? transformedStore : store
      ));
      
      console.log('Store updated successfully!');
      
      // Refresh admin stores after updating
      if (showAdmin) {
        fetchAdminStores();
      }
    } catch (error) {
      console.error('Error updating store:', error);
      alert('Error updating store. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Wholesale Button - Top Left */}
      <div className="fixed top-4 left-4 z-50">
        <WholesaleDialog />
      </div>

      {/* Admin access for adding stores */}
      {user && (
        <div className="fixed top-4 right-4 z-50">
          <AuthDialog user={user} onSignOut={handleSignOut} />
          <Button 
            onClick={() => setShowAdmin(!showAdmin)}
            variant="outline"
            className="ml-2 border-red-200 text-red-600 hover:bg-red-50"
          >
            {showAdmin ? 'Hide Admin' : 'Admin Panel'}
          </Button>
        </div>
      )}

      {/* Store Owner Button - Upper Right */}
      {!user && (
        <div className="fixed top-4 right-4 z-50">
          <Button 
            onClick={() => setShowAuthDialog(true)}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            STORE OWNERS CLICK HERE
          </Button>
        </div>
      )}

      {/* Logo Section */}
      <section className="relative pt-16 pb-4 px-4 text-center">
        <div className="container mx-auto">
          <div className="mb-2">
            <img 
              src="/lovable-uploads/8043f686-a816-4896-a150-6c645fe81ed6.png" 
              alt="Mattress Liquidators Logo" 
              className="mx-auto w-full max-w-2xl h-auto drop-shadow-lg"
            />
          </div>
          
          {/* Welcome message for logged in users */}
          {user && (
            <div className="mt-8 text-center">
              <p className="text-gray-600">Welcome back! Use the admin panel to manage stores.</p>
            </div>
          )}
           
           {/* Auth Dialog */}
           {showAuthDialog && (
             <AuthDialog 
               user={null} 
               onSignOut={() => {}} 
               onClose={() => setShowAuthDialog(false)}
               isOpen={showAuthDialog}
             />
           )}
        </div>
      </section>

      {/* Store Locator Section */}
      <section className="px-4">
        <div className="container mx-auto">
          <StoreLocator stores={stores} />
        </div>
      </section>

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Featured Brands Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <FeaturedBrands />
        </div>
      </section>

      {/* Admin Panel - Show for authenticated users */}
      {showAdmin && user && (
        <section className="py-8 px-4 bg-white/70 backdrop-blur-sm border-y border-red-100">
          <div className="container mx-auto">
            <AdminPanel onAddStore={addStore} stores={stores} onRemoveStore={removeStore} onUpdateStore={updateStore} />
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
