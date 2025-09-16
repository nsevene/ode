import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, ShoppingCart, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { track } from '@/lib/analytics';

const DemoOrderFlow = () => {
  const [currentStep, setCurrentStep] = useState<'menu' | 'customize' | 'cart' | 'payment' | 'confirmation'>('menu');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [customizations, setCustomizations] = useState<any>({});

  const demoMenuItems = [
    {
      id: 1,
      name: "Signature Pad Thai",
      description: "Traditional Thai stir-fried rice noodles with tamarind, palm sugar, and fresh herbs",
      price: 85000,
      image: "/lovable-uploads/614f7b79-d13c-4774-9cfa-e18cf97a80ba.png",
      kitchen: "Warung Spice Asia",
      customizations: [
        { type: "Spice Level", options: ["Mild", "Medium", "Spicy", "Thai Hot"], default: "Medium" },
        { type: "Protein", options: ["Chicken (+0)", "Shrimp (+12k)", "Tofu (+0)", "Mixed Seafood (+18k)"], default: "Chicken (+0)" },
        { type: "Add-ons", options: ["Extra Vegetables (+5k)", "Crushed Peanuts (+3k)", "Lime Wedge (+2k)", "Bean Sprouts (+3k)"], default: [] }
      ]
    },
    {
      id: 2,
      name: "Wood-Fired Margherita",
      description: "Classic Neapolitan pizza with San Marzano tomatoes, buffalo mozzarella, and fresh basil",
      price: 105000,
      image: "/lovable-uploads/7183ec12-e263-49ad-bcf4-46b29c2e0c53.png",
      kitchen: "Casa Italiana",
      customizations: [
        { type: "Size", options: ["Personal (25cm)", "Regular (30cm) (+15k)", "Large (35cm) (+25k)"], default: "Personal (25cm)" },
        { type: "Crust", options: ["Traditional Thin", "Thick Roman", "Gluten-Free (+12k)"], default: "Traditional Thin" },
        { type: "Extra Toppings", options: ["Extra Mozzarella (+8k)", "Prosciutto (+15k)", "Mushrooms (+6k)", "Arugula (+5k)"], default: [] }
      ]
    },
    {
      id: 3,
      name: "Nasi Campur Bali",
      description: "Traditional Balinese rice platter with rendang, satay, vegetables, and sambal",
      price: 75000,
      image: "/lovable-uploads/9661fa44-47b8-4375-9a53-04abf298479f.png",
      kitchen: "Bali Heritage Kitchen",
      customizations: [
        { type: "Protein", options: ["Beef Rendang", "Chicken Satay", "Grilled Fish (+8k)", "Mixed Platter (+12k)"], default: "Beef Rendang" },
        { type: "Rice Type", options: ["Steamed White Rice", "Coconut Rice (+3k)", "Brown Rice (+5k)"], default: "Steamed White Rice" },
        { type: "Spice Level", options: ["Mild Sambal", "Medium Sambal", "Spicy Sambal"], default: "Medium Sambal" }
      ]
    },
    {
      id: 4,
      name: "24-Hour Smoked Brisket",
      description: "Slow-smoked beef brisket with house BBQ sauce, coleslaw, and cornbread",
      price: 145000,
      image: "/lovable-uploads/a6143ebd-fe6e-4b6b-8452-baa56f5278ec.png",
      kitchen: "Smoke & Fire",
      customizations: [
        { type: "Cut Style", options: ["Lean Cut", "Fatty Cut", "Mixed Cut"], default: "Mixed Cut" },
        { type: "Sauce", options: ["House BBQ", "Carolina Mustard", "Spicy Chipotle", "Dry Rub Only"], default: "House BBQ" },
        { type: "Sides", options: ["Mac & Cheese (+8k)", "Grilled Corn (+6k)", "Extra Coleslaw (+5k)", "Pickles (+3k)"], default: [] }
      ]
    },
    {
      id: 5,
      name: "Tonkotsu Ramen",
      description: "Rich pork bone broth with chashu, soft egg, nori, and fresh noodles",
      price: 95000,
      image: "/lovable-uploads/c249dca9-bfb0-49e1-89cc-41abfb0c64ad.png",
      kitchen: "Ramen Master Koji",
      customizations: [
        { type: "Broth Richness", options: ["Light", "Regular", "Extra Rich"], default: "Regular" },
        { type: "Noodle Firmness", options: ["Soft", "Regular", "Firm"], default: "Regular" },
        { type: "Toppings", options: ["Extra Chashu (+12k)", "Soft Egg (+8k)", "Bamboo Shoots (+5k)", "Corn (+3k)", "Nori Sheet (+2k)"], default: [] }
      ]
    },
    {
      id: 6,
      name: "Dragon Bowl",
      description: "Quinoa, roasted vegetables, avocado, hemp seeds, and tahini dressing",
      price: 68000,
      image: "/lovable-uploads/3150407f-e53f-49d6-afbe-64288de5aeaa.png",
      kitchen: "Farm to Bowl",
      customizations: [
        { type: "Base", options: ["Quinoa", "Brown Rice (+0)", "Mixed Greens (+0)", "Cauliflower Rice (+3k)"], default: "Quinoa" },
        { type: "Protein", options: ["No Protein", "Grilled Tempeh (+8k)", "Chickpeas (+5k)", "Tofu (+6k)"], default: "No Protein" },
        { type: "Extras", options: ["Extra Avocado (+8k)", "Nuts & Seeds (+5k)", "Nutritional Yeast (+3k)"], default: [] }
      ]
    },
    {
      id: 7,
      name: "Fish Tacos Tropicales",
      description: "Grilled mahi-mahi with mango salsa, cabbage slaw, and chipotle mayo",
      price: 78000,
      image: "/lovable-uploads/bd3a71c1-e62b-465c-9acc-74398d478797.png",
      kitchen: "Taco Libre",
      customizations: [
        { type: "Quantity", options: ["2 Tacos", "3 Tacos (+12k)", "4 Tacos (+20k)"], default: "2 Tacos" },
        { type: "Protein", options: ["Grilled Fish", "Carnitas (+5k)", "Vegetarian (-5k)", "Shrimp (+8k)"], default: "Grilled Fish" },
        { type: "Sides", options: ["Elote (+8k)", "Guacamole (+6k)", "Churros (+12k)"], default: [] }
      ]
    },
    {
      id: 8,
      name: "Coq au Vin Moderne",
      description: "Braised chicken in red wine with pearl onions, mushrooms, and herbs",
      price: 125000,
      image: "/lovable-uploads/ac54db01-aed6-4579-9a66-5ea3579c5cb2.png",
      kitchen: "Le Petit Bistro",
      customizations: [
        { type: "Wine Choice", options: ["Burgundy Style", "Local Red Wine", "White Wine Version (+8k)"], default: "Burgundy Style" },
        { type: "Side Dish", options: ["Garlic Mashed Potato", "Ratatouille (+5k)", "French Bread (+3k)"], default: "Garlic Mashed Potato" },
        { type: "Portion", options: ["Regular", "Large (+15k)"], default: "Regular" }
      ]
    }
  ];

  const handleItemSelect = (item: any) => {
    setSelectedItem(item);
    setCurrentStep('customize');
    setCustomizations({
      "Spice Level": item.customizations?.find((c: any) => c.type === "Spice Level")?.default || "",
      "Protein": item.customizations?.find((c: any) => c.type === "Protein")?.default || "",
      "Size": item.customizations?.find((c: any) => c.type === "Size")?.default || "",
      "Crust": item.customizations?.find((c: any) => c.type === "Crust")?.default || "",
      "Add-ons": [],
      "Extra Toppings": []
    });
    track('order_item_select', { item_name: item.name, kitchen: item.kitchen });
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...selectedItem,
      customizations: { ...customizations },
      quantity: 1,
      cartId: Date.now()
    };
    setCartItems([...cartItems, cartItem]);
    setCurrentStep('cart');
    track('order_add_to_cart', { item_name: selectedItem.name });
  };

  const handleProceedToPayment = () => {
    setCurrentStep('payment');
    track('order_proceed_payment', { items: cartItems.length, total: getTotalPrice() });
  };

  const handlePaymentDemo = () => {
    setCurrentStep('confirmation');
    track('order_payment_demo', { total: getTotalPrice() });
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-charcoal-dark mb-3">Order Flow Simulation</h2>
        <p className="text-charcoal-medium max-w-2xl mx-auto">
          Experience our streamlined ordering process from selection to payment. 
          All transactions are simulated for demo purposes.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 bg-pure-white rounded-full p-2 border border-cream-medium">
          {['menu', 'customize', 'cart', 'payment', 'confirmation'].map((step, index) => (
            <div
              key={step}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentStep === step 
                  ? 'bg-burgundy-primary text-pure-white' 
                  : index < ['menu', 'customize', 'cart', 'payment', 'confirmation'].indexOf(currentStep)
                  ? 'bg-green-100 text-green-700'
                  : 'bg-cream-light text-charcoal-medium'
              }`}
            >
              {step.charAt(0).toUpperCase() + step.slice(1)}
            </div>
          ))}
        </div>
      </div>

      {/* Content based on current step */}
      <div className="min-h-[400px]">
        {currentStep === 'menu' && (
          <div className="grid md:grid-cols-2 gap-6">
            {demoMenuItems.map((item) => (
              <Card 
                key={item.id}
                className="bg-pure-white/80 backdrop-blur border border-cream-medium cursor-pointer hover:border-burgundy-primary/30"
                onClick={() => handleItemSelect(item)}
              >
                <CardContent className="p-4">
                  <div className="aspect-video bg-gradient-to-br from-cream-light to-cream-medium rounded-lg mb-4 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <h3 className="font-semibold text-charcoal-dark mb-2">{item.name}</h3>
                  <p className="text-sm text-charcoal-medium mb-3">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-burgundy-primary">{formatPrice(item.price)}</span>
                    <Badge variant="outline">{item.kitchen}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {currentStep === 'customize' && selectedItem && (
          <Card className="max-w-2xl mx-auto bg-pure-white/80 backdrop-blur">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-charcoal-dark mb-4">
                Customize Your {selectedItem.name}
              </h3>
              
              {selectedItem.customizations?.map((customization: any) => (
                <div key={customization.type} className="mb-6">
                  <h4 className="font-medium text-charcoal-dark mb-3">{customization.type}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {customization.options.map((option: string) => (
                      <Button
                        key={option}
                        variant={customizations[customization.type] === option ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (customization.type === "Add-ons" || customization.type === "Extra Toppings") {
                            const current = customizations[customization.type] || [];
                            setCustomizations({
                              ...customizations,
                              [customization.type]: current.includes(option)
                                ? current.filter((item: string) => item !== option)
                                : [...current, option]
                            });
                          } else {
                            setCustomizations({
                              ...customizations,
                              [customization.type]: option
                            });
                          }
                        }}
                        className="text-xs justify-start"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4 border-t border-cream-medium">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('menu')}
                >
                  Back to Menu
                </Button>
                <Button 
                  onClick={handleAddToCart}
                  className="bg-burgundy-primary hover:bg-burgundy-dark text-pure-white"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart - {formatPrice(selectedItem.price)}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'cart' && (
          <Card className="max-w-2xl mx-auto bg-pure-white/80 backdrop-blur">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-charcoal-dark mb-4">
                Your Order ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
              </h3>
              
              {cartItems.map((item) => (
                <div key={item.cartId} className="flex justify-between items-start p-4 border border-cream-medium rounded-lg mb-4">
                  <div>
                    <h4 className="font-medium text-charcoal-dark">{item.name}</h4>
                    <p className="text-sm text-charcoal-medium">{item.kitchen}</p>
                    <div className="text-xs text-charcoal-medium mt-1">
                       {Object.entries(item.customizations as Record<string, string | string[]>).map(([key, raw]) => {
                         const value = raw as string | string[];
                         if (!value) return null;
                         const isArray = Array.isArray(value);
                         if (isArray && (value as string[]).length === 0) return null;
                         return (
                           <span key={key} className="mr-2">
                             {key}: {isArray ? (value as string[]).join(', ') : String(value)}
                           </span>
                         );
                       })}
                     </div>
                  </div>
                  <span className="font-bold text-burgundy-primary">{formatPrice(item.price)}</span>
                </div>
              ))}
              
              <div className="border-t border-cream-medium pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-burgundy-primary">{formatPrice(getTotalPrice())}</span>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep('menu')}
                    className="flex-1"
                  >
                    Add More Items
                  </Button>
                  <Button 
                    onClick={handleProceedToPayment}
                    className="flex-1 bg-burgundy-primary hover:bg-burgundy-dark text-pure-white"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'payment' && (
          <Card className="max-w-md mx-auto bg-pure-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-burgundy-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-burgundy-primary" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-dark mb-2">Payment Demo</h3>
              <p className="text-charcoal-medium mb-4">
                This is a payment simulation. No real transactions will be processed.
              </p>
              <div className="bg-cream-light rounded-lg p-4 mb-6">
                <div className="text-sm text-charcoal-medium mb-2">Order Total:</div>
                <div className="text-2xl font-bold text-burgundy-primary">{formatPrice(getTotalPrice())}</div>
              </div>
              <Button 
                onClick={handlePaymentDemo}
                className="w-full bg-burgundy-primary hover:bg-burgundy-dark text-pure-white"
              >
                Simulate Payment Processing
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 'confirmation' && (
          <Card className="max-w-md mx-auto bg-pure-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-dark mb-2">Order Confirmed!</h3>
              <p className="text-charcoal-medium mb-4">
                Demo order #ODE{Date.now().toString().slice(-6)} has been placed successfully.
              </p>
              <div className="bg-cream-light rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-sm text-charcoal-medium mb-2">
                  <Clock className="w-4 h-4" />
                  Estimated Preparation Time
                </div>
                <div className="text-lg font-bold text-burgundy-primary">15-20 minutes</div>
              </div>
              <Button 
                onClick={() => {
                  setCurrentStep('menu');
                  setCartItems([]);
                  setSelectedItem(null);
                }}
                className="w-full bg-burgundy-primary hover:bg-burgundy-dark text-pure-white"
              >
                Start New Order
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DemoOrderFlow;