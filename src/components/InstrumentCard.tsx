import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music } from "lucide-react";

interface InstrumentCardProps {
  name: string;
  category: string;
  family?: string;
  description?: string;
  origin?: string;
  range_description?: string;
  difficulty_level?: string;
  image_url?: string;
}

export const InstrumentCard = ({
  name,
  category,
  family,
  description,
  origin,
  range_description,
  difficulty_level,
  image_url,
}: InstrumentCardProps) => {
  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Advanced":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "Professional":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <Card className='group h-full transition-all duration-300 hover:shadow-[var(--shadow-glow)] hover:-translate-y-1 border-border/50 backdrop-blur-sm bg-card/50 overflow-hidden'>
      {image_url && (
        <div className='w-full h-48 bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center p-6 overflow-hidden'>
          <img
            src={image_url}
            alt={`${name} instrument`}
            className='w-full h-full object-contain transition-transform duration-300 group-hover:scale-105'
            loading='lazy'
          />
        </div>
      )}
      <CardHeader>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex items-center gap-3'>
            <div className='p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-glow/80 shadow-lg'>
              <Music className='h-5 w-5 text-primary-foreground' />
            </div>
            <div>
              <CardTitle className='text-xl group-hover:text-primary transition-colors'>
                {name}
              </CardTitle>
              <CardDescription className='text-xs mt-1'>
                {family || category}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex flex-wrap gap-2'>
          <Badge variant='secondary' className='text-xs font-medium'>
            {category}
          </Badge>
          {difficulty_level && (
            <Badge
              className={`text-xs font-medium border ${getDifficultyColor(
                difficulty_level
              )}`}
            >
              {difficulty_level}
            </Badge>
          )}
        </div>

        {description && (
          <p className='text-sm text-muted-foreground leading-relaxed line-clamp-3'>
            {description}
          </p>
        )}

        {(origin || range_description) && (
          <div className='pt-2 space-y-1.5 text-xs text-muted-foreground border-t border-border/50'>
            {origin && (
              <div className='flex items-center gap-2'>
                <span className='font-semibold text-foreground'>Origin:</span>
                <span>{origin}</span>
              </div>
            )}
            {range_description && range_description !== "N/A" && (
              <div className='flex items-center gap-2'>
                <span className='font-semibold text-foreground'>Range:</span>
                <span className='font-mono'>{range_description}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
