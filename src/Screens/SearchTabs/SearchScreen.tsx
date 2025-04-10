import React, {useRef, useState, useEffect} from 'react';
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
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import CustomLoadingModal from '../../Modals/LoadingModal';
import {HOME_SCREEN_STYLE} from '../HomeTabs/HomeScreenStyle';
import {COLORS} from '../../Utils/Colors';
import SearchBox from '../../Utils/SearchBox';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../Utils/DimensionsUtil';
import {useAppNavigation} from '../../Utils/useAppNavigation';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/Store';
import ApiService from '../../ApiProviders/ApiService';
import {
  API_BASE_URL,
  API_ENDPOINTS,
  IMAGE_URL_ARTISTS,
  IMAGE_URL_GENRE,
  IMAGE_URL_PLAYLIST,
  IMAGE_URL_VIDEOS,
} from '../../ApiProviders/ApiConfig';
var PAGE_NUMBER = 1;
var ARRAY_ALL: any = [];
var ARTIST_ALL: any = [];

const images = [
  'img/playlist-video-img1.jpg',
  'img/playlist-video-img2.jpg',
  'img/playlist-video-img3.jpg',
  'img/playlist-video-img5.jpg',
];

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useAppNavigation();
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [artitsList, setArtitsList] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState(ARTIST_ALL);
const [filteredArray, setFilteredArray] = useState(ARRAY_ALL);

  const AUTH_TOKEN = useSelector(
    (state: RootState) => state.authToken.AUTH_TOKEN,
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [songsResponse, artistsResponse] = await Promise.all([
          ApiService.get(
            API_BASE_URL +
              'search' +
              '?page=' +
              PAGE_NUMBER +
              '&search=' +
              searchQuery,
          ),
          ApiService.get(
            API_BASE_URL +
              'searchArtist' +
              '?page=' +
              PAGE_NUMBER +
              '&search=' +
              searchQuery,
          ),
        ]);

        const songsTypedResponse = songsResponse as {
          success: boolean;
          message?: string;
          data?: any;
        };
        const artistsTypedResponse = artistsResponse as {
          success: boolean;
          message?: string;
          data?: any;
        };

        if (songsTypedResponse.success) {
          if (songsTypedResponse.data.length == 0) {
            setPlaylist(songsTypedResponse.data);
          } else {
            const recnames = songsTypedResponse.data.map((obj: any) => {
              ARRAY_ALL.push(obj);
              return obj;
            });
            setPlaylist(songsTypedResponse.data);
          }
        } else {
          console.log('Songs Error:', songsTypedResponse.message);
        }

        if (artistsTypedResponse.success) {
          if (artistsTypedResponse.data.length == 0) {
            setArtitsList(artistsTypedResponse.data.data);
          } else {
            const recnames = artistsTypedResponse.data.map((obj: any) => {
              ARTIST_ALL.push(obj);
              return obj;
            });
            setArtitsList(artistsTypedResponse.data);
          }
        } else {
          console.log('Artists Error:', artistsTypedResponse.message);
        }
      } catch (err: any) {
        console.log('Error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (AUTH_TOKEN) {
      fetchData();
    }
  }, [AUTH_TOKEN]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredArtists(ARTIST_ALL);
      setFilteredArray(ARRAY_ALL);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
  
      // Filter Artists
      const newFilteredArtists = ARTIST_ALL.filter(artist =>
        artist.name.toLowerCase().includes(lowerCaseQuery),
      );
  
      // Filter Other Items
      const newFilteredArray = ARRAY_ALL.filter(item =>
        item.name.toLowerCase().includes(lowerCaseQuery),
      );
  
      setFilteredArtists(newFilteredArtists);
      setFilteredArray(newFilteredArray);
    }
  }, [searchQuery, ARTIST_ALL, ARRAY_ALL]);

  // console.log('Artists Data:', artitsList);
  // console.log('Songs Data:', playlist);

  return (
    <SafeAreaView style={HOME_SCREEN_STYLE.BG_CONTAINER}>
      <CustomLoadingModal isVisible={loading} message="Loading" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <SearchBox
              placeholder="Music, Artist, Album"
              onSearch={(query: any) => setSearchQuery(query)}
              style={{marginVertical: 10, width: WINDOW_WIDTH - 20}}
            />
            <FlatList
              style={{
                marginTop: 10,
                marginBottom: 10,
                marginLeft: 5,
                marginRight: 5,
              }}
              scrollEnabled={true}
              data={[{key: 'key'}]}
              keyExtractor={(item, index) => index.toString()}
              onScrollEndDrag={() => console.log(' *********end', PAGE_NUMBER)}
              onScrollBeginDrag={() =>
                console.log(' *******start', PAGE_NUMBER)
              }
              onEndReachedThreshold={0}
              renderItem={({item, index}) => {
                return (
                  <View style={{flex: 1}}>
                    {ARTIST_ALL.length == 0 ? (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 1,
                        }}>
                        <Text
                          style={{
                            color: COLORS.WHITE_COLOR,
                            marginLeft: 10,
                            fontFamily: 'ProximaNova-Regular',
                            fontSize: 15,
                          }}></Text>
                      </View>
                    ) : (
                      <FlatList
                        style={{marginTop: 10, marginBottom: 10, flex: 1}}
                        scrollEnabled={true}
                        horizontal={true}
                        data={filteredArtists}
                        keyExtractor={(item, index) => index.toString()}
                        onScrollEndDrag={() =>
                          console.log(' *********end', PAGE_NUMBER)
                        }
                        onScrollBeginDrag={() =>
                          console.log(' *******start', PAGE_NUMBER)
                        }
                        onEndReachedThreshold={0}
                        renderItem={({item, index}) => {
                          return (
                            <View
                              style={{
                                marginRight: 8,
                                marginLeft: 8,
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                              }}>
                              <TouchableOpacity
                                style={{
                                  height: 100,
                                  width: 100,
                                  borderRadius: 150 / 2,
                                }}
                                onPress={() =>
                                  //@ts-ignore
                                  navigation.navigate('ArtistDetailsScreen', {
                                    Video_Id: item.id,

                                    Type: 'artists',
                                  })
                                }>
                                <Image
                                  style={{
                                    height: 100,
                                    width: 100,
                                    borderRadius: 150 / 2,
                                  }}
                                  source={{
                                    uri: IMAGE_URL_ARTISTS + item.image,
                                  }}></Image>
                              </TouchableOpacity>
                              <View
                                style={{
                                  marginTop: 10,
                                  justifyContent: 'center',
                                  width: 90,
                                  alignItems: 'center',
                                  alignContent: 'center',
                                }}>
                                <Text
                                  style={{
                                    color: COLORS.WHITE_COLOR,
                                    fontSize: 14,
                                    fontFamily: 'ProximaNova-Regular',
                                    alignItems: 'center',
                                  }}>
                                  {item.name}
                                </Text>
                              </View>
                            </View>
                          );
                        }}
                      />
                    )}

                    {ARRAY_ALL.length == 0 ? (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 1,
                          marginTop: WINDOW_HEIGHT / 2,
                        }}>
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
                        scrollEnabled={false}
                        numColumns={2}
                        data={filteredArray}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => {
                          const randomNumber = Math.floor(
                            Math.random() * images.length,
                          );

                          const randomBool = Math.floor(
                            () => Math.random() < 0.5, //@ts-ignore
                            [],
                          );

                          return (
                            <View
                              key={index}
                              style={{marginTop: 5, flex: 1, marginRight: 10}}>
                              {item.slug === 'playlists' ? (
                                <TouchableOpacity
                                  onPress={() =>
                                    //@ts-ignore
                                    navigation.navigate(
                                      //@ts-ignore
                                      'PopularTrendingScreen',
                                      {
                                        Header_Name: item.name,
                                        Video_Id: item.id,
                                        Type: 'playlist',
                                      },
                                    )
                                  }>
                                  <View>
                                    {item.image == null || item.image == '' ? (
                                      <Image
                                        style={{
                                          height: randomBool ? 150 : 200,
                                          marginLeft: 10,
                                          marginRight: 10,
                                          borderRadius: 10,
                                        }}
                                        source={{
                                          uri:
                                            'https://musicapp.betademo.net/' +
                                            images[randomNumber],
                                        }}
                                        resizeMode="cover"></Image>
                                    ) : (
                                      <Image
                                        style={{
                                          height: randomBool ? 150 : 250,
                                          borderRadius: 10,
                                          marginLeft: 10,
                                          marginRight: 10,
                                        }}
                                        source={{
                                          uri: IMAGE_URL_PLAYLIST + item.image,
                                        }}
                                        resizeMode="cover"></Image>
                                    )}
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <View>
                                  {item.slug === 'genres' ? (
                                    <TouchableOpacity
                                      onPress={() =>
                                        //@ts-ignore
                                        navigation.navigate(
                                          //@ts-ignore
                                          'PopularTrendingScreen',
                                          {
                                            Header_Name: item.name,
                                            Video_Id: item.id,
                                            Type: 'genres',
                                          },
                                        )
                                      }>
                                      <View
                                        style={{
                                          height: randomBool ? 150 : 250,
                                          justifyContent: 'center',
                                        }}>
                                        {item.image == null ? (
                                          <Image
                                            style={{
                                              height: '100%',

                                              borderRadius: 10,
                                            }}
                                            source={{
                                              uri: 'https://musicapp.betademo.net/aws-bkp/album.jpg',
                                            }}
                                            resizeMode="cover"></Image>
                                        ) : (
                                          <Image
                                            style={{
                                              height: '100%',

                                              borderRadius: 10,
                                            }}
                                            source={{
                                              uri: IMAGE_URL_GENRE + item.image,
                                            }}
                                            resizeMode="cover"></Image>
                                        )}

                                        <View
                                          style={{
                                            position: 'absolute',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            marginLeft: 55,
                                          }}>
                                          <Image
                                            style={{
                                              height: 30,
                                              width: 30,
                                              marginLeft: 7,
                                            }}
                                            source={{
                                              uri:
                                                IMAGE_URL_GENRE +
                                                'icon/' +
                                                item.icon,
                                            }}></Image>
                                          <Text
                                            style={{
                                              color: COLORS.WHITE_COLOR,
                                              fontSize: 13,
                                              alignItems: 'center',
                                              fontFamily: 'ProximaNova-Regular',
                                            }}>
                                            {item.name}
                                          </Text>
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  ) : (
                                    <View>
                                      {item.slug === 'video' ? (
                                        <TouchableOpacity>
                                          <View>
                                            {item.image == null ? (
                                              <Image
                                                style={{
                                                  height: randomBool
                                                    ? 150
                                                    : 250,
                                                  borderRadius: 10,
                                                }}
                                                source={{
                                                  uri: 'https://musicapp.betademo.net/aws-bkp/album.jpg',
                                                }}
                                                resizeMode="cover"></Image>
                                            ) : (
                                              <Image
                                                style={{
                                                  height: randomBool
                                                    ? 150
                                                    : 250,
                                                  borderRadius: 10,
                                                }}
                                                source={{
                                                  uri:
                                                    IMAGE_URL_VIDEOS +
                                                    item.image,
                                                }}
                                                resizeMode="cover"></Image>
                                            )}
                                          </View>
                                        </TouchableOpacity>
                                      ) : (
                                        <View></View>
                                      )}
                                    </View>
                                  )}
                                </View>
                              )}

                              {item.slug === 'playlists' ||
                              item.slug === 'video' ? (
                                <View style={{marginLeft: 10, marginTop: 10}}>
                                  <Text
                                    style={{
                                      flexShrink: 1,
                                      color: COLORS.WHITE_COLOR,
                                      fontSize: 13,
                                      fontFamily: 'ProximaNova-Regular',
                                      flexWrap: 'wrap',
                                    }}>
                                    {item.name}
                                  </Text>

                                  <Text
                                    style={{
                                      flexShrink: 1,
                                      color: COLORS.WHITE_COLOR,
                                      fontSize: 13,
                                      fontFamily: 'ProximaNova-Regular',
                                      flexWrap: 'wrap',
                                    }}>
                                    {item.artistname}
                                  </Text>
                                </View>
                              ) : (
                                <View style={{margin: 10}}>
                                  <Text
                                    style={{
                                      flexShrink: 1,
                                      color: COLORS.WHITE_COLOR,
                                      fontSize: 13,
                                      fontFamily: 'ProximaNova-Regular',
                                      flexWrap: 'wrap',
                                    }}>
                                    {item.name}
                                  </Text>
                                </View>
                              )}
                            </View>
                          );
                        }}
                      />
                    )}
                  </View>
                );
              }}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    marginTop: 15,
    fontWeight: 'bold',
    color: COLORS.WHITE_COLOR,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 15,
    textAlign: 'center',
    color: COLORS.WHITE_COLOR,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 20,
    textAlign: 'center',
    marginHorizontal: 5,
    color: '#000',
  },
});

export default SearchScreen;
