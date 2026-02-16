import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ScoreEntry } from '../backend';

export function useTopScores(limit: number = 10) {
  const { actor, isFetching } = useActor();

  return useQuery<ScoreEntry[]>({
    queryKey: ['topScores', limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopScores(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (score: number) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.submitScore(BigInt(score));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topScores'] });
    },
  });
}
