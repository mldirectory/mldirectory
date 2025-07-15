
import { Star, Award, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import sertaLogo from '@/assets/serta-logo.png';
import tempurPedicLogo from '@/assets/tempur-pedic-logo.png';
import sealyLogo from '@/assets/sealy-logo.png';
import casperLogo from '@/assets/casper-logo.png';
import purpleLogo from '@/assets/purple-logo.png';

const FeaturedBrands = () => {
  const brands = [
    {
      name: "Sealy",
      logo: sealyLogo,
      description: "Premium comfort with Posturepedic technology",
      savings: "Up to 75% off",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Serta", 
      logo: sertaLogo,
      description: "Perfect sleeper collection for ultimate rest",
      savings: "Up to 80% off", 
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Tempur-Pedic",
      logo: tempurPedicLogo,
      description: "Memory foam innovation for personalized comfort",
      savings: "Up to 70% off",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Beautyrest",
      logo: null, // We'll use text for now since logo download failed
      description: "Pocketed coil technology for motion isolation",
      savings: "Up to 75% off",
      color: "from-orange-500 to-red-500"
    },
    {
      name: "Casper",
      logo: casperLogo,
      description: "Modern sleep solutions with premium materials",
      savings: "Up to 65% off",
      color: "from-indigo-500 to-purple-500"
    },
    {
      name: "Purple",
      logo: purpleLogo,
      description: "Innovative gel grid technology for cooling comfort",
      savings: "Up to 70% off",
      color: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Award className="w-8 h-8 text-yellow-500" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Featured Top Brands
          </h2>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
          Discover premium mattresses from the world's most trusted brands at liquidation prices. 
          Save up to 80% off retail store prices without compromising on quality.
        </p>
        
        {/* Savings Banner */}
        <div className="bg-gradient-to-r from-pink-500 via-yellow-500 to-cyan-500 text-white py-4 px-8 rounded-full inline-block mb-8 shadow-lg animate-pulse">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Zap className="w-6 h-6" />
            Save Up To 80% Off Retail Prices
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand, index) => (
          <Card key={brand.name} className="group bg-white/80 backdrop-blur-sm border-pink-100 hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <CardContent className="p-6">
              <div className={`bg-gradient-to-r ${brand.color} p-4 rounded-lg mb-4 text-center flex items-center justify-center`} style={{ minHeight: '120px' }}>
                {brand.logo ? (
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} logo`}
                    className="max-h-16 max-w-full object-contain filter brightness-0 invert"
                  />
                ) : (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{brand.name}</h3>
                    <div className="flex justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-300 fill-current" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mb-4 text-center leading-relaxed">
                {brand.description}
              </p>
              
              <div className="text-center">
                <div className={`bg-gradient-to-r ${brand.color} text-white px-4 py-2 rounded-full inline-block font-bold text-lg shadow-lg`}>
                  {brand.savings}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-pink-100 text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span>Premium Quality</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <Card className="bg-gradient-to-r from-pink-100 via-yellow-100 to-cyan-100 border-pink-200">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Find Your Perfect Mattress?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Visit your nearest Mattress Liquidators store and experience these premium brands at unbeatable prices.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-pink-200 shadow-sm">
                <span className="text-gray-700 font-semibold">✓ Free Delivery Available</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-pink-200 shadow-sm">
                <span className="text-gray-700 font-semibold">✓ Expert Sleep Consultants</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeaturedBrands;
