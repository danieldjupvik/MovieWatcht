import React, { useLayoutEffect, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import axios from 'axios';
import i18n from 'i18n-js';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useAppearance } from '../components/AppearanceContext';
import Loader from '../components/Loader';
import {
  backgroundColorDark,
  backgroundColorLight,
  textColorDark,
  textColorLight,
} from '../colors/colors';
import { borderRadius } from '../styles/globalStyles';
import {
  baseSearchPosterUrl,
  searchMultiUrl,
} from '../settings/api';
import { imageBlurhash } from '../settings/imagePlaceholder';
import noImage from '../assets/no-image.jpg';
import tmdbLogo from '../assets/tmdb-logo-small.png';

const Search = ({ navigation }) => {
  const { colorScheme } = useAppearance();
  const themeTabBar = colorScheme === 'light' ? 'black' : 'white';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  const [results, setResults] = useState([]);
  const [loader, setLoader] = useState(false);
  const [query, setQuery] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: i18n.t('searchAll'),
        placement: 'stacked',
        hideWhenScrolling: false,
        onChangeText: (e) => handleSearch(e.nativeEvent.text ?? ''),
        onCancelButtonPress: () => {
          setQuery('');
          setResults([]);
          setLoader(false);
        },
      },
    });
  }, [navigation]);

  const handleSearch = async (inputValue) => {
    const rawQuery = inputValue.trim();
    setQuery(rawQuery);

    if (rawQuery.length < 1) {
      setResults([]);
      setLoader(false);
      return;
    }

    const encodedQuery = rawQuery.replaceAll(' ', '+');
    setLoader(true);

    try {
      const response = await axios.get(`${searchMultiUrl}&query=${encodedQuery}`);
      const filteredResults =
        response?.data?.results?.filter(
          (item) => item.media_type === 'movie' || item.media_type === 'tv'
        ) ?? [];
      setResults(filteredResults);
    } catch (e) {
      setResults([]);
    } finally {
      setLoader(false);
    }
  };

  const openItem = (item) => {
    const isSeries = item.media_type === 'tv';
    const headerTitle = item.title || item.name || '';
    navigation.navigate(isSeries ? 'SeriesDetails' : 'Details', {
      id: item.id,
      headerTitle,
    });
  };

  const onShare = async (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const isSeries = item.media_type === 'tv';
    const title = item.title || item.name || '';
    const url = `https://www.themoviedb.org/${isSeries ? 'tv' : 'movie'}/${item.id}`;
    try {
      await Share.share({ title, url });
    } catch (error) {
      alert(error.message);
    }
  };

  const renderState = () => {
    if (loader) {
      return <Loader loadingStyle={styles.loaderStyle} />;
    }

    if (query.length < 1) {
      return (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, themeTextStyle]}>{i18n.t('searchAll')}</Text>
        </View>
      );
    }

    if (results.length < 1) {
      return (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, themeTextStyle]}>{i18n.t('noResults')}</Text>
        </View>
      );
    }

    return (
      <View style={styles.main}>
        {results.map((item) => {
          const posterImage = item.poster_path
            ? { uri: `${baseSearchPosterUrl + item.poster_path}` }
            : noImage;
          const title = item.original_title || item.original_name || item.title || item.name;
          const releaseDate = item.release_date || item.first_air_date || '';
          const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
          const mediaLabel = item.media_type === 'tv' ? i18n.t('series') : i18n.t('movies');

          return (
            <Pressable
              key={`${item.media_type}-${item.id}`}
              style={[styles.cards, themeContainerStyle]}
              onLongPress={() => onShare(item)}
              onPress={() => openItem(item)}
            >
              <View>
                <Image
                  source={posterImage}
                  style={styles.image}
                  placeholder={imageBlurhash}
                  placeholderContentFit='cover'
                  transition={300}
                />
              </View>
              <View style={styles.infoDiv}>
                <View style={styles.titleDiv}>
                  <Text style={[styles.title, themeTextStyle]}>
                    {title} {year ? `(${year})` : ''}
                  </Text>
                  <Text style={[styles.mediaType, themeTextStyle]}>{mediaLabel}</Text>
                </View>
                <View style={styles.ratingDiv}>
                  <Image
                    source={tmdbLogo}
                    style={styles.tmdbLogo}
                    contentFit='contain'
                  />
                  <Text style={[styles.rating, themeTextStyle]}>
                    {Math.floor((item.vote_average * 100) / 10)}%
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <ScrollView
        style={[styles.scrollView, themeContainerStyle]}
        contentInsetAdjustmentBehavior='automatic'
        keyboardDismissMode='on-drag'
        indicatorStyle={themeTabBar}
      >
        <View style={styles.mainParent}>{renderState()}</View>
        <View style={styles.view} />
      </ScrollView>
    </View>
  );
};

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: deviceWidth,
  },
  view: {
    height: 75,
  },
  scrollView: {
    height: '100%',
    width: '100%',
    paddingTop: 5,
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
  },
  mainParent: {
    flex: 1,
  },
  image: {
    width: deviceWidth / 4.3,
    height: deviceWidth / 3.24,
    backgroundColor: 'grey',
    borderTopLeftRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
  },
  cards: {
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: borderRadius,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.55,
    shadowRadius: 3.2,
  },
  infoDiv: {
    flex: 1,
    flexDirection: 'column',
    height: '50%',
  },
  titleDiv: {
    marginLeft: 15,
  },
  title: {
    fontSize: 17,
  },
  mediaType: {
    marginTop: 2,
    fontSize: 12,
    opacity: 0.75,
  },
  rating: {
    marginLeft: 6,
  },
  ratingDiv: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  tmdbLogo: {
    width: 25,
    height: 12,
  },
  loaderStyle: {
    paddingTop: deviceHeight / 4.5,
    paddingBottom: deviceHeight / 3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: deviceHeight / 6,
  },
  emptyText: {
    fontSize: 18,
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

export default Search;
