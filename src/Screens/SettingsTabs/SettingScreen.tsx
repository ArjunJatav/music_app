import React from 'react';
import {
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import HomeHeader from '../../Headers/HomeHeader';
import {HOME_SCREEN_STYLE} from '../HomeTabs/HomeScreenStyle';
import {Entypo, FontAwesome, MaterialIcons} from '../../Utils/ReactIcons';
import {WINDOW_WIDTH} from '../../Utils/DimensionsUtil';
import {COLORS} from '../../Utils/Colors';
import {useAppNavigation} from '../../Utils/useAppNavigation';

const settingsOptions = [
  {id: 1, title: 'My Profile', icon: 'person', screen: 'MyProfileScreen'},
  {
    id: 2,
    title: 'Change Password',
    icon: 'lock',
    screen: 'ChangePasswordScreen',
  },
  {
    id: 3,
    title: 'Notification',
    icon: 'notifications',
    screen: 'NotificationScreen',
  },
  // {
  //   id: 4,
  //   title: 'My Subscription',
  //   icon: 'credit-card',
  //   screen: 'SubscriptionScreen',
  // },
  {id: 5, title: 'Help & Support', icon: 'help', screen: 'HelpAndSupportScreen'},
  // {id: 6, title: 'About', icon: 'info', screen: 'AboutScreen'},
  // {id: 6, title: 'Logout', icon: 'logout', screen: 'Logout'},
];

const SettingScreen = () => {
  const navigation = useAppNavigation();

  return (
    <SafeAreaView style={HOME_SCREEN_STYLE.BG_CONTAINER}>
      <HomeHeader title="Musica" onNotificationClick={() => {//@ts-ignore
         navigation.navigate("NotificationScreen")}} />

      {settingsOptions.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.optionContainer}
          onPress={() =>
            // @ts-ignore
            navigation.navigate(item.screen.toString())
          }>
          <View style={styles.iconWrapper}>
            <MaterialIcons
              name={item.icon}
              size={20}
              color={COLORS.WHITE_COLOR}
            />
            <Text style={styles.optionTitle}>{item.title}</Text>
          </View>
          {item.title !== 'Logout' && (
            <MaterialIcons
              name="chevron-right"
              size={25}
              color={COLORS.WHITE_COLOR}
            />
          )}
        </TouchableOpacity>
      ))}
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
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

export default SettingScreen;
