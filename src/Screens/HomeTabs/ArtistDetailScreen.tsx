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
  IMAGE_URL_ARTISTS,
  IMAGE_URL_VIDEOS,
} from '../../ApiProviders/ApiConfig';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../Utils/DimensionsUtil';
import {COLORS} from '../../Utils/Colors';
import {FontAwesome} from '../../Utils/ReactIcons';
import MusicPlayModal from '../../Modals/MusicPlayModal';
import {setMinimizeView, setMusicTracker} from '../../Redux/MusicTrackerReducer';
import {
  addRunningPlaylist,
  setCurrentSong,
} from '../../Redux/RunningPlayListReducer';

var pageNumber = 1;
var extra: any = [];
const ArtistDetailsScreen = () => {
  const ROUTE = useRoute();
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [search, setSearch] = useState('');
  const {Type} = ROUTE.params as {Type: ''};
  const {Video_Id} = ROUTE.params as {Video_Id: ''};
  const navigation = useAppNavigation();
  const AUTH_TOKEN = useSelector(
    (state: RootState) => state.authToken.AUTH_TOKEN,
  );
   const MINIMIZED_VIEW = useSelector(
      (state: RootState) => state.musicTracker.MINIMIZED_VIEW,
    );

  const [loading, setLoading] = useState(false);
  const itemWidth = (WINDOW_WIDTH - 25) / 3;
  const images = [
    'img/playlist-video-img1.jpg',
    'img/playlist-video-img2.jpg',
    'img/playlist-video-img3.jpg',
    'img/playlist-video-img5.jpg',
  ];

  const [artistList, setArtistList] = useState([]);
  const [artistName, setArtistName] = useState('');
  const [artistDes, setArtistDes] = useState('');
  const [artistImage, setArtistImage] = useState('');
  const [artistId, setArtistId] = useState('');
  const [artistFav, setArtistFav] = useState('');
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    const fetchPopularSongData = async () => {
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
        }; // Define the expected structure

        if (typedResponse.success) {
          setArtistName(typedResponse.data.artist.full_name);
          setArtistDes(typedResponse.data.artist.description);
          setArtistImage(typedResponse.data.artist.image);
          setArtistFav(typedResponse.data.artist.artistFav + '');
          setArtistId(typedResponse.data.artist.id);

          if (!loading) {
            extra = [];
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

    if (AUTH_TOKEN) {
      fetchPopularSongData();
    }
  }, [AUTH_TOKEN]);

  console.log('artistImage >>>> ', artistImage);
  console.log('artistName >>>> ', artistName);
  console.log('artistList >>>> ', artistList);
  console.log('artistId >>> ', artistId);
  console.log('artistDes >>>> ', artistDes);
  console.log('artistFav >>>> ', artistFav);

  ////// ****** OPEN MODAL TO PLAY SONG ***** ////
  const handleItemPress = (item: any, playListData: any) => {
    setSelectedSong(item);
    setIsModalVisible(true);
    dispatch(addRunningPlaylist(playListData));
    dispatch(setCurrentSong(item));
    dispatch(setMusicTracker(true));
     dispatch(setMinimizeView(false));
    
  };

  return (
    <SafeAreaView style={[HOME_SCREEN_STYLE.BG_CONTAINER, {flex: 1}]}>
      <HeaderWithBackButton
        title={artistName}
        onBackButton={() => navigation.goBack()}
      />

  
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
          style={{marginBottom: 10}}
          horizontal={false}
          data={extra}
          onEndReachedThreshold={0}
          ListHeaderComponent={() => (
            <View
              style={{height: WINDOW_HEIGHT / 2.5, justifyContent: 'center'}}>
              <View
                style={{
                  alignItems: 'center',
                  width: WINDOW_WIDTH,
                  flexDirection: 'column',
                }}>
                <Image
                  style={{
                    width: WINDOW_WIDTH,
                    height: WINDOW_WIDTH,
                    borderRadius: 10,
                    // overflow: 'hidden',
                    borderWidth: 3,
                    borderColor: COLORS.PINK_COLOR,
                  }}
                  source={{uri: IMAGE_URL_ARTISTS + artistImage}}></Image>

                {/* <Text
                  style={{
                    color: COLORS.WHITE_COLOR,
                    fontSize: 16,
                    fontFamily: 'ProximaNova-Regular',
                    marginTop: 10,
                  }}>
                  {artistName}
                </Text> */}
                {/* <Text
                  style={{
                    color: COLORS.GRAY,
                    fontSize: 14,
                    fontFamily: 'ProximaNova-Regular',
                  }}>
                  {artistDes}
                </Text> */}

                {extra.length > 0 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: WINDOW_WIDTH,
                      marginTop: 15,
                      marginBottom: 90,
                      paddingHorizontal: 10,
                    }}>
                    {/* Top Song Section */}
                    <View
                      style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                      <Text
                        style={{
                          color: COLORS.WHITE_COLOR,
                          fontSize: 18,
                          fontFamily: 'ProximaNova-Regular',
                          marginLeft: 8,
                          fontWeight: '600',
                        }}>
                        Top Song
                      </Text>
                    </View>

                    {/* Play All Button */}
                    <TouchableOpacity
                      onPress={() => {
                        // if (extra.length > 0) {
                        //   global.songlist = extra;
                        //   global.index = 0;
                        //   global.download = false;
                        //   EventRegister.emit('showbar', 'it works!!!');
                        // }
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: COLORS.PINK_COLOR,
                        borderRadius: 25,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                      }}>
                      <FontAwesome name="play-circle" size={22} color="white" />
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 18,
                          fontFamily: 'ProximaNova-Regular',
                          marginLeft: 5,
                        }}>
                        Play All
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text
                    style={{
                      color: COLORS.GRAY,
                      fontSize: 18,
                      marginTop: 30,

                      justifyContent: 'center',
                      fontFamily: 'ProximaNova-Regular',
                    }}>
                    No songs Added
                  </Text>
                )}
              </View>
            </View>
          )}
          //extraData={state}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            let _menu: any = null;
            return (
              <TouchableOpacity
                onPress={() => {
                  handleItemPress(item, extra);
                }}>
                <View
                  style={{
                    padding: 10,
                    flex: 1,
                    // marginTop: 100,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignContent: 'flex-start',
                  }}>
                  {item.image == null ? (
                    <Image
                      style={{height: 80, width: 80, borderRadius: 15}}
                      source={{
                        uri: 'http://musicapp.betademo.net/aws-bkp/album.jpg',
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
                      {item.video_name}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: 10,
                      marginLeft: 10,
                      alignItems: 'center',
                      flex: 1,
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      style={{marginRight: 10, height: 20, width: 20}}
                      onPress={() => {
                        // _addToFav(
                        //   'videos',
                        //   item.id,
                        //   item.videoFav == 0 ? '1' : '0',
                        // );
                      }}>
                      {/* {item.videoFav == 0 ? (
                            <Heart
                              width={20}
                              height={20}
                              marginLeft={20}></Heart>
                          ) : (
                            <Heartfill
                              width={20}
                              height={20}
                              marginLeft={20}></Heartfill>
                          )} */}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{}}
                      onPress={() => {
                        if (item.songInPlaylist === 1) {
                          Alert.alert('Song is already added in the playlist.');
                        } else {
                          // navigation.navigate('CreatePlayListScreen', {
                          //   Headers: 'Add To Playlist',
                          //   SongName: item.video_name,
                          //   vedio_id: item.id,
                          // });
                        }
                      }}>
                      {/* <Addsquare
                            height={20}
                            width={20}
                            marginLeft={20}></Addsquare> */}
                    </TouchableOpacity>
                    <View style={{flex: 1}}>
                      {/* <Menu
                            style={{ backgroundColor: 'rgba(52, 52, 52, 0.8)', marginTop: 21 }}
                            ref={ref => (_menu = ref)}
                            button={
                              <TouchableOpacity
                                style={{ flex: 1 / 3 }}
                                onPress={() => _menu.show()}>
                                <MoreSquare
                                  height={20}
                                  width={20}
                                  marginLeft={10}></MoreSquare>
                              </TouchableOpacity>
                            }>
                            <TouchableOpacity
                              onPress={() => {
                                let url =
                                  SHAREVIDEO + item.video_name + '.' + item.id;

                                Share.share({
                                  message: SHAREMESSAGE + url,
                                  url: SHAREMESSAGE + url,
                                })
                                  //after successful share return result
                                  .then(result => {
                                    _menu.hide();

                                    console.log(result);
                                  })
                                  //If any thing goes wrong it comes here
                                  .catch(errorMsg => console.log(errorMsg));
                              }}>
                              <View style={{ flexDirection: 'row', margin: 16 }}>
                                <Sharee
                                  width={25}
                                  height={20}
                                  marginRight={10}></Sharee>
                                <Text
                                  style={{
                                    fontFamily: 'ProximaNova-Regular',
                                    color: 'white',
                                  }}>
                                  Share
                                </Text>
                                <View style={{ marginLeft: 10 }}></View>
                              </View>
                            </TouchableOpacity>

                            <MenuDivider style={{ background: 'white' }} />

                            <TouchableOpacity
                              onPress={async () => {
                                _menu.hide();
                                let path =
                                  'file://' + RNFS.DocumentDirectoryPath + '/' + userId;

                                RNFS.exists(path).then(exists => {
                                  if (exists) {
                                    console.log('BLAH EXISTS');
                                  } else {
                                    console.log('BLAH DOES NOT EXIST');
                                    RNFS.mkdir(path);
                                  }
                                });
                                let exist = await verifyFiles(
                                  'file://' +
                                  RNFS.DocumentDirectoryPath + "/" + userId +
                                  '/' +
                                  item.video,
                                );
                                if (exist) {
                                  // Toast('File already exists');
                                  verifyDb(global.songlist[global.index].id)

                                } else {
                                  setIsLoading(true);

                                  onDownloadImagePress(
                                    item.video,
                                    item.video_name,
                                    item.id,
                                    item.artists[0].full_name,
                                    item.audio,
                                    item.image,
                                  );

                                }
                              }}>
                              <View style={{ flexDirection: 'row', margin: 16 }}>
                                <Download
                                  width={25}
                                  height={20}
                                  resizeMode="contain"
                                  marginRight={10}></Download>
                                <Text
                                  style={{
                                    fontFamily: 'ProximaNova-Regular',
                                    color: 'white',
                                  }}>
                                  {' '}
                                  Cache offline
                                </Text>
                                <View style={{ marginLeft: 10 }}></View>
                              </View>
                            </TouchableOpacity>
                          </Menu> */}
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

export default ArtistDetailsScreen;
