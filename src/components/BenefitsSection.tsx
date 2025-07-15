import { Shield, Truck, Clock, Star, CheckCircle, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Verified Authentic Stores",
      description: "All Store Listings are REAL Mattress Liquidators that have been verified for authenticity",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Truck,
      title: "Fresh Inventory Weekly",
      description: "Product Inventory changes fast as new truck loads arrive weekly",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Star,
      title: "Premium Brand Names",
      description: "All Mattress Liquidator stores purchase factory overstocks, discontinued and slightly blemished mattress sets from major manufacturers including Sealy, Simmons, Serta, Spring Air, Beautyrest, Stearns and Foster and more",
      color: "from-red-500 to-red-600"
    },
    {
      icon: CheckCircle,
      title: "Quality Assured",
      description: "Every mattress meets our high quality standards for comfort and durability",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Zap,
      title: "Unbeatable Savings",
      description: "Save up to 80% off retail prices on premium mattresses",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Clock,
      title: "Quick & Easy Shopping",
      description: "Find your perfect mattress fast with our streamlined store locator",
      color: "from-red-500 to-red-600"
    }
  ];

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why Choose Mattress Liquidators?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the benefits of shopping with verified mattress liquidation stores nationwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="group bg-white/90 backdrop-blur-sm border-red-100 hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
              <CardContent className="p-6">
                <div className={`bg-gradient-to-r ${benefit.color} p-4 rounded-lg mb-4 text-center`}>
                  <benefit.icon className="w-8 h-8 text-white mx-auto mb-2" />
                  <h3 className="text-lg font-bold text-white">{benefit.title}</h3>
                </div>
                
                <p className="text-gray-600 text-center leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action Banner */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-red-500 to-red-600 border-red-200 overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Start Saving Today!
              </h3>
              <p className="text-lg text-red-100 mb-6 max-w-2xl mx-auto">
                Join thousands of satisfied customers who have found their perfect mattress at liquidation prices
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                  <span className="text-white font-semibold">✓ No Hidden Fees</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                  <span className="text-white font-semibold">✓ Professional Service</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                  <span className="text-white font-semibold">✓ Best Liquidation Prices</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;