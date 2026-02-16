import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crosshair, Keyboard, Mouse } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm z-50">
      <Card className="w-full max-w-2xl border-accent/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Crosshair className="w-16 h-16 text-accent animate-pulse" />
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            Space Shooter
          </CardTitle>
          <CardDescription className="text-lg">
            Defend against waves of enemy drones. Survive as long as you can!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Keyboard className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Movement</h3>
                <p className="text-sm text-muted-foreground">
                  WASD or Arrow Keys to move
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Mouse className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Combat</h3>
                <p className="text-sm text-muted-foreground">
                  Mouse to aim, Click or Space to shoot
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">
              Press <kbd className="px-2 py-1 bg-background rounded border">P</kbd> or{' '}
              <kbd className="px-2 py-1 bg-background rounded border">ESC</kbd> to pause
            </p>
          </div>
          <Button onClick={onStart} size="lg" className="w-full text-lg font-bold">
            Start Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
