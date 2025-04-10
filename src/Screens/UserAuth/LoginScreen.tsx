import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../Utils/DimensionsUtil';
import CommonInput from '../../Utils/CommonInput';
import {USER_AUTH_STYLE} from './UserAuthStyle';
import {IMAGES_ASSETS} from '../../Utils/Images';
import CheckBox from '../../Utils/CheckBox';
import {COLORS} from '../../Utils/Colors';
import CommonButton from '../../Utils/CommonButton';
import DividerWithText from '../../Utils/DividerWithText';
import SocialAuthButton from '../../Utils/SocialAuthButton';
import {UserAuthRouteParamList} from './UserAuthNavigation';
import {useAppNavigation} from '../../Utils/useAppNavigation';
import ApiService from '../../ApiProviders/ApiService';
import {API_ENDPOINTS} from '../../ApiProviders/ApiConfig';
import AsyncStorageService from '../../Utils/AsyncStorageService';
import {setAuthToken} from '../../Redux/AuthReducer';
import {useDispatch} from 'react-redux';

const LoginScreen = () => {
  const navigation = useAppNavigation<UserAuthRouteParamList>();
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    let newErrors: {email?: string; password?: string} = {};

    // Email Validation
    if (!emailValue.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(emailValue)) {
      newErrors.email = 'Enter a valid email';
    }

    // Password Validation
    if (!passwordValue) {
      newErrors.password = 'Password is required';
    } else {
      const passwordRules = [
        {regex: /.{6,}/, message: 'Password must be at least 6 characters'},
        {
          regex: /[A-Z]/,
          message: 'Password must contain at least one uppercase letter',
        },
        {
          regex: /[a-z]/,
          message: 'Password must contain at least one lowercase letter',
        },
        {regex: /[0-9]/, message: 'Password must contain at least one number'},
        {
          regex: /[!@#$%^&*(),.?":{}|<>]/,
          message: 'Password must contain at least one special character',
        },
      ];

      for (const rule of passwordRules) {
        if (!rule.regex.test(passwordValue)) {
          newErrors.password = rule.message;
          break; // Stop at the first failing rule
        }
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        console.log('Calling API with:', {
          email: emailValue,
          password: passwordValue,
        });

        const response = await ApiService.post<{
          success: boolean;
          message: string;
          data?: any;
        }>(API_ENDPOINTS.AUTH.LOGIN, {
          email: emailValue,
          password: passwordValue,
        });

        if (response.success) {
          await AsyncStorageService.setItem<string>(
            'USER_AUTH_TOKEN',
            response.data.token,
          );
          dispatch(setAuthToken(response.data.token));
          //@ts-ignore
          navigation.navigate('BottomTab', {screen: 'HomeRoute'});
        } else {
          Alert.alert(
            'Login Failed',
            response.message || 'Invalid login details',
          );

          setErrors({email: response.message || 'Invalid login details'});
          return;
        }
      } catch (error: any) {
        let errorMessage = 'Something went wrong';

        if (error.response) {
          errorMessage = error.response.data.message || 'Invalid login details';
        } else if (error.request) {
          errorMessage = 'No response from server. Check your network.';
        } else {
          errorMessage = error.message;
        }
        Alert.alert('Login Failed', errorMessage);

        setErrors({email: errorMessage});
      }
    }
  };

  return (
    <SafeAreaView style={USER_AUTH_STYLE.BG_CONTAINER}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled">
            <Image
              source={IMAGES_ASSETS.LOGO_IMAGE}
              style={USER_AUTH_STYLE.LOGO_IMAGE}
            />
            <Text style={styles.title}>Sign in</Text>

            <CommonInput
              placeholder="Enter Your Email"
              label="Email"
              placeholderTextColor={COLORS.GRAY}
              keyboardType="email-address"
              value={emailValue}
              onChangeText={text => {
                setEmailValue(text);
                setErrors(prev => ({...prev, email: ''}));
              }}
              errorMessage={errors.email}
            />

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

            <View style={styles.row}>
              <View style={styles.rememberMeContainer}>
                {/* <CheckBox
                  checked={checked}
                  onPress={() => setChecked(!checked)}
                />
                <Text style={USER_AUTH_STYLE.LOGO_REMEMBER_ME}>
                  {'Remember me'}
                </Text> */}
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}>
                <Text
                  style={[
                    USER_AUTH_STYLE.LOGO_REMEMBER_ME,
                    {color: COLORS.PINK_COLOR},
                  ]}>
                  {'Forgot Password ?'}
                </Text>
              </TouchableOpacity>
            </View>

            <CommonButton title="Login" onPress={handleLogin} />

            {/* <DividerWithText
              text="Or"
              color={COLORS.BORDER_COLOR}
              lineWidth="40%"
            /> */}

            {/* {Platform.OS === 'ios' ? (
              <SocialAuthButton
                title="Continue with Apple"
                icon={IMAGES_ASSETS.APPLE_LOGO}
                backgroundColor={COLORS.WHITE_COLOR}
                textColor={COLORS.BLACK_COLOR}
                onPress={() => console.log('Apple Sign In')}
              />
            ) : (
              <SocialAuthButton
                title="Continue with Google"
                icon={IMAGES_ASSETS.GOOGLE_LOGO}
                backgroundColor={COLORS.WHITE_COLOR}
                textColor={COLORS.BLACK_COLOR}
                onPress={() => console.log('Google Sign In')}
              />
            )} */}

            {/* <SocialAuthButton
              title="Continue with Facebook"
              icon={IMAGES_ASSETS.FB_LOGO}
              backgroundColor={COLORS.WHITE_COLOR}
              textColor={COLORS.BLACK_COLOR}
              onPress={() => console.log('Facebook Sign In')}
            /> */}

            <TouchableOpacity
              style={styles.signUpContainer}
              onPress={() => navigation.navigate('SignUpScreen')}>
              <Text style={USER_AUTH_STYLE.LOGO_REMEMBER_ME}>
                {'Don’t have an account?'}
              </Text>
              <Text
                style={[
                  USER_AUTH_STYLE.LOGO_REMEMBER_ME,
                  {color: COLORS.PINK_COLOR, fontWeight: 'bold'},
                ]}>
                {' Sign Up'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    marginTop: 15,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: WINDOW_WIDTH - 20,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;
