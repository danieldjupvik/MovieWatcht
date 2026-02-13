import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import axios from 'axios';
import i18n from '../language/i18n';
import { Image } from 'expo-image';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppearance } from '../components/AppearanceContext';
import Loader from '../components/Loader';
import {
  backgroundColorDark,
  backgroundColorLight,
  primaryButton,
  secondaryButton,
} from '../colors/colors';
import { basePosterUrl, searchMultiUrl } from '../settings/api';
import { imageBlurhash } from '../settings/imagePlaceholder';
import noImage from '../assets/no-image.jpg';

const POSTER_WIDTH = 85;
const POSTER_HEIGHT = 128;
const CARD_RADIUS = 14;

const getScoreColor = (score) => {
  if (score >= 70) return '#34C759';
  if (score >= 40) return '#FF9F0A';
  return '#FF453A';
};

const SearchResultItem = React.memo(function SearchResultItem({ item, colorScheme, onPress, onLongPress }) {
  const isDark = colorScheme === 'dark';
  const textStyle = { color: isDark ? '#FFFFFF' : '#000000' };
  const mutedStyle = { color: isDark ? '#98989F' : '#8E8E93' };
  const cardBg = { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' };

  const posterImage = item.poster_path
    ? { uri: `${basePosterUrl}${item.poster_path}` }
    : noImage;
  const title = item.title || item.name || item.original_title || item.original_name;
  const releaseDate = item.release_date || item.first_air_date || '';
  const parsedDate = releaseDate ? new Date(releaseDate) : null;
  const year = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.getFullYear() : '';
  const isSeries = item.media_type === 'tv';
  const mediaLabel = isSeries ? i18n.t('series') : i18n.t('movies');
  const score = Math.round(item.vote_average * 10);
  const scoreColor = getScoreColor(score);
  const badgeColor = isSeries ? secondaryButton : primaryButton;
  const badgeTextColor = isSeries ? '#1a3a24' : '#FFFFFF';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        cardBg,
        pressed && styles.cardPressed,
      ]}
      onLongPress={() => onLongPress(item)}
      onPress={() => onPress(item)}
    >
      <Image
        source={posterImage}
        style={styles.poster}
        placeholder={imageBlurhash}
        placeholderContentFit='cover'
        transition={200}
      />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.title, textStyle]} numberOfLines={2}>
            {title}
          </Text>
          {year ? (
            <Text style={[styles.year, mutedStyle]}>{year}</Text>
          ) : null}
        </View>
        <View style={styles.cardFooter}>
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={[styles.badgeText, { color: badgeTextColor }]}>
              {mediaLabel}
            </Text>
          </View>
          {score > 0 ? (
            <View style={styles.scoreContainer}>
              <View style={[styles.scoreDot, { backgroundColor: scoreColor }]} />
              <Text style={[styles.score, { color: scoreColor }]}>
                {score}%
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
});

const Search = ({ navigation }) => {
  const { colorScheme } = useAppearance();
  const { height: deviceHeight } = useWindowDimensions();
  const isDark = colorScheme === 'dark';
  const themeTabBar = isDark ? 'white' : 'black';
  const containerBg = {
    backgroundColor: isDark ? backgroundColorDark : backgroundColorLight,
  };

  const [results, setResults] = useState([]);
  const [loader, setLoader] = useState(false);
  const [query, setQuery] = useState('');
  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const listRef = useRef(null);
  useScrollToTop(listRef);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const clearSearch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();
    setQuery('');
    setResults([]);
    setLoader(false);
  }, []);

  const handleSearch = useCallback((inputValue) => {
    const rawQuery = inputValue.trim();
    setQuery(rawQuery);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (rawQuery.length < 1) {
      if (abortRef.current) abortRef.current.abort();
      setResults([]);
      setLoader(false);
      return;
    }

    setLoader(true);

    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const encodedQuery = encodeURIComponent(rawQuery);
      try {
        const response = await axios.get(
          `${searchMultiUrl}&query=${encodedQuery}`,
          { signal: controller.signal }
        );
        const filteredResults =
          response?.data?.results?.filter(
            (item) => item.media_type === 'movie' || item.media_type === 'tv'
          ) ?? [];
        setResults(filteredResults);
      } catch (_e) {
        if (!controller.signal.aborted) {
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoader(false);
        }
      }
    }, 350);
  }, []);

  const applySearchBarOptions = useCallback(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: i18n.t('searchAll'),
        ...(Platform.OS === 'ios'
          ? { placement: 'automatic', allowToolbarIntegration: true }
          : null),
        hideWhenScrolling: false,
        onChangeText: (e) => handleSearch(e.nativeEvent.text ?? ''),
        onCancelButtonPress: clearSearch,
      },
    });
  }, [clearSearch, handleSearch, navigation]);

  useFocusEffect(
    useCallback(() => {
      applySearchBarOptions();
    }, [applySearchBarOptions])
  );

  const openItem = useCallback((item) => {
    const isSeries = item.media_type === 'tv';
    const headerTitle = item.title || item.name || '';
    navigation.navigate(isSeries ? 'SeriesDetails' : 'Details', {
      id: item.id,
      headerTitle,
    });
  }, [navigation]);

  const onShare = useCallback(async (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const isSeries = item.media_type === 'tv';
    const title = item.title || item.name || '';
    const url = `https://www.themoviedb.org/${isSeries ? 'tv' : 'movie'}/${item.id}`;
    try {
      await Share.share({ title, url });
    } catch (error) {
      Alert.alert(error.message);
    }
  }, []);

  const keyExtractor = useCallback(
    (item) => `${item.media_type}-${item.id}`,
    []
  );

  const renderItem = useCallback(
    ({ item }) => (
      <SearchResultItem
        item={item}
        colorScheme={colorScheme}
        onPress={openItem}
        onLongPress={onShare}
      />
    ),
    [colorScheme, openItem, onShare]
  );

  const listEmptyComponent = useMemo(() => {
    const iconColor = isDark ? '#48484A' : '#C7C7CC';
    const textColor = { color: isDark ? '#98989F' : '#8E8E93' };

    if (loader) {
      return <Loader loadingStyle={{ paddingTop: deviceHeight / 3.5 }} />;
    }
    if (query.length < 1) {
      return (
        <View style={styles.emptyState}>
          <FontAwesome5 name='film' size={56} color={iconColor} />
          <Text style={[styles.emptyTitle, textColor]}>
            {i18n.t('searchAll')}
          </Text>
          <Text style={[styles.emptySubtitle, textColor]}>
            {i18n.t('movies')} & {i18n.t('series')}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyState}>
        <FontAwesome5 name='search' size={48} color={iconColor} />
        <Text style={[styles.emptyTitle, textColor]}>
          {i18n.t('noResults')}
        </Text>
      </View>
    );
  }, [loader, query, isDark, deviceHeight]);

  return (
    <View style={[styles.container, containerBg]}>
      <FlatList
        ref={listRef}
        data={results}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        contentInsetAdjustmentBehavior='always'
        keyboardDismissMode='on-drag'
        indicatorStyle={themeTabBar}
        scrollEnabled={results.length > 0}
        ListEmptyComponent={listEmptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
    gap: 12,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    borderRadius: CARD_RADIUS,
    borderCurve: 'continuous',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardPressed: {
    opacity: 0.7,
  },
  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    backgroundColor: '#2C2C2E',
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  cardHeader: {
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  year: {
    fontSize: 14,
    fontWeight: '400',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderCurve: 'continuous',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  scoreDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  score: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 15,
    fontWeight: '400',
  },
});

export default Search;
