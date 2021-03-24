import React from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { backgroundColor } from './Home';
import {
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Settings = ({ navigation }) => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.main}>
            <View style={styles.listHeadingElement}>
              <Text style={styles.listHeading}>Main Settings</Text>
            </View>
            <TouchableWithoutFeedback
              style={styles.touchableElem}
              onPress={() => navigation.navigate('About')}
            >
              <View style={styles.listElement}>
                <View style={styles.iconElement}>
                  <View style={styles.icon}>
                    <FontAwesome5
                      name={'info-circle'}
                      solid
                      style={{ color: 'grey', fontSize: 25 }}
                    />
                  </View>
                  <View>
                    <Text style={styles.text}>About</Text>
                  </View>
                </View>

                <View style={styles.rightArrow}>
                  <FontAwesome5
                    name={'chevron-right'}
                    solid
                    style={{ color: 'grey', fontSize: 20 }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('Login')}
            >
              <View style={styles.listElement}>
                <View style={styles.iconElement}>
                  <View style={styles.icon}>
                    <FontAwesome5
                      name={'sign-in-alt'}
                      solid
                      style={{ color: 'grey', fontSize: 25 }}
                    />
                  </View>
                  <View>
                    <Text style={styles.text}>Login</Text>
                  </View>
                </View>
                <View style={styles.rightArrow}>
                  <FontAwesome5
                    name={'chevron-right'}
                    solid
                    style={{ color: 'grey', fontSize: 20 }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  main: {
    width: '100%',
    paddingLeft: 15,
  },
  listElement: {
    paddingBottom: 15,
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey',
    width: '100%',
  },
  iconElement: {
    flexDirection: 'row',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: '300',
  },
  icon: {
    marginRight: 12,
  },
  listHeading: {
    color: 'grey',
    fontSize: 20,
  },
  listHeadingElement: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey',
    marginTop: 20,
    paddingBottom: 15,
  },
  rightArrow: {
    paddingRight: 8,
  },
  touchableElem: {
    width: '100%',
  },
});

export default Settings;
