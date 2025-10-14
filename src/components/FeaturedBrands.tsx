
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const FeaturedBrands = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Premium Brand Mattresses
        </h2>
        
        {/* Brand Logos Block */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/821af3f6-f657-4e76-9204-2bee6c21c100.png" 
            alt="Featured Mattress Brands" 
            className="mx-auto w-full max-w-4xl h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Disclaimer */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-800 font-semibold mb-2">Important Notice:</p>
                <p className="text-gray-700">
                  All mattress liquidation sales are final. No returns, exchanges, or refunds. 
                  Please inspect all items carefully before purchase. All sales are AS-IS with no warranties or guarantees.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeaturedBrands;
