import { GameShell } from './components/game/GameShell';

export default function App() {
  return (
    <div className="min-h-screen">
      <GameShell />
      <footer className="fixed bottom-4 left-0 right-0 text-center text-sm text-muted-foreground">
        Built with ❤️ using{' '}
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
            typeof window !== 'undefined' ? window.location.hostname : 'space-shooter'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
