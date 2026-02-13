import { useEffect, useRef } from 'react';
import { useWindowDimensions, LayoutAnimation } from 'react-native';

const CARD_GAP = 10;
const TARGET_CARD_WIDTH = 155;
const TABLET_BREAKPOINT = 700;

export default function useResponsive() {
  const { width } = useWindowDimensions();
  const prevWidth = useRef(width);

  useEffect(() => {
    if (prevWidth.current !== width) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      prevWidth.current = width;
    }
  }, [width]);

  const isTablet = width >= TABLET_BREAKPOINT;
  const numColumns = Math.max(3, Math.floor(width / TARGET_CARD_WIDTH));
  const posterWidth = (width - CARD_GAP * (numColumns + 1)) / numColumns;
  const posterHeight = posterWidth * 1.5;

  return { width, isTablet, numColumns, posterWidth, posterHeight };
}
