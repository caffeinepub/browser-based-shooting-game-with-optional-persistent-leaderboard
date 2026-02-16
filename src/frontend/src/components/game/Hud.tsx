import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface HudProps {
  score: number;
  health: number;
  maxHealth: number;
  wave: number;
}

export function Hud({ score, health, maxHealth, wave }: HudProps) {
  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
      <Card className="bg-card/90 backdrop-blur-sm border-accent/50 p-4 shadow-lg">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Score</span>
            <Badge variant="default" className="text-lg font-bold px-3 py-1">
              {score}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Wave</span>
            <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
              {wave}
            </Badge>
          </div>
        </div>
      </Card>

      <Card className="bg-card/90 backdrop-blur-sm border-accent/50 p-4 shadow-lg">
        <div className="flex items-center gap-2">
          {Array.from({ length: maxHealth }).map((_, i) => (
            <Heart
              key={i}
              className={`w-6 h-6 ${
                i < health ? 'fill-destructive text-destructive' : 'fill-muted text-muted'
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
