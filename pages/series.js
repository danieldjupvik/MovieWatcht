import React from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions
} from 'react-native';
import {
  popularSeriesUrl,
  topRatedSeriesUrl,
  onTheAirSeriesUrl,
  airingTodaySeriesUrl,
  trendingSeriesUrl,
} from '../settings/api';
import i18n from '../language/i18n';
import {
  backgroundColorDark,
  backgroundColorLight,
} from '../colors/colors';
import { useAppearance } from '../components/AppearanceContext';
import RenderSeries from '../components/RenderSeries';

import { TabView, TabBar } from 'react-native-tab-view';

const Series = () => {
  const { colorScheme } = useAppearance();
  const inactiveTabColor = colorScheme === 'light' ? 'black' : 'white';
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);

  const routes = React.useMemo(() => [
    { key: 'first', title: i18n.t('trending') },
    { key: 'second', title: i18n.t('popular') },
    { key: 'third', title: i18n.t('airingToday') },
    { key: 'fourth', title: i18n.t('airingNow') },
    { key: 'fifth', title: i18n.t('topRated') },
  ], []);

  const renderScene = React.useCallback(({ route }) => {
    switch (route.key) {
      case 'first':
        return <RenderSeries baseUrl={trendingSeriesUrl} />;
      case 'second':
        return <RenderSeries baseUrl={popularSeriesUrl} />;
      case 'third':
        return <RenderSeries baseUrl={airingTodaySeriesUrl} />;
      case 'fourth':
        return <RenderSeries baseUrl={onTheAirSeriesUrl} />;
      case 'fifth':
        return <RenderSeries baseUrl={topRatedSeriesUrl} />;
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

const styles = StyleSheet.create({
  lightContainer: {
    backgroundColor: backgroundColorLight,
  },
  darkContainer: {
    backgroundColor: backgroundColorDark,
  },
});

export default Series;
