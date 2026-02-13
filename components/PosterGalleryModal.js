import React, { useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, Pressable, Modal } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Gallery from 'react-native-awesome-gallery';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppearance } from './AppearanceContext';
import {
  backgroundColorDark,
  backgroundColorLight,
  textColorDark,
  textColorLight,
} from '../colors/colors';
import { basePosterUrl, baseFullPosterUrl, getLanguageName } from '../settings/api';

const thumbGap = 6;

const PosterGalleryModal = ({
  visible,
  onClose,
  images,
  index,
  onIndexChange,
  thumbW = 44,
}) => {
  const { colorScheme } = useAppearance();
  const insets = useSafeAreaInsets();
  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const thumbScrollRef = useRef(null);
  const galleryRef = useRef(null);

  const handleIndexChange = (idx) => {
    onIndexChange?.(idx);
    thumbScrollRef.current?.scrollTo({
      x: idx * (thumbW + thumbGap) - thumbW * 2,
      animated: true,
    });
  };

  const handleThumbPress = (idx) => {
    galleryRef.current?.setIndex(idx, true);
  };

  const currentImage = images?.[index];

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={[styles.galleryContainer, themeContainerStyle]}>
        <Gallery
          ref={galleryRef}
          data={images?.map((p) => `${baseFullPosterUrl}${p.file_path}`) ?? []}
          style={{ backgroundColor: colorScheme === 'light' ? backgroundColorLight : backgroundColorDark }}
          initialIndex={index}
          onIndexChange={handleIndexChange}
          onSwipeToClose={onClose}
        />
        <View style={[styles.galleryHeader, { top: insets.top + 10 }]}>
          <Pressable onPress={onClose} hitSlop={16}>
            <FontAwesome5 name='times' style={[styles.galleryClose, themeTextStyle]} />
          </Pressable>
          <Text style={[styles.galleryCounter, themeTextStyle]}>
            {index + 1} / {images?.length ?? 0}
          </Text>
        </View>
        <View style={[styles.galleryFooter, { bottom: insets.bottom + 10 }]}>
          {currentImage && (
            <Text style={[styles.galleryMetaText, themeTextStyle]}>
              {[
                currentImage.iso_639_1 ? getLanguageName(currentImage.iso_639_1) : null,
                `${currentImage.width}\u00d7${currentImage.height}`,
                currentImage.vote_average > 0 ? `${currentImage.vote_average.toFixed(1)} \u2605` : null,
              ].filter(Boolean).join(' \u00b7 ')}
            </Text>
          )}
          <ScrollView
            ref={thumbScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbContent}
          >
            {images?.map((p, idx) => (
              <Pressable
                key={p.file_path}
                onPress={() => handleThumbPress(idx)}
              >
                <Image
                  source={{ uri: `${basePosterUrl}${p.file_path}` }}
                  style={[
                    styles.thumbImage,
                    { width: thumbW, height: thumbW * 1.5 },
                    idx === index && [styles.thumbActive, { borderColor: colorScheme === 'light' ? textColorLight : textColorDark }],
                  ]}
                />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  galleryContainer: {
    flex: 1,
  },
  galleryHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  galleryClose: {
    fontSize: 22,
  },
  galleryCounter: {
    fontSize: 16,
    fontWeight: '600',
  },
  galleryFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    gap: 10,
  },
  galleryMetaText: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
  },
  thumbContent: {
    paddingHorizontal: 16,
    gap: thumbGap,
  },
  thumbImage: {
    borderRadius: 4,
    opacity: 0.5,
  },
  thumbActive: {
    opacity: 1,
    borderWidth: 2,
  },
  lightContainer: {
    backgroundColor: backgroundColorLight,
  },
  darkContainer: {
    backgroundColor: backgroundColorDark,
  },
  lightThemeText: {
    color: textColorLight,
  },
  darkThemeText: {
    color: textColorDark,
  },
});

export default PosterGalleryModal;
