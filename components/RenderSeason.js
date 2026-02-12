import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { useAppearance } from './AppearanceContext';
import {
  detailsSeriesUrl,
  apiKey,
  basePosterUrl,
  baseFullPosterUrl,
  baseStillImageUrl,
  getLanguageName,
} from '../settings/api';
import Gallery from 'react-native-awesome-gallery';
import { FontAwesome5 } from '@expo/vector-icons';
import Loader from '../components/Loader';
import axios from 'axios';
import {
  backgroundColorDark,
  backgroundColorLight,
  textColorDark,
  textColorLight,
} from '../colors/colors';
import { borderRadius, boxShadow } from '../styles/globalStyles';
import { imageBlurhash } from '../settings/imagePlaceholder';
import useResponsive from '../hooks/useResponsive';

const thumbGap = 6;

export const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const RenderSeason = ({ navigation, id, season }) => {
  const [loader, setLoader] = useState(true);
  const [episodes, setEpisodes] = useState([]);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryRef = useRef(null);
  const thumbScrollRef = useRef(null);
  const { colorScheme } = useAppearance();
  const { width, isTablet } = useResponsive();
  const stillWidth = isTablet ? 280 : Math.min(width / 3, 160);
  const stillHeight = stillWidth / 1.6;
  const seasonPosterW = isTablet ? 180 : 140;
  const seasonPosterH = isTablet ? 257 : 200;
  const thumbW = isTablet ? 64 : 44;
  const scrollBarTheme = colorScheme === 'light' ? 'black' : 'white';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  useEffect(() => {
    const getSeason = async () => {
      try {
        const response = await axios.get(
          `${detailsSeriesUrl + id + `/season/${season}` + apiKey}&append_to_response=images&include_image_language=en,null`
        );
        setEpisodes(response.data);
      } catch (_e) {

      } finally {
        setLoader(false);
      }
    };
    getSeason();
  }, [id, season]);

  return (
    <View style={[styles.container, themeContainerStyle]}>
      {loader ? (
        <Loader loadingStyle={styles.Loader} />
      ) : (
        <View style={styles.scrollViewWrapper}>
          <ScrollView indicatorStyle={scrollBarTheme} contentContainerStyle={{ paddingBottom: isTablet ? 0 : 50 }}>
            <View style={styles.main}>
              <Pressable onPress={() => { if (episodes.images?.posters?.length > 0) setGalleryVisible(true); }}>
                <View style={[styles.imageDiv, boxShadow]}>
                  <Image
                    source={{
                      uri: `${basePosterUrl + (episodes?.poster_path ?? '')}`,
                    }}
                    placeholder={imageBlurhash}
                    placeholderContentFit='cover'
                    style={[styles.posterImg, { width: seasonPosterW, height: seasonPosterH }]}
                  />
                </View>
              </Pressable>
              {isTablet ? (
                <View style={styles.cardsDiv}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row' }}>
                      {(episodes?.episodes ?? []).map((episode, idx) => {
                        let releaseDate = '';
                        if (episode.air_date) {
                          let d = new Date(episode.air_date);
                          let year = d.getFullYear();
                          let month = monthNames[d.getMonth()];
                          let day = d.getDate();
                          releaseDate = `${day}. ${month} ${year}`;
                        }
                        return (
                          <View key={idx} style={{ width: stillWidth, marginRight: 20 }}>
                            <Image
                              source={{
                                uri: `${baseStillImageUrl + (episode.still_path ?? '')}`,
                              }}
                              placeholder={imageBlurhash}
                              placeholderContentFit='cover'
                              style={[styles.stillImg, { width: stillWidth, height: stillHeight }]}
                            />
                            <Text style={[styles.episodeName, themeTextStyle, { marginTop: 10 }]}>
                              {episode.episode_number} - {episode.name}
                            </Text>
                            <Text style={[styles.releaseDate, themeTextStyle]}>
                              {releaseDate}
                            </Text>
                            <Text
                              numberOfLines={3}
                              style={[styles.overview, themeTextStyle]}
                            >
                              {episode.overview}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              ) : (
                <View style={styles.cardsDiv}>
                  {(episodes?.episodes ?? []).map((episode, idx) => {
                    let releaseDate = '';
                    if (episode.air_date) {
                      let d = new Date(episode.air_date);
                      let year = d.getFullYear();
                      let month = monthNames[d.getMonth()];
                      let day = d.getDate();
                      releaseDate = `${day}. ${month} ${year}`;
                    }
                    return (
                      <View key={idx} style={styles.cards}>
                        <View style={styles.stillImgDiv}>
                          <Image
                            source={{
                              uri: `${baseStillImageUrl + (episode.still_path ?? '')}`,
                            }}
                            placeholder={imageBlurhash}
                            placeholderContentFit='cover'
                            style={[styles.stillImg, { width: stillWidth, height: stillHeight }]}
                          />
                        </View>
                        <View style={styles.infoDiv}>
                          <Text style={[styles.episodeName, themeTextStyle]}>
                            {episode.episode_number} - {episode.name}
                          </Text>
                          <Text style={[styles.releaseDate, themeTextStyle]}>
                            {releaseDate}
                          </Text>
                          <Text
                            numberOfLines={2}
                            style={[styles.overview, themeTextStyle]}
                          >
                            {episode.overview}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}
      <Modal
        visible={galleryVisible}
        transparent
        animationType='fade'
        statusBarTranslucent
        onRequestClose={() => setGalleryVisible(false)}
      >
        <View style={[styles.galleryContainer, themeContainerStyle]}>
          <Gallery
            ref={galleryRef}
            data={episodes.images?.posters?.map((p) => `${baseFullPosterUrl}${p.file_path}`) ?? []}
            style={{ backgroundColor: colorScheme === 'light' ? backgroundColorLight : backgroundColorDark }}
            initialIndex={galleryIndex}
            onIndexChange={(idx) => {
              setGalleryIndex(idx);
              thumbScrollRef.current?.scrollTo({ x: idx * (thumbW + thumbGap) - thumbW * 2, animated: true });
            }}
            onSwipeToClose={() => setGalleryVisible(false)}
          />
          <View style={styles.galleryHeader}>
            <Pressable onPress={() => setGalleryVisible(false)} hitSlop={16}>
              <FontAwesome5 name='times' style={[styles.galleryClose, themeTextStyle]} />
            </Pressable>
            <Text style={[styles.galleryCounter, themeTextStyle]}>
              {galleryIndex + 1} / {episodes.images?.posters?.length ?? 0}
            </Text>
          </View>
          <View style={styles.galleryFooter}>
            {(() => {
              const img = episodes.images?.posters?.[galleryIndex];
              if (!img) return null;
              const lang = img.iso_639_1 ? getLanguageName(img.iso_639_1) : null;
              const parts = [
                lang,
                `${img.width}\u00d7${img.height}`,
                img.vote_average > 0 ? `${img.vote_average.toFixed(1)} \u2605` : null,
              ].filter(Boolean);
              return <Text style={[styles.galleryMetaText, themeTextStyle]}>{parts.join(' \u00b7 ')}</Text>;
            })()}
            <ScrollView
              ref={thumbScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbContent}
            >
              {episodes.images?.posters?.map((p, idx) => (
                <Pressable
                  key={p.file_path}
                  onPress={() => {
                    galleryRef.current?.setIndex(idx, true);
                  }}
                >
                  <Image
                    source={{ uri: `${basePosterUrl}${p.file_path}` }}
                    style={[
                      styles.thumbImage,
                      { width: thumbW, height: thumbW * 1.5 },
                      idx === galleryIndex && [styles.thumbActive, { borderColor: colorScheme === 'light' ? textColorLight : textColorDark }],
                    ]}
                  />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollViewWrapper: {
    marginBottom: 45,
  },
  main: {
    marginLeft: 22,
    marginRight: 22,
  },
  cardsDiv: {
    marginTop: 20,
  },
  cards: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  posterImg: {
    marginTop: 20,
    borderRadius: borderRadius,
  },
  stillImg: {
    borderRadius: borderRadius,
  },
  stillImgDiv: {},
  infoDiv: {
    flex: 1,
    marginLeft: 15,
  },
  imageDiv: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  episodeName: {
    fontSize: 14,
    fontWeight: '600',
  },
  releaseDate: {
    marginTop: 6,
    opacity: 0.7,
    fontSize: 13,
  },
  overview: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '400',
  },
  Loader: {
    marginBottom: 80,
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
  lightThemeBtnBackground: {
    backgroundColor: 'lightgrey',
  },
  darkThemeBtnBackground: {
    backgroundColor: '#4a4b4d',
  },
  darkThemeBox: {
    backgroundColor: '#313337',
  },
  lightThemeBox: {
    backgroundColor: '#bfc5ce',
  },
  galleryContainer: {
    flex: 1,
  },
  galleryHeader: {
    position: 'absolute',
    top: 60,
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
    bottom: 40,
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
});

export default RenderSeason;
