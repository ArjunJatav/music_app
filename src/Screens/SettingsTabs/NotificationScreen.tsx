import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import {HOME_SCREEN_STYLE} from '../HomeTabs/HomeScreenStyle';
import HeaderWithBackButton from '../../Headers/Header';
import {useAppNavigation} from '../../Utils/useAppNavigation';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/Store';
import {API_ENDPOINTS} from '../../ApiProviders/ApiConfig';
import ApiService from '../../ApiProviders/ApiService';
import {COLORS} from '../../Utils/Colors';
import CustomLoadingModal from '../../Modals/LoadingModal';

const NotificationScreen = () => {
  const navigation = useAppNavigation();
  const [loading, setLoading] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const AUTH_TOKEN = useSelector(
    (state: RootState) => state.authToken.AUTH_TOKEN,
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await ApiService.get(
          API_ENDPOINTS.PROFILE.GET_NOTIFICATIONS,
        );

        const typedResponse = response as {
          success: boolean;
          message?: string;
          data?: any;
        };

        if (typedResponse.success) {
          setNotificationData(typedResponse.data);
        } else {
          console.log('Error:', typedResponse.message);
        }
      } catch (err: any) {
        console.log('Error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (AUTH_TOKEN) {
      fetchNotifications();
    }
  }, [AUTH_TOKEN]);

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.notificationCard}>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.date}>{new Date(item.created).toDateString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[HOME_SCREEN_STYLE.BG_CONTAINER, {flex: 1}]}>
      <HeaderWithBackButton
        title={'Notifications'}
        onBackButton={() => navigation.goBack()}
      />

      {loading ? (
        <CustomLoadingModal
          isVisible={loading}
          message={'Fetching Notifications..'}
        />
      ) : notificationData.length > 0 ? (
        <FlatList
          data={notificationData}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noDataText}>No notifications found</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: COLORS.BLACK_SCREENS_BG,
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  message: {
    fontSize: 14,
    color: COLORS.WHITE_COLOR,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: COLORS.GRAY,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: COLORS.GRAY,
  },
});

export default NotificationScreen;
