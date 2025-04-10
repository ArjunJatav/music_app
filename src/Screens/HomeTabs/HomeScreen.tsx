import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
  LogBox,
  RefreshControl,
} from 'react-native';
import {useAppNavigation} from '../../Utils/useAppNavigation';
import HomeHeader from '../../Headers/HomeHeader';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../Utils/DimensionsUtil';
import {COLORS} from '../../Utils/Colors';
import VideoCustomSlider from './VideoCustomSlider';
import MusicListWithHeader from './MusicListWithHeader';
import {RootState} from '../../Redux/Store';
import {useSelector} from 'react-redux';
import ApiService from '../../ApiProviders/ApiService';
import {API_ENDPOINTS} from '../../ApiProviders/ApiConfig';
import {HOME_SCREEN_STYLE} from './HomeScreenStyle';

const HomeScreen = () => {
  const navigation = useAppNavigation();
  const [loading, setLoading] = useState(false);
  const AUTH_TOKEN = useSelector(
    (state: RootState) => state.authToken.AUTH_TOKEN,
  );
  const [newRelease, setNewRealese] = useState([]);
  const [videos, setVideos] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [artistArray, setArtistArray] = useState([]);
  const [genre, setGenre] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHomeData = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const response = await ApiService.get(API_ENDPOINTS.HOME.GET_HOME_DATA);
      const typedResponse = response as {
        success: boolean;
        message?: string;
        data?: any;
      };

      if (typedResponse.success) {
        setNewRealese(typedResponse.data.new_releases);
        setVideos(typedResponse.data.videos.slice(0, 7));
        setArtistArray(typedResponse.data.artists.slice(0, 7));
        setGenre(typedResponse.data.genres.slice(0, 7));
        setPlaylist(typedResponse.data.playlists.slice(0, 7));
      } else {
        console.log('response.message', typedResponse.message);
      }
    } catch (err: any) {
      console.log('err.message', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (AUTH_TOKEN) {
      fetchHomeData();
    }
  }, [AUTH_TOKEN, fetchHomeData]);


  
  return (
    <SafeAreaView style={HOME_SCREEN_STYLE.BG_CONTAINER}>
      <HomeHeader
        title="Musica"
        onNotificationClick={() => {//@ts-ignore
           navigation.navigate("NotificationScreen")}}
      />
      {refreshing && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.PINK_COLOR} />
          <Text style={styles.loaderText}>Refreshing...</Text>
        </View>
      )}

      {/* Show Loading Indicator when Fetching Data */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.PINK_COLOR} />
          <Text style={styles.loaderText}>Loading...</Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {newRelease.length === 0 &&
          videos.length === 0 &&
          playlist.length === 0 &&
          artistArray.length === 0 &&
          genre.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No Data Available</Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={fetchHomeData}
                  colors={[COLORS.PINK_COLOR]}
                />
              }>
              <View style={styles.sectionContainer}>
                <VideoCustomSlider data={newRelease} />
              </View>

              <MusicListWithHeader
                title="Popular & Trending"
                //onMorePress={() => console.log('More clicked')}
                onMorePress={() => {
                  //@ts-ignore
                  navigation.navigate('PopularTrendingScreen', {
                    Header_Name: 'Popular & Trending',
                    Video_Id: '',
                    Type: 'videos',
                  });
                }}
                data={videos}
              />

              <MusicListWithHeader
                title="Public Playlist"
                onMorePress={() => {
                  //@ts-ignore
                  navigation.navigate('PublicPlaylistScreen', {
                    isScreenFrom: 'Public Playlist',
                  });
                }}
                data={playlist}
              />
              <View style={{marginVertical: 10}}>
                <MusicListWithHeader
                  title="Artist"
                  onMorePress={() => {
                    //@ts-ignore
                    navigation.navigate('ArtistScreen', {Type: 'artist'});
                  }}
                  data={artistArray}
                />
              </View>
              <View style={{marginVertical: 10}}>
                <MusicListWithHeader
                  title="Genre"
                  onMorePress={() => {
                    //@ts-ignore
                    navigation.navigate('GenreScreen', {Type: 'Genre'});
                  }}
                  data={genre}
                />
              </View>
            </ScrollView>
          )}
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 150,
    paddingHorizontal: 10,
    width: WINDOW_WIDTH,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.PINK_COLOR,
  },
  sectionContainer: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.GRAY,
  },
});

export default HomeScreen;
