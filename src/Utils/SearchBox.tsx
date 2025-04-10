import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from './ReactIcons';
import { COLORS } from './Colors';
import { WINDOW_WIDTH } from './DimensionsUtil';

const SearchBox = ({ placeholder, onSearch, style }:any) => {
  const [searchText, setSearchText] = useState('');

  const handleClear = () => {
    setSearchText('');
    if (onSearch) onSearch(''); // Trigger search callback with empty input
  };

  return (
    <View style={[styles.container, style]}>
      <FontAwesome name="search" size={20} color={COLORS.WHITE_COLOR} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder || 'Search...'}
        placeholderTextColor={COLORS.GRAY}
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
          if (onSearch) onSearch(text);
        }}
      />
      {searchText.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <FontAwesome name="times" size={18} color={COLORS.WHITE_COLOR} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width:WINDOW_WIDTH - 20,
    alignItems: 'center',
    backgroundColor: COLORS.BLACK_SCREENS_BG,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.WHITE_COLOR,
    paddingVertical: 8,
  },
  clearButton: {
    marginLeft: 8,
  },
});

export default SearchBox;
