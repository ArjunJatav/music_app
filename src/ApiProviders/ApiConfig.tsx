const API_BASE_URL = 'https://musicapp.betademo.net/api/';
export const IMAGE_URL_VIDEOS =
  'https://musicapp.betademo.net/aws-bkp/thumbnails/';
export const IMAGE_URL_PLAYLIST =
  'https://musicapp.betademo.net/uploads/playlists/';
export const IMAGE_URL_ARTISTS =
  'https://musicapp.betademo.net/uploads/artists/';
export const IMAGE_URL_GENRE = 'https://musicapp.betademo.net/uploads/genres/';
export const VIDEO_BASE_URL = 'https://musicapp.betademo.net/aws-bkp/videos/';

const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'login',
    REGISTER: 'register',
    FORGOT_PASSWORD: 'forgotPassword',
    RESET_PASSWORD: 'resetPassword',
    OTP_VERIFICATION: 'verifyOtp',
    LOGOUT: '/auth/logout',
  },
  HOME: {
    GET_HOME_DATA: 'home',
    PUBLIC_PLAYLIST: 'publicPlaylist',
    DETAILED_PLAY_LIST: 'detailById',
    ARTIST_LIST: 'artistList',
    MYMUSIC: 'myMusic',
    GENRE_LIST: 'genreList',
    PLAYLIST_FAVORITELIST: 'playlistFavoriteList',
    ADD_FAV_UN_FAV: 'addToFavUnFavCommon',
    FAVOURITES_LIST: 'videoFavoriteList',
  },
  PROFILE: {
    GET_PROFILE_DATA: 'myProfile',
    CHANGED_PASSWORD: 'changePassword',
    GET_NOTIFICATIONS: 'getNotification',
    SUPPORT: 'support',
  },
};

export {API_BASE_URL, API_ENDPOINTS};
