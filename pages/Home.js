import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { sharedStyles as styles } from '../styles/sharedStyles';
import {
  baseUrl,
  topRatedMovieUrl,
  upcomingMovieUrl,
  nowPlayingUrl,
  trendingMovieUrl,
} from '../settings/api';
import i18n from '../language/i18n';
import { useAppearance } from '../components/AppearanceContext';
import RenderMovies from '../components/RenderMovies';
import { TabView, TabBar } from 'react-native-tab-view';

const Home = () => {
  const { colorScheme } = useAppearance();
  const inactiveTabColor = colorScheme === 'light' ? 'black' : 'white';
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);

  const routes = React.useMemo(() => [
    { key: 'first', title: i18n.t('trending') },
    { key: 'second', title: i18n.t('popular') },
    { key: 'third', title: i18n.t('nowPlaying') },
    { key: 'fourth', title: i18n.t('topRated') },
    { key: 'fifth', title: i18n.t('upcoming') },
  ], []);

  const renderScene = React.useCallback(({ route }) => {
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
  }, []);

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
      inactiveColor={inactiveTabColor}
      labelStyle={{ fontWeight: '600', fontSize: 16 }}
      getLabelText={({ route }) => route.title}
      scrollEnabled={true}
      tabStyle={{
        width: 'auto',
        paddingLeft: 20,
        paddingRight: 20,
      }}
      bounces={true}
    />
  );

  return (
    <View style={[{ flex: 1 }, themeContainerStyle]}>
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
};

export default Home;
