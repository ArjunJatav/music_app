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
import { WINDOW_WIDTH } from '../../Utils/DimensionsUtil';
import ApiService from '../../ApiProviders/ApiService';
import { API_ENDPOINTS, IMAGE_URL_VIDEOS } from '../../ApiProviders/ApiConfig';
import { COLORS } from '../../Utils/Colors';
import { AntDesign, FontAwesome } from '../../Utils/ReactIcons';
import { addRunningPlaylist, setCurrentSong } from '../../Redux/RunningPlayListReducer';
import { setMinimizeView, setMusicTracker } from '../../Redux/MusicTrackerReducer';
const MyMusicScreen = () => {
  const navigation = useAppNavigation();
  const dispatch = useDispatch();

  const AUTH_TOKEN = useSelector(
    (state: RootState) => state.authToken.AUTH_TOKEN,
  );
  const [loading, setLoading] = useState(false);
  const [favList, setFavList] = useState([]);
  const images = [
    'img/playlist-video-img1.jpg',
    'img/playlist-video-img2.jpg',
    'img/playlist-video-img3.jpg',
    'img/playlist-video-img5.jpg',
  ];
  const itemWidth = (WINDOW_WIDTH - 25) / 3;


  useEffect(() => {
    

    if (AUTH_TOKEN) {
      fetchFavData();
    }
  }, [AUTH_TOKEN]);

  const fetchFavData = async () => {
    setLoading(true);
    try {
      const response = await ApiService.get(
        API_ENDPOINTS.HOME.FAVOURITES_LIST,
      );
      const typedResponse = response as {
        success: boolean;
        message?: string;
        data?: any;
      }; // Define the expected structure

      if (typedResponse.success) {
        console.log('typedResponse', typedResponse);
        setFavList(typedResponse.data);
      } else {
        console.log('response.message', typedResponse.message);
      }
    } catch (err: any) {
      console.log('err.message', err.message);
    } finally {
      setLoading(false);
    }
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
        // extra = [];
        setFavList([]);

        fetchFavData();
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

   ////// ****** OPEN MODAL TO PLAY SONG ***** ////
    const handleItemPress = (item: any, playListData: any) => {
      // setSelectedSong(item);
      // setIsModalVisible(true);
      dispatch(addRunningPlaylist(playListData));
      dispatch(setCurrentSong(item));
      dispatch(setMusicTracker(true));
       dispatch(setMinimizeView(false));
      
    };
  return (
    <SafeAreaView style={[HOME_SCREEN_STYLE.BG_CONTAINER, {flex: 1}]}>
      <HeaderWithBackButton
        title={
           'Favourites'
        }
        onBackButton={() => navigation.goBack()}
      />
          {favList.length == 0 ? (
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
                data={favList}
                onEndReachedThreshold={0}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}: any) => {
                  let _menu: any = null;
                  // console.log(item.artists[0].full_name);
      
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        handleItemPress(item, favList);
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

export default MyMusicScreen;
