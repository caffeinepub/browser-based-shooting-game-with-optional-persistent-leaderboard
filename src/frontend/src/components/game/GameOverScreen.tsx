import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { SubmitScoreCTA } from '../leaderboard/SubmitScoreCTA';
import { LeaderboardPanel } from '../leaderboard/LeaderboardPanel';

interface GameOverScreenProps {
  score: number;
  wave: number;
  onRestart: () => void;
}

export function GameOverScreen({ score, wave, onRestart }: GameOverScreenProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm z-50 overflow-y-auto p-4">
      <div className="w-full max-w-4xl space-y-6 my-8">
        <Card className="border-accent/50 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Trophy className="w-16 h-16 text-accent" />
            </div>
            <CardTitle className="text-4xl font-bold">Game Over</CardTitle>
            <CardDescription className="text-lg">
              You survived {wave} wave{wave !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Final Score</p>
                <Badge variant="default" className="text-3xl font-bold px-6 py-3">
                  {score}
                </Badge>
              </div>
            </div>

            <SubmitScoreCTA score={score} />

            <Button onClick={onRestart} size="lg" className="w-full font-semibold">
              Play Again
            </Button>
          </CardContent>
        </Card>

        <LeaderboardPanel />
      </div>
    </div>
  );
}
