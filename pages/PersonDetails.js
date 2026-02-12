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
import { LinearGradient } from 'expo-linear-gradient';
import {
  baseBackdropUrl,
  baseBackdropPlaceholderUrl,
  apiKey,
  basePosterUrl,
  baseFullPosterUrl,
  personUrl,
  creditPerson,
} from '../settings/api';
import Gallery from 'react-native-awesome-gallery';
import { FontAwesome5 } from '@expo/vector-icons';
import Loader from '../components/Loader';
import * as WebBrowser from 'expo-web-browser';
import i18n from '../language/i18n';
import { useAppearance } from '../components/AppearanceContext';

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
import { monthNames } from '../components/RenderMovieDetails';
import tmdbLogo from '../assets/tmdb-logo-small.png';
import noImage from '../assets/no-image.jpg';

const thumbGap = 6;

const PersonDetails = ({ route, navigation }) => {
  const { id } = route.params;
  const { creditId } = route.params;

  const [loader, setLoader] = useState(true);
  const [person, setPerson] = useState({});
  const [personCredit, setPersonCredit] = useState({});
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryRef = useRef(null);
  const thumbScrollRef = useRef(null);
  const pendingRequests = useRef(0);

  const { colorScheme } = useAppearance();
  const { width, isTablet } = useResponsive();
  const scrollBarTheme = colorScheme === 'light' ? 'black' : 'white';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeBtnBackground =
    colorScheme === 'light'
      ? styles.lightThemeBtnBackground
      : styles.darkThemeBtnBackground;

  const backdropHeight = isTablet ? 560 : 250;
  const posterImgW = isTablet ? 200 : 120;
  const posterImgH = posterImgW * 1.5;
  const posterW = isTablet ? 140 : Math.min(width / 4.5, 130);
  const posterH = posterW * 1.5;
  const thumbW = isTablet ? 64 : 44;

  useEffect(() => {
    pendingRequests.current = creditId ? 2 : 1;
    setLoader(true);

    const getPerson = async () => {
      try {
        const response = await axios.get(
          `${personUrl + id + apiKey}&append_to_response=combined_credits,images`
        );
        setPerson(response.data);
      } catch (e) {
        console.log(e);
      } finally {
        pendingRequests.current -= 1;
        if (pendingRequests.current <= 0) setLoader(false);
      }
    };

    const getCreditPerson = async () => {
      try {
        const response = await axios.get(`${creditPerson + creditId + apiKey}`);
        setPersonCredit(response.data);
      } catch (e) {
        console.log(e);
      } finally {
        pendingRequests.current -= 1;
        if (pendingRequests.current <= 0) setLoader(false);
      }
    };

    getPerson();
    if (creditId) getCreditPerson();
  }, [id, creditId]);

  let birthday = '';
  if (person.birthday) {
    const dBirthday = new Date(person.birthday);
    birthday = `${dBirthday.getDate()}. ${monthNames[dBirthday.getMonth()]} ${dBirthday.getFullYear()}`;
  }

  let deathday = '';
  if (person.deathday) {
    const dDeathday = new Date(person.deathday);
    deathday = `${dDeathday.getDate()}. ${monthNames[dDeathday.getMonth()]} ${dDeathday.getFullYear()}`;
  }

  const knownForItems = (person.combined_credits?.cast || [])
    .slice()
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 20);

  const appearsInItems = person.combined_credits?.cast || [];

  const goToWebsite = () => {
    WebBrowser.openBrowserAsync(person.homepage);
  };

  return (
    <View style={[styles.container, themeContainerStyle]}>
      {loader ? (
        <Loader />
      ) : (
        <View style={styles.scrollViewWrapper}>
          <ScrollView indicatorStyle={scrollBarTheme}>
            <View style={styles.main}>
              <View style={[styles.backdrop, { height: backdropHeight }]}>
                <Image
                  source={
                    personCredit.media?.backdrop_path
                      ? {
                          uri: `${baseBackdropUrl + personCredit.media.backdrop_path}`,
                        }
                      : noImage
                  }
                  style={StyleSheet.absoluteFill}
                  placeholder={
                    personCredit.media?.backdrop_path
                      ? {
                          uri: `${
                            baseBackdropPlaceholderUrl +
                            personCredit.media.backdrop_path
                          }`,
                        }
                      : imageBlurhash
                  }
                  placeholderContentFit='cover'
                  transition={350}
                  contentFit='cover'
                />
                <LinearGradient
                  colors={[
                    'rgba(0,0,0,0.4)',
                    'rgba(0,0,0,0.6)',
                    colorScheme === 'light' ? backgroundColorLight : backgroundColorDark,
                  ]}
                  locations={[0, 0.5, 1]}
                  style={StyleSheet.absoluteFill}
                />

              </View>
              <View style={{ flexDirection: isTablet ? 'row' : 'column', paddingHorizontal: isTablet ? 22 : 0, marginTop: isTablet ? -backdropHeight * 0.6 : 0, marginBottom: isTablet ? 30 : 0 }}>
                <View style={isTablet ? { alignItems: 'center' } : undefined}>
                  <Pressable onPress={() => { if (person.images?.profiles?.length > 0) setGalleryVisible(true); }}>
                    <View style={boxShadow}>
                      <Image
                        source={
                          person.profile_path
                            ? { uri: `${basePosterUrl + person.profile_path}` }
                            : noImage
                        }
                        placeholder={imageBlurhash}
                        placeholderContentFit='cover'
                        style={[styles.posterImg, { width: posterImgW, height: posterImgH, marginTop: isTablet ? 0 : -backdropHeight / 2, marginLeft: isTablet ? 0 : 20 }]}
                      />
                    </View>
                  </Pressable>
                </View>
                <View style={isTablet ? { flex: 1, marginLeft: 22, flexDirection: 'row', gap: 32, alignItems: 'flex-start' } : undefined}>
                  <View style={isTablet ? { flexShrink: 0, maxWidth: 250 } : undefined}>
                    <Text style={[styles.title, styles.runtime, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0, fontSize: 24, marginTop: 10, color: 'white' }]}>
                      {person.name}
                    </Text>

                    <Text style={[styles.genre, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                      <Text style={styles.category}>{i18n.t('birthday')}</Text>{' '}
                      {birthday}
                    </Text>

                    {person.deathday ? (
                      <Text style={[styles.genre, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                        <Text style={styles.category}>{i18n.t('deathday')}</Text>{' '}
                        {deathday}
                      </Text>
                    ) : null}

                    <Text style={[styles.genre, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                      <Text style={styles.category}>{i18n.t('gender')}</Text>{' '}
                      {person.gender === 1
                        ? i18n.t('female')
                        : person.gender === 2
                          ? i18n.t('male')
                          : person.gender === 3
                            ? i18n.t('nonBinary')
                            : ''}
                    </Text>

                    <Text style={[styles.genre, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                      <Text style={styles.category}>{i18n.t('birthPlace')}</Text>{' '}
                      {person.place_of_birth}
                    </Text>

                    {person.homepage ? (
                      <View style={styles.homepageButtonMain}>
                        <Pressable
                          style={[styles.homepageButtonDiv, isTablet && { marginLeft: 0 }]}
                          onPress={goToWebsite}
                        >
                          <Text
                            style={[
                              styles.homepageButton,
                              themeTextStyle,
                              themeBtnBackground,
                            ]}
                          >
                            {i18n.t('homepage')}
                          </Text>
                        </Pressable>
                      </View>
                    ) : null}
                  </View>
                  <View style={isTablet ? { flex: 1, maxWidth: 500, marginTop: 52 } : undefined}>
                    <Text style={[styles.overview, styles.runtime, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0, marginTop: 10 }]}>
                      {person.biography}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.moviesMain}>
              <Text style={[styles.moviesHeading, themeTextStyle]}>
                {i18n.t('knownFor')}
              </Text>
              <ScrollView horizontal={true} indicatorStyle={scrollBarTheme}>
                <View style={styles.moviesDiv}>
                  {knownForItems
                    .filter((movie) => movie.poster_path !== null)
                    .map((movie) => {
                      const mediaType = movie.media_type === 'movie' ? 'Details' : 'SeriesDetails';
                      return (
                        <Pressable
                          style={styles.moviesCard}
                          key={movie.credit_id}
                          onPress={() =>
                            navigation.push(mediaType, {
                              id: movie.id,
                              headerTitle:
                                movie.title || movie.name || movie.original_name,
                            })
                          }
                        >
                          <View style={boxShadow}>
                            <Image
                              style={[styles.posterImage, { width: posterW, height: posterH }]}
                              source={{
                                uri: `${basePosterUrl + movie.poster_path}`,
                              }}
                            />
                          </View>
                          <View style={styles.ratingDiv}>
                            <Image
                              source={tmdbLogo}
                              style={styles.tmdbLogo}
                              contentFit='contain'
                            />
                            <Text style={[styles.rating, themeTextStyle]}>
                              {Math.floor((movie.vote_average * 100) / 10)}%
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })}
                </View>
              </ScrollView>
            </View>

            <View style={styles.moviesMain}>
              <Text style={[styles.moviesHeading, themeTextStyle]}>
                {i18n.t('appearsIn')}
              </Text>
              <ScrollView horizontal={true} indicatorStyle={scrollBarTheme}>
                <View style={styles.moviesDiv}>
                  {appearsInItems
                    .filter((movie) => movie.poster_path !== null)
                    .map((movie) => {
                      const mediaType = movie.media_type === 'movie' ? 'Details' : 'SeriesDetails';
                      return (
                        <Pressable
                          style={styles.moviesCard}
                          key={movie.credit_id}
                          onPress={() =>
                            navigation.push(mediaType, {
                              id: movie.id,
                              headerTitle:
                                movie.title || movie.name || movie.original_name,
                            })
                          }
                        >
                          <View style={boxShadow}>
                            <Image
                              style={[styles.posterImage, { width: posterW, height: posterH }]}
                              source={{
                                uri: `${basePosterUrl + movie.poster_path}`,
                              }}
                            />
                          </View>
                          <View style={styles.ratingDiv}>
                            <Image
                              source={tmdbLogo}
                              style={styles.tmdbLogo}
                              contentFit='contain'
                            />
                            <Text style={[styles.rating, themeTextStyle]}>
                              {Math.floor((movie.vote_average * 100) / 10)}%
                            </Text>
                          </View>
                          <View style={styles.ratingDiv}>
                            <Text style={[styles.rating, themeTextStyle]}>
                              {movie.media_type === 'movie' ? 'Movie' : 'TV'}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })}
                </View>
              </ScrollView>
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
            data={person.images?.profiles?.map((p) => `${baseFullPosterUrl}${p.file_path}`) ?? []}
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
              {galleryIndex + 1} / {person.images?.profiles?.length ?? 0}
            </Text>
          </View>
          <View style={styles.galleryFooter}>
            {(() => {
              const img = person.images?.profiles?.[galleryIndex];
              if (!img) return null;
              const parts = [
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
              {person.images?.profiles?.map((p, idx) => (
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

const globalFontsize = 16;
const globalPadding = 5;
const normalFontWeight = '400';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    width: '100%',
    justifyContent: 'center',
  },
  scrollViewWrapper: {
    marginBottom: 45,
  },
  backdrop: {
    width: '100%',
    height: 250,
  },
  posterImg: {
    width: 120,
    height: 180,
    marginTop: -250 / 2,
    marginLeft: 20,
    borderRadius: borderRadius,
  },
  title: {
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 22,
    marginRight: 22,
    fontSize: 20,
    fontWeight: 'bold',
  },
  overview: {
    marginLeft: 22,
    marginRight: 22,
    fontSize: globalFontsize,
    fontWeight: normalFontWeight,
    marginTop: 20,
    lineHeight: 29,
  },
  genre: {
    marginLeft: 22,
    marginRight: 22,
    fontSize: globalFontsize,
    fontWeight: normalFontWeight,
    marginTop: globalPadding,
    marginBottom: globalPadding,
    lineHeight: 29,
  },
  runtime: {
    marginBottom: globalPadding * 4,
  },
  rating: {
    marginLeft: 22,
    fontSize: globalFontsize,
    fontWeight: normalFontWeight,
    marginTop: 20,
    marginBottom: globalPadding,
  },
  tagline: {
    marginLeft: 22,
    opacity: 0.7,
    fontSize: 16,
  },
  category: {
    opacity: 0.7,
  },
  castMain: {
    marginTop: 25 + globalPadding,
    marginBottom: 25 + globalPadding,
    marginLeft: 22,
  },
  castDiv: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 30,
  },
  castCard: {
    alignItems: 'center',
    marginRight: 20,
  },
  profileImage: {
    width: 85,
    height: 85,
    marginBottom: 5,
    borderRadius: 50,
  },
  textName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  textCharacter: {
    paddingTop: 8,
    fontSize: 12,
  },
  castHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  homepageButton: {
    fontSize: 17,
    fontWeight: '600',
    padding: 8,
  },
  homepageButtonMain: {
    alignItems: 'flex-start',
  },
  homepageButtonDiv: {
    marginLeft: 22,
    marginTop: globalPadding * 7,
    marginBottom: globalPadding * 3,
  },
  moviesMain: {
    marginBottom: 25 + globalPadding,
    marginLeft: 22,
  },
  moviesDiv: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 30,
  },
  moviesCard: {
    alignItems: 'center',
    marginRight: 20,
  },
  posterImage: {
    marginBottom: 13,
    borderRadius: borderRadius,
  },
  ratingDiv: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tmdbLogo: {
    width: 25,
    height: 12,
  },
  moviesHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 20,
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

export default PersonDetails;
