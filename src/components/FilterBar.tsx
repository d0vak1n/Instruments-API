import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const FilterBar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: FilterBarProps) => {
  return (
    <div className='flex flex-col sm:flex-row gap-4 w-full max-w-4xl mx-auto'>
      <div className='relative flex-1'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search instruments...'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className='pl-10 bg-background/80 backdrop-blur-sm border-border/50'
        />
      </div>

      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className='w-full sm:w-[200px] bg-background/80 backdrop-blur-sm border-border/50'>
          <SelectValue placeholder='All Categories' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
