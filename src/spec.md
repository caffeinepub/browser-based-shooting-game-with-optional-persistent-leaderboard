# Specification

## Summary
**Goal:** Deliver a playable 2D browser-based shooting game with a complete game loop and an optional persistent Top 10 leaderboard for authenticated users.

**Planned changes:**
- Build a 2D shooting game in the React frontend with start/play/pause/game over/restart flow.
- Implement player movement and shooting, enemy spawning/movement, collision detection, lives/health, scoring, and difficulty scaling over time.
- Add a HUD showing score, lives/health, and difficulty/wave plus clear on-screen control instructions; include a pause overlay with Resume.
- Add generated static image assets (player, enemy, bullet, background) under `frontend/public/assets/generated` and render them in-game.
- Implement a Motoko canister leaderboard API (`submitScore(score : Nat)`, `getTopScores(limit : Nat)`) with stable persistence and per-principal best-score logic.
- Integrate Internet Identity: allow signed-in users to submit score at game over; show a public Top 10 leaderboard in the UI using React Query with loading/error states.
- Apply a consistent Tailwind-based visual theme across all screens, avoiding blue/purple as the primary palette.

**User-visible outcome:** Users can play a complete 2D shooting game in the browser with clear HUD/instructions and pause/restart, and (when signed in) submit their final score to a persistent backend leaderboard and view the public Top 10.
