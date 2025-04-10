import {Dimensions, StyleSheet} from 'react-native';
import { COLORS } from '../Utils/Colors';
import { WINDOW_WIDTH } from '../Utils/DimensionsUtil';

export const HEADER_STYLE = StyleSheet.create({
  HEADER_WITH_BACK: {
    height: 60,
    backgroundColor: COLORS.BLACK_COLOR,
    flexDirection: 'row',
    paddingHorizontal: 10,
    width:WINDOW_WIDTH,
  },
  BACK_BUTTON_CONTAINER: {
    width: '10%',
    justifyContent: 'center',
  },
  TITLE_CONTAINER: {
    width: '80%',
    justifyContent: 'center',
  },
  TITLE: {
    color: COLORS.WHITE_COLOR,
    fontSize: 18,
    fontWeight:"500"
  },
 
 
});
