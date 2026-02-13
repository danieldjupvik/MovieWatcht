const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY || '';
const OMDB_API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY || '';

if (__DEV__ && !TMDB_API_KEY) {
  console.warn(
    'EXPO_PUBLIC_TMDB_API_KEY is not set. Run `bun run env:pull` to fetch environment variables.'
  );
}

export const apiKey = `?api_key=${TMDB_API_KEY}`;
export const omdbApiKey = OMDB_API_KEY;

export const basePosterUrl = 'https://image.tmdb.org/t/p/w342';
export const baseSearchPosterUrl = 'https://image.tmdb.org/t/p/w92';
export const baseStillImageUrl = 'https://image.tmdb.org/t/p/w300';
export const baseBackdropUrl = 'https://image.tmdb.org/t/p/w780';
export const baseFullPosterUrl = 'https://image.tmdb.org/t/p/w780';
export const baseBackdropPlaceholderUrl = 'https://image.tmdb.org/t/p/w300';
export const baseProfileUrl = 'https://image.tmdb.org/t/p/w185';
export const detailsMovieUrl = 'https://api.themoviedb.org/3/movie/';
export const baseUrl = `https://api.themoviedb.org/3/movie/popular${apiKey}`;
export const searchMovieUrl = `https://api.themoviedb.org/3/search/movie${apiKey}`;
export const searchMultiUrl = `https://api.themoviedb.org/3/search/multi${apiKey}`;
export const topRatedMovieUrl = `https://api.themoviedb.org/3/movie/top_rated${apiKey}`;
export const upcomingMovieUrl = `https://api.themoviedb.org/3/movie/upcoming${apiKey}`;
export const nowPlayingUrl = `https://api.themoviedb.org/3/movie/now_playing${apiKey}`;
export const trendingMovieUrl = `https://api.themoviedb.org/3/trending/movie/week${apiKey}`;
export const personUrl = `https://api.themoviedb.org/3/person/`;
export const creditPerson = `https://api.themoviedb.org/3/credit/`;
export const getTokenUrl = `https://api.themoviedb.org/3/authentication/token/new${apiKey}`;
export const accountUrl = `https://api.themoviedb.org/3/account${apiKey}`;

export const popularSeriesUrl = `https://api.themoviedb.org/3/tv/popular${apiKey}`;
export const topRatedSeriesUrl = `https://api.themoviedb.org/3/tv/top_rated${apiKey}`;
export const onTheAirSeriesUrl = `https://api.themoviedb.org/3/tv/on_the_air${apiKey}`;
export const airingTodaySeriesUrl = `https://api.themoviedb.org/3/tv/airing_today${apiKey}`;
export const detailsSeriesUrl = 'https://api.themoviedb.org/3/tv/';
export const trendingSeriesUrl = `https://api.themoviedb.org/3/trending/tv/week${apiKey}`;

const langMap = {
  en: 'English', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian',
  pt: 'Portuguese', ja: 'Japanese', ko: 'Korean', zh: 'Chinese', ru: 'Russian',
  ar: 'Arabic', hi: 'Hindi', th: 'Thai', tr: 'Turkish', pl: 'Polish',
  nl: 'Dutch', sv: 'Swedish', da: 'Danish', no: 'Norwegian', fi: 'Finnish',
  cs: 'Czech', hu: 'Hungarian', ro: 'Romanian', el: 'Greek', he: 'Hebrew',
  uk: 'Ukrainian', vi: 'Vietnamese', id: 'Indonesian', ms: 'Malay', nb: 'Norwegian',
};
export const getLanguageName = (code) => langMap[code] ?? code?.toUpperCase();
