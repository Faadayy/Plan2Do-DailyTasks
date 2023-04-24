import { Dimensions, PixelRatio } from 'react-native';

// Get the screen dimensions
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Set your base dimension (you can choose any value you want)
const BASE_DIMENSION = 375;

// Define a custom function to scale a given dimension based on the screen size
export const scale = (dimension) => {
    const ratio = dimension / BASE_DIMENSION;
    const scaledValue = SCREEN_WIDTH * ratio;
    return Math.round(PixelRatio.roundToNearestPixel(scaledValue));
};
