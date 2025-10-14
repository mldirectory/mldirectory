import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import WholesaleDialog from '@/components/WholesaleDialog';
import AuthDialog from '@/components/AuthDialog';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { z } from 'zod';

interface FooterProps {
  user: User | null;
  onSignOut: () => void;
  onShowAuthDialog: () => void;
  onToggleAdmin?: () => void;
  showAdmin?: boolean;
}

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").optional(),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters")
});

const Footer = ({ user, onSignOut, onShowAuthDialog, onToggleAdmin, showAdmin }: FooterProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      contactSchema.parse(formData);
      toast.success('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-white/90 text-gray-900"
                      required
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-white/90 text-gray-900"
                      required
                      maxLength={255}
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number (Optional)"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-white/90 text-gray-900"
                      maxLength={20}
                    />
                  </div>
                  <div>
                    <Textarea
                      name="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="bg-white/90 text-gray-900 min-h-[100px]"
                      required
                      maxLength={1000}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info & Actions */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Get Started</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <WholesaleDialog />
                
                {user ? (
                  <>
                    <AuthDialog user={user} onSignOut={onSignOut} />
                    {onToggleAdmin && (
                      <Button 
                        onClick={onToggleAdmin}
                        variant="outline"
                        className="border-red-200 text-white hover:bg-red-50/10 w-full"
                      >
                        {showAdmin ? 'Hide Admin' : 'Admin Panel'}
                      </Button>
                    )}
                  </>
                ) : (
                  <Button 
                    onClick={onShowAuthDialog}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold w-full"
                  >
                    STORE OWNERS - LOGIN
                  </Button>
                )}
              </div>

              <div className="mt-6 space-y-2 text-white/80">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@mattressliquidators.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} Mattress Liquidators. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
