import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {HOME_SCREEN_STYLE} from '../HomeTabs/HomeScreenStyle';
import HeaderWithBackButton from '../../Headers/Header';
import {useAppNavigation} from '../../Utils/useAppNavigation';
import {COLORS} from '../../Utils/Colors';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/Store';
import CommonButton from '../../Utils/CommonButton';
import {MaterialIcons} from '../../Utils/ReactIcons';
import { API_ENDPOINTS } from '../../ApiProviders/ApiConfig';
import ApiService from '../../ApiProviders/ApiService';

const problemOptions = [
  'Genre not showing',
  'Playlist not showing',
  'Artist list not showing',
  'Songs not showing',
  'Cache offline not working',
  'Download list not showing',
  'App crash',
];

const HelpAndSupportScreen = () => {
  const navigation = useAppNavigation();
  const [selectedProblem, setSelectedProblem] = useState(problemOptions[0]);
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const AUTH_TOKEN = useSelector(
    (state: RootState) => state.authToken.AUTH_TOKEN,
  );

  const validateForm = () => {
    if (!message.trim()) {
      Alert.alert('Validation Error!', 'Please describe the issue before submitting.');
      return false;
    }
    return true;
  };

  const submitButton = async () => {
    if (validateForm()) {
      try {
        const response = await ApiService.post<{
          success: boolean;
          message: string;
          data?: any;
        }>(API_ENDPOINTS.PROFILE.SUPPORT, {
            type: selectedProblem,
            message: message,
        });

        console.log('response', response);

        if (response.success) {
          setTimeout(() => {
          }, 100);
          Alert.alert('Successfully',response.message);
        } else {
          Alert.alert(
            response.message || 'Something went wrong. Please try again.',
          );
        }
      } catch (error) {
        console.error('API Error:', error);
        Alert.alert('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <SafeAreaView style={[HOME_SCREEN_STYLE.BG_CONTAINER, {flex: 1}]}>
      <HeaderWithBackButton
        title="Support"
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
              <View style={{marginBottom: 20}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: COLORS.WHITE_COLOR,
                    marginBottom: 8,
                  }}>
                  Select a problem
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor:COLORS.BLACK_SCREENS_BG,
                    padding: 12,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => setModalVisible(true)}>
                  <Text style={{color: COLORS.WHITE_COLOR, fontSize: 16}}>
                    {selectedProblem}
                  </Text>
                  <MaterialIcons
                    name="arrow-drop-down"
                    size={24}
                    color={COLORS.WHITE_COLOR}
                  />
                </TouchableOpacity>
              </View>

              {/* Dropdown Modal */}
              <Modal visible={modalVisible} transparent animationType="fade">
                <TouchableWithoutFeedback
                  onPress={() => setModalVisible(false)}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: '80%',
                        backgroundColor: COLORS.WHITE_COLOR,
                        borderRadius: 10,
                        paddingVertical: 10,
                        elevation: 5,
                      }}>
                      <FlatList
                        data={problemOptions}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => (
                          <TouchableOpacity
                            style={{
                              padding: 15,
                              borderBottomWidth: 1,
                              borderBottomColor: '#ddd',
                            }}
                            onPress={() => {
                              setSelectedProblem(item);
                              setModalVisible(false);
                            }}>
                            <Text style={{fontSize: 16, color: '#000'}}>
                              {item}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>

              {/* Input Box */}
              <View style={{marginBottom: 20}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: COLORS.WHITE_COLOR,
                    marginBottom: 8,
                  }}>
                  Describe the issue
                </Text>
                <TextInput
                  style={{
                    backgroundColor: '#333',
                    color: COLORS.WHITE_COLOR,
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 16,
                    minHeight: 100,
                    textAlignVertical: 'top',
                  }}
                  placeholder="Type here..."
                  placeholderTextColor="#ccc"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                />
              </View>
            </View>

            {/* Submit Button */}
            <CommonButton
              title="Submit"
              onPress={submitButton}
              style={{alignSelf: 'center', marginBottom: 0}}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HelpAndSupportScreen;