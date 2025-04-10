import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {HOME_SCREEN_STYLE} from '../HomeTabs/HomeScreenStyle';
import HeaderWithBackButton from '../../Headers/Header';
import {useAppNavigation} from '../../Utils/useAppNavigation';
import {COLORS} from '../../Utils/Colors';
import ApiService from '../../ApiProviders/ApiService';
import {API_ENDPOINTS} from '../../ApiProviders/ApiConfig';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/Store';
import CustomLoadingModal from '../../Modals/LoadingModal';
import CommonInput from '../../Utils/CommonInput';
interface ProfileData {
    email?: string;
    name?: string;
    profileImage?: string;
    full_name?: string;
    phone_number?: string;
  }

const MyProfileScreen = () => {
  const navigation = useAppNavigation();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const AUTH_TOKEN = useSelector(
    (state: RootState) => state.authToken.AUTH_TOKEN,
  );
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  }>({});

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const response = await ApiService.get(
          API_ENDPOINTS.PROFILE.GET_PROFILE_DATA,
        );

        const typedResponse = response as {
          success: boolean;
          message?: string;
          data?: any;
        };

        if (typedResponse.success) {
          setProfileData(typedResponse.data);
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
      fetchProfileData();
    }
  }, [AUTH_TOKEN]);
  console.log('profileData', profileData);

  return (
    <SafeAreaView style={HOME_SCREEN_STYLE.BG_CONTAINER}>
      <HeaderWithBackButton
        title={'My Profile'}
        onBackButton={() => navigation.goBack()}
      />

      {/* Loader */}
      {loading ? (
        <CustomLoadingModal
          isVisible={loading}
          message={'Fetching Profile Data..'}
        />
      ) : (
        <>
          <View>
            <Image
              source={{
                uri: 'https://cdn.pixabay.com/photo/2016/11/21/13/36/man-1845432_1280.jpg',
              }}
              style={MY_PROFILE_STYLE.PROFILE_IMAGE}
            />
            {/* Edit Icon */}
            {/* <TouchableOpacity style={MY_PROFILE_STYLE.EDIT_ICON}>
              <Entypo
                name="camera"
                size={15}
                color={COLORS.PINK_COLOR}
                style={{height: 15, width: 15}}
              />
            </TouchableOpacity> */}
          </View>
          <CommonInput
            placeholder={profileData?.full_name}
            label="Name"
            placeholderTextColor={COLORS.WHITE_COLOR}
            keyboardType="email-address"
            //  value={fullName}
            value={fullName === 'xyz' ? '' : fullName}
            onChangeText={text => {
              setFullName(text);
              setErrors(prev => ({...prev, email: ''}));
            }}
            errorMessage={errors.fullName}
            theme={true}
            editable={false}
          />
          <CommonInput
            placeholder={profileData?.email ?? "Enter your email"}
            label="Email"
            placeholderTextColor={COLORS.WHITE_COLOR}
            keyboardType="email-address"
            //  value={fullName}
            value={email === 'xyz' ? '' : email}
            onChangeText={text => {
              setEmail(text);
              setErrors(prev => ({...prev, email: ''}));
            }}
            errorMessage={errors.email}
            theme={true}
            editable={false}
          />
      
        </>
      )}
    </SafeAreaView>
  );
};

const MY_PROFILE_STYLE = StyleSheet.create({
  PROFILE_IMAGE: {
    height: 150,
    width: 150,
    borderRadius: 80,
  },
  EDIT_ICON: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: COLORS.PINK_COLOR,
    bottom: 10,
    right: -5,
    backgroundColor: COLORS.BORDER_COLOR,
    borderRadius: 20,
    padding: 8,
  },
});

export default MyProfileScreen;
