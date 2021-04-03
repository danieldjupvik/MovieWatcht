import { StyleSheet } from 'react-native';
import { borderRadius } from '../styles/globalStyles';

const ButtonStyles = StyleSheet.create({
  mediumButtonStyling: {
    padding: 15,
    paddingLeft: 44,
    paddingRight: 44,
    borderRadius: borderRadius,
  },
  smallButtonStyling: {
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: borderRadius,
  },
  buttonText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 17,
  },
});
export default ButtonStyles;
