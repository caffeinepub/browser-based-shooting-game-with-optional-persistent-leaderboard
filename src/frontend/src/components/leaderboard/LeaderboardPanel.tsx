import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy, Loader2 } from 'lucide-react';
import { useTopScores } from '../../hooks/useQueries';

export function LeaderboardPanel() {
  const { data: scores, isLoading, isError } = useTopScores(10);

  return (
    <Card className="border-accent/50 shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-accent" />
          <CardTitle className="text-2xl">Top Pilots</CardTitle>
        </div>
        <CardDescription>The best scores from across the galaxy</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        )}

        {isError && (
          <div className="text-center py-8 text-muted-foreground">
            Failed to load leaderboard. Please try again later.
          </div>
        )}

        {!isLoading && !isError && scores && scores.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No scores yet. Be the first to make the leaderboard!
          </div>
        )}

        {!isLoading && !isError && scores && scores.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Pilot</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((entry, index) => (
                <TableRow key={entry.principal.toString()}>
                  <TableCell>
                    <Badge
                      variant={index === 0 ? 'default' : 'secondary'}
                      className="font-bold"
                    >
                      #{index + 1}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm truncate max-w-xs">
                    {entry.principal.toString().slice(0, 20)}...
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {entry.score.toString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
