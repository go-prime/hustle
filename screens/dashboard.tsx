import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  Alert,
  Dimensions,
  ScrollView,
  Animated
} from 'react-native';
import {card, shadow} from '../styles/inputs';
import axios from 'axios';
import constants from '../constants';
import {Image} from 'react-native';
import colors from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Centered, {Row} from '../components/layout';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faEye,
  faEyeSlash,
  faLock,
  faDoorOpen,
} from '@fortawesome/free-solid-svg-icons';
import Carousel from 'react-native-reanimated-carousel';

import {useIsFocused, useNavigation} from '@react-navigation/native';
import {getAbsoluteURL} from '../utils';
import Geolocation from 'react-native-geolocation-service';
import { LoadingButton } from '../components/button';
import { FormattedMessage } from 'react-intl';

const DashboardCard = props => {
  const animated = new Animated.Value(1);
  const onPressIn = () => {
    console.log('animating')
    Animated.timing(animated, {
      
      toValue: 0.2,
      duration: 1000,
      useNativeDriver: true,
    });
  };

  const onPressOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    });
  };
  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => {
        props.handler();
      }}>
      <Animated.View style={{...styles.container, opacity: animated}}>
        <Centered>
          <Image
            source={props.source}
            style={{width: props.width, height: props.height, marginBottom: 18}}
          />
        </Centered>
        <View style={styles.loginText}>
          <Text style={styles.title}><FormattedMessage id={props.title} /></Text>
          <Text style={styles.subtitle}><FormattedMessage id={props.message} /></Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default function DashboardScreen({navigation}) {
  const {width, height} = Dimensions.get('screen');
  const [username, setUsername] = React.useState(null);
  const isFocused = useIsFocused();
  const [loggingOut, setLoggingOut] = React.useState(false)
  React.useEffect(() => {
    AsyncStorage.getItem('expiry').then(expiry => {
      if (expiry && new Date() < new Date(expiry)) {
        AsyncStorage.getItem('user').then(user => {
          setUsername(user);
        });
      } else {
        setUsername(null);
      }
    });
  }, [isFocused]);

  logOut = () => {
    setLoggingOut(true)
    Geolocation.getCurrentPosition(position => {
      axios
        .post(
          getAbsoluteURL('/api/method/logout'),
          {},
          {
            headers: {
              'fine-location': JSON.stringify(position.coords),
            },
          },
        )
        .then(res => {
          AsyncStorage.setItem('expiry', '');
          AsyncStorage.setItem('user', '');
          AsyncStorage.setItem('location', JSON.stringify(position.coords));
          AsyncStorage.setItem('location-last-fetch', new Date().toISOString());
          setUsername(null);
          Alert.alert('Success', 'Signed out of your account successfully.');
          setLoggingOut(false)
          // navigation.navigate("Login")
        })
        .catch(err => {
          Alert.alert('Error', 'Failed to sign out of your account.');
          AsyncStorage.setItem('user', '');
          AsyncStorage.setItem('expiry', '');
          setLoggingOut(false)
          // navigation.navigate("Login")
        });
    });
  };

  return (
    <ImageBackground
      source={require('../assets/images/background_2.png')}
      style={{width: '100%', height: '100%'}}>
      {/* <NotPermitted visible /> */}
      <ScrollView>
        <Image
          source={require('../assets/images/Logo-01.png')}
          style={{width: width, height: height / 4}}
        />
        <View>
          {username && (
            <>
              <Row styles={{justifyContent: 'center'}}>
                <Text style={styles.welcome}>Welcome {username}</Text>
              </Row>
              <Row>
                <DashboardCard
                  title="market"
                  message="shop"
                  source={require('../assets/images/marketplace.png')}
                  handler={() => navigation.navigate("Marketplace Home")}
                  width={width / 2 - 48}
                  height={height / 5 - 12}
                />
                <DashboardCard
                  title="partner_store"
                  message="equip"
                  source={require('../assets/images/partner_store.png')}
                  handler={() => navigation.navigate("Home")}
                  width={width / 2 - 48}
                  height={height / 5 - 12}
                />
              </Row>
              <Row>
                <DashboardCard
                  title="edutec"
                  source={require('../assets/images/edutec.png')}
                  message="skills"
                  handler={() => navigation.navigate("Courses Home")}
                  width={width / 2 - 48}
                  height={height / 5 - 12}
                />
                <DashboardCard
                  title="business_books"
                  source={require('../assets/images/books.png')}
                  message="funds"
                  handler={() => {
                    navigation.navigate("Books")
                  }}
                  width={width / 2 - 48}
                  height={height / 5 - 12}
                />
              </Row>
            </>
          )}
        </View>
        <Centered>
          {username && (
            <LoadingButton style={styles.pill} loading={loggingOut} onPress={logOut}>
              <Row >
                <FontAwesomeIcon
                  icon={faDoorOpen}
                  color={colors.primary}
                  size={24}
                />
                <Text style={styles.signIn}>{'  '} Log Out</Text>
              </Row>
            </LoadingButton>
          )}
        </Centered>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    ...shadow,
    elevation: 5,
    margin: 12,
    backgroundColor: 'white',
    padding: 12,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    color: 'black',
    backgroundColor: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'black',
    backgroundColor: 'white',
  },
  loginText: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  welcome: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    margin: 12,
    textAlign: 'center',
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    margin: 36,
    textShadowColor: 'black',
    textShadowRadius: 0.5,
    color: 'white',
  },
  tagLine: {
    fontSize: 18,
    color: 'white',
  },
  signIn: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 18,
  },
  pill: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 18,
    paddingLeft: 40,
    paddingRight: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 4,
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 4,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonRow: {
    gap: 12,
    padding: 12,
  },
  inputContainer: {
    padding: 4,
    ...card,
    backgroundColor: 'white',
    margin: 8,
    borderRadius: 8,
    elevation: 5,
  },
  signInCard: {
    marginTop: 48,
  },
  inputText: {
    color: 'black',
    flex: 1,
  },
});
