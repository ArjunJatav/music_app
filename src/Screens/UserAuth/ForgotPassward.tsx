import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { WINDOW_WIDTH} from '../../Utils/DimensionsUtil';
import CommonInput from '../../Utils/CommonInput';
import {USER_AUTH_STYLE} from './UserAuthStyle';
import {IMAGES_ASSETS} from '../../Utils/Images';
import {COLORS} from '../../Utils/Colors';
import {useAppNavigation} from '../../Utils/useAppNavigation';
import {UserAuthRouteParamList} from './UserAuthNavigation';
import CommonBackButton from '../../Utils/CommonBackButton';
import ApiService from '../../ApiProviders/ApiService';
import {API_ENDPOINTS} from '../../ApiProviders/ApiConfig';
import CommonButton from '../../Utils/CommonButton';
import CustomLoadingModal from '../../Modals/LoadingModal';

const ForgotPassword = () => {
  const navigation = useAppNavigation<UserAuthRouteParamList>();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{email?: string}>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let newErrors: {email?: string} = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitButton = async () => {
    if (validateForm()) {
      setLoading(true); // Show loader

      try {
        const response = await ApiService.post<{
          success: boolean;
          message: string;
          data?: any;
        }>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {email: email});

        console.log('response', response);

        if (response.success) {
          setTimeout(() => {
            setLoading(false); 
            navigation.navigate('OtpVerificationScreen', { email, isScreenFrom: 'ForgotPassword' });
          }, 2000); 
        } else {
          setLoading(false);
          Alert.alert(
            response.message || 'Something went wrong. Please try again.',
          );
        }
      } catch (error) {
        console.error('API Error:', error);
        setLoading(false);
        Alert.alert('Failed to reset password. Please try again.');
      }
    }
  };

  return (
    <SafeAreaView style={USER_AUTH_STYLE.BG_CONTAINER}>
      <CommonBackButton />
      <CustomLoadingModal isVisible={loading} message={"OTP Sending"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image
              source={IMAGES_ASSETS.LOGO_IMAGE}
              style={USER_AUTH_STYLE.LOGO_IMAGE}
            />
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={[{fontWeight: '400', fontSize: 15, marginBottom: 15}]}>
              Enter the email address associated with your account.
            </Text>
            <CommonInput
              placeholder="Enter Your Email"
              label="Email"
              placeholderTextColor={COLORS.GRAY}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              errorMessage={errors.email}
            />

            {/* Submit Button with Loader */}
            <CommonButton title="Submit" onPress={submitButton} />

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
  },
  title: {
    fontSize: 24,
    marginTop: 15,
    fontWeight: 'bold',
  },
  button: {
    width: WINDOW_WIDTH - 40,
    backgroundColor: COLORS.PINK_COLOR,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPassword;
