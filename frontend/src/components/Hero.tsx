import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Recycle, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Shop Local, Shop Sustainable</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Discover Local
            <span className="block text-primary">Sustainable Treasures</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Connect with local sellers offering organic, handmade, and recycled products. 
            Make a difference with every purchase.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button 
              size="lg" 
              className="text-lg gap-2 group"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Shopping
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg"
              onClick={() => navigate('/become-seller')}
            >
              Become a Seller
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">100% Organic</p>
                <p className="text-sm text-muted-foreground">Certified products</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Recycle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Zero Waste</p>
                <p className="text-sm text-muted-foreground">Eco-friendly packaging</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Community</p>
                <p className="text-sm text-muted-foreground">Support local makers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;