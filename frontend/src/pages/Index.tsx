import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { useState } from "react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navigation onSearch={setSearchQuery} />
      <Hero />
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <ProductGrid 
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
      />
      <Footer />
    </div>
  );
};

export default Index;
