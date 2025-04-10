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
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/Store';
import {useRoute} from '@react-navigation/native';
import ApiService from '../../ApiProviders/ApiService';
import {
  API_ENDPOINTS,
  IMAGE_URL_ARTISTS,
  IMAGE_URL_GENRE,
} from '../../ApiProviders/ApiConfig';
import {WINDOW_WIDTH} from '../../Utils/DimensionsUtil';
import {COLORS} from '../../Utils/Colors';
const GenreScreen = () => {
  const ROUTE = useRoute();

  const {Header_Name} = ROUTE.params as {Header_Name: 'MUSIC'};

  console.log('ROUTE', Header_Name);

  const {Type} = ROUTE.params as {Type: ''};
  const [genreList, setGenreList] = useState([]);

  //   const {isScreenFrom} = ROUTE.params as {isScreenFrom: string};
  const [loading, setLoading] = useState(false);
  const itemWidth = (WINDOW_WIDTH - 25) / 3;
  const images = [
    'img/playlist-video-img1.jpg',
    'img/playlist-video-img2.jpg',
    'img/playlist-video-img3.jpg',
    'img/playlist-video-img5.jpg',
  ];

  const navigation = useAppNavigation();

  const AUTH_TOKEN = useSelector(
    (state: RootState) => state.authToken.AUTH_TOKEN,
  );

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const response = await ApiService.get(
          //@ts-ignore
          Type === 'My Music'
            ? API_ENDPOINTS.HOME.MYMUSIC
            : API_ENDPOINTS.HOME.GENRE_LIST,
        );
        const typedResponse = response as {
          success: boolean;
          message?: string;
          data?: any;
        }; // Define the expected structure

        if (typedResponse.success) {
          //@ts-ignore
          if (Type === 'My Music') {
            setGenreList(typedResponse.data.genres);
          } else {
            setGenreList(typedResponse.data);
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
      fetchHomeData();
    }
  }, [AUTH_TOKEN]);
  console.log('ROUTEROUTEROUTE', genreList);
  return (
    <SafeAreaView style={[HOME_SCREEN_STYLE.BG_CONTAINER, {flex: 1}]}>
      <HeaderWithBackButton
        title={
          //@ts-ignore
          Type === 'My Music' ? 'Liked Genres' : 'Genres'
        }
        onBackButton={() => navigation.goBack()}
      />
      {genreList.length == 0 ? (
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
          horizontal={false}
          numColumns={3}
          data={genreList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}: any) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  //@ts-ignore
                  navigation.navigate('PopularTrendingScreen', {
                    Header_Name: item.full_name,
                    Video_Id: item.id,
                    Type: 'genres',
                  })
                }>
                <View
                  style={{
                    flex: 1 / 3,
                    marginBottom: 20,
                    maxWidth: itemWidth,
                    minWidth: itemWidth,
                  }}>
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                      style={{
                        borderRadius: 15,
                        width: itemWidth - 15,
                        height: itemWidth - 15,
                      }}
                      source={{uri: IMAGE_URL_GENRE + item.image}}></Image>
                    <View
                      style={{
                        position: 'absolute',
                        alignContent: 'center',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{height: 30, width: 30}}
                        source={{
                          uri: IMAGE_URL_GENRE + 'icon/' + item.icon_image,
                        }}></Image>
                      <Text
                        style={{
                          color: COLORS.WHITE_COLOR,
                          fontSize: 13,
                          fontFamily: 'ProximaNova-Regular',
                        }}>
                        {item.full_name}
                      </Text>
                    </View>
                  </View>

                  {
                    //@ts-ignore

                    Type === 'My Music' ? (
                      <View
                        style={{
                          position: 'absolute',
                          backgroundColor: COLORS.WHITE_COLOR,
                          borderRadius: 30,
                          padding: 5,
                          height: 30,
                          width: 30,
                          alignItems: 'center',
                          marginLeft: 75,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            // _addToFav('genres', item.id, '0');
                          }}>
                          {/* <Delete
                            height={20}
                            width={15}
                            alignItems={'center'}></Delete> */}
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View></View>
                    )
                  }
                  <View style={{marginTop: 5, marginLeft: 2, marginRight: 5}}>
                    <Text
                      style={{
                        color: COLORS.GRAY,
                        fontSize: 12,
                        fontFamily: 'ProximaNova-Regular',
                      }}>
                      {' '}
                      {item.description}
                    </Text>
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

export default GenreScreen;
