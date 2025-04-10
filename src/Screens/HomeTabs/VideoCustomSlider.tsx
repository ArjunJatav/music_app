import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../Utils/DimensionsUtil';
import {IMAGE_URL_VIDEOS} from '../../ApiProviders/ApiConfig';
import MusicPlayModal from '../../Modals/MusicPlayModal';
import {useDispatch, useSelector} from 'react-redux';
import {setMinimizeView, setMusicTracker} from '../../Redux/MusicTrackerReducer';
import {
  addRunningPlaylist,
  setCurrentSong,
} from '../../Redux/RunningPlayListReducer';
import { RootState } from '../../Redux/Store';

const VideoCustomSlider = ({data}: any) => {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const dispatch = useDispatch();
  const MINIMIZED_VIEW = useSelector(
    (state: RootState) => state.musicTracker.MINIMIZED_VIEW,
  );
  const handleItemPress = (item: any, playListData: any) => {
    dispatch(setMusicTracker(true));
    dispatch(addRunningPlaylist(playListData));
    dispatch(setCurrentSong(item));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => {
        const nextIndex = prevIndex === data.length - 1 ? 0 : prevIndex + 1;
        scrollRef.current?.scrollTo({
          x: nextIndex * WINDOW_WIDTH,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [data.length]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={event => {
          const slideIndex = Math.round(
            event.nativeEvent.contentOffset.x / WINDOW_WIDTH,
          );
          setActiveIndex(slideIndex);
        }}>
        {data.map((item: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={styles.slide}
            onPress={() => handleItemPress(item, data)}>
            <Image
              source={{uri: IMAGE_URL_VIDEOS + item.image}}
              style={styles.image}
              resizeMode='cover'
              
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    width: WINDOW_WIDTH, // Ensure full width for proper centering
    height: WINDOW_HEIGHT * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: WINDOW_WIDTH - 30, // Adjust width to prevent stretching
    height: '100%',
    resizeMode: 'cover',
    overflow:"hidden",
    borderRadius: 10,
  },
});

export default VideoCustomSlider;
