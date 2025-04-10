import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {USER_AUTH_STYLE} from './UserAuthStyle';
import {IMAGES_ASSETS} from '../../Utils/Images';
import {useAppNavigation} from '../../Utils/useAppNavigation';
import {useRoute} from '@react-navigation/native';
import ApiService from '../../ApiProviders/ApiService';
import {API_ENDPOINTS} from '../../ApiProviders/ApiConfig';
import CommonBackButton from '../../Utils/CommonBackButton';
import CustomLoadingModal from '../../Modals/LoadingModal';
import {COLORS} from '../../Utils/Colors';
import AsyncStorageService from '../../Utils/AsyncStorageService';
import { setAuthToken } from '../../Redux/AuthReducer';
import { useDispatch } from 'react-redux';

// Custom Hook for OTP Timer
const useOtpTimer = (initialTime = 30) => {
  const [timer, setTimer] = useState(initialTime);
  const [disabled, setDisabled] = useState(true);


  useEffect(() => {
    if (!disabled) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          clearInterval(interval);
          setDisabled(false);
          return initialTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [disabled]);

  const resetTimer = () => {
    setDisabled(true);
    setTimer(initialTime);
  };

  return {timer, disabled, resetTimer};
};

const OtpVerificationScreen = () => {
  const dispatch = useDispatch();
  const navigation = useAppNavigation();
  const route = useRoute();
  const {email} = route.params as {email: string};
  const {isScreenFrom} = route.params as {isScreenFrom: string};
  console.log('isScreenFrom', isScreenFrom);
  

  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<TextInput[]>([]);
  const [loading, setLoading] = useState(false);
  const {timer, disabled: resendDisabled, resetTimer} = useOtpTimer();

  const handleOtpChange = (text: string, index: number) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (otp.join('').length === otp.length) {
      handleOtpSubmit();
    }
  }, [otp]);

  const handleOtpSubmit = async () => {
    setLoading(true);
    try {
      const response = await ApiService.post<{
        success: boolean;
        message: string;
        data?: any;
      }>(API_ENDPOINTS.AUTH.OTP_VERIFICATION, {
        email: email,
        otp: otp.join(''),
      });
      setLoading(false);
      if (response.success) {

        console.log('response', response);
        if (isScreenFrom === 'ForgotPassword') { //@ts-ignore
          navigation.navigate('ResetPasswordScreen', {email:email});
        } else {
          console.log("else");
          
          await AsyncStorageService.setItem<string>(
            'USER_AUTH_TOKEN',
            response.data.token,
          );
          dispatch(setAuthToken(response.data.token));
          //@ts-ignore
          navigation.navigate('BottomTab', {screen: 'HomeRoute'});
        }
        // Handle success
      } else {
        //@ts-ignore
        Alert.alert('Error', response.message.otp || 'Invalid OTP. Try again.');
      }
    } catch {
      setLoading(false);
      Alert.alert('Error', 'Failed to verify OTP. Try again.');
    }
  };

  const handleResendOtp = async () => {
    resetTimer();
    setOtp(['', '', '', '']);
    setLoading(true);
    try {
      const response = await ApiService.post<{
        success: boolean;
        message: string;
        data?: any;
      }>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        email: email,
      });
      // const response = await ApiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      setLoading(false);
      Alert.alert('Success!', response.message);
    } catch {
      setLoading(false);
      Alert.alert('Error', 'Failed to resend OTP. Try again.');
    }
  };

  return (
    <SafeAreaView style={USER_AUTH_STYLE.BG_CONTAINER}>
      <CommonBackButton />
      <CustomLoadingModal isVisible={loading} message="OTP Sending" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image
              source={IMAGES_ASSETS.LOGO_IMAGE}
              style={USER_AUTH_STYLE.LOGO_IMAGE}
            />
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subTitle}>
              Enter the OTP sent to your registered email.
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={el => (inputRefs.current[index] = el!)}
                  style={styles.otpBox}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={text => handleOtpChange(text, index)}
                  onKeyPress={event => handleKeyPress(event, index)}
                />
              ))}
            </View>

            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={resendDisabled}
              style={{opacity: resendDisabled ? 0.5 : 1}}>
              <Text style={{color: COLORS.PINK_COLOR, fontSize: 16}}>
                {resendDisabled ? `Resend OTP in ${timer}s` : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
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
    marginTop: 15,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 15,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 20,
    textAlign: 'center',
    marginHorizontal: 5,
    color: '#000',
  },
});

export default OtpVerificationScreen;
