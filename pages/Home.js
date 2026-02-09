import React, { useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { sharedStyles as styles } from '../styles/sharedStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '@rneui/themed';
import axios from 'axios';
import {
  baseUrl,
  searchMovieUrl,
  topRatedMovieUrl,
  upcomingMovieUrl,
  nowPlayingUrl,
  trendingMovieUrl,
} from '../settings/api';
import i18n from 'i18n-js';
import { useAppearance } from '../components/AppearanceContext';
import RenderMovies from '../components/RenderMovies';
import SearchResults from '../components/SearchResults';
import { TabView, TabBar } from 'react-native-tab-view';

const Home = ({ navigation }) => {
  const [movies, setMovies] = useState();
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
      const response = await axios.get(`${searchMovieUrl + `&query=${title}`}`);
      setMovies(response.data.results);
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
    { key: 'third', title: i18n.t('nowPlaying') },
    { key: 'fourth', title: i18n.t('topRated') },
    { key: 'fifth', title: i18n.t('upcoming') },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <RenderMovies baseUrl={trendingMovieUrl} />;
      case 'second':
        return <RenderMovies baseUrl={baseUrl} />;
      case 'third':
        return <RenderMovies baseUrl={nowPlayingUrl} />;
      case 'fourth':
        return <RenderMovies baseUrl={topRatedMovieUrl} />;
      case 'fifth':
        return <RenderMovies baseUrl={upcomingMovieUrl} />;
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
        placeholder={i18n.t('search')}
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
        <SearchResults movies={movies} loader={loader} />
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

export default Home;
