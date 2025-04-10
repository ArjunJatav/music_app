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
import {WINDOW_WIDTH} from '../../Utils/DimensionsUtil';
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
import PhoneInput from '../../Utils/CountryPicker';
import ApiService from '../../ApiProviders/ApiService';
import {API_ENDPOINTS} from '../../ApiProviders/ApiConfig';
import CommonBackButton from '../../Utils/CommonBackButton';

const SignUpScreen = () => {
  const navigation = useAppNavigation<UserAuthRouteParamList>();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState({
    countryCode: 'US',
    dialCode: '+1',
    phoneNumber: '',
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  // **Validation Function**
  const validateForm = () => {
    let newErrors: {
      fullName?: string;
      email?: string;
      phoneNumber?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};

    // Full Name Validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
      setErrors(newErrors);
      return false;
    }

    // Email Validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      setErrors(newErrors);
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email';
      setErrors(newErrors);
      return false;
    }

    // Phone Number Validation
    if (!phoneNumber.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
      setErrors(newErrors);
      return false;
    } else if (phoneNumber.phoneNumber.length < 8) {
      newErrors.phoneNumber = 'Enter a valid phone number';
      setErrors(newErrors);
      return false;
    }

    // Password Validation with Rules
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
      if (!rule.regex.test(password)) {
        newErrors.password = rule.message;
        setErrors(newErrors);
        return false;
      }
    }

    // Confirm Password Validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm Password is required';
      setErrors(newErrors);
      return false;
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
      setErrors(newErrors);
      return false;
    }

    // Terms & Conditions Agreement Validation
    if (!checked) {
      newErrors.terms = 'You must agree to Terms & Conditions';
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  // **Sign-Up Handler**
  const handleSignUp = async () => {
    if (validateForm()) {
      try {
        const response = await ApiService.post<{
          success: boolean;
          message: string;
          data?: {email: string};
        }>(API_ENDPOINTS.AUTH.REGISTER, {
          full_name: fullName,
          email: email,
          password: password,
          contact_number: phoneNumber.phoneNumber,
          code: phoneNumber.dialCode,
          country: phoneNumber.countryCode,
        });

        if (response.success) {
          navigation.navigate('OtpVerificationScreen', {email: email, isScreenFrom: 'SignUpScreen'});
        } else {
          Alert.alert('Error', response.message || 'Signup failed.');
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong!');
      }
    }
  };

  return (
    <SafeAreaView style={USER_AUTH_STYLE.BG_CONTAINER}>
      <CommonBackButton />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              width: WINDOW_WIDTH,
            }}>
            <Image
              source={IMAGES_ASSETS.LOGO_IMAGE}
              style={[USER_AUTH_STYLE.LOGO_IMAGE, {marginTop: 20}]}
            />
            <Text style={styles.title}>Sign Up</Text>

            {/* Full Name Input */}
            <CommonInput
              placeholder="Enter Your Full Name"
              label="Full Name"
              placeholderTextColor={COLORS.GRAY}
              value={fullName}
              onChangeText={setFullName}
              errorMessage={errors.fullName}
            />

            {/* Email Input */}
            <CommonInput
              placeholder="Enter Your Email"
              label="Email"
              placeholderTextColor={COLORS.GRAY}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              errorMessage={errors.email}
            />

            {/* Phone Number Input */}
            <PhoneInput
              onChangePhone={phoneData => setPhoneNumber(phoneData)}
              errorMessage={errors.phoneNumber}
            />
           

            {/* Password Input */}
            <CommonInput
              placeholder="Password"
              label="Password"
              placeholderTextColor={COLORS.GRAY}
              secureTextEntry
              value={password}
              isPassword={true}
              onChangeText={setPassword}
              errorMessage={errors.password}
            />

            {/* Confirm Password Input */}
            <CommonInput
              placeholder="Confirm Password"
              label="Confirm Password"
              placeholderTextColor={COLORS.GRAY}
              secureTextEntry
              value={confirmPassword}
              isPassword={true}
              onChangeText={setConfirmPassword}
              errorMessage={errors.confirmPassword}
            />

            {/* Terms & Conditions */}
            <View style={styles.termsContainer}>
              <CheckBox
                checked={checked}
                onPress={() => setChecked(!checked)}
              />
              <Text style={USER_AUTH_STYLE.LOGO_REMEMBER_ME}>
                {'I have read & agreed'}
              </Text>
              <TouchableOpacity
                onPress={() => console.log('Open Terms & Conditions')}>
                <Text
                  style={[
                    USER_AUTH_STYLE.LOGO_REMEMBER_ME,
                    {color: COLORS.PINK_COLOR},
                  ]}>
                  {' Terms & Conditions'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.terms && (
              <Text style={styles.errorText}>{errors.terms}</Text>
            )}

            {/* Sign Up Button */}
            <CommonButton title="Sign Up" onPress={handleSignUp} />

            {/* Social Logins */}
            {/* <DividerWithText
              text="Or"
              color={COLORS.BORDER_COLOR}
              lineWidth="40%"
            />
            {Platform.OS === 'ios' ? (
              <SocialAuthButton
                title="Continue with Apple"
                icon={IMAGES_ASSETS.APPLE_LOGO}
                backgroundColor={COLORS.WHITE_COLOR}
                textColor={COLORS.BLACK_COLOR}
                onPress={() => {}}
              />
            ) : (
              <SocialAuthButton
                title="Continue with Google"
                icon={IMAGES_ASSETS.GOOGLE_LOGO}
                backgroundColor={COLORS.WHITE_COLOR}
                textColor={COLORS.BLACK_COLOR}
                onPress={() => {}}
              />
            )} */}
            {/* <SocialAuthButton
              title="Continue with Facebook"
              icon={IMAGES_ASSETS.FB_LOGO}
              backgroundColor={COLORS.WHITE_COLOR}
              textColor={COLORS.BLACK_COLOR}
              onPress={() => {}}
            /> */}

            {/* Navigate to Sign In */}
            <TouchableOpacity
              style={styles.signInContainer}
              onPress={() =>
                //@ts-ignore
                navigation.pop()
              }>
              <Text style={USER_AUTH_STYLE.LOGO_REMEMBER_ME}>
                {'Already have an account? '}
              </Text>
              <Text
                style={[
                  USER_AUTH_STYLE.LOGO_REMEMBER_ME,
                  {color: COLORS.PINK_COLOR, fontWeight: 'bold'},
                ]}>
                {'Sign In'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginTop: 15,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: WINDOW_WIDTH - 20,
    // alignItems: 'center',
    marginBottom: 10,
  },
  errorText: {color: 'red', fontSize: 12, marginTop: 5},
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
});

export default SignUpScreen;
