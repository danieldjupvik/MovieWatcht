import React, { useState, useRef, useContext } from 'react';
import {
  StyleSheet,
  Dimensions,
  Platform,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '@rneui/themed';
import axios from 'axios';
import {
  popularSeriesUrl,
  topRatedSeriesUrl,
  searchSeriesUrl,
  onTheAirSeriesUrl,
  airingTodaySeriesUrl,
  trendingSeriesUrl,
} from '../settings/api';
import i18n from 'i18n-js';
import {
  backgroundColorDark,
  backgroundColorLight,
  textColorDark,
  textColorLight,
} from '../colors/colors';
import { borderRadius } from '../styles/globalStyles';
import { primaryButton, secondaryButton } from '../colors/colors';
import { useAppearance } from '../components/AppearanceContext';
import RenderSeries from '../components/RenderSeries';
import SeriesSearchResults from '../components/SeriesSearchResults';

import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const Series = ({ navigation }) => {
  const [series, setSeries] = useState();
  const [search, setSearch] = useState();
  const [loader, setLoader] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showCancel, setShowCancel] = useState(true);

  const { colorScheme } = useAppearance();
  const themeSearchbar = colorScheme === 'light' ? true : false;
  const searchBarTheme = colorScheme === 'light' ? 'black' : 'white';
  const themeTabBar = colorScheme === 'light' ? 'black' : 'white';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeSearchBarStyle = colorScheme === 'light' ? '#bfc5ce' : '#313337';

  const getSearch = async (title) => {
    setLoader(true);
    try {
      const response = await axios.get(
        `${searchSeriesUrl + `&query=${title}`}`
      );
      setSeries(response.data.results);
    } catch (e) {
      console.log(e);
    } finally {
      setLoader(false);
    }
  };

  function handleSearch(inputValue) {
    setSearch(inputValue);
    setLoader(true);
    setShowSearch(true);
    var title = inputValue.replaceAll(' ', '+').trim();
    console.log(title);
    if (title.length >= 1) {
      getSearch(title);
    } else {
      setLoader(false);
      setShowSearch(false);
      setShowCancel(false);
    }
  }

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'first', title: i18n.t('trending') },
    { key: 'second', title: i18n.t('popular') },
    { key: 'third', title: i18n.t('airingToday') },
    { key: 'forth', title: i18n.t('airingNow') },
    { key: 'fifth', title: i18n.t('topRated') },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <RenderSeries baseUrl={trendingSeriesUrl} />;
      case 'second':
        return <RenderSeries baseUrl={popularSeriesUrl} />;
      case 'third':
        return <RenderSeries baseUrl={airingTodaySeriesUrl} />;
      case 'forth':
        return <RenderSeries baseUrl={onTheAirSeriesUrl} />;
      case 'fifth':
        return <RenderSeries baseUrl={topRatedSeriesUrl} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'red', height: 3.5 }}
      style={{
        backgroundColor: 'transparent',
        marginLeft: 5,
        marginRight: 5,
      }}
      activeColor={'red'}
      inactiveColor={searchBarTheme}
      labelStyle={{ fontWeight: '600', fontSize: 16 }}
      getLabelText={({ route }) => route.title}
      scrollEnabled={true}
      tabStyle={{
        width: 'auto',
        // padding: 0,
        paddingLeft: 20,
        paddingRight: 20,
      }}
      bounces={true}
    />
  );

  return (
    <SafeAreaView style={[{ flex: 1 }, themeContainerStyle]}>
      <SearchBar
        placeholder={i18n.t('searchSeries')}
        onChangeText={(text) => handleSearch(text)}
        lightTheme={themeSearchbar}
        platform={Platform.OS}
        containerStyle={{
          backgroundColor: 'transparent',
          paddingLeft: 0,
          paddingRight: 0,
          height: 10,
          width: '90%',
          paddingTop: 25,
          paddingBottom: 25,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          alignSelf: 'center',
        }}
        inputContainerStyle={{ backgroundColor: themeSearchBarStyle }}
        cancelButtonTitle={i18n.t('cancel')}
        cancelButtonProps={{ color: 'red' }}
        showCancel={showCancel}
        searchIcon={{ size: 25, color: searchBarTheme }}
        placeholderTextColor={searchBarTheme}
        inputStyle={{ color: searchBarTheme }}
        value={search}
        returnKeyType={'search'}
        enablesReturnKeyAutomatically={true}
      />
      {showSearch ? (
        <SeriesSearchResults series={series} loader={loader} />
      ) : (
        <TabView
          navigationState={{ index, routes }}
          renderTabBar={renderTabBar}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />
      )}
    </SafeAreaView>
  );
};

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 30,
    marginTop: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  view: {
    height: 75,
  },
  scrollView: {
    // marginHorizontal: 20,
    height: '100%',
    width: '100%',
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  mainParent: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    width: deviceWidth,
  },
  image: {
    width: deviceWidth / 3.3,
    height: deviceWidth / 2.24,
    backgroundColor: 'grey',
    borderRadius: borderRadius,
  },
  imageDiv: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 3.2,
  },
  cards: {
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 20,
  },
  rating: {
    marginLeft: 6,
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
  description: {
    fontSize: 15,
    paddingBottom: 20,
  },
  loaderStyle: {
    paddingTop: deviceHeight / 4.5,
    paddingBottom: deviceHeight,
  },
  // Watch list styles
  noMoviesDiv: {
    marginTop: deviceHeight / 4.5,
    flexDirection: 'row',
  },
  noMoviesText: {
    fontSize: 19,
    fontWeight: '600',
    marginRight: 10,
  },
  loginSection: {
    width: deviceWidth - 50,
    alignItems: 'center',
    padding: 20,
    borderRadius: borderRadius,
  },
  loginImage: {
    width: 140,
    height: 140,
  },
  loginSectionText: {
    fontWeight: '500',
    fontSize: 17,
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: primaryButton,
    marginTop: 20,
    marginBottom: 10,
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
  darkThemeBox: {
    backgroundColor: '#313337',
  },
  lightThemeBox: {
    backgroundColor: '#bfc5ce',
  },
});

export default Series;
