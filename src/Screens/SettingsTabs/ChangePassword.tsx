import React, {useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {HOME_SCREEN_STYLE} from '../HomeTabs/HomeScreenStyle';
import HeaderWithBackButton from '../../Headers/Header';
import {useAppNavigation} from '../../Utils/useAppNavigation';
import {COLORS} from '../../Utils/Colors';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/Store';
import CustomLoadingModal from '../../Modals/LoadingModal';
import CommonInput from '../../Utils/CommonInput';
import CommonButton from '../../Utils/CommonButton';
import {API_ENDPOINTS} from '../../ApiProviders/ApiConfig';
import ApiService from '../../ApiProviders/ApiService';

const ChangePasswordScreen = () => {
  const navigation = useAppNavigation();
  const [LOADING, SET_LOADING] = useState(false);
  const [OLD_PASSWORD, SET_OLD_PASSWORD] = useState('');
  const [NEW_PASSWORD, SET_NEW_PASSWORD] = useState('');
  const AUTH_TOKEN = useSelector(
    (state: RootState) => state.authToken.AUTH_TOKEN,
  );
  const [ERRORS, SET_ERRORS] = useState<{
    OLD_PASSWORD?: string;
    NEW_PASSWORD?: string;
  }>({});

  const validateForm = () => {
    let NEW_ERRORS: {
      OLD_PASSWORD?: string;
      NEW_PASSWORD?: string;
    } = {};

    // Password validation
    if (!OLD_PASSWORD) {
      NEW_ERRORS.OLD_PASSWORD = 'Old password is required';
    } else if (OLD_PASSWORD.length < 6) {
      NEW_ERRORS.OLD_PASSWORD = 'Password must be at least 6 characters';
    } else if (
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(OLD_PASSWORD)
    ) {
      NEW_ERRORS.OLD_PASSWORD =
        'Password must contain uppercase, lowercase, number, and special character';
    }

    // Confirm password validation
    if (!NEW_PASSWORD) {
      NEW_ERRORS.NEW_PASSWORD = 'New password is required';
    } else if (NEW_PASSWORD !== OLD_PASSWORD) {
      NEW_ERRORS.NEW_PASSWORD = 'Passwords do not match';
    }

    SET_ERRORS(NEW_ERRORS);
    return Object.keys(NEW_ERRORS).length === 0;
  };

  const submitButton = async () => {
    if (validateForm()) {
      SET_LOADING(true); // Show loader

      try {
        const response = await ApiService.post<{
          success: boolean;
          message: string;
          data?: any;
        }>(API_ENDPOINTS.PROFILE.CHANGED_PASSWORD, {
          old_pass: OLD_PASSWORD,
          new_pass: NEW_PASSWORD,
        });

        console.log('response', response);

        if (response.success) {
          setTimeout(() => {
            SET_LOADING(false);
          }, 100);
          Alert.alert('Password changed successfully');
        } else {
          SET_LOADING(false);
          Alert.alert(
            response.message || 'Something went wrong. Please try again.',
          );
        }
      } catch (error) {
        console.error('API Error:', error);
        SET_LOADING(false);
        Alert.alert('Failed to reset password. Please try again.');
      }
    }
  };

  return (
    <SafeAreaView style={[HOME_SCREEN_STYLE.BG_CONTAINER, {flex: 1}]}>
      <HeaderWithBackButton
        title={'Change Password'}
        onBackButton={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              paddingBottom: 20,
            }}>
            <View style={{flex: 1}}>
              <CommonInput
                placeholder={'Enter your old Password'}
                label="Old Password"
                placeholderTextColor={COLORS.GRAY}
                theme={true}
                keyboardType="email-address"
                value={OLD_PASSWORD}
                onChangeText={text => {
                  SET_OLD_PASSWORD(text);
                  SET_ERRORS(prev => ({...prev, OLD_PASSWORD: ''}));
                }}
                errorMessage={ERRORS.OLD_PASSWORD}
              />
              <CommonInput
                placeholder={'Enter your new Password'}
                label="New Password"
                placeholderTextColor={COLORS.GRAY}
                keyboardType="email-address"
                value={NEW_PASSWORD}
                onChangeText={text => {
                  SET_NEW_PASSWORD(text);
                  SET_ERRORS(prev => ({...prev, NEW_PASSWORD: ''}));
                }}
                errorMessage={ERRORS.NEW_PASSWORD}
                theme={true}
              />
            </View>

            {/* Submit Button */}
            <CommonButton
              title="Submit"
              onPress={() => {
                submitButton();
              }}
              style={{alignSelf: 'center', marginBottom: 0}}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
