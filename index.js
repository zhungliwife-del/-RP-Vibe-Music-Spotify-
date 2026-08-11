// RP Vibe Music — Spotify-powered adaptive soundtrack for SillyTavern roleplay.
// Watches the scene, asks the LLM for the current mood, finds a matching track
// on Spotify, plays it, and renders a "now playing" info block inside the chat.

const MODULE = 'rp_vibe_music';
const LOG = '[RP Vibe Music]';
const STATE_KEY = 'rvm_oauth_state';
const VERIFIER_KEY = 'rvm_pkce_verifier';
const SCOPES = 'user-read-playback-state user-modify-playback-state user-read-currently-playing user-library-read user-library-modify playlist-read-private playlist-modify-private playlist-modify-public';
const INJECT_ID = 'rp_vibe_music_now_playing';

const defaultSettings = {
    language: 'auto', // 'auto' (follow SillyTavern locale) | 'en' | 'ru'
    enabled: true,
    autoMode: true,
    inlineBlock: true,
    keepOldBlocks: false,
    preferInstrumental: true, // legacy, superseded by musicStyle
    musicStyle: 'auto', // 'auto' | 'modern' | 'soundtrack'
    freshness: 'fresh', // 'fresh' | 'balanced' | 'any'
    useFandom: true,
    moodEngine: 'auto', // 'auto' (LLM → keyword fallback) | 'llm' | 'keywords'
    messageInterval: 2,
    minSecondsBetween: 45,
    injectEnabled: true,
    injectDepth: 1,
    injectTemplate: '',
    autoPlaylist: true,
    playlistId: '',
    playlistUris: [],
    autoVolume: true,
    smoothSwitch: false,
    bannedUris: [],
    clientId: '',
    redirectUri: '',
    refreshToken: '',
};

let settings = {};
let accessToken = '';
let tokenExpiresAt = 0;
let aiMessageCounter = 0;
let lastAnalysisAt = 0;
let analyzing = false;
let isPlaying = false;
let currentTrack = null;   // { uri, name, artists, album, image, url }
let currentMood = null;    // { mood, energy, query, reason }
let searchResults = [];
let searchIndex = 0;
let currentVolume = 70;
let likedCache = {};
let recentTrackUris = [];
let recentArtists = [];
let volumeTimer = 0;
let controlBusy = false;
let scopeWarned = false;

function getCtx() {
    return SillyTavern.getContext();
}

function getSettings() {
    const ctx = getCtx();
    if (!ctx.extensionSettings[MODULE]) {
        ctx.extensionSettings[MODULE] = structuredClone(defaultSettings);
    }
    for (const key of Object.keys(defaultSettings)) {
        if (ctx.extensionSettings[MODULE][key] === undefined) {
            ctx.extensionSettings[MODULE][key] = defaultSettings[key];
        }
    }
    return ctx.extensionSettings[MODULE];
}

function save() {
    getCtx().saveSettingsDebounced();
}

function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function status(text) {
    console.log(LOG, text);
    $('#rvm_status').text(text);
}

// ------------------------------------------------------------------ i18n ---

const LANGS = {
    en: {
        // statuses
        enterClientId: 'Enter your Spotify Client ID first (developer.spotify.com → Dashboard → Create app).',
        disconnected: 'Disconnected from Spotify.',
        authStateMismatch: 'Spotify authorization failed: state mismatch. Press "Connect Spotify" again.',
        authFailed: 'Spotify authorization failed: {error}',
        authVerifier: 'Spotify authorization failed: missing PKCE verifier. Press "Connect Spotify" again.',
        authHttp: 'Spotify authorization failed (HTTP {status}). Check that the Redirect URI in your Spotify app matches exactly.',
        connectedOk: 'Connected to Spotify ✔',
        connectedShort: 'Connected to Spotify.',
        notConnected: 'Not connected.',
        sessionExpired: 'Spotify session expired — reconnect (HTTP {status})',
        searchFailed: 'Spotify search failed (HTTP {status}) for "{query}"',
        noDevice: 'No active Spotify device. Open Spotify on any device, then press ▶ here.',
        needPremium: 'Playback control requires Spotify Premium — tap the track title to open it in Spotify.',
        playbackHttp: 'Spotify playback error (HTTP {status}).',
        nowPlaying: 'Now playing: {name} — {artists}',
        nowPlayingMood: 'Now playing: {name} — {artists} ({mood})',
        connectFirst: 'Connect Spotify first (Extensions → RP Vibe Music).',
        noMessages: 'No messages to analyze yet.',
        analyzing: 'Analyzing the scene mood…',
        moodFailed: 'Mood analysis failed: {message}',
        moodParse: 'Mood analysis failed: could not parse the LLM reply.',
        noVibe: 'Could not determine a vibe from the scene.',
        emptyQuery: 'Mood query was empty after sanitizing — try /vibe with a manual query.',
        vibeUnchanged: 'Vibe unchanged ({mood}) — keeping the current track.',
        searching: 'Searching Spotify: "{query}"…',
        noTracks: 'No tracks found for "{query}".',
        error: 'Error: {message}',
        // mood engine
        reasonKeyword: 'keyword engine',
        reasonKeywordFandom: 'keyword engine · fandom',
        reasonDefault: 'keyword engine · default',
        reasonManual: 'manual override',
        moodAmbient: 'ambient',
        moodDefault: 'vibe',
        // block
        ttToggle: 'Play / Pause',
        ttNext: 'Another track for this vibe',
        ttReroll: 'Re-analyze the scene',
        // settings UI
        sTitle: '🎵 RP Vibe Music (Spotify)',
        sSectionMain: 'Main',
        sSectionMusic: 'Music choice',
        sSectionPrompt: 'Character reactions',
        sSectionSpotify: 'Spotify connection',
        sLanguage: 'Language / Язык',
        sLangAuto: 'Auto (SillyTavern language)',
        sEnabled: 'Enabled',
        sAuto: 'Auto mode — adapt music to the scene',
        sInline: 'Show "Now playing" block in chat',
        sKeep: 'Keep old music blocks in chat',
        sFandom: 'Use franchise soundtracks when detected (Genshin, Harry Potter…)',
        sStyle: 'Music style',
        sStyleAuto: 'Auto — famous songs when they fit, cinematic otherwise',
        sStyleModern: 'Modern popular — rock / rap / metal / pop with vocals',
        sStyleSoundtrack: 'Instrumental / soundtrack only',
        sFreshness: 'Track freshness',
        sFreshnessFresh: 'Fresh mix — prefer 2015+ and avoid overused classics',
        sFreshnessBalanced: 'Balanced — modern + proven tracks',
        sFreshnessAny: 'Any era — classics allowed',
        sEngine: 'Mood engine',
        sEngineAuto: 'LLM with keyword fallback (default)',
        sEngineLlm: 'LLM only',
        sEngineKeywords: 'Keywords only — no LLM calls',
        sInterval: 'Analyze every N character messages',
        sClientId: 'Spotify Client ID',
        sClientIdPh: 'from developer.spotify.com',
        sRedirect: 'Redirect URI (must match your Spotify app exactly)',
        sConnect: 'Connect Spotify',
        sDisconnect: 'Disconnect',
        sAnalyze: 'Analyze now',
        sHint: 'Playback control needs Spotify Premium. Use <code>/vibe</code> to re-analyze the scene, or <code>/vibe dark epic orchestral</code> to force a vibe.',
        slashHelp: 'Adapt Spotify music to the current RP scene. Optionally force a vibe: /vibe dark epic orchestral',
        // new features
        sInject: 'Character "hears" the music — inject now-playing into the prompt',
        sInjectDepth: 'Injection depth (messages from the end)',
        sInjectTemplate: 'Prompt injection template ({{song}}, {{artist}}, {{album}}, {{mood}})',
        injectDefault: '[Background music is playing right now: "{{song}}" by {{artist}} (mood: {{mood}}). Characters can hear it and may naturally react to it.]',
        sAutoPlaylist: 'Save played tracks to the "RP Vibe Music" playlist in Spotify',
        sAutoVolume: 'Auto volume by scene energy — battles louder, cozy scenes quieter',
        sSmooth: 'Soft switch — let the current track finish, start the new vibe via the queue',
        sBanned: 'Banned tracks: {count}',
        sBanClear: 'Clear ban list',
        banCleared: 'Ban list cleared.',
        ttLike: 'Save to Liked Songs',
        ttBan: 'Never play this track again',
        ttVolume: 'Volume',
        liked: 'Saved to Liked Songs ❤',
        unliked: 'Removed from Liked Songs.',
        bannedTrack: 'Banned: {name}. Picking another track…',
        queuedNote: 'Queued — starts after the current track.',
        queuedStatus: 'Queued next: {name} — {artists} ({mood})',
        volumeSet: 'Volume: {volume}%',
        volumeFailed: 'Could not change volume (HTTP {status}). Try an active desktop/web Spotify device.',
        needReconnect: 'The new features need extra Spotify permissions — press "Connect Spotify" once to re-authorize.',
    },
    ru: {
        // statuses
        enterClientId: 'Сначала введите Spotify Client ID (developer.spotify.com → Dashboard → Create app).',
        disconnected: 'Отключено от Spotify.',
        authStateMismatch: 'Авторизация Spotify не удалась: несовпадение state. Нажмите «Подключить Spotify» ещё раз.',
        authFailed: 'Авторизация Spotify не удалась: {error}',
        authVerifier: 'Авторизация Spotify не удалась: потерян PKCE verifier. Нажмите «Подключить Spotify» ещё раз.',
        authHttp: 'Авторизация Spotify не удалась (HTTP {status}). Проверьте, что Redirect URI в приложении Spotify совпадает точь-в-точь.',
        connectedOk: 'Подключено к Spotify ✔',
        connectedShort: 'Подключено к Spotify.',
        notConnected: 'Не подключено.',
        sessionExpired: 'Сессия Spotify истекла — переподключитесь (HTTP {status})',
        searchFailed: 'Поиск Spotify не удался (HTTP {status}) по запросу «{query}»',
        noDevice: 'Нет активного устройства Spotify. Откройте Spotify на любом устройстве и нажмите ▶ здесь.',
        needPremium: 'Для управления воспроизведением нужен Spotify Premium — нажмите на название трека, чтобы открыть его в Spotify.',
        playbackHttp: 'Ошибка воспроизведения Spotify (HTTP {status}).',
        nowPlaying: 'Сейчас играет: {name} — {artists}',
        nowPlayingMood: 'Сейчас играет: {name} — {artists} ({mood})',
        connectFirst: 'Сначала подключите Spotify (Расширения → RP Vibe Music).',
        noMessages: 'Пока нет сообщений для анализа.',
        analyzing: 'Анализирую настроение сцены…',
        moodFailed: 'Анализ настроения не удался: {message}',
        moodParse: 'Анализ настроения не удался: не получилось разобрать ответ LLM.',
        noVibe: 'Не удалось определить вайб сцены.',
        emptyQuery: 'Запрос настроения оказался пустым — попробуйте /vibe с ручным запросом.',
        vibeUnchanged: 'Вайб не изменился ({mood}) — оставляю текущий трек.',
        searching: 'Ищу в Spotify: «{query}»…',
        noTracks: 'Ничего не найдено по запросу «{query}».',
        error: 'Ошибка: {message}',
        // mood engine
        reasonKeyword: 'движок ключевых слов',
        reasonKeywordFandom: 'ключевые слова · фандом',
        reasonDefault: 'ключевые слова · по умолчанию',
        reasonManual: 'ручной запрос',
        moodAmbient: 'эмбиент',
        moodDefault: 'вайб',
        // block
        ttToggle: 'Играть / Пауза',
        ttNext: 'Другой трек под этот вайб',
        ttReroll: 'Проанализировать сцену заново',
        // settings UI
        sTitle: '🎵 RP Vibe Music (Spotify)',
        sSectionMain: 'Главное',
        sSectionMusic: 'Подбор музыки',
        sSectionPrompt: 'Реакции персонажей',
        sSectionSpotify: 'Подключение Spotify',
        sLanguage: 'Язык / Language',
        sLangAuto: 'Авто (язык SillyTavern)',
        sEnabled: 'Включено',
        sAuto: 'Авторежим — подстраивать музыку под сцену',
        sInline: 'Показывать блок «Сейчас играет» в чате',
        sKeep: 'Оставлять старые блоки музыки в чате',
        sFandom: 'Использовать саундтреки франшиз, если они узнаны (Genshin, Гарри Поттер…)',
        sStyle: 'Стиль музыки',
        sStyleAuto: 'Авто — известные песни, когда подходят, иначе кинематографичная музыка',
        sStyleModern: 'Современная популярная — рок / рэп / метал / поп с вокалом',
        sStyleSoundtrack: 'Только инструментал / саундтреки',
        sFreshness: 'Свежесть треков',
        sFreshnessFresh: 'Свежий микс — чаще 2015+ и меньше заезженной классики',
        sFreshnessBalanced: 'Баланс — современные и проверенные треки',
        sFreshnessAny: 'Любая эпоха — классика разрешена',
        sEngine: 'Движок настроения',
        sEngineAuto: 'LLM с запасным движком ключевых слов (по умолчанию)',
        sEngineLlm: 'Только LLM',
        sEngineKeywords: 'Только ключевые слова — без обращений к LLM',
        sInterval: 'Анализировать каждые N сообщений персонажа',
        sClientId: 'Spotify Client ID',
        sClientIdPh: 'с developer.spotify.com',
        sRedirect: 'Redirect URI (должен точно совпадать с приложением Spotify)',
        sConnect: 'Подключить Spotify',
        sDisconnect: 'Отключить',
        sAnalyze: 'Анализировать сейчас',
        sHint: 'Для управления воспроизведением нужен Spotify Premium. Команда <code>/vibe</code> — перечитать сцену, <code>/vibe dark epic orchestral</code> — задать вайб вручную.',
        slashHelp: 'Подстроить музыку Spotify под текущую RP-сцену. Можно задать вайб вручную: /vibe dark epic orchestral',
        // new features
        sInject: 'Персонаж «слышит» музыку — вставлять «сейчас играет» в промпт',
        sInjectDepth: 'Глубина вставки (сообщений от конца)',
        sInjectTemplate: 'Шаблон вставки в промпт ({{song}}, {{artist}}, {{album}}, {{mood}})',
        injectDefault: '[Прямо сейчас фоном играет музыка: «{{song}}» — {{artist}} (настроение: {{mood}}). Персонажи её слышат и могут естественно на неё реагировать.]',
        sAutoPlaylist: 'Сохранять сыгранные треки в плейлист «RP Vibe Music» в Spotify',
        sAutoVolume: 'Автогромкость по энергии сцены — бои громче, уютные сцены тише',
        sSmooth: 'Мягкая смена — дать треку доиграть, новый вайб через очередь',
        sBanned: 'Забанено треков: {count}',
        sBanClear: 'Очистить бан-лист',
        banCleared: 'Бан-лист очищен.',
        ttLike: 'Сохранить в «Любимые треки»',
        ttBan: 'Больше никогда не играть этот трек',
        ttVolume: 'Громкость',
        liked: 'Сохранено в «Любимые треки» ❤',
        unliked: 'Убрано из «Любимых треков».',
        bannedTrack: 'Забанен: {name}. Подбираю другой трек…',
        queuedNote: 'В очереди — начнётся после текущего трека.',
        queuedStatus: 'Следующим в очереди: {name} — {artists} ({mood})',
        volumeSet: 'Громкость: {volume}%',
        volumeFailed: 'Не удалось изменить громкость (HTTP {status}). Попробуйте активный Spotify на компьютере или в веб-плеере.',
        needReconnect: 'Новым функциям нужны дополнительные права Spotify — нажмите «Подключить Spotify» ещё раз.',
    },
};

function lang() {
    if (settings.language === 'ru' || settings.language === 'en') return settings.language;
    const locale = localStorage.getItem('language') || navigator.language || 'en';
    return String(locale).toLowerCase().startsWith('ru') ? 'ru' : 'en';
}

function t(key, vars = {}) {
    let text = LANGS[lang()]?.[key] ?? LANGS.en[key] ?? key;
    for (const [k, v] of Object.entries(vars)) {
        text = text.replaceAll(`{${k}}`, String(v));
    }
    return text;
}

// ------------------------------------------------------------------ auth ---

function defaultRedirectUri() {
    return `${window.location.origin}${window.location.pathname}`;
}

function randomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(values, v => chars[v % chars.length]).join('');
}

async function sha256base64url(input) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function connectSpotify() {
    if (!settings.clientId) {
        status(t('enterClientId'));
        return;
    }
    const verifier = randomString(64);
    localStorage.setItem(VERIFIER_KEY, verifier);
    const state = `rvm_${randomString(24)}`;
    localStorage.setItem(STATE_KEY, state);
    const challenge = await sha256base64url(verifier);
    const params = new URLSearchParams({
        client_id: settings.clientId,
        response_type: 'code',
        redirect_uri: settings.redirectUri || defaultRedirectUri(),
        scope: SCOPES,
        code_challenge_method: 'S256',
        code_challenge: challenge,
        state,
    });
    window.location.assign(`https://accounts.spotify.com/authorize?${params}`);
}

function disconnectSpotify() {
    settings.refreshToken = '';
    accessToken = '';
    tokenExpiresAt = 0;
    save();
    updateConnectionUi();
    status(t('disconnected'));
}

async function handleAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const returnedState = params.get('state') || '';
    if (!returnedState.startsWith('rvm_')) return; // not our callback
    const expectedState = localStorage.getItem(STATE_KEY);
    localStorage.removeItem(STATE_KEY);
    const code = params.get('code');
    const error = params.get('error');
    window.history.replaceState({}, document.title, window.location.pathname);
    if (!expectedState || returnedState !== expectedState) {
        status(t('authStateMismatch'));
        return;
    }
    if (error) {
        status(t('authFailed', { error }));
        return;
    }
    if (!code) return;
    const verifier = localStorage.getItem(VERIFIER_KEY);
    if (!verifier) {
        status(t('authVerifier'));
        return;
    }
    try {
        const body = new URLSearchParams({
            client_id: settings.clientId,
            grant_type: 'authorization_code',
            code,
            redirect_uri: settings.redirectUri || defaultRedirectUri(),
            code_verifier: verifier,
        });
        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body,
        });
        if (!res.ok) {
            status(t('authHttp', { status: res.status }));
            return;
        }
        const data = await res.json();
        accessToken = data.access_token;
        tokenExpiresAt = Date.now() + data.expires_in * 1000;
        settings.refreshToken = data.refresh_token;
        save();
        localStorage.removeItem(VERIFIER_KEY);
        updateConnectionUi();
        status(t('connectedOk'));
    } catch (err) {
        console.error(LOG, err);
        status(t('authFailed', { error: err.message }));
    }
}

async function ensureToken() {
    if (accessToken && Date.now() < tokenExpiresAt - 10_000) return accessToken;
    if (!settings.refreshToken) throw new Error('Not connected to Spotify');
    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: settings.refreshToken,
        client_id: settings.clientId,
    });
    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    });
    if (!res.ok) {
        if (res.status === 400 || res.status === 401) {
            settings.refreshToken = '';
            save();
            updateConnectionUi();
        }
        throw new Error(t('sessionExpired', { status: res.status }));
    }
    const data = await res.json();
    accessToken = data.access_token;
    tokenExpiresAt = Date.now() + data.expires_in * 1000;
    if (data.refresh_token) {
        settings.refreshToken = data.refresh_token;
        save();
    }
    return accessToken;
}

async function api(path, options = {}) {
    const token = await ensureToken();
    return fetch(`https://api.spotify.com/v1${path}`, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });
}

// --------------------------------------------------------------- spotify ---

// Spotify's search endpoint returns HTTP 400 on unbalanced quotes and broken
// field-filter syntax ("artist:", "year:"), which LLMs love to produce.
function sanitizeQuery(query) {
    return String(query || '')
        .replace(/["'«»“”{}\[\]:;`~|\\]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 100);
}

function normalizeTrack(t) {
    if (!t?.uri || t.type !== 'track') return null;
    const releaseDate = t.album?.release_date || '';
    return {
        uri: t.uri,
        name: t.name,
        artists: (t.artists || []).map(a => a.name).join(', '),
        album: t.album?.name || '',
        image: t.album?.images?.[1]?.url || t.album?.images?.[0]?.url || '',
        url: t.external_urls?.spotify || '',
        popularity: Number(t.popularity) || 0,
        releaseDate,
        year: Number(String(releaseDate).slice(0, 4)) || 0,
    };
}

function isBanned(track) {
    return (settings.bannedUris || []).includes(track?.uri);
}

function buildSearchQueries(query) {
    const base = sanitizeQuery(query);
    const queries = [];
    const currentYear = new Date().getFullYear();
    const fresh = (settings.freshness || 'fresh') === 'fresh' && settings.musicStyle !== 'soundtrack';
    if (fresh) {
        queries.push(`${base} year:2015-${currentYear}`);
        queries.push(`${base} modern 2020s`);
    }
    if (settings.musicStyle === 'modern') {
        queries.push(`${base} modern popular`);
    }
    queries.push(base);
    return [...new Set(queries.map(q => q.trim()).filter(Boolean))];
}

async function searchTracks(query) {
    const tracks = [];
    const seen = new Set();
    let lastStatus = 0;
    // Dev-mode apps are capped at limit=10 since Spotify's Feb 2026 API changes.
    for (const q of buildSearchQueries(query)) {
        const res = await api(`/search?type=track&limit=10&q=${encodeURIComponent(q)}`);
        if (!res.ok) {
            lastStatus = res.status;
            continue;
        }
        const data = await res.json();
        for (const item of data.tracks?.items || []) {
            const track = normalizeTrack(item);
            if (!track || isBanned(track) || seen.has(track.uri)) continue;
            seen.add(track.uri);
            tracks.push(track);
        }
    }
    if (!tracks.length && lastStatus) throw new Error(t('searchFailed', { status: lastStatus, query }));
    return rankTracks(tracks);
}

// Rank with a bias toward fresher tracks and recent variety. Popularity still matters,
// but it no longer blindly promotes the same old legacy hits every time.
const JUNK_RE = /karaoke|tribute|8[- ]?bit|lullab|music box|kids|parody|made famous|in the style of|караоке/i;
function trackScore(track) {
    const text = `${track.name} ${track.artists} ${track.album}`;
    let score = track.popularity;
    if (JUNK_RE.test(text)) score -= 80;
    if (settings.musicStyle !== 'soundtrack') {
        const freshness = settings.freshness || 'fresh';
        if (freshness === 'fresh') {
            if (track.year >= 2020) score += 35;
            else if (track.year >= 2015) score += 22;
            else if (track.year >= 2010) score += 6;
            else if (track.year > 0) score -= 45;
        } else if (freshness === 'balanced') {
            if (track.year >= 2015) score += 12;
            else if (track.year > 0 && track.year < 2005) score -= 18;
        }
    }
    if (recentTrackUris.includes(track.uri)) score -= 90;
    const artists = String(track.artists || '').toLowerCase();
    for (const artist of recentArtists) {
        if (artist && artists.includes(artist)) score -= 25;
    }
    return score + Math.random() * 4;
}

function rankTracks(tracks) {
    return [...tracks].sort((a, b) => trackScore(b) - trackScore(a));
}

function rememberTrack(track) {
    if (!track?.uri) return;
    recentTrackUris = [track.uri, ...recentTrackUris.filter(uri => uri !== track.uri)].slice(0, 12);
    const firstArtist = String(track.artists || '').split(',')[0].trim().toLowerCase();
    if (firstArtist) {
        recentArtists = [firstArtist, ...recentArtists.filter(x => x !== firstArtist)].slice(0, 6);
    }
}

async function playTrack(track) {
    let res = await api('/me/player/play', { method: 'PUT', body: JSON.stringify({ uris: [track.uri] }) });
    if (res.status === 404) {
        // No active device — try to grab any available one.
        const devRes = await api('/me/player/devices');
        const devices = devRes.ok ? (await devRes.json()).devices || [] : [];
        const device = devices.find(d => !d.is_restricted);
        if (!device) {
            isPlaying = false;
            return { ok: false, note: t('noDevice') };
        }
        res = await api(`/me/player/play?device_id=${encodeURIComponent(device.id)}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [track.uri] }),
        });
    }
    if (res.status === 403) {
        isPlaying = false;
        return { ok: false, note: t('needPremium') };
    }
    if (!res.ok && res.status !== 204) {
        isPlaying = false;
        return { ok: false, note: t('playbackHttp', { status: res.status }) };
    }
    isPlaying = true;
    return { ok: true };
}

async function togglePlayback() {
    try {
        if (isPlaying) {
            const res = await api('/me/player/pause', { method: 'PUT' });
            if (!res.ok && res.status !== 204) throw new Error(`Spotify pause failed (HTTP ${res.status})`);
            isPlaying = false;
        } else if (currentTrack) {
            const res = await api('/me/player/play', { method: 'PUT' });
            if (!res.ok && res.status !== 204) {
                const retry = await playTrack(currentTrack);
                if (!retry.ok) status(retry.note);
            } else {
                isPlaying = true;
            }
        }
        $('.rvm-btn-toggle i')
            .toggleClass('fa-play', !isPlaying)
            .toggleClass('fa-pause', isPlaying);
        updateInject();
    } catch (err) {
        status(t('error', { message: err.message }));
    }
}

async function nextTrack() {
    if (!searchResults.length) return;
    searchIndex = (searchIndex + 1) % searchResults.length;
    currentTrack = searchResults[searchIndex];
    const result = await playTrack(currentTrack);
    afterPlay(result.ok);
    renderBlock(result.ok ? '' : result.note);
    status(result.ok ? t('nowPlaying', { name: currentTrack.name, artists: currentTrack.artists }) : result.note);
}

// ----------------------------------------------- like / playlist / volume ---

function handleScope403() {
    if (scopeWarned) return;
    scopeWarned = true;
    status(t('needReconnect'));
}

function trackId(track) {
    return String(track?.uri || '').split(':').pop();
}

async function toggleLike() {
    if (!currentTrack) return;
    const id = trackId(currentTrack);
    try {
        const isLiked = likedCache[id] === true;
        const res = await api(`/me/tracks?ids=${encodeURIComponent(id)}`, { method: isLiked ? 'DELETE' : 'PUT' });
        if (res.status === 403) return handleScope403();
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        likedCache[id] = !isLiked;
        $('.rvm-btn-like').toggleClass('rvm-liked', !isLiked);
        status(t(isLiked ? 'unliked' : 'liked'));
    } catch (err) {
        status(t('error', { message: err.message }));
    }
}

async function refreshLikeUi() {
    if (!currentTrack) return;
    const id = trackId(currentTrack);
    try {
        const res = await api(`/me/tracks/contains?ids=${encodeURIComponent(id)}`);
        if (!res.ok) return;
        const [liked] = await res.json();
        likedCache[id] = !!liked;
        $('.rvm-btn-like').toggleClass('rvm-liked', !!liked);
    } catch { /* non-critical */ }
}

async function ensurePlaylist() {
    if (settings.playlistId) return settings.playlistId;
    const meRes = await api('/me');
    if (meRes.status === 403) { handleScope403(); return ''; }
    if (!meRes.ok) return '';
    const me = await meRes.json();
    const res = await api(`/users/${encodeURIComponent(me.id)}/playlists`, {
        method: 'POST',
        body: JSON.stringify({
            name: 'RP Vibe Music',
            public: false,
            description: 'Soundtrack of your roleplay — added automatically by the RP Vibe Music SillyTavern extension.',
        }),
    });
    if (res.status === 403) { handleScope403(); return ''; }
    if (!res.ok) return '';
    const playlist = await res.json();
    settings.playlistId = playlist.id;
    save();
    return playlist.id;
}

async function addToPlaylist(track) {
    if (!settings.autoPlaylist || !track?.uri) return;
    if ((settings.playlistUris || []).includes(track.uri)) return;
    try {
        let playlistId = await ensurePlaylist();
        if (!playlistId) return;
        let res = await api(`/playlists/${playlistId}/tracks`, { method: 'POST', body: JSON.stringify({ uris: [track.uri] }) });
        if (res.status === 404) {
            // Playlist was deleted by the user — recreate it once.
            settings.playlistId = '';
            save();
            playlistId = await ensurePlaylist();
            if (!playlistId) return;
            res = await api(`/playlists/${playlistId}/tracks`, { method: 'POST', body: JSON.stringify({ uris: [track.uri] }) });
        }
        if (res.status === 403) return handleScope403();
        if (!res.ok) return;
        settings.playlistUris = [...(settings.playlistUris || []), track.uri].slice(-500);
        save();
    } catch (err) {
        console.warn(LOG, 'playlist add failed:', err);
    }
}

function clampVolume(volume) {
    return Math.max(0, Math.min(100, Math.round(Number(volume) || 0)));
}

function updateVolumeUi() {
    $('.rvm-vol').val(currentVolume);
    $('.rvm-vol-value').text(`${currentVolume}%`);
}

async function setVolume(volume, { announce = false } = {}) {
    currentVolume = clampVolume(volume);
    updateVolumeUi();
    try {
        const res = await api(`/me/player/volume?volume_percent=${currentVolume}`, { method: 'PUT' });
        if (res.status === 403) {
            status(t('needPremium'));
            return;
        }
        if (!res.ok && res.status !== 204) {
            status(t('volumeFailed', { status: res.status }));
            return;
        }
        if (announce) status(t('volumeSet', { volume: currentVolume }));
    } catch (err) {
        console.warn(LOG, 'volume change failed:', err);
        if (announce) status(t('error', { message: err.message }));
    }
}

function queueVolumeChange(volume) {
    currentVolume = clampVolume(volume);
    updateVolumeUi();
    clearTimeout(volumeTimer);
    volumeTimer = setTimeout(() => setVolume(currentVolume, { announce: true }), 250);
}

function applyAutoVolume(energy) {
    if (!settings.autoVolume) return;
    const e = Math.max(1, Math.min(10, Number(energy) || 5));
    setVolume(30 + e * 6); // energy 1..10 → volume 36..90
}

async function queueTrack(track) {
    try {
        const res = await api(`/me/player/queue?uri=${encodeURIComponent(track.uri)}`, { method: 'POST' });
        return res.ok || res.status === 204;
    } catch {
        return false;
    }
}

async function banTrack() {
    if (!currentTrack) return;
    settings.bannedUris = [...new Set([...(settings.bannedUris || []), currentTrack.uri])];
    save();
    updateBanCountUi();
    status(t('bannedTrack', { name: currentTrack.name }));
    searchResults = searchResults.filter(track => track.uri !== currentTrack.uri);
    if (searchResults.length) {
        searchIndex = searchIndex % searchResults.length;
        currentTrack = searchResults[searchIndex];
        const result = await playTrack(currentTrack);
        afterPlay(result.ok);
        renderBlock(result.ok ? '' : result.note);
        if (result.ok) status(t('nowPlaying', { name: currentTrack.name, artists: currentTrack.artists }));
    } else {
        currentTrack = null;
        updateInject();
        analyzeAndPlay({ force: true });
    }
}

// ---------------------------------------------------------- prompt inject ---

function updateInject() {
    const ctx = getCtx();
    if (typeof ctx.setExtensionPrompt !== 'function') return;
    const type = ctx.extension_prompt_types?.IN_CHAT ?? 1;
    const role = ctx.extension_prompt_roles?.SYSTEM ?? 0;
    if (!settings.injectEnabled || !currentTrack || !isPlaying) {
        ctx.setExtensionPrompt(INJECT_ID, '', type, 0);
        return;
    }
    const template = String(settings.injectTemplate || '').trim() || t('injectDefault');
    const text = template
        .replaceAll('{{song}}', currentTrack.name)
        .replaceAll('{{artist}}', currentTrack.artists)
        .replaceAll('{{album}}', currentTrack.album || '')
        .replaceAll('{{mood}}', currentMood?.mood || t('moodDefault'));
    ctx.setExtensionPrompt(INJECT_ID, text, type, Math.max(0, Number(settings.injectDepth) || 0), false, role);
}

function afterPlay(ok) {
    updateInject();
    if (!ok) return;
    rememberTrack(currentTrack);
    applyAutoVolume(currentMood?.energy);
    addToPlaylist(currentTrack);
}

// ------------------------------------------------------------ mood engine ---

function getSceneText(maxMessages = 8) {
    const chat = getCtx().chat ?? [];
    const messages = chat.filter(m => !m.is_system && m.mes).slice(-maxMessages);
    return messages
        .map(m => `${m.name}: ${String(m.mes).replace(/<[^>]*>/g, ' ').slice(0, 600)}`)
        .join('\n');
}

function getCardText() {
    const ctx = getCtx();
    try {
        const character = ctx.characters?.[ctx.characterId];
        if (character?.name) {
            const description = String(character.description || '').replace(/<[^>]*>/g, ' ').slice(0, 400);
            return `${character.name}\n${description}`;
        }
    } catch { /* group chats / older versions */ }
    return '';
}

function buildPrompt(sceneText, cardText) {
    const styleRules = {
        modern: 'Prefer modern, popular, well-known songs with vocals that fit the mood (rock, rap, metal, pop, phonk); you may name a specific famous song or artist in the query.',
        soundtrack: 'Prefer instrumental, soundtrack, or ambient music unless lyrics strongly fit the scene.',
        auto: 'Use famous popular songs when the scene fits them, and cinematic/instrumental music otherwise.',
    };
    const styleRule = styleRules[settings.musicStyle] || styleRules.auto;
    const freshnessRules = {
        fresh: 'Prefer fresh, varied music from roughly 2015-now; avoid overused legacy hits unless the scene explicitly asks for nostalgia.',
        balanced: 'Use a mix of modern and proven tracks, but avoid repeating the same old classics too often.',
        any: 'Any era is allowed if it fits the scene.',
    };
    const freshnessRule = freshnessRules[settings.freshness] || freshnessRules.fresh;
    const fandomRule = settings.useFandom
        ? 'If the roleplay is clearly set in a well-known franchise (game / anime / movie / book — e.g. Genshin Impact, Harry Potter, Naruto, The Witcher), set "fandom" to its name and make the query target its official soundtrack, themes, or openings (e.g. "Genshin Impact OST battle", "Harry Potter theme", "Naruto opening"). Otherwise set "fandom" to null.'
        : 'Set "fandom" to null.';
    return `[Pause the roleplay.] You are a film music supervisor. Read the roleplay scene below and choose background music that matches its atmosphere.
${cardText ? `\nCHARACTER CARD:\n${cardText}\n` : ''}
SCENE:
${sceneText}

Respond with ONLY a single JSON object and nothing else, in exactly this shape:
{"mood":"1-3 word mood label","energy":5,"fandom":"franchise name or null","query":"Spotify track search query","reason":"very short explanation"}

Rules:
- Write the "mood" and "reason" values in ${lang() === 'ru' ? 'Russian' : 'English'}; keep "query" in English.
- ${fandomRule}
- For "query": describe MUSIC, not the plot — genre + adjectives + optional era/style keywords, or a franchise soundtrack search. Never mention roleplay character names.
- ${styleRule}
- ${freshnessRule}`;
}

async function runQuiet(prompt) {
    const ctx = getCtx();
    const fn = ctx.generateQuietPrompt;
    if (!fn) throw new Error('generateQuietPrompt is not available in this SillyTavern version');
    // Newer ST versions take a params object; older ones take positional args.
    if (fn.length <= 1) {
        return await fn({ quietPrompt: prompt, quietToLoud: false, skipWIAN: true });
    }
    return await fn(prompt, false, true);
}

async function runLLM(prompt) {
    const ctx = getCtx();
    // Prefer generateRaw: it sends ONLY our short prompt (no character card, no chat
    // history), which is much faster and far less likely to hit gateway timeouts.
    const raw = ctx.generateRaw;
    if (typeof raw === 'function') {
        try {
            if (raw.length <= 1) {
                return await raw({ prompt, systemPrompt: '' });
            }
            return await raw(prompt, null, false, false);
        } catch (err) {
            console.warn(LOG, 'generateRaw failed, falling back to quiet prompt:', err);
        }
    }
    return runQuiet(prompt);
}

function withTimeout(promise, ms, label) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error(label)), ms)),
    ]);
}

// Offline mood detection — no LLM calls at all. English + Russian keywords.
const VIBE_RULES = [
    { mood: 'epic battle', ru: 'эпичная битва', tag: 'battle', query: 'epic orchestral battle intense drums choir', modern: 'aggressive metal rock battle', words: ['battle', 'fight', 'sword', 'blade', 'gun', 'attack', 'war', 'enemy', 'strike', 'clash', 'punch', 'shoot', 'бой', 'битв', 'драк', 'сраж', 'меч', 'клин', 'оруж', 'атак', 'войн', 'удар', 'враг', 'выстрел'] },
    { mood: 'horror', ru: 'хоррор', tag: 'dark', query: 'dark ambient horror tension drone', modern: 'dark phonk horrorcore', words: ['fear', 'horror', 'terror', 'shadow', 'monster', 'scream', 'creep', 'dread', 'nightmare', 'страх', 'ужас', 'тьм', 'тень', 'монстр', 'крик', 'жутк', 'кошмар', 'мрак'] },
    { mood: 'passionate', ru: 'страсть', tag: 'sensual', query: 'sensual slow smooth saxophone r&b', modern: 'sensual r&b slow jam', words: ['moan', 'passion', 'desire', 'lust', 'undress', 'sensual', 'стон', 'страст', 'желани', 'вожделен', 'постел', 'соблазн'] },
    { mood: 'romantic', ru: 'романтика', tag: 'love', query: 'romantic tender piano strings soft', modern: 'romantic pop love song', words: ['kiss', 'love', 'embrace', 'tender', 'blush', 'heart', 'caress', 'gentle', 'поцелу', 'любл', 'любов', 'обним', 'объят', 'нежн', 'сердц', 'ласк', 'романт'] },
    { mood: 'sorrowful', ru: 'печаль', tag: 'sad', query: 'sad melancholic piano emotional', modern: 'sad emotional ballad', words: ['tears', 'cry', 'crying', 'grief', 'loss', 'mourn', 'sorrow', 'weep', 'слез', 'плакал', 'плач', 'горе', 'печал', 'утрат', 'скорб', 'груст'] },
    { mood: 'mysterious', ru: 'загадочность', tag: 'tension', query: 'suspense noir mysterious tension strings', modern: 'dark trap suspense', words: ['mystery', 'secret', 'investigate', 'clue', 'whisper', 'suspicion', 'hidden', 'тайн', 'загадк', 'секрет', 'улик', 'шепот', 'шёпот', 'подозр', 'скрыт'] },
    { mood: 'magical', ru: 'магия', tag: 'magic', query: 'fantasy magical ethereal orchestral mystical', modern: 'ethereal dream pop magical', words: ['magic', 'spell', 'wizard', 'ritual', 'arcane', 'enchant', 'маги', 'заклинан', 'волшеб', 'ритуал', 'чар', 'колд'] },
    { mood: 'adventurous', ru: 'приключение', tag: 'adventure', query: 'cinematic adventure journey folk orchestral', modern: 'indie rock adventure anthem', words: ['journey', 'travel', 'forest', 'road', 'mountain', 'explore', 'quest', 'путешеств', 'дорог', 'лес', 'гор', 'странств', 'поход', 'путь'] },
    { mood: 'festive', ru: 'праздник', tag: 'party', query: 'upbeat fun swing dance party', modern: 'party hits dance pop', words: ['dance', 'party', 'laugh', 'festival', 'celebrate', 'drink', 'tavern', 'танц', 'вечеринк', 'смех', 'смея', 'праздник', 'весел', 'таверн'] },
    { mood: 'cozy', ru: 'уют', tag: 'calm', query: 'cozy calm acoustic warm lo-fi', modern: 'chill lo-fi indie cozy', words: ['cozy', 'warm', 'tea', 'coffee', 'fireplace', 'rain', 'blanket', 'calm', 'quiet', 'уют', 'тепл', 'чай', 'кофе', 'камин', 'дожд', 'плед', 'спокой', 'тиш'] },
];

// Popular RP franchises — when detected, search their official soundtracks instead
// of generic mood music. Matched against the character card and the scene text.
const FANDOMS = [
    { name: 'Genshin Impact', query: 'Genshin Impact OST', words: ['genshin', 'геншин', 'teyvat', 'тейват', 'mondstadt', 'мондштадт', 'liyue', 'лиюэ', 'fontaine', 'фонтейн', 'paimon', 'паймон', 'архонт'] },
    { name: 'Honkai: Star Rail', query: 'Honkai Star Rail OST', words: ['honkai', 'хонкай', 'star rail', 'астрал экспресс'] },
    { name: 'Harry Potter', query: 'Harry Potter soundtrack theme', words: ['hogwarts', 'хогвартс', 'harry potter', 'гарри поттер', 'гриффиндор', 'gryffindor', 'слизерин', 'slytherin', 'волдеморт', 'voldemort', 'quidditch', 'квиддич'] },
    { name: 'Naruto', query: 'Naruto OST', words: ['naruto', 'наруто', 'konoha', 'конох', 'hokage', 'хокаге', 'sharingan', 'шаринган', 'джутсу'] },
    { name: 'The Witcher', query: 'The Witcher soundtrack', words: ['witcher', 'ведьмак', 'geralt', 'геральт', 'цири', 'ciri', 'каэр морхен'] },
    { name: 'Cyberpunk 2077', query: 'Cyberpunk 2077 OST', words: ['cyberpunk', 'киберпанк', 'night city', 'найт-сити', 'найт сити', 'arasaka', 'арасак'] },
    { name: 'Attack on Titan', query: 'Attack on Titan OST', words: ['attack on titan', 'атака титанов', 'shingeki', 'эрен', 'eren yeager', 'разведкорпус'] },
    { name: 'Demon Slayer', query: 'Demon Slayer OST', words: ['demon slayer', 'kimetsu', 'клинок рассекающ', 'танджиро', 'tanjiro', 'недзуко', 'nezuko'] },
    { name: 'Jujutsu Kaisen', query: 'Jujutsu Kaisen OST', words: ['jujutsu', 'магическая битва', 'годжо', 'gojo', 'сукуна', 'sukuna', 'проклятая энерги'] },
    { name: 'My Hero Academia', query: 'My Hero Academia OST', words: ['hero academia', 'геройская академия', 'deku', 'деку', 'юэй', 'quirk', 'причуд'] },
    { name: 'Star Wars', query: 'Star Wars soundtrack', words: ['star wars', 'звездные войны', 'звёздные войны', 'jedi', 'джеда', 'ситх', 'sith', 'татуин'] },
    { name: 'Lord of the Rings', query: 'Lord of the Rings soundtrack', words: ['средиземь', 'middle-earth', 'mordor', 'мордор', 'hobbit', 'хоббит', 'gandalf', 'гэндальф', 'гандальф'] },
    { name: 'Elden Ring', query: 'Elden Ring soundtrack', words: ['elden ring', 'элден', 'dark souls', 'дарк соулс', 'междуземь'] },
    { name: 'The Elder Scrolls', query: 'Skyrim soundtrack', words: ['skyrim', 'скайрим', 'dovahkiin', 'довакин', 'tamriel', 'тамриэл'] },
    { name: 'Zelda', query: 'Legend of Zelda soundtrack', words: ['zelda', 'зельда', 'hyrule', 'хайрул'] },
    { name: 'Undertale', query: 'Undertale OST', words: ['undertale', 'андертейл'] },
    { name: 'Minecraft', query: 'Minecraft soundtrack C418', words: ['minecraft', 'майнкрафт'] },
];

function countMatches(text, words) {
    let score = 0;
    for (const word of words) {
        let idx = -1;
        while ((idx = text.indexOf(word, idx + 1)) !== -1) score++;
    }
    return score;
}

function detectFandom(sceneText, cardText) {
    if (!settings.useFandom) return null;
    const scene = sceneText.toLowerCase();
    const card = (cardText || '').toLowerCase();
    let best = null;
    let bestScore = 0;
    for (const fandom of FANDOMS) {
        // Card mentions are strong evidence (the whole chat is set there).
        const score = countMatches(card, fandom.words) * 3 + countMatches(scene, fandom.words);
        if (score > bestScore) {
            bestScore = score;
            best = fandom;
        }
    }
    return bestScore >= 2 ? best : null;
}

function moodLabel(rule) {
    return lang() === 'ru' && rule.ru ? rule.ru : rule.mood;
}

function keywordMood(sceneText, cardText = '') {
    const text = sceneText.toLowerCase();
    let best = null;
    let bestScore = 0;
    for (const rule of VIBE_RULES) {
        const score = countMatches(text, rule.words);
        if (score > bestScore) {
            bestScore = score;
            best = rule;
        }
    }
    const fandom = detectFandom(sceneText, cardText);
    if (fandom) {
        return {
            mood: `${fandom.name}${best ? ` · ${moodLabel(best)}` : ''}`,
            energy: 5,
            query: `${fandom.query} ${best ? best.tag : ''}`.trim(),
            reason: t('reasonKeywordFandom'),
        };
    }
    if (!best) {
        return { mood: t('moodAmbient'), energy: 4, query: 'cinematic ambient atmospheric instrumental', reason: t('reasonDefault') };
    }
    const query = settings.musicStyle === 'modern' || (settings.musicStyle === 'auto' && (settings.freshness || 'fresh') === 'fresh')
        ? best.modern
        : best.query;
    return { mood: moodLabel(best), energy: 5, query, reason: t('reasonKeyword') };
}

function parseMood(raw) {
    if (!raw) return null;
    const text = String(raw).replace(/```(?:json)?/gi, '');
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
        try {
            const parsed = JSON.parse(match[0]);
            if (parsed && typeof parsed.query === 'string' && parsed.query.trim()) {
                const fandom = parsed.fandom && String(parsed.fandom).toLowerCase() !== 'null'
                    ? String(parsed.fandom).slice(0, 40)
                    : '';
                return {
                    mood: `${fandom ? `${fandom} · ` : ''}${String(parsed.mood || t('moodDefault')).slice(0, 60)}`,
                    energy: Number(parsed.energy) || 5,
                    query: parsed.query.trim().slice(0, 120),
                    reason: String(parsed.reason || '').slice(0, 140),
                };
            }
        } catch { /* fall through */ }
    }
    // Fallback handled by the caller (keyword engine in auto mode).
    return null;
}

async function analyzeAndPlay({ force = false, hint = '' } = {}) {
    if (analyzing) return;
    if (!settings.enabled) return;
    if (!settings.refreshToken) {
        status(t('connectFirst'));
        return;
    }
    analyzing = true;
    try {
        let mood;
        if (hint) {
            mood = { mood: hint.slice(0, 60), energy: 5, query: hint, reason: t('reasonManual') };
        } else {
            const scene = getSceneText();
            if (!scene) {
                status(t('noMessages'));
                return;
            }
            const engine = settings.moodEngine || 'auto';
            const cardText = getCardText();
            if (engine !== 'keywords') {
                status(t('analyzing'));
                try {
                    const raw = await withTimeout(runLLM(buildPrompt(scene, cardText)), 90_000, 'LLM analysis timed out');
                    mood = parseMood(raw);
                } catch (err) {
                    console.warn(LOG, 'LLM mood analysis failed:', err);
                    if (engine === 'llm') {
                        status(t('moodFailed', { message: err.message }));
                        return;
                    }
                }
            }
            if (!mood?.query) {
                if (engine === 'llm') {
                    status(t('moodParse'));
                    return;
                }
                mood = keywordMood(scene, cardText);
            }
        }
        if (!mood?.query) {
            status(t('noVibe'));
            return;
        }
        mood.query = sanitizeQuery(mood.query);
        if (!mood.query) {
            status(t('emptyQuery'));
            return;
        }
        if (!force && currentTrack && currentMood?.query &&
            mood.query.toLowerCase() === currentMood.query.toLowerCase()) {
            lastAnalysisAt = Date.now();
            aiMessageCounter = 0;
            status(t('vibeUnchanged', { mood: mood.mood }));
            return;
        }
        status(t('searching', { query: mood.query }));
        const results = await searchTracks(mood.query);
        if (!results.length) {
            status(t('noTracks', { query: mood.query }));
            return;
        }
        const newTrack = results[0];
        const smooth = settings.smoothSwitch && !force && isPlaying && currentTrack && currentTrack.uri !== newTrack.uri;
        currentMood = mood;
        searchResults = results;
        searchIndex = 0;
        if (smooth && await queueTrack(newTrack)) {
            currentTrack = newTrack;
            lastAnalysisAt = Date.now();
            aiMessageCounter = 0;
            afterPlay(true);
            renderBlock(t('queuedNote'));
            status(t('queuedStatus', { name: newTrack.name, artists: newTrack.artists, mood: mood.mood }));
            return;
        }
        currentTrack = newTrack;
        const result = await playTrack(currentTrack);
        lastAnalysisAt = Date.now();
        aiMessageCounter = 0;
        afterPlay(result.ok);
        renderBlock(result.ok ? '' : result.note);
        status(result.ok
            ? t('nowPlayingMood', { name: currentTrack.name, artists: currentTrack.artists, mood: mood.mood })
            : result.note);
    } catch (err) {
        console.error(LOG, err);
        status(t('error', { message: err.message }));
    } finally {
        analyzing = false;
    }
}

// ------------------------------------------------------------- chat block ---

function findChatBlockTarget() {
    let target = $('#chat .mes[is_user="false"]').not('[is_system="true"]').last().find('.mes_text').first();
    if (target.length) return target;

    target = $('#chat .mes').filter(function () {
        const el = $(this);
        const isUser = String(el.attr('is_user') || '').toLowerCase() === 'true'
            || el.hasClass('user_mes')
            || el.hasClass('is_user');
        const isSystem = String(el.attr('is_system') || '').toLowerCase() === 'true'
            || el.hasClass('system_mes')
            || el.hasClass('system');
        return !isUser && !isSystem;
    }).last().find('.mes_text, .mes_text_pre, .mes_content').first();
    if (target.length) return target;

    return $('#chat .mes_text, #chat .mes_text_pre, #chat .mes_content').last();
}

function renderBlock(note = '') {
    if (!settings.keepOldBlocks) {
        $('#chat .rvm-block').remove();
    }
    if (!settings.inlineBlock || !currentTrack) return;
    const target = findChatBlockTarget();
    if (!target.length) {
        console.warn(LOG, 'could not find a chat message target for the now-playing block');
        return;
    }
    target.find('.rvm-block').remove();
    const track = currentTrack;
    const mood = currentMood;
    const html = `
    <div class="rvm-block">
        ${track.image ? `<img class="rvm-art" src="${esc(track.image)}" alt="">` : ''}
        <div class="rvm-meta">
            <div class="rvm-mood">♪ ${esc(mood?.mood || t('moodDefault'))}${mood?.reason ? ` — ${esc(mood.reason)}` : ''}</div>
            <a class="rvm-title" href="${esc(track.url)}" target="_blank" rel="noopener">${esc(track.name)}</a>
            <div class="rvm-artist">${esc(track.artists)}</div>
            ${note ? `<div class="rvm-note">${esc(note)}</div>` : ''}
        </div>
        <div class="rvm-controls" role="group" aria-label="RP Vibe Music controls">
            <div class="rvm-ctrl-row">
                <button type="button" class="rvm-iconbtn rvm-btn-toggle" title="${esc(t('ttToggle'))}" aria-label="${esc(t('ttToggle'))}"><i class="fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}"></i></button>
                <button type="button" class="rvm-iconbtn rvm-btn-next" title="${esc(t('ttNext'))}" aria-label="${esc(t('ttNext'))}"><i class="fa-solid fa-forward"></i></button>
                <button type="button" class="rvm-iconbtn rvm-btn-reroll" title="${esc(t('ttReroll'))}" aria-label="${esc(t('ttReroll'))}"><i class="fa-solid fa-arrows-rotate"></i></button>
                <button type="button" class="rvm-iconbtn rvm-btn-like" title="${esc(t('ttLike'))}" aria-label="${esc(t('ttLike'))}"><i class="fa-solid fa-heart"></i></button>
                <button type="button" class="rvm-iconbtn rvm-btn-ban" title="${esc(t('ttBan'))}" aria-label="${esc(t('ttBan'))}"><i class="fa-solid fa-ban"></i></button>
            </div>
            <label class="rvm-volume" title="${esc(t('ttVolume'))}">
                <i class="fa-solid fa-volume-high"></i>
                <input type="range" class="rvm-vol" min="0" max="100" value="${currentVolume}">
                <span class="rvm-vol-value">${currentVolume}%</span>
            </label>
        </div>
    </div>`;
    target.append(html);
    refreshLikeUi();
}

// ----------------------------------------------------------------- events ---

function onCharacterMessage() {
    if (!settings.enabled || !settings.autoMode || !settings.refreshToken) return;
    aiMessageCounter++;
    if (aiMessageCounter < Math.max(1, Number(settings.messageInterval) || 1)) return;
    if (Date.now() - lastAnalysisAt < (Number(settings.minSecondsBetween) || 0) * 1000) return;
    setTimeout(() => analyzeAndPlay(), 800);
}

// -------------------------------------------------------------- settings UI ---

function settingsSection(title, body) {
    return `
        <div class="rvm-section">
            <div class="rvm-section-title">${esc(title)}</div>
            <div class="rvm-section-body">${body}</div>
        </div>`;
}

function buildSettingsHtml() {
    return `
<div class="rvm-ext-settings">
    <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header">
            <b>${t('sTitle')}</b>
            <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content">
            ${settingsSection(t('sSectionMain'), `
                <div class="rvm-grid">
                    <label>${esc(t('sLanguage'))}
                        <select id="rvm_lang" class="text_pole">
                            <option value="auto">${esc(t('sLangAuto'))}</option>
                            <option value="en">English</option>
                            <option value="ru">Русский</option>
                        </select>
                    </label>
                    <label class="checkbox_label"><input id="rvm_enabled" type="checkbox"><span>${esc(t('sEnabled'))}</span></label>
                    <label class="checkbox_label"><input id="rvm_auto" type="checkbox"><span>${esc(t('sAuto'))}</span></label>
                    <label class="checkbox_label"><input id="rvm_inline" type="checkbox"><span>${esc(t('sInline'))}</span></label>
                    <label class="checkbox_label"><input id="rvm_keep" type="checkbox"><span>${esc(t('sKeep'))}</span></label>
                </div>
            `)}
            ${settingsSection(t('sSectionMusic'), `
                <div class="rvm-grid">
                    <label>${esc(t('sStyle'))}
                        <select id="rvm_style" class="text_pole">
                            <option value="auto">${esc(t('sStyleAuto'))}</option>
                            <option value="modern">${esc(t('sStyleModern'))}</option>
                            <option value="soundtrack">${esc(t('sStyleSoundtrack'))}</option>
                        </select>
                    </label>
                    <label>${esc(t('sFreshness'))}
                        <select id="rvm_freshness" class="text_pole">
                            <option value="fresh">${esc(t('sFreshnessFresh'))}</option>
                            <option value="balanced">${esc(t('sFreshnessBalanced'))}</option>
                            <option value="any">${esc(t('sFreshnessAny'))}</option>
                        </select>
                    </label>
                    <label>${esc(t('sEngine'))}
                        <select id="rvm_engine" class="text_pole">
                            <option value="auto">${esc(t('sEngineAuto'))}</option>
                            <option value="llm">${esc(t('sEngineLlm'))}</option>
                            <option value="keywords">${esc(t('sEngineKeywords'))}</option>
                        </select>
                    </label>
                    <label>${esc(t('sInterval'))}
                        <input id="rvm_interval" type="number" min="1" max="20" class="text_pole">
                    </label>
                    <label class="checkbox_label"><input id="rvm_fandom" type="checkbox"><span>${esc(t('sFandom'))}</span></label>
                    <label class="checkbox_label"><input id="rvm_autovol" type="checkbox"><span>${esc(t('sAutoVolume'))}</span></label>
                    <label class="checkbox_label"><input id="rvm_smooth" type="checkbox"><span>${esc(t('sSmooth'))}</span></label>
                    <label class="checkbox_label"><input id="rvm_playlist" type="checkbox"><span>${esc(t('sAutoPlaylist'))}</span></label>
                </div>
                <div class="rvm-btnrow rvm-banrow">
                    <span id="rvm_ban_count" class="rvm-status"></span>
                    <button type="button" id="rvm_ban_clear" class="menu_button">${esc(t('sBanClear'))}</button>
                </div>
            `)}
            ${settingsSection(t('sSectionPrompt'), `
                <label class="checkbox_label"><input id="rvm_inject" type="checkbox"><span>${esc(t('sInject'))}</span></label>
                <div class="rvm-grid">
                    <label>${esc(t('sInjectDepth'))}
                        <input id="rvm_inject_depth" type="number" min="0" max="20" class="text_pole">
                    </label>
                    <label>${esc(t('sInjectTemplate'))}
                        <textarea id="rvm_inject_template" class="text_pole" rows="3" placeholder="${esc(t('injectDefault'))}"></textarea>
                    </label>
                </div>
            `)}
            ${settingsSection(t('sSectionSpotify'), `
                <label>Spotify Client ID
                    <input id="rvm_client_id" type="text" class="text_pole" placeholder="${esc(t('sClientIdPh'))}">
                </label>
                <label>${esc(t('sRedirect'))}
                    <input id="rvm_redirect" type="text" class="text_pole">
                </label>
                <div class="rvm-btnrow">
                    <button type="button" id="rvm_connect" class="menu_button">${esc(t('sConnect'))}</button>
                    <button type="button" id="rvm_disconnect" class="menu_button">${esc(t('sDisconnect'))}</button>
                    <button type="button" id="rvm_analyze" class="menu_button">${esc(t('sAnalyze'))}</button>
                </div>
                <div id="rvm_status" class="rvm-status">${esc(t('notConnected'))}</div>
                <small>${t('sHint')}</small>
            `)}
        </div>
    </div>
</div>`;
}

function addSettingsUi() {
    const container = $('#extensions_settings2').length ? $('#extensions_settings2') : $('#extensions_settings');
    const existing = container.find('.rvm-ext-settings');
    const wasOpen = existing.find('.inline-drawer-content').is(':visible');
    existing.remove();
    container.append(buildSettingsHtml());
    if (wasOpen) {
        container.find('.rvm-ext-settings .inline-drawer-toggle').addClass('open');
        container.find('.rvm-ext-settings .inline-drawer-content').show();
    }

    $('#rvm_lang').val(settings.language || 'auto').on('change', function () {
        settings.language = this.value;
        save();
        addSettingsUi();
        updateConnectionUi();
        renderBlock();
    });
    $('#rvm_enabled').prop('checked', settings.enabled).on('change', function () { settings.enabled = this.checked; save(); });
    $('#rvm_auto').prop('checked', settings.autoMode).on('change', function () { settings.autoMode = this.checked; save(); });
    $('#rvm_inline').prop('checked', settings.inlineBlock).on('change', function () { settings.inlineBlock = this.checked; save(); if (!this.checked) $('#chat .rvm-block').remove(); });
    $('#rvm_keep').prop('checked', settings.keepOldBlocks).on('change', function () { settings.keepOldBlocks = this.checked; save(); });
    $('#rvm_fandom').prop('checked', settings.useFandom).on('change', function () { settings.useFandom = this.checked; save(); });
    $('#rvm_style').val(settings.musicStyle || 'auto').on('change', function () { settings.musicStyle = this.value; save(); });
    $('#rvm_freshness').val(settings.freshness || 'fresh').on('change', function () { settings.freshness = this.value; save(); });
    $('#rvm_engine').val(settings.moodEngine || 'auto').on('change', function () { settings.moodEngine = this.value; save(); });
    $('#rvm_interval').val(settings.messageInterval).on('input', function () { settings.messageInterval = Math.max(1, Number(this.value) || 1); save(); });
    $('#rvm_client_id').val(settings.clientId).on('input', function () { settings.clientId = this.value.trim(); save(); });
    $('#rvm_redirect').val(settings.redirectUri).on('input', function () { settings.redirectUri = this.value.trim(); save(); });

    $('#rvm_inject').prop('checked', settings.injectEnabled).on('change', function () { settings.injectEnabled = this.checked; save(); updateInject(); });
    $('#rvm_inject_depth').val(settings.injectDepth).on('input', function () { settings.injectDepth = Math.max(0, Number(this.value) || 0); save(); updateInject(); });
    $('#rvm_inject_template').val(settings.injectTemplate).on('input', function () { settings.injectTemplate = this.value; save(); updateInject(); });
    $('#rvm_playlist').prop('checked', settings.autoPlaylist).on('change', function () { settings.autoPlaylist = this.checked; save(); });
    $('#rvm_autovol').prop('checked', settings.autoVolume).on('change', function () { settings.autoVolume = this.checked; save(); });
    $('#rvm_smooth').prop('checked', settings.smoothSwitch).on('change', function () { settings.smoothSwitch = this.checked; save(); });
    $('#rvm_ban_clear').on('click', () => { settings.bannedUris = []; save(); updateBanCountUi(); status(t('banCleared')); });
    updateBanCountUi();

    $('#rvm_connect').on('click', connectSpotify);
    $('#rvm_disconnect').on('click', disconnectSpotify);
    $('#rvm_analyze').on('click', () => analyzeAndPlay({ force: true }));
}

function updateBanCountUi() {
    $('#rvm_ban_count').text(t('sBanned', { count: (settings.bannedUris || []).length }));
}

// Inline block controls (delegated — blocks are created dynamically).
// Bound once at init, NOT in addSettingsUi, which re-runs on language change.
function runControlAction(event, action) {
    event.preventDefault();
    event.stopPropagation();
    if (controlBusy) return;
    controlBusy = true;
    $('.rvm-iconbtn').prop('disabled', true).addClass('rvm-busy');
    Promise.resolve(action())
        .catch(err => status(t('error', { message: err.message })))
        .finally(() => {
            controlBusy = false;
            $('.rvm-iconbtn').prop('disabled', false).removeClass('rvm-busy');
        });
}

function bindBlockControls() {
    $(document)
        .off('click.rvm', '.rvm-btn-toggle')
        .off('click.rvm', '.rvm-btn-next')
        .off('click.rvm', '.rvm-btn-reroll')
        .off('click.rvm', '.rvm-btn-like')
        .off('click.rvm', '.rvm-btn-ban')
        .off('input.rvm change.rvm', '.rvm-vol')
        .on('click.rvm', '.rvm-btn-toggle', function (event) { runControlAction(event, togglePlayback); })
        .on('click.rvm', '.rvm-btn-next', function (event) { runControlAction(event, nextTrack); })
        .on('click.rvm', '.rvm-btn-reroll', function (event) { runControlAction(event, () => analyzeAndPlay({ force: true })); })
        .on('click.rvm', '.rvm-btn-like', function (event) { runControlAction(event, toggleLike); })
        .on('click.rvm', '.rvm-btn-ban', function (event) { runControlAction(event, banTrack); })
        .on('input.rvm', '.rvm-vol', function () { queueVolumeChange(this.value); })
        .on('change.rvm', '.rvm-vol', function () { clearTimeout(volumeTimer); setVolume(this.value, { announce: true }); });
}

function updateConnectionUi() {
    const connected = !!settings.refreshToken;
    $('#rvm_connect').toggle(!connected);
    $('#rvm_disconnect').toggle(connected);
    if (connected) status(t('connectedShort'));
}

// --------------------------------------------------------- slash commands ---

function registerCommands() {
    const ctx = getCtx();
    const handler = (_namedArgs, text) => {
        const hint = typeof text === 'string' ? text.trim() : '';
        analyzeAndPlay({ force: true, hint });
        return '';
    };
    try {
        if (ctx.SlashCommandParser?.addCommandObject && ctx.SlashCommand?.fromProps) {
            const unnamedArgumentList = ctx.SlashCommandArgument?.fromProps
                ? [ctx.SlashCommandArgument.fromProps({
                    description: 'optional manual vibe / music search query',
                    typeList: ['string'],
                    isRequired: false,
                })]
                : [];
            ctx.SlashCommandParser.addCommandObject(ctx.SlashCommand.fromProps({
                name: 'vibe',
                callback: handler,
                unnamedArgumentList,
                helpString: t('slashHelp'),
            }));
            return;
        }
    } catch (err) {
        console.warn(LOG, 'Modern slash command registration failed, falling back.', err);
    }
    try {
        ctx.registerSlashCommand?.('vibe', handler, [], `– ${t('slashHelp')}`, true, true);
    } catch (err) {
        console.warn(LOG, 'Slash command registration failed.', err);
    }
}

// ------------------------------------------------------------------- init ---

jQuery(async () => {
    settings = getSettings();
    if (!settings.redirectUri) {
        settings.redirectUri = defaultRedirectUri();
    }
    addSettingsUi();
    bindBlockControls();
    await handleAuthCallback();
    updateConnectionUi();

    const ctx = getCtx();
    ctx.eventSource.on(ctx.eventTypes.CHARACTER_MESSAGE_RENDERED, onCharacterMessage);
    ctx.eventSource.on(ctx.eventTypes.CHAT_CHANGED, () => { aiMessageCounter = 0; });

    registerCommands();
    console.log(LOG, 'loaded');
});
