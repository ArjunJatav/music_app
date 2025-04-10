import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import {COLORS} from '../../Utils/Colors';
import {Fontisto} from '../../Utils/ReactIcons';
import {WINDOW_WIDTH} from '../../Utils/DimensionsUtil';
import {
  IMAGE_URL_VIDEOS,
  IMAGE_URL_PLAYLIST,
  IMAGE_URL_ARTISTS,
  IMAGE_URL_GENRE,
} from '../../ApiProviders/ApiConfig';
import {useAppNavigation} from '../../Utils/useAppNavigation';
import {useDispatch, useSelector} from 'react-redux';
import {
  setMinimizeView,
  setMusicTracker,
} from '../../Redux/MusicTrackerReducer';
import {
  addRunningPlaylist,
  setCurrentSong,
} from '../../Redux/RunningPlayListReducer';
import {RootState} from '../../Redux/Store';

interface MusicListWithHeaderProps {
  title: string;
  onMorePress: () => void;
  data: any[];
}

const MusicListWithHeader: React.FC<MusicListWithHeaderProps> = ({
  title,
  onMorePress,
  data,
}) => {
  const navigation = useAppNavigation();
  const dispatch = useDispatch();
  const handleItemPress = (item: any, title: string, playListData: any) => {
    switch (title) {
      case 'Popular & Trending':
        dispatch(setMusicTracker(true));
        dispatch(addRunningPlaylist(playListData));
        dispatch(setCurrentSong(item));
        dispatch(setMinimizeView(false));
        break;
      case 'Public Playlist': //@ts-ignore
        navigation.navigate('PopularTrendingScreen', {
          Header_Name: item.full_name,
          Video_Id: item.id,
          Type: 'playlist',
        });
        break;
      case 'Artist': //@ts-ignore
        navigation.navigate('ArtistDetailsScreen', {
          Video_Id: item.id,
          Type: 'artists',
        });
        break;
      case 'Genre': //@ts-ignore
        navigation.navigate('PopularTrendingScreen', {
          Header_Name: item.full_name,
          Video_Id: item.id,
          Type: 'genres',
        });
        break;
      default:
        console.warn('Unknown title:', title);
    }
  };

  const getImageUrl = (item: any) => {
    const imageMap: Record<string, string> = {
      'Popular & Trending': IMAGE_URL_VIDEOS,
      'Public Playlist': IMAGE_URL_PLAYLIST,
      Artist: IMAGE_URL_ARTISTS,
      Genre: IMAGE_URL_GENRE,
    };
    return `${imageMap[title] || IMAGE_URL_VIDEOS}${item.image}`;
  };

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.itemBox}
      onPress={() => handleItemPress(item, title, data)}>
      <View style={styles.image}>
        <Image
          source={{uri: getImageUrl(item)}}
          resizeMode="cover"
          style={{height: '100%', width: '100%'}}
        />
      </View>

      <View style={styles.textContainer}>
        {title === 'Artist' ? (
          <Text style={styles.songName} numberOfLines={1}>
            {item?.full_name ?? 'Unknown Artist'}
          </Text>
        ) : title === 'Public Playlist' ? (
          <Text style={styles.songName} numberOfLines={1}>
            {item?.full_name ?? 'Unknown Playlist'}
          </Text>
        ) : (
          <>
            <Text style={styles.songName} numberOfLines={1}>
              {item?.description ?? item?.video_name ?? 'Unknown Song'}
            </Text>
            <Text style={styles.singerName} numberOfLines={1}>
              {item?.full_name ??
                item?.artists?.[0]?.full_name ??
                'Unknown Artist'}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {data.length > 3 && (
          <TouchableOpacity style={styles.moreButton} onPress={onMorePress}>
            <Text style={styles.moreText}>More</Text>
            <Fontisto name="angle-right" size={12} color={COLORS.WHITE_COLOR} />
          </TouchableOpacity>
        )}
      </View>

      {/* Content Section */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'ProximaNovaA-Bold',
    color: COLORS.WHITE_COLOR,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PINK_COLOR,
    padding: 8,
    borderRadius: 15,
  },
  moreText: {
    fontWeight: '400',
    color: COLORS.WHITE_COLOR,
    marginRight: 4,
  },
  itemBox: {
    height: WINDOW_WIDTH * 0.35,
    width: WINDOW_WIDTH / 3.5,
    marginRight: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '75%',
    // resizeMode: 'cover',
    overflow: 'hidden',
    borderRadius: 10,
  },
  textContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingRight: 5,
  },
  songName: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.WHITE_COLOR,
  },
  singerName: {
    fontSize: 12,
    color: COLORS.GRAY,
  },
});

export default MusicListWithHeader;
