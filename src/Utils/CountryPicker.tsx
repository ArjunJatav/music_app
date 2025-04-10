import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import { MaterialIcons } from './ReactIcons';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from './DimensionsUtil';
import { COLORS } from './Colors';

const PhoneInput = ({
  onChangePhone,
  errorMessage,
}: {
  onChangePhone: (phoneData: { countryCode: string; dialCode: string; phoneNumber: string }) => void;
  errorMessage?: string;
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    dial_code: string;
    code: string;
  }>({
    name: 'United States',
    dial_code: '+1',
    code: 'US',
  });

  const [phone, setPhone] = useState('');

  const handleSelect = (country: any) => {
    setSelectedCountry(country);
    setShowPicker(false);
    setPhone(''); // Reset phone number when country changes

    // Send updated data
    onChangePhone({
      countryCode: country.code,
      dialCode: country.dial_code,
      phoneNumber: '',
    });
  };

  const handlePhoneChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setPhone(numericText);

    // Send updated data
    onChangePhone({
      countryCode: selectedCountry.code,
      dialCode: selectedCountry.dial_code,
      phoneNumber: numericText,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Phone Number</Text>
      <View style={styles.inputContainer}>
        {/* Country Code Selection */}
        <TouchableOpacity
          style={styles.countryPicker}
          onPress={() => setShowPicker(true)}>
          <Text style={styles.countryCode}>{selectedCountry.dial_code}</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={20}
            color={COLORS.GRAY}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        {/* Phone Number Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter your number"
          keyboardType="phone-pad"
          value={phone}
          maxLength={15}
          onChangeText={handlePhoneChange}
        />
      </View>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {/* Country Picker */}
      <CountryPicker
        show={showPicker} //@ts-ignore
        showSearch={true}
        inputPlaceholder="Search country..."
        pickerButtonOnPress={handleSelect}
        onBackdropPress={() => setShowPicker(false)}
        style={{
          // Styles for whole modal [View]
          modal: {
              height: WINDOW_HEIGHT / 2,
          },
          backdrop: {
            height:WINDOW_HEIGHT,
          },
         
          textInput: {
                height: 50,
                borderRadius: 10,
                
          },
          countryButtonStyles: {
                height: 50
          },
       
      }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.GRAY,
    marginLeft: 10,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE_COLOR,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    height: 50,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: COLORS.BORDER_COLOR,
    marginRight: 10,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.BLACK_COLOR,
  },
  arrowIcon: {
    marginLeft: 5,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.BLACK_COLOR,
  },
  errorBorder: {
    borderColor: COLORS.PINK_COLOR,
  },
  errorText: {
    color: COLORS.PINK_COLOR,
    fontSize: 12,
    marginLeft: 10,
    marginTop: 3,
  },
});

export default PhoneInput;
