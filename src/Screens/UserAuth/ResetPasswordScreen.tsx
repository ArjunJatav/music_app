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
import {WINDOW_WIDTH} from '../../Utils/DimensionsUtil';
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
import {useRoute} from '@react-navigation/native';

const ResetPasswordScreen = () => {
  const route = useRoute();
  const {email} = route.params as {email: string};
  console.log('email', email);

  const navigation = useAppNavigation<UserAuthRouteParamList>();
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateForm = () => {
    let newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // Password validation
    if (!passwordValue) {
      newErrors.password = 'Password is required';
    } else if (passwordValue.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(passwordValue)
    ) {
      newErrors.password =
        'Password must contain uppercase, lowercase, number, and special character';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (confirmPassword !== passwordValue) {
      newErrors.confirmPassword = 'Passwords do not match';
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
        }>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
          email: email,
          password: passwordValue,
        });

        console.log('response', response);

        if (response.success) {
          setTimeout(() => {
            setLoading(false);
            // console.log('response', response);
            navigation.navigate("LoginScreen");

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
      <CustomLoadingModal isVisible={loading} message={'Password Resetting..'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image
              source={IMAGES_ASSETS.LOGO_IMAGE}
              style={USER_AUTH_STYLE.LOGO_IMAGE}
            />
            <Text style={styles.title}>Reset Password</Text>
            {/* <Text style={[{fontWeight: '400', fontSize: 15, marginBottom: 15}]}>
              Enter the email address associated with your account.
            </Text> */}
            <CommonInput
              placeholder="Password"
              placeholderTextColor={COLORS.GRAY}
              label="Password"
              secureTextEntry
              value={passwordValue}
              isPassword={true}
              onChangeText={text => {
                setPasswordValue(text);
                setErrors(prev => ({...prev, password: ''}));
              }}
              errorMessage={errors.password}
            />

            <CommonInput
              placeholder="Confirm Password"
              label="Confirm Password"
              placeholderTextColor={COLORS.GRAY}
              secureTextEntry
              value={confirmPassword}
              isPassword={true}
              onChangeText={text => {
                setConfirmPassword(text);
                setErrors(prev => ({...prev, confirmPassword: ''}));
              }}
              errorMessage={errors.confirmPassword}
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

export default ResetPasswordScreen;
