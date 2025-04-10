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
} from '../../ApiProviders/ApiConfig';
import {WINDOW_WIDTH} from '../../Utils/DimensionsUtil';
import {COLORS} from '../../Utils/Colors';
const ArtistScreen = () => {
  const ROUTE = useRoute();

  const {Header_Name} = ROUTE.params as {Header_Name: 'MUSIC'};

  console.log('ROUTE', Header_Name);

  const {Type} = ROUTE.params as {Type: ''};
  const [artistList, setArtistList] = useState([]);

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
    const fetchArtistDetails = async () => {
      setLoading(true);
      try {
        const response = await ApiService.get(
          //@ts-ignore
          Type === 'My Music'
            ? API_ENDPOINTS.HOME.MYMUSIC
            : API_ENDPOINTS.HOME.ARTIST_LIST,
        );
        const typedResponse = response as {
          success: boolean;
          message?: string;
          data?: any;
        }; // Define the expected structure

        if (typedResponse.success) {

          //@ts-ignore
          if (Type === 'My Music') {
            setArtistList(typedResponse.data.artists);
          } else {
            setArtistList(typedResponse.data);
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
      fetchArtistDetails();
    }
  }, [AUTH_TOKEN]);
  console.log('ROUTEROUTEROUTE', artistList);
  return (
    <SafeAreaView style={[HOME_SCREEN_STYLE.BG_CONTAINER, {flex: 1}]}>
      <HeaderWithBackButton
        title={
          //@ts-ignore
          Type === 'My Music' ? 'Liked Artists' : 'Artists'
        }
        onBackButton={() => navigation.goBack()}
      />

      {artistList.length == 0 ? (
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
          style={{marginBottom: 50}}
          horizontal={false}
          numColumns={3}
          data={artistList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={
                  () => //@ts-ignore
                  navigation.navigate('ArtistDetailsScreen', {//@ts-ignore
                    Video_Id: item.id,
                    Type: 'artists',
                  })
                }>
                <View
                  style={{
                    flex: 1 / 3,
                    marginBottom: 20,
                    maxWidth: itemWidth,
                    minWidth: itemWidth,
                  }}>
                  <Image
                    style={{
                      borderRadius: itemWidth - 15 / 2,
                      width: itemWidth - 15,
                      height: itemWidth - 15,
                    }} //@ts-ignore
                    source={{uri: IMAGE_URL_ARTISTS + item.image}}></Image>

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
                            //  _addToFav('artists', item.id, '0');
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

                  <View
                    style={{
                      marginTop: 5,
                      marginLeft: 2,
                      marginRight: 5,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: COLORS.WHITE_COLOR,
                        fontSize: 14,
                        fontFamily: 'ProximaNova-Regular',
                        justifyContent: 'center',
                      }}>
                      {
                        //@ts-ignore
                        item.full_name
                      }
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

export default ArtistScreen;
