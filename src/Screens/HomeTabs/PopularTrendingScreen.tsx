import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {HOME_SCREEN_STYLE} from '../HomeTabs/HomeScreenStyle';
import HeaderWithBackButton from '../../Headers/Header';
import {useAppNavigation} from '../../Utils/useAppNavigation';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../Redux/Store';
import {useRoute} from '@react-navigation/native';
import ApiService from '../../ApiProviders/ApiService';
import {
  API_ENDPOINTS,
  IMAGE_URL_PLAYLIST,
  IMAGE_URL_VIDEOS,
} from '../../ApiProviders/ApiConfig';
import {WINDOW_WIDTH} from '../../Utils/DimensionsUtil';
import {COLORS} from '../../Utils/Colors';
import {AntDesign, FontAwesome} from '../../Utils/ReactIcons';
import CustomLoadingModal from '../../Modals/LoadingModal';
import MusicPlayModal from '../../Modals/MusicPlayModal';
import {setMinimizeView, setMusicTracker} from '../../Redux/MusicTrackerReducer';
import {
  addRunningPlaylist,
  setCurrentSong,
} from '../../Redux/RunningPlayListReducer';
var pageNumber = 1;
var extra: any = [];
const PopularTrendingScreen = () => {
  const dispatch = useDispatch();

  const ROUTE = useRoute();
  const navigation = useAppNavigation();
  const AUTH_TOKEN = useSelector(
    (state: RootState) => state.authToken.AUTH_TOKEN,
  );
  const MINIMIZED_VIEW = useSelector(
      (state: RootState) => state.musicTracker.MINIMIZED_VIEW,
    );

  const {Header_Name} = ROUTE.params as {Header_Name: 'MUSIC'};
  const {Type} = ROUTE.params as {Type: ''};
  const {Video_Id} = ROUTE.params as {Video_Id: ''};
  const [search, setSearch] = useState('');
  const [artistFav, setArtistFav] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState([]);

  const fetchPlayListData = async () => {
    setLoading(true);
    try {
      const response = await ApiService.get(
        API_ENDPOINTS.HOME.DETAILED_PLAY_LIST +
          '?page=' +
          pageNumber +
          '&type=' +
          Type +
          '&id=' +
          Video_Id +
          '&search=' +
          search,
      );
      const typedResponse = response as {
        success: boolean;
        message?: string;
        data?: any;
      };

      if (typedResponse.success) {
        console.log('typedResponse.data>>>', typedResponse);
        //@ts-ignore
        if (Type === 'genres') {
          setArtistFav(typedResponse.data.genre.genreFav + ''); //@ts-ignore
        } else if (Type === 'playlist') {
          setArtistFav(typedResponse.data.playlist.playlistFav + '');
        }

        if (typedResponse.data.videos.length == 0) {
          setPlaylist(typedResponse.data.videos);
        } else {
          const recnames = typedResponse.data.videos.map((obj: any) => {
            extra.push(obj);
            return obj;
          });
          setPlaylist(typedResponse.data.videos);
        }
      } else {
        console.log('response.message', typedResponse.message);
      }
    } catch (err: any) {
      console.log('err.message', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (AUTH_TOKEN) {
      fetchPlayListData();
    }
  }, [AUTH_TOKEN]);

  ////// ****** OPEN MODAL TO PLAY SONG ***** ////
  const handleItemPress = (item: any, playListData: any) => {
    setSelectedSong(item);
    dispatch(setMusicTracker(true));
    dispatch(addRunningPlaylist(playListData));
    dispatch(setCurrentSong(item));
    dispatch(setMinimizeView(false));
    setIsModalVisible(true);
  };

  ////// ****** METHOD TO ADD FAVORITE SONG ***** ////

  const handleAddFavoriteSong = async (
    Apitype: any,
    id: any,
    favstatus: any,
  ) => {
    try {
      const response = await ApiService.post<{
        success: boolean;
        message: string;
        data?: any;
      }>(API_ENDPOINTS.HOME.ADD_FAV_UN_FAV + '?type=' + Apitype, {
        id: id,
        fvalue: favstatus,
      });

      if (response.success) {
        console.log('Favorite added successfully:', response.message);
        extra = [];
        setPlaylist([]);

        fetchPlayListData();
        Alert.alert('Success', response.message);
      } else {
        Alert.alert('Error', response.message || 'Failed to add to favorites');
      }
    } catch (error: any) {
      console.log('Error adding favorite:', error);
      let errorMessage = 'Something went wrong';

      if (error.response) {
        errorMessage = error.response.data.message || 'Failed to add favorite';
      } else if (error.request) {
        errorMessage = 'No response from server. Check your network.';
      } else {
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    }
  };

  console.log('extraextraextraextraextra', extra);

  return (
    <SafeAreaView style={[HOME_SCREEN_STYLE.BG_CONTAINER, {flex: 1}]}>
      <HeaderWithBackButton
        title={
          Header_Name
            ? Header_Name.charAt(0).toUpperCase() + Header_Name.slice(1)
            : 'Music'
        }
        onBackButton={() => navigation.goBack()}
      />

 
      {loading && (
        <CustomLoadingModal isVisible={loading} message="Loading.." />
      )}

      {playlist.length == 0 ? (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Text
            style={{
              color: COLORS.WHITE_COLOR,
              marginLeft: 10,
              fontFamily: 'ProximaNova-Regular',
              fontSize: 15,
            }}>
            No Result Found
          </Text>
        </View>
      ) : (
        <FlatList
          data={extra}
          onEndReachedThreshold={0}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}: any) => {
            let _menu: any = null;
            // console.log(item.artists[0].full_name);

            return (
              <TouchableOpacity
                onPress={() => {
                  handleItemPress(item, extra);
                }}>
                <View
                  style={{
                    padding: 10,
                    flex: 1,
                    width: WINDOW_WIDTH,
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                  }}>
                  {item.image == null || item.image == '' ? (
                    <Image
                      style={{height: 80, width: 80, borderRadius: 15}}
                      source={{
                        uri: IMAGE_URL_VIDEOS,
                      }}></Image>
                  ) : (
                    <Image
                      style={{height: 80, width: 80, borderRadius: 15}}
                      source={{
                        uri: IMAGE_URL_VIDEOS + item.image,
                      }}></Image>
                  )}

                  <View
                    style={{
                      marginTop: 10,
                      marginLeft: 10,
                      justifyContent: 'center',
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        color: COLORS.WHITE_COLOR,
                        fontSize: 16,
                        fontFamily: 'ProximaNova-Regular',
                      }}>
                      {item.video_name}
                    </Text>
                    <Text
                      style={{
                        color: COLORS.GRAY,
                        fontSize: 14,
                        fontFamily: 'ProximaNova-Regular',
                      }}>
                      {item.artists[0]?.full_name ?? "Artist Name"}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: 10,
                      marginLeft: 10,
                      alignItems: 'flex-end',
                      flex: 1,
                      paddingLeft: 10,
                      justifyContent: 'flex-end',
                    }}>
                    <View style={{flexDirection: 'row', paddingRight: 10}}>
                      {
                        //@ts-ignore
                        Header_Name === 'Favorites' ? (
                          <TouchableOpacity
                            style={{height: 20, width: 20, marginRight: 10}}
                            onPress={() => {
                              Alert.alert(
                                '',

                                'Do you want to delete this song from your favourite list ?',
                                [
                                  {
                                    text: 'No',
                                    onPress: () =>
                                      console.log('Cancel Pressed'),
                                  },
                                  {
                                    text: 'Yes',
                                    onPress: () => {
                                      //  _addToFav('videos', item.id, '0');
                                    },
                                  },
                                ],
                              );
                            }}>
                            <AntDesign
                              name="delete"
                              size={20}
                              color={COLORS.PINK_COLOR}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={{height: 20, width: 20, marginRight: 10}}
                            onPress={() => {
                              handleAddFavoriteSong(
                                'videos',
                                item?.id,
                                item?.videoFav == 0 ? '1' : '0',
                              );
                            }}>
                            {item.videoFav == 0 ? (
                              <FontAwesome
                                name="heart-o"
                                size={20}
                                color={COLORS.WHITE_COLOR}
                              />
                            ) : (
                              <FontAwesome
                                name="heart"
                                size={20}
                                color={COLORS.PINK_COLOR}
                              />
                            )}
                          </TouchableOpacity>
                        )
                      }
                      {/* <TouchableOpacity
                        style={{height: 20, width: 20, marginRight: 10}}
                        onPress={() => {
                          if (item.songInPlaylist === 1) {
                            Alert.alert(
                              'Song is already added in the playlist.',
                            );
                          } else {
                            // navigation.navigate('CreatePlayListScreen', {
                            //   Headers: 'Add To Playlist',
                            //   SongName: item.video_name,
                            //   vedio_id: item.id,
                            // });
                          }
                        }}>
                        <FontAwesome
                          name="plus-square-o"
                          size={22}
                          color={COLORS.WHITE_COLOR}
                        />
                      </TouchableOpacity> */}

                      <View></View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default PopularTrendingScreen;
