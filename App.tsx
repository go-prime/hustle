/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import {
  DefaultTheme,
  DarkTheme,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet} from 'react-native';
import HomeScreenNavigator from './screens/navigator';
import {Appearance} from 'react-native';
import ChatButton from './components/chat';
import {screens} from './hooks/colors';
import { IntlProvider } from 'react-intl';
import messages from './intl/messages';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffff"
  },
};

const NightTheme = {
  ...DarkTheme,
};

function App(): JSX.Element {
  const [locale, setLocale] = React.useState("en");
  const [chatVisible, setChatVisible] = React.useState(false);
  const [currentRoute, setCurrentRoute] = React.useState('');
  const [theme, setTheme] = React.useState(LightTheme)
  const navContainerRef = useNavigationContainerRef();

  const handleSetLocale = async (newLocale) => {
    console.log(`Now setting new locale ${newLocale}`)
    await AsyncStorage.setItem('locale', newLocale);
    setLocale(newLocale);
  };

  React.useEffect(() => {
    const loadLocale = async () => {
      const storedLocale = await AsyncStorage.getItem('locale');
      if (storedLocale) {
        setLocale(storedLocale);
      }
    };
    loadLocale();
    navContainerRef.addListener('state', e => {
      if (e.data.state.history.length) {
        const length = e.data.state.history.length;
        const index = length - 1;
        const route = e.data.state.history[e.data.state.history.length - 1];
        let route_name = '';
        if (route) {
          route_name = route.key && route.key.split ? route.key.split('-')[0] : '';
        }

        setChatVisible(route_name != 'Login');
        setCurrentRoute(route_name);
        const colorScheme = screens[route_name]
        if(colorScheme) {
          const newTheme = {...theme}
          // newTheme.colors.background = colorScheme.tertiary
          newTheme.colors.card = colorScheme.quarternary
          newTheme.colors.text = colorScheme.primary
          setTheme(newTheme)
        }
      }
      setTheme(Appearance.getColorScheme() === 'dark' ? NightTheme : LightTheme)
    });
  }, []);


  return (
    <NavigationContainer
      ref={navContainerRef}
      theme={theme}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        <HomeScreenNavigator 
          accent={theme.colors.card}
          textColor={theme.colors.text}
          iconColor={theme.colors.text} 
          setLocale={handleSetLocale}
        />
        <ChatButton visible={chatVisible} route={currentRoute} />
      </IntlProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
