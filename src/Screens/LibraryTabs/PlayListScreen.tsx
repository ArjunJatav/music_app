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
import ApiService from '../../ApiProviders/ApiService';
import {API_ENDPOINTS, IMAGE_URL_PLAYLIST} from '../../ApiProviders/ApiConfig';
import { WINDOW_WIDTH } from '../../Utils/DimensionsUtil';
import { COLORS } from '../../Utils/Colors';

const PlayListScreen = () => {
  const navigation = useAppNavigation();
  const AUTH_TOKEN = useSelector(
    (state: RootState) => state.authToken.AUTH_TOKEN,
  );
  const [loading, setLoading] = useState(false);
  const [plylist, setPlayList] = useState([]);
  const images = [
    'img/playlist-video-img1.jpg',
    'img/playlist-video-img2.jpg',
    'img/playlist-video-img3.jpg',
    'img/playlist-video-img5.jpg',
  ];
  const itemWidth = (WINDOW_WIDTH - 25) / 3;

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const response = await ApiService.get(
          API_ENDPOINTS.HOME.PLAYLIST_FAVORITELIST,
        );
        const typedResponse = response as {
          success: boolean;
          message?: string;
          data?: any;
        }; // Define the expected structure

        if (typedResponse.success) {
          console.log('typedResponse', typedResponse);
          setPlayList(typedResponse.data);
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

  return (
    <SafeAreaView style={[HOME_SCREEN_STYLE.BG_CONTAINER, {flex: 1,  alignItems:"flex-start"}]}>
      <HeaderWithBackButton
        title={'Playlist'}
        onBackButton={() => navigation.goBack()}
      />
       <FlatList
              // style={{margin: 15, marginBottom: 60}}
              horizontal={false}
              numColumns={3}
              data={plylist}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}: any) => {
                const randomNumber = Math.floor(Math.random() * images.length);
                return (
                  <TouchableOpacity
                    onPress={() =>
                      //@ts-ignore
      
                      navigation.navigate('PopularTrendingScreen', {
                        Header_Name: item.full_name,
                        Video_Id: item.id,
                        Type: 'playlist',
                      })
                    }>
                    <View
                      style={{
                        flex: 1 / 3,
                        marginBottom: 20,
                        
                        maxWidth: itemWidth,
                        minWidth: itemWidth,
                      }}>
                      {item.image == null || item.image == '' ? (
                        <Image
                          style={{
                            borderRadius: 15,
                            width: itemWidth - 15,
                            height: itemWidth - 15,
                          }}
                          source={{
                            uri:
                              'https://musicapp.betademo.net/' + images[randomNumber],
                          }}></Image>
                      ) : (
                        <Image
                          style={{
                            borderRadius: 15,
                            width: itemWidth - 15,
                            height: itemWidth - 15,
                          }}
                          source={{uri: IMAGE_URL_PLAYLIST + item.image}}></Image>
                      )}
      
               
      
                      <View style={{marginTop: 5, marginLeft: 2, marginRight: 5}}>
                        <View style={{flex: 1 / 3}}>
                          <Text
                            style={{
                              flexShrink: 1,
                              color: COLORS.WHITE_COLOR,
                              fontSize: 13,
                              fontFamily: 'ProximaNova-Regular',
                              flexWrap: 'wrap',
                            }}>
                            {item.full_name}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: COLORS.GRAY,
                            fontSize: 12,
                            fontFamily: 'ProximaNova-Regular',
                          }}>
                          {item.description}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
    </SafeAreaView>
  );
};

export default PlayListScreen;
