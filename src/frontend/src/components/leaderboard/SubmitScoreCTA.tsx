import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, LogIn, CheckCircle2 } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useSubmitScore } from '../../hooks/useQueries';
import { useState } from 'react';

interface SubmitScoreCTAProps {
  score: number;
}

export function SubmitScoreCTA({ score }: SubmitScoreCTAProps) {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const submitScore = useSubmitScore();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = () => {
    submitScore.mutate(score, {
      onSuccess: () => {
        setHasSubmitted(true);
      },
    });
  };

  if (!identity) {
    return (
      <Alert className="border-accent/50">
        <LogIn className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Sign in to submit your score to the leaderboard</span>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="sm"
            variant="outline"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (hasSubmitted) {
    return (
      <Alert className="border-accent/50 bg-accent/10">
        <CheckCircle2 className="h-4 w-4 text-accent" />
        <AlertDescription>
          Score submitted successfully! Check the leaderboard below.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Button
      onClick={handleSubmit}
      disabled={submitScore.isPending}
      size="lg"
      variant="outline"
      className="w-full"
    >
      {submitScore.isPending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          <Upload className="mr-2 h-5 w-5" />
          Submit Score to Leaderboard
        </>
      )}
    </Button>
  );
}
