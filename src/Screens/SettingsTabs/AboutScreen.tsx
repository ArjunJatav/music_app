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
  TouchableOpacity,
} from 'react-native';
import {useAppNavigation} from '../../Utils/useAppNavigation';
import CustomLoadingModal from '../../Modals/LoadingModal';
import {HOME_SCREEN_STYLE} from '../HomeTabs/HomeScreenStyle';
import {COLORS} from '../../Utils/Colors';
import HomeHeader from '../../Headers/HomeHeader';
import {WINDOW_WIDTH} from '../../Utils/DimensionsUtil';
import {MaterialIcons} from '../../Utils/ReactIcons';
import HeaderWithBackButton from '../../Headers/Header';

const AboutScreen = () => {
  const navigation = useAppNavigation();

  const [loading, setLoading] = useState(false);
  const AboutOptions = [
    { id: 1, title: 'Terms & Conditions', icon: 'gavel', screen: 'MyMusicScreen' },
    { id: 2, title: 'FAQ', icon: 'help-outline', screen: 'PlayListScreen' },
    { id: 3, title: 'Privacy Policy', icon: 'menu-book', screen: 'FavouritesListScreen' }, // Clearer book-related icon
  ];
  
  
  
  

  return (
    <SafeAreaView style={HOME_SCREEN_STYLE.BG_CONTAINER}>
       <HeaderWithBackButton
             title={'About'}
             onBackButton={() => navigation.goBack()}
           />
      <CustomLoadingModal isVisible={loading} message="OTP Sending" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {AboutOptions.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.optionContainer}
                //onPress={() => navigation.navigate(item.screen)}
              >
                <View style={styles.iconWrapper}>
                  <MaterialIcons
                    name={item.icon}
                    size={20}
                    color={COLORS.WHITE_COLOR}
                  />
                  <Text style={styles.optionTitle}>{item.title}</Text>
                </View>

                <MaterialIcons
                  name="chevron-right"
                  size={25}
                  color={COLORS.WHITE_COLOR}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    // marginTop: 15,
    fontWeight: 'bold',
    color: COLORS.WHITE_COLOR,
  },

  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: WINDOW_WIDTH - 20,
    // backgroundColor:"red",
    // justifyContent: 'space-between',

    padding: 10,
    marginBottom: 10,
  },
  iconWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  optionTitle: {
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '600',
    color: COLORS.WHITE_COLOR,
  },
});

export default AboutScreen;
