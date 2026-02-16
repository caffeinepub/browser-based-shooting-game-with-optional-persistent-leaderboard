import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pause } from 'lucide-react';

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
}

export function PauseOverlay({ onResume, onRestart }: PauseOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-40">
      <Card className="w-full max-w-md border-accent/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Pause className="w-12 h-12 text-accent" />
          </div>
          <CardTitle className="text-3xl font-bold">Paused</CardTitle>
          <CardDescription>Take a break, the battle can wait</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={onResume} size="lg" className="w-full font-semibold">
            Resume Game
          </Button>
          <Button onClick={onRestart} variant="outline" size="lg" className="w-full">
            Restart
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
