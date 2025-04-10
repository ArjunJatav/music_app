import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import {WINDOW_WIDTH} from './DimensionsUtil';
import {COLORS} from './Colors';
import {MaterialIcons} from './ReactIcons';

interface InputProps extends TextInputProps {
  label?: string;
  errorMessage?: string;
  isPassword?: boolean;
  theme?: boolean;
}

const CommonInput: React.FC<InputProps> = ({
  label,
  errorMessage,
  isPassword = false,
  value, // Use this instead of local state
  onChangeText, // Ensure it's passed down
  theme, // Ensure theme is destructured correctly

  ...props
}: any) => {
  const [secureText, setSecureText] = useState(isPassword);
  const inputRef = useRef<TextInput | null>(null);
  const selectionRef = useRef<{start: number; end: number}>({start: 0, end: 0});

  const togglePasswordVisibility = () => {
    inputRef.current?.focus();
    inputRef.current?.setNativeProps({
      selection: selectionRef.current,
    });

    setSecureText((prev: any) => !prev);

    setTimeout(() => {
      inputRef.current?.setNativeProps({
        selection: selectionRef.current,
      });
    }, 50);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            {color: theme ? COLORS.WHITE_COLOR : COLORS.GRAY},
          ]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme
              ? COLORS.BLACK_SCREENS_BG
              : COLORS.WHITE_COLOR,
          },
        ]}>
        <TextInput
          ref={ref => (inputRef.current = ref)}
          {...props}
          key={secureText ? 'password' : 'text'} // Forces re-render while preserving input
          value={value} // Use value prop instead of local state
          onChangeText={onChangeText} // Ensure the parent state updates
          secureTextEntry={secureText}
          onSelectionChange={e =>
            (selectionRef.current = e.nativeEvent.selection)
          }
          style={[
            styles.input,
            errorMessage && styles.errorBorder,
            {color: theme ? COLORS.WHITE_COLOR : COLORS.BLACK_COLOR},
          ]}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={togglePasswordVisibility}>
            <MaterialIcons
              name={secureText ? 'visibility-off' : 'visibility'}
              size={22}
              color={COLORS.GRAY}
            />
          </TouchableOpacity>
        )}
      </View>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
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
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
  },
  input: {
    flex: 1,
    height: 45,
    paddingHorizontal: 15,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
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

export default CommonInput;
