import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, BackHandler, Platform} from 'react-native';
import Video from 'react-native-video';
import {COLORS} from '../Utils/Colors';
import {
  FontAwesome,
  Fontisto,
  MaterialIcons,
  Octicons,
} from '../Utils/ReactIcons';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../Utils/DimensionsUtil';
import {IMAGE_URL_VIDEOS, VIDEO_BASE_URL} from '../ApiProviders/ApiConfig';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../Redux/Store';
import {setCurrentSong} from '../Redux/RunningPlayListReducer';
import Slider from '@react-native-community/slider';
const MusicPlayModal = ({song, onOptionsPress}: any) => {
  const [isRepeat, setIsRepeat] = useState(false);
  const [CurrentSongHere, setCurrentSongHere] = useState(null);

  const dispatch = useDispatch();

  const RUNNING_PLAYLIST = useSelector(
    (state: RootState) => state.runningPlaylists.runningPlaylists,
  );
  const CURRENT_RUNNING_SONG = useSelector(
    (state: RootState) => state.runningPlaylists.currentSong,
  );

  const [isMinimized, setIsMinimized] = useState(false);

  const deepFlattenedPlaylist = RUNNING_PLAYLIST.flat(Infinity);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); //@ts-ignore
  const videoRef = useRef<Video>(null);
  const [songDuration, setSongDuration] = useState(
    //@ts-ignore
    CurrentSongHere?.duration ?? 30,
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (CURRENT_RUNNING_SONG) {
      //@ts-ignore
      setCurrentSongHere(CURRENT_RUNNING_SONG);
      setIsPlaying(true);
    }
  }, [CURRENT_RUNNING_SONG]);

  useEffect(() => {
    setElapsedTime(0); //@ts-ignore
    setSongDuration(CurrentSongHere?.duration ?? 30);
    setIsPlaying(true);
  }, [CurrentSongHere]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleRepeatToggle = () => {
    setIsRepeat(!isRepeat);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  const toggleMinimizScreen = () => {
    setIsMinimized(!isMinimized);

    if (videoRef.current) {
      setElapsedTime(prevElapsedTime => prevElapsedTime);
    }
  };

  const handleNextSong = () => {
    if (!CurrentSongHere) return;
    const currentIndex = deepFlattenedPlaylist.findIndex(
      //@ts-ignore
      (item: any) => item?.video === CurrentSongHere?.video,
    );

    if (
      currentIndex !== -1 &&
      currentIndex < deepFlattenedPlaylist.length - 1
    ) {
      const nextSong = deepFlattenedPlaylist[currentIndex + 1];

      if (nextSong) {
        //@ts-ignore
        setCurrentSongHere(nextSong);
        //@ts-ignore
        dispatch(setCurrentSong(nextSong));
        setElapsedTime(0);
        setIsPlaying(true);
      }
    } else {
      console.log('No more songs in the playlist');
      setIsPlaying(false);
    }
  };
  const handlePreviousSong = () => {
    if (!CurrentSongHere) return;
    const currentIndex = deepFlattenedPlaylist.findIndex(
      //@ts-ignore
      (item: any) => item?.video === CurrentSongHere?.video,
    );

    if (currentIndex > 0) {
      const previousSong = deepFlattenedPlaylist[currentIndex - 1];
      if (previousSong) {
        //@ts-ignore
        setCurrentSongHere(previousSong);
        //@ts-ignore
        dispatch(setCurrentSong(previousSong));
        setElapsedTime(0);
        setIsPlaying(true);
      }
    } else {
      console.log('No previous songs in the playlist');
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const backAction = () => {
      toggleMinimizScreen();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const progressPercentage = songDuration ? elapsedTime / songDuration : 0;


  const Modal_Styles = StyleSheet.create({
    overlay: {
      flex: 1,
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
      backgroundColor: COLORS.BLACK_COLOR,
      overflow: 'hidden',
      alignSelf: 'flex-end',
      justifyContent: 'flex-end',
      top: 0,
    },
    overlaySmall: {
      position: 'absolute',
      width: WINDOW_WIDTH,
      height: 0,
      top: WINDOW_HEIGHT,
    },
    modalContainer: {
      width: WINDOW_WIDTH,
      height: isMinimized ? 80 : WINDOW_HEIGHT,
      alignItems: 'center',
      justifyContent: isMinimized ? 'flex-end' : 'flex-start',
      position: 'absolute',
      bottom: isMinimized ? Platform.OS==="android" ? 60: 85 : 'auto',
      flexDirection: isMinimized ? 'row' : 'column',
      backgroundColor: isMinimized
        ? COLORS.BLACK_SCREENS_BG
        : COLORS.BLACK_COLOR,
      padding: isMinimized ? 5 : 0,
      borderRadius: isMinimized ? 5 : 0,
    },
    topButtons: {
      position: 'absolute',
      top:  Platform.OS==="android" ? 60 :50,
      width: WINDOW_WIDTH - 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 10,
    },
    albumArt: {
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT - 230,
      marginBottom: 20,
    },
    video: {
      width: isMinimized ? 60 : WINDOW_WIDTH,
      height: isMinimized ? 60 : WINDOW_HEIGHT - 230,
      borderRadius: isMinimized ? 5 : 0,
    },
    detailsContainer: {
      width: isMinimized ? WINDOW_WIDTH - 200 : WINDOW_WIDTH,

      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingHorizontal: 10,
      marginVertical: 5,
    },
    songTitle: {
      fontSize: isMinimized ? 14 : 18,
      fontWeight: 'bold',
      color: COLORS.WHITE_COLOR,
      textAlign: 'center',
      marginBottom: isMinimized ? 0 : 2,
    },
    songTitle2: {
      color: COLORS.WHITE_COLOR,
      fontSize: 15,
      fontWeight: '600',
    },
    singer: {
      fontSize: isMinimized ? 16 : 14,
      color: COLORS.GRAY,
      textAlign: 'center',
    },
    progressBarContainer: {
      width: WINDOW_WIDTH - 20,
      height: 35,
      backgroundColor: 'transparent',
      borderRadius: 5,
      overflow: 'hidden',
      marginVertical: 5,
      justifyContent: 'center',
    },
    progressBar: {
      height: 15,
      backgroundColor: COLORS.PINK_COLOR,
    },
    timeContainer: {
      width: WINDOW_WIDTH - 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    timeText: {
      fontSize: 14,
      color: COLORS.WHITE_COLOR,
    },
    controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: isMinimized ? 120 : WINDOW_WIDTH - 20,
      alignItems: 'center',
      paddingHorizontal: isMinimized ? 10 : 0,
    },
    playButton: {
      backgroundColor: COLORS.PINK_COLOR,
      borderRadius: isMinimized ? 40 : 50,
      width: isMinimized ? 40 : 50,
      height: isMinimized ? 40 : 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoomIcon: {
      position: 'absolute',
      bottom: 10,
      right: 10,
    },
    videoContainer: {
      position: isMinimized ? 'absolute' : 'relative',
      bottom: isMinimized ? 10 : 'auto',
      left: isMinimized ? 10 : 0,
      width: isMinimized ? 60 : WINDOW_WIDTH,
      height: isMinimized ? 60 : WINDOW_HEIGHT - 230,
      borderRadius: isMinimized ? 10 : 0,
      overflow: 'hidden',
    },
    fullScreenVideo: {
      width: WINDOW_HEIGHT,
      height: WINDOW_WIDTH,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flex: 1,
    },
    ArtistName: {
      color: COLORS.GRAY,
      fontSize: 14,
      fontWeight: '500',
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: COLORS.BLACK_SCREENS_BG,
      width: WINDOW_WIDTH,
      height: 60,
      borderRadius: 5,
    },
    progressContainer: {
      width: WINDOW_WIDTH - 75,
      height: 5,
      backgroundColor: COLORS.GRAY,
      borderRadius: 5,
      overflow: 'hidden',
      marginVertical: 5,
    },
  });

  const progressBarStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderRadius: 2,
    height: 3, // Thickness of progress bar
    width: progressPercentage * WINDOW_WIDTH, // Dynamic width
    backgroundColor: COLORS.PINK_COLOR,
  };

  return (
    <>
      <View
        style={[
          isMinimized ? Modal_Styles.overlaySmall : Modal_Styles.overlay,
        ]}>
        <TouchableOpacity
          style={Modal_Styles.modalContainer}
          activeOpacity={9}
          onPress={() => {
            if (isMinimized) {
              toggleMinimizScreen();
            }
          }}>
          {isMinimized && (
            <View //@ts-ignore
              style={progressBarStyle}
            />
          )}
          {!isMinimized && (
            <View style={Modal_Styles.topButtons}>
              <TouchableOpacity onPress={() => toggleMinimizScreen()}>
                <Fontisto
                  name="angle-down"
                  size={20}
                  color={COLORS.WHITE_COLOR}
                />
              </TouchableOpacity>
            </View>
          )}

          {
            //@ts-ignore
            CurrentSongHere?.video ? (
              <View style={Modal_Styles.videoContainer}>
                <Video
                  fullscreen={isFullScreen}
                  ignoreSilentSwitch="ignore"
                  playInBackground={true}
                  // showNotificationControls={true}
                  fullscreenAutorotate={isFullScreen}
                  ref={videoRef}
                  source={{
                    uri:
                      VIDEO_BASE_URL + //@ts-ignore
                      CurrentSongHere?.video,
                  }}
                  style={Modal_Styles.video}
                  resizeMode="cover"
                  paused={!isPlaying}
                  onLoad={({duration}) => {
                    setSongDuration(Math.floor(duration));
                    if (elapsedTime > 0) {
                      videoRef.current.seek(elapsedTime); // Resume from last position
                    }
                  }}
                  onProgress={({currentTime}) =>
                    setElapsedTime(Math.floor(currentTime))
                  }
                  onEnd={() => {
                    if (isRepeat) {
                      videoRef.current.seek(0);
                      setIsPlaying(true);
                    } else {
                      handleNextSong();
                      // setIsPlaying(false);
                    }
                  }}
                  onFullscreenPlayerWillDismiss={() => {
                    setIsFullScreen(false);

                    // Ensure the video continues playing
                    setTimeout(() => {
                      if (videoRef.current) {
                        videoRef.current.seek(elapsedTime); // Resume from last position
                        setIsPlaying(true);
                      }
                    }, 100);
                  }}
                />
                {/* Zoom Icon */}
                {!isMinimized && (
                  <TouchableOpacity
                    style={Modal_Styles.zoomIcon}
                    onPress={toggleFullScreen}>
                    <MaterialIcons
                      name="zoom-out-map"
                      size={24}
                      color={COLORS.WHITE_COLOR}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <Image
                //@ts-ignore
                source={{uri:IMAGE_URL_VIDEOS + CurrentSongHere?.image}}
                style={Modal_Styles.albumArt}
                resizeMode="cover"
              />
            )
          }

          <View style={Modal_Styles.detailsContainer}>
            <Text style={Modal_Styles.songTitle} numberOfLines={1}>
              {
                //@ts-ignore
                CurrentSongHere?.video_name ?? 'Unknown Song'
              }
            </Text>
            <Text style={Modal_Styles.singer} numberOfLines={1}>
              {
                //@ts-ignore
                CurrentSongHere?.artists?.[0]?.full_name ?? 'Unknown Artist'
              }
            </Text>
          </View>
          {!isMinimized && (
            <Slider
              style={{
                width: isMinimized ? WINDOW_WIDTH - 100 : WINDOW_WIDTH,
                height: 30,
              }}
              minimumValue={0}
              maximumValue={1}
              value={progressPercentage}
              minimumTrackTintColor={COLORS.PINK_COLOR}
              maximumTrackTintColor={COLORS.GRAY}
              thumbTintColor={COLORS.PINK_COLOR}
              onValueChange={value => {
                let newElapsedTime = value * songDuration;
                setElapsedTime(Math.floor(newElapsedTime));
              }}
              onSlidingComplete={value => {
                let newElapsedTime = value * songDuration;
                videoRef.current.seek(newElapsedTime);
                setElapsedTime(Math.floor(newElapsedTime));
                setIsPlaying(true);
              }}
            />
          )}
          {!isMinimized && (
            <View style={Modal_Styles.timeContainer}>
              <Text style={Modal_Styles.timeText}>
                {formatTime(elapsedTime)}
              </Text>
              <Text style={Modal_Styles.timeText}>
                {formatTime(songDuration)}
              </Text>
            </View>
          )}

          {/* {!isMinimized && ( */}
          <View style={Modal_Styles.controlsContainer}>
            {!isMinimized && (
              <TouchableOpacity onPress={handleRepeatToggle}>
                <FontAwesome
                  name="repeat"
                  size={22}
                  color={isRepeat ? COLORS.PINK_COLOR : COLORS.WHITE_COLOR} // Change color when active
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handlePreviousSong}>
              <FontAwesome
                name="step-backward"
                size={isMinimized ? 18 : 22}
                color={COLORS.WHITE_COLOR}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePlayPause}
              style={Modal_Styles.playButton}>
              <FontAwesome
                name={isPlaying ? 'pause' : 'play'}
                size={isMinimized ? 18 : 22}
                color={COLORS.WHITE_COLOR}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNextSong}>
              <FontAwesome
                name="step-forward"
                size={isMinimized ? 18 : 22}
                color={COLORS.WHITE_COLOR}
              />
            </TouchableOpacity>
            {!isMinimized && (
              <FontAwesome name="random" size={22} color={COLORS.WHITE_COLOR} />
            )}
          </View>
          {/* )} */}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default MusicPlayModal;
