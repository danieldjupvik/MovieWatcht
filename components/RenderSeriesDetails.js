import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { useAppearance } from './AppearanceContext';
import {
  detailsSeriesUrl,
  apiKey,
  omdbApiKey,
  basePosterUrl,
  baseProfileUrl,
} from '../settings/api';
import ProgressiveBackdrop from './ProgressiveBackdrop';
import { FontAwesome5 } from '@expo/vector-icons';
import Loader from '../components/Loader';
import i18n from '../language/i18n';
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
import noImage from '../assets/no-image.jpg';
import * as WebBrowser from 'expo-web-browser';
import imdbLogo from '../assets/imdb-logo.png';
import tmdbLogo from '../assets/tmdb-logo-small.png';
import freshNegative from '../assets/freshNegative.png';
import freshPositive from '../assets/freshPositive.png';
import PosterGalleryModal from './PosterGalleryModal';
import { formatDate } from '../utils/dateUtils';

const RenderSeriesDetails = ({ navigation, id }) => {
  const [loader, setLoader] = useState(true);
  const [series, setSeries] = useState({});
  const [error, setError] = useState(false);
  const [videos, setVideos] = useState([]);
  const [omdb, setOmdb] = useState();
  const [rottenTomato, setRottenTomato] = useState();
  const [imdbVotes, setImdbVotes] = useState();
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const { colorScheme } = useAppearance();
  const { width, isTablet } = useResponsive();
  const scrollBarTheme = colorScheme === 'light' ? 'black' : 'white';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeBoxStyle =
    colorScheme === 'light' ? styles.lightThemeBox : styles.darkThemeBox;

  const backdropHeight = isTablet ? 560 : 250;
  const posterImgW = isTablet ? 200 : 120;
  const posterImgH = posterImgW * 1.5;
  const videoWidth = isTablet ? Math.min(width * 0.4, 400) : Math.min(width * 0.52, 320);
  const videoHeight = videoWidth / 1.78;
  const castSize = isTablet ? 110 : Math.min(width / 4.5, 100);
  const posterW = isTablet ? 140 : Math.min(width / 4.5, 130);
  const posterH = posterW * 1.5;
  const seasonW = isTablet ? 140 : Math.min(width / 3.9, 130);
  const seasonH = seasonW * 1.5;
  const thumbW = isTablet ? 64 : 44;

  useEffect(() => {
    const getSeries = async () => {
      try {
        const videos = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/videos${apiKey}&language=en-US`
        );
        const response = await axios.get(
          `${
            detailsSeriesUrl +
            id +
            apiKey +
            '&append_to_response=translations,recommendations,similar,credits,external_ids,images&include_image_language=en,null'
          }`
        );
        setVideos(videos.data.results);
        getOmdbInfo(response.data.external_ids.imdb_id);
        setSeries(response.data);
      } catch (e) {
        console.error('Failed to fetch series:', e);
        setError(true);
        setLoader(false);
      }
    };
    getSeries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOmdbInfo = async (imdbId) => {
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${omdbApiKey}&i=${imdbId}`
      );
      setOmdb(response.data);
      if (response.data.imdbVotes && response.data.imdbVotes !== 'N/A') {
        setImdbVotes(JSON.parse(response.data.imdbVotes.replaceAll(',', '')));
      }
      const rtRating = response.data.Ratings?.find(
        (source) => source.Source === 'Rotten Tomatoes'
      );
      if (rtRating) {
        setRottenTomato(JSON.parse(rtRating.Value.replace('%', '')));
      }
      return response;
    } catch (e) {
      console.error('Failed to fetch OMDB info:', e);
    } finally {
      setLoader(false);
    }
  };

  let year = '';
  let releaseDate = '';
  if (series.first_air_date) {
    year = series.first_air_date.split('-')[0];
    releaseDate = formatDate(series.first_air_date);
  }

  const nextEpisode = (date) => formatDate(date);

  const nextAirCountdown = (date) => {
    if (!date) return false;
    const [y, m, d] = date.split('-').map(Number);
    const end = new Date(y, m - 1, d);
    const _hour = 3600000;
    const _day = _hour * 24;

    const distance = end - new Date();
    if (distance < 0 || Number.isNaN(distance)) return false;

    const days = Math.floor(distance / _day);
    const hours = Math.floor((distance % _day) / _hour);
    const dayString = days > 1 ? i18n.t('days') : i18n.t('day');
    const hourString = hours > 1 ? i18n.t('hours') : i18n.t('hour');
    return `${days} ${dayString} ${hours} ${hourString}`;
  };

  const numFormatter = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'm';
    } else if (num >= 1000) {
      return (num / 1000).toFixed() + 'k';
    } else {
      return num;
    }
  };

  return (
    <View style={[styles.container, themeContainerStyle]}>
      {loader ? (
        <Loader loadingStyle={styles.Loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, themeTextStyle]}>
            {i18n.t('errorLoading')}
          </Text>
        </View>
      ) : (
        <View style={styles.scrollViewWrapper}>
          <ScrollView indicatorStyle={scrollBarTheme}>
            <View style={styles.main}>
              <ProgressiveBackdrop
                backdropPath={series.backdrop_path}
                height={backdropHeight}
                backgroundColor={colorScheme === 'light' ? backgroundColorLight : backgroundColorDark}
              />
              <View style={{ flexDirection: isTablet ? 'row' : 'column', paddingHorizontal: isTablet ? 22 : 0, marginTop: isTablet ? -backdropHeight * 0.6 : 0 }}>
                <View style={isTablet ? { alignItems: 'center' } : [styles.imageDiv, boxShadow]}>
                  <Pressable onPress={() => { if (series.images?.posters?.length > 0) setGalleryVisible(true); }}>
                    <View style={boxShadow}>
                      <Image
                        source={
                          series.poster_path
                            ? { uri: `${basePosterUrl}${series.poster_path}` }
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
                    <Text style={[styles.title, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0, fontSize: 24, marginTop: 10, color: 'white' }]} selectable>
                      {series.original_name}
                    </Text>
                    <View style={[styles.underTitleDiv, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                      <View style={styles.underTitleElem}>
                        <Text style={[styles.underTitle, themeTextStyle]}>
                          {year}
                        </Text>
                      </View>
                      <Text style={[styles.separators, themeTextStyle]}>•</Text>
                      <View style={styles.underTitleElem}>
                        <Text style={[styles.underTitle, themeTextStyle]}>
                          {series.episode_run_time?.[0] ? `${series.episode_run_time[0]} min` : ''}
                        </Text>
                      </View>
                      <Text style={[styles.separators, themeTextStyle]}>•</Text>
                      <View style={styles.underTitleElem}>
                        <Text style={[styles.underTitle, themeTextStyle]}>
                          {omdb?.Rated}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.underTitleDiv2, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                      <View style={styles.underTitleElem}>
                        <Text style={[styles.underTitle, themeTextStyle]}>
                          {series.number_of_seasons} {i18n.t('totalSeasons')}
                        </Text>
                      </View>
                      <Text style={[styles.separators, themeTextStyle]}>•</Text>
                      <View style={styles.underTitleElem}>
                        <Text style={[styles.underTitle, themeTextStyle]}>
                          {series.number_of_episodes} {i18n.t('totalEpisodes')}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.rating, styles.runtime, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                      <Text style={styles.category}>{i18n.t('releaseDate')}</Text>{' '}
                      {releaseDate}
                    </Text>

                    <Text style={[styles.genre, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                      <Text style={styles.category}>{i18n.t('status')}</Text>{' '}
                      {series.status}
                    </Text>

                    {Array.isArray(series.created_by) && series.created_by.length > 0 ? (
                      <Text style={[styles.genre, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                        <Text style={styles.category}>{i18n.t('createdBy')}</Text>{' '}
                        {series.created_by[0].name}
                      </Text>
                    ) : null}
                    <Text style={[styles.genre, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                      <Text style={styles.category}>{i18n.t('genres')}</Text>{' '}
                      {series.genres?.map((genre) => genre.name).join(', ')}
                    </Text>
                  </View>
                  <View style={isTablet ? { flex: 1, maxWidth: 500, marginTop: 52 } : undefined}>
                    <View style={[styles.rating, styles.ratingDiv, isTablet && { marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0, flex: 0 }]}>
                      <Pressable
                        style={[styles.ratingWrapper]}
                        onPress={() => WebBrowser.openBrowserAsync(`https://www.themoviedb.org/tv/${series.id}`)}
                      >
                        <Image
                          source={tmdbLogo}
                          style={styles.tmdbLogo}
                          contentFit='contain'
                        />
                        <View style={styles.ratingElem}>
                          <Text style={[themeTextStyle]}>
                            {Math.floor((series.vote_average * 100) / 10)}%{' '}
                          </Text>
                          <Text style={[styles.ratingCounter, themeTextStyle]}>
                            {numFormatter(series.vote_count)}
                          </Text>
                        </View>
                      </Pressable>
                      {omdb ? (
                        <Pressable
                          style={[styles.ratingWrapper]}
                          onPress={() => WebBrowser.openBrowserAsync(`https://www.imdb.com/title/${series.external_ids?.imdb_id}/`)}
                        >
                          <Image
                            source={imdbLogo}
                            style={styles.imdbLogo}
                            contentFit='contain'
                          />
                          <View style={styles.ratingElem}>
                            <Text style={[themeTextStyle]}>
                              {omdb.imdbRating && omdb.imdbRating !== 'N/A'
                                ? `${omdb.imdbRating}/10`
                                : '—'}
                            </Text>
                            {imdbVotes ? (
                              <Text style={[styles.ratingCounter, themeTextStyle]}>
                                {numFormatter(imdbVotes)}
                              </Text>
                            ) : null}
                          </View>
                        </Pressable>
                      ) : null}
                      {omdb ? (
                        <Pressable
                          style={[styles.ratingWrapper]}
                          onPress={() => WebBrowser.openBrowserAsync(`https://www.rottentomatoes.com/search?search=${encodeURIComponent(series.original_name)}`)}
                        >
                          <Image
                            source={rottenTomato ? (rottenTomato > 60 ? freshPositive : freshNegative) : freshPositive}
                            style={styles.rottenLogo}
                          />
                          <View style={styles.ratingElem}>
                            <Text style={[themeTextStyle]}>
                              {rottenTomato ? `${rottenTomato}%` : '—'}
                            </Text>
                            {rottenTomato ? (
                              <Text style={[styles.ratingCounter, themeTextStyle]}>
                                {rottenTomato > 60 ? 'Fresh' : 'Rotten'}
                              </Text>
                            ) : null}
                          </View>
                        </Pressable>
                      ) : null}
                    </View>
                    <Text style={[styles.overview, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                      {series.overview}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {series.next_episode_to_air &&
            nextAirCountdown(series.next_episode_to_air.air_date) ? (
              <View style={styles.episodeMain}>
                <Text style={[styles.episodeHeading, themeTextStyle]}>
                  {i18n.t('nextEpisodeToAir')}
                </Text>
                <View style={[styles.infoDiv, themeBoxStyle, boxShadow]}>
                  <Text style={[styles.timeUntilAir, themeTextStyle]}>
                    {i18n.t('airsIn') +
                      ' ' +
                      nextAirCountdown(series.next_episode_to_air.air_date)}
                  </Text>
                  <View
                    style={{
                      borderBottomColor: 'grey',
                      borderBottomWidth: 1,
                      // opacity: 0.6,
                      marginBottom: 10,
                    }}
                  />
                  {
                    <Text style={[styles.episodeName, themeTextStyle]}>
                      {series.next_episode_to_air.episode_number} -{' '}
                      {series.next_episode_to_air.name}
                    </Text>
                  }
                  <Text style={[styles.releaseDate, themeTextStyle]}>
                    {nextEpisode(series.next_episode_to_air.air_date)}
                  </Text>

                  <Text
                    numberOfLines={3}
                    style={[styles.NextEpisodeOverview, themeTextStyle]}
                  >
                    {series.next_episode_to_air.overview}
                  </Text>
                </View>
              </View>
            ) : (
              <>
                {series.last_episode_to_air ? (
                  <View style={styles.episodeMain}>
                    <Text style={[styles.episodeHeading, themeTextStyle]}>
                      {i18n.t('lastEpisodeToAir')}
                    </Text>
                    <View style={[styles.infoDiv, themeBoxStyle]}>
                      <Text style={[styles.episodeName, themeTextStyle]}>
                        {series.last_episode_to_air.episode_number} -{' '}
                        {series.last_episode_to_air.name}
                      </Text>
                      <Text style={[styles.releaseDate, themeTextStyle]}>
                        {nextEpisode(series.last_episode_to_air.air_date)}
                      </Text>
                      <Text
                        numberOfLines={3}
                        style={[styles.NextEpisodeOverview, themeTextStyle]}
                      >
                        {series.last_episode_to_air.overview}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </>
            )}
            {series.seasons?.length > 0 ? (
              <View style={styles.seasonMain}>
                <Text style={[styles.moviesHeading, themeTextStyle]}>
                  {i18n.t('seasons')}
                </Text>
                <ScrollView showsHorizontalScrollIndicator={false}>
                  <View style={styles.seasonDiv}>
                    {series.seasons.map((serie, idx) => (
                          <Pressable
                            style={styles.seasonCard}
                            key={idx}
                            onPress={() =>
                              navigation.push('SeriesSeason', {
                                id: series.id,
                                headerTitle:
                                  i18n.t('season') + ' ' + serie.season_number,
                                season: serie.season_number,
                              })
                            }
                          >
                            <View style={boxShadow}>
                              <Image
                                style={[styles.seasonImage, { width: seasonW, height: seasonH }]}
                                source={
                                  serie.poster_path
                                    ? { uri: `${basePosterUrl}${serie.poster_path}` }
                                    : noImage
                                }
                                placeholder={imageBlurhash}
                                placeholderContentFit='cover'
                              />
                            </View>
                            <Text style={[styles.textName, themeTextStyle]}>
                              {i18n.t('seasons')} {serie.season_number}
                            </Text>
                            <Text
                              numberOfLines={2}
                              style={[styles.textCharacter, themeTextStyle]}
                            >
                              {serie.episode_count} {i18n.t('episodes')}
                            </Text>
                          </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ) : null}
            {videos.filter((v) => v.type === 'Trailer' && v.site === 'YouTube').length > 0 ? (
              <View style={styles.trailerMain}>
                <Text style={[styles.trailerHeading, themeTextStyle]}>
                  {i18n.t('extras')}
                </Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <View style={styles.trailerDiv}>
                    {videos
                      .filter(
                        (type) =>
                          type.type === 'Trailer' && type.site === 'YouTube'
                      )
                      .map((video, idx) => {
                        let maxLimit = 32;
                        return (
                          <View style={styles.videoDiv} key={idx}>
                            <Pressable
                              onPress={() => WebBrowser.openBrowserAsync(`https://www.youtube.com/watch?v=${video.key}`)}
                              style={[boxShadow, { width: videoWidth, height: videoHeight, borderRadius: borderRadius, overflow: 'hidden' }]}
                            >
                              <Image
                                source={{ uri: `https://img.youtube.com/vi/${video.key}/hqdefault.jpg` }}
                                style={{ width: videoWidth, height: videoHeight }}
                                placeholder={imageBlurhash}
                                placeholderContentFit='cover'
                                contentFit='cover'
                                transition={200}
                              />
                              <View style={styles.playOverlay}>
                                <View style={styles.playButton}>
                                  <FontAwesome5 name='play' solid style={styles.playIcon} />
                                </View>
                              </View>
                            </Pressable>
                            <Text style={[styles.videoText, themeTextStyle]}>
                              {video.name.length > maxLimit
                                ? video.name.substring(0, maxLimit - 3) + '...'
                                : video.name}
                            </Text>
                            <Text style={[styles.typeText, themeTextStyle]}>
                              {video.type}
                            </Text>
                          </View>
                        );
                      })}
                </View>
              </ScrollView>
            </View>
          ) : null}
          {series.credits?.cast?.length > 0 ? (
            <View style={styles.castMain}>
              <Text style={[styles.castHeading, themeTextStyle]}>
                {i18n.t('cast')}
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View style={styles.castDiv}>
                  {series.credits.cast.slice(0, 20).map((cast, idx) => {
                    const profilePicture = {
                      uri: `${baseProfileUrl + cast.profile_path}`,
                    };
                    return (
                      <Pressable
                        key={idx}
                        onPress={() =>
                          navigation.push('PersonDetails', {
                            id: cast.id,
                            creditId: cast.credit_id,
                            headerTitle: cast.name,
                          })
                        }
                      >
                        <View style={[styles.castCard, { width: castSize }]}>
                          <View style={boxShadow}>
                            <Image
                              style={[styles.profileImage, { width: castSize, height: castSize }]}
                              source={
                                cast.profile_path ? profilePicture : noImage
                              }
                              placeholder={imageBlurhash}
                              placeholderContentFit='cover'
                            />
                          </View>
                          <Text style={[styles.textName, themeTextStyle]}>
                            {cast.name}
                          </Text>
                          <Text
                            numberOfLines={2}
                            style={[styles.textCharacter, themeTextStyle]}
                          >
                            {cast.character}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          ) : null}
          {series.recommendations?.results?.length > 0 ? (
            <View style={styles.moviesMain}>
                <Text style={[styles.moviesHeading, themeTextStyle]}>
                  {i18n.t('recommendations')}
                </Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <View style={styles.moviesDiv}>
                    {series.recommendations.results
                      .slice(0, 50)
                      .map((item, idx) => (
                            <Pressable
                              style={styles.moviesCard}
                              key={item.id || idx}
                              onPress={() =>
                                navigation.push('SeriesDetails', {
                                  id: item.id,
                                  headerTitle: item.original_name,
                                })
                              }
                            >
                              <View style={boxShadow}>
                                <Image
                                  style={[styles.posterImage, { width: posterW, height: posterH }]}
                                  source={
                                    item.poster_path
                                      ? { uri: `${basePosterUrl}${item.poster_path}` }
                                      : noImage
                                  }
                                  placeholder={imageBlurhash}
                                  placeholderContentFit='cover'
                                />
                              </View>
                              <View style={styles.ratingDivRec}>
                                <Image
                                  source={tmdbLogo}
                                  style={styles.tmdbLogoRec}
                                  contentFit='contain'
                                />
                                <Text
                                  style={[styles.textRating, themeTextStyle]}
                                >
                                  {Math.floor((item.vote_average * 100) / 10)}
                                  %
                                </Text>
                              </View>
                            </Pressable>
                      ))}
                  </View>
              </ScrollView>
            </View>
          ) : null}
          {series.similar?.results?.length > 0 ? (
            <View style={styles.moviesMain}>
                <Text style={[styles.moviesHeading, themeTextStyle]}>
                  {i18n.t('similar')}
                </Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <View style={styles.moviesDiv}>
                    {series.similar.results.slice(0, 50).map((item, idx) => (
                          <Pressable
                            style={styles.moviesCard}
                            key={item.id || idx}
                            onPress={() =>
                              navigation.push('SeriesDetails', {
                                id: item.id,
                                headerTitle: item.original_name,
                              })
                            }
                          >
                            <View style={boxShadow}>
                              <Image
                                style={[styles.posterImage, { width: posterW, height: posterH }]}
                                source={
                                  item.poster_path
                                    ? { uri: `${basePosterUrl}${item.poster_path}` }
                                    : noImage
                                }
                                placeholder={imageBlurhash}
                                placeholderContentFit='cover'
                              />
                            </View>
                            <View style={styles.ratingDivRec}>
                              <Image
                                source={tmdbLogo}
                                style={styles.tmdbLogoRec}
                                contentFit='contain'
                              />
                              <Text style={[styles.textRating, themeTextStyle]}>
                                {Math.floor((item.vote_average * 100) / 10)}%
                              </Text>
                            </View>
                          </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ) : null}
          </ScrollView>
        </View>
      )}
      <PosterGalleryModal
        visible={galleryVisible}
        onClose={() => setGalleryVisible(false)}
        images={series.images?.posters}
        index={galleryIndex}
        onIndexChange={setGalleryIndex}
        thumbW={thumbW}
      />
    </View>
  );
};

const globalFontsize = 17;
const globalPadding = 5;
const normalFontWeight = '300';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchListLoader: {
    marginTop: -48,
    marginRight: 65,
  },
  scrollViewWrapper: {
    marginBottom: 45,
  },
  main: {
    width: '100%',
    justifyContent: 'center',
  },
  Loader: {
    marginBottom: 300,
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
  imageDiv: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  watchListDiv: {
    marginTop: -40,
    marginRight: 50,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  watchListText: {
    fontWeight: '600',
    fontSize: 19,
    color: 'white',
    marginLeft: 10,
  },
  title: {
    marginTop: 30,
    marginBottom: 12,
    marginLeft: 22,
    marginRight: 22,
    fontSize: 19,
    fontWeight: 'bold',
  },
  underTitleDiv: {
    marginLeft: 22,
    marginRight: 22,
    flex: 1,
    flexDirection: 'row',
  },
  underTitleDiv2: {
    marginLeft: 22,
    marginRight: 22,
    marginTop: 6,
    flex: 1,
    flexDirection: 'row',
  },
  underTitleElem: {},
  separators: {
    opacity: 0.6,
    marginRight: 7.5,
    marginLeft: 7.5,
  },
  underTitle: {
    opacity: 0.6,
    fontWeight: '400',
    fontSize: 14.5,
  },
  overview: {
    marginLeft: 22,
    marginRight: 22,
    fontSize: globalFontsize,
    fontWeight: normalFontWeight,
    marginTop: 20,
    lineHeight: 29,
  },
  episodeMain: {
    marginTop: 35 + globalPadding,
    marginLeft: 22,
    marginRight: 22,
  },
  episodeHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  episodeName: {
    fontSize: 15,
    fontWeight: '600',
  },
  releaseDate: {
    marginTop: 10,
    opacity: 0.7,
    fontSize: 14,
  },
  infoDiv: {
    marginTop: 12,
    padding: 10,
    borderRadius: borderRadius,
  },
  NextEpisodeOverview: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '400',
    paddingBottom: 3,
  },
  timeUntilAir: {
    // marginTop: 6,
    fontSize: 16,
    fontWeight: '600',
    paddingBottom: 15,
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
    marginRight: 22,
    fontSize: globalFontsize,
    fontWeight: normalFontWeight,
    marginTop: 20,
    marginBottom: globalPadding,
  },
  ratingDiv: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingElem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 4,
  },
  ratingCounter: {
    opacity: 0.7,
  },
  imdbLogo: {
    width: 40,
    height: 18,
    marginRight: 7,
  },
  tmdbLogo: {
    width: 40,
    height: 17,
    marginRight: 7,
  },
  rottenLogo: {
    width: 25,
    height: 25,
    marginRight: 7,
  },
  tagline: {
    marginLeft: 22,
    opacity: 0.7,
    fontSize: 16,
  },
  category: {
    opacity: 0.7,
  },
  trailerMain: {
    marginTop: 35 + globalPadding,
    marginBottom: 25 + globalPadding,
    marginLeft: 22,
  },
  trailerHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  trailerDiv: {
    flex: 1,
    flexDirection: 'row',
  },
  videoDiv: {
    marginRight: 16,
  },
  videoText: {
    fontWeight: '600',
    fontSize: 13,
    marginTop: 10,
  },
  typeText: {
    paddingTop: 5,
    opacity: 0.7,
  },
  videoElem: {
    marginBottom: 10,
    marginRight: 30,
    borderRadius: borderRadius,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: 'white',
    fontSize: 18,
    marginLeft: 3,
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
    textAlign: 'center',
  },
  profileImage: {
    marginBottom: 8,
    borderRadius: 50,
  },
  textName: {
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  textCharacter: {
    paddingTop: 5,
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
  },
  castHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  seasonCard: {
    alignItems: 'flex-start',
    marginRight: 18,
    marginBottom: 18,
  },
  seasonMain: {
    marginTop: 35 + globalPadding,
    marginLeft: 22,
  },
  seasonDiv: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // marginBottom: 20,
  },
  seasonImage: {
    marginBottom: 13,
    borderRadius: borderRadius,
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
  textRating: {
    // paddingTop: 8,
    marginLeft: 6,
    fontSize: 12,
  },
  ratingDivRec: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tmdbLogoRec: {
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
  darkThemeBox: {
    backgroundColor: '#313337',
  },
  lightThemeBox: {
    backgroundColor: '#bfc5ce',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default RenderSeriesDetails;
