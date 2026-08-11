# 🎵 RP Vibe Music (Spotify) — SillyTavern Extension

An adaptive soundtrack for your roleplay. The extension watches the scene, asks your
connected LLM what the current atmosphere is, finds a matching track on Spotify by
itself, plays it on your Spotify device, and shows a **"Now playing" info block right
inside the chat** — with album art, mood label, and playback controls.

## Features

- 🧠 **Automatic mood detection** — every N character messages the extension analyzes
  the recent scene and produces a mood + a Spotify search query (e.g.
  `dark ambient tension drone` or `epic orchestral battle choir`). Three engines:
  - **LLM with keyword fallback** (default) — asks your connected LLM with a tiny raw
    prompt; if the API fails or times out, falls back to the built-in keyword engine.
  - **LLM only** — no fallback.
  - **Keywords only** — fully offline mood detection (English + Russian keywords),
    zero LLM calls. Use this if your API is slow or rate-limited.
- 🎶 **Self-directed music search** — the extension searches Spotify and starts playback
  on your active device. Results are ranked by popularity (well-known tracks and official
  OSTs win; karaoke/tribute covers are penalized). If the vibe hasn't changed, the
  current track keeps playing.
- 🏰 **Fandom awareness** — if the RP is set in a known franchise (Genshin Impact,
  Harry Potter, Naruto, The Witcher, Cyberpunk 2077, and more), the extension plays that
  franchise's official soundtrack/themes instead of generic mood music. Detected both by
  the LLM and by the offline keyword engine (character card + scene, RU + EN).
- 🎸 **Music style setting** — Auto (famous songs when they fit), Modern popular
  (rock / rap / metal / pop with vocals), or Instrumental / soundtrack only.
- 💬 **In-chat info block** — a compact card appears inside the latest character message:
  album art, mood ("♪ tense — the duel is starting"), track, artist, and buttons:
  play/pause ▸ another track for this vibe ▸ re-analyze the scene.
- ⌨️ **`/vibe` slash command** — `/vibe` re-analyzes the scene immediately;
  `/vibe cozy lo-fi rain` forces a manual vibe.
- ⚙️ Configurable: auto mode on/off, analysis frequency, instrumental preference,
  keep or move old music blocks.

- 🎧 **Characters hear the music** — the currently playing track (name, artist, mood)
  is injected into the prompt, so characters can naturally react to the soundtrack of
  the scene. Template and injection depth are configurable; off with one checkbox.
- ❤️ **Like & auto-playlist** — a heart button on the in-chat block saves the track to
  your Liked Songs, and every played track is automatically collected into a private
  **"RP Vibe Music"** playlist in your Spotify — the permanent soundtrack of your roleplay.
- 🔊 **Scene-aware volume** — a volume slider right on the in-chat block, plus auto
  volume driven by the scene energy the LLM reports: battles get louder, cozy and
  sentimental scenes get quieter.
- 🚫 **Ban list** — a ban button on the block: never hear that track again (the search
  filters it out permanently; clear the list in settings).
- 🎚️ **Soft switch** (optional) — when the vibe changes, let the current track finish
  and start the new one via the Spotify queue instead of cutting it off mid-note.
- 🌍 **English / Русский интерфейс** — the whole UI (settings panel, statuses,
  in-chat block, mood labels) is available in English and Russian. Default is
  **Auto** (follows your SillyTavern language); switch manually via the
  "Language / Язык" dropdown at the top of the settings panel. The LLM mood
  labels in the chat block are also written in the selected language.

## Installation

1. In SillyTavern open **Extensions → Install extension**.
2. Paste this repository URL and install:
   ```
   https://github.com/zhungliwife-del/SjsisjskdkxkxkzbzjzksbzjsoskanN
   ```

## Spotify setup (one time, ~2 minutes)

1. Go to <https://developer.spotify.com/dashboard> and **Create app**.
   - App name / description: anything.
   - **Redirect URI**: the exact address you open SillyTavern with, e.g.
     `http://127.0.0.1:8000/`
     (Spotify no longer accepts `localhost` — use `127.0.0.1`. The trailing slash matters.)
   - Check the **Web API** checkbox and save.
2. Copy the app's **Client ID**.
3. In SillyTavern: **Extensions → 🎵 RP Vibe Music (Spotify)** → paste the Client ID,
   verify the Redirect URI field matches step 1, press **Connect Spotify** and approve.
4. Open Spotify on any device (desktop, phone, web player) so there is an active device.
5. Roleplay. The music follows.

## Updating from v1.3 or older

The like/playlist features need extra Spotify permissions. After updating, press
**Connect Spotify** once more to re-authorize — everything else keeps working as before.

## Notes & limitations

- **Starting/pausing playback requires Spotify Premium** (Spotify API limitation).
  Without Premium the info block still appears — tap the track title to open it in Spotify.
- Mood analysis uses your currently connected LLM via a quiet prompt, so each analysis
  costs one small generation. Tune "Analyze every N character messages" to taste.
- The Spotify refresh token is stored in your SillyTavern user settings on your machine.
- If playback fails with "No active Spotify device", just open Spotify anywhere and hit ▶
  on the in-chat block.

## Files

- `manifest.json` — extension manifest
- `index.js` — mood engine, Spotify PKCE auth + Web API client, in-chat block UI
- `style.css` — styling for the info block and settings panel
