import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InstrumentCard } from "@/components/InstrumentCard";
import { FilterBar } from "@/components/FilterBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Music2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Instrument {
  id: string;
  name: string;
  category: string;
  family?: string;
  description?: string;
  origin?: string;
  range_description?: string;
  difficulty_level?: string;
  image_url?: string;
}

const Index = () => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [filteredInstruments, setFilteredInstruments] = useState<Instrument[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInstruments();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterInstruments();
  }, [instruments, selectedCategory, searchQuery]);

  const fetchInstruments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("instruments")
        .select("*")
        .order("name");

      if (error) throw error;

      setInstruments(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading instruments",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("instruments")
        .select("category");

      if (error) throw error;

      const uniqueCategories = [...new Set(data?.map((item) => item.category))].sort();
      setCategories(uniqueCategories);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
    }
  };

  const filterInstruments = () => {
    let filtered = instruments;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((inst) => inst.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inst) =>
          inst.name.toLowerCase().includes(query) ||
          inst.description?.toLowerCase().includes(query) ||
          inst.family?.toLowerCase().includes(query) ||
          inst.origin?.toLowerCase().includes(query)
      );
    }

    setFilteredInstruments(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-10"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20">
              <Music2 className="h-6 w-6 text-primary" />
              <span className="text-sm font-semibold text-primary">Instruments API</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Musical Instruments Database
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore {instruments.length}+ instruments from around the world. Complete API with detailed information about each instrument.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <div className="px-6 py-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="text-2xl font-bold text-primary">{categories.length}</div>
                <div className="text-xs text-muted-foreground">Categories</div>
              </div>
              <div className="px-6 py-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="text-2xl font-bold text-primary">{instruments.length}</div>
                <div className="text-xs text-muted-foreground">Instruments</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-8">
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredInstruments.length === 0 ? (
          <div className="text-center py-20">
            <Music2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-xl text-muted-foreground">No instruments found</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredInstruments.length} instrument{filteredInstruments.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstruments.map((instrument) => (
                <InstrumentCard key={instrument.id} {...instrument} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* API Info Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-[var(--gradient-primary)]">
              API Endpoints
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <code className="text-primary font-mono">GET /instruments-api</code>
                <p className="text-muted-foreground mt-2">Get all instruments with optional filters</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <code className="text-primary font-mono">GET /instruments-api/:id</code>
                <p className="text-muted-foreground mt-2">Get a specific instrument by ID</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <code className="text-primary font-mono">GET /instruments-api/categories</code>
                <p className="text-muted-foreground mt-2">Get all instrument categories</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <code className="text-primary font-mono">GET /instruments-api/stats</code>
                <p className="text-muted-foreground mt-2">Get database statistics</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;