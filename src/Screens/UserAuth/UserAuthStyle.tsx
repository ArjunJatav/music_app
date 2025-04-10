import {StyleSheet} from 'react-native';
import {COLORS} from '../../Utils/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../Utils/DimensionsUtil';

export const USER_AUTH_STYLE = StyleSheet.create({
  BG_CONTAINER: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    backgroundColor: COLORS.SCREENS_BG,
    alignItems:"center"
  },
  LOGO_IMAGE: {
    marginTop: WINDOW_HEIGHT * 0.1,
    height: WINDOW_HEIGHT * 0.1,
    width: WINDOW_HEIGHT * 0.1,
  },
  LOGO_REMEMBER_ME: {
    fontSize: 15,
    fontWeight: "400",
    color:COLORS.GRAY,
    marginLeft:5,
    // marginBottom: 5,
  },
});
