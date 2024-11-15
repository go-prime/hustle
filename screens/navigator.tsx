import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  useDrawerStatus,
} from '@react-navigation/drawer';

import {
  faUser,
  faHouse,
  faHeart,
  faShoppingCart,
  faUserGraduate,
  faRightToBracket,
  faEdit,
  faDoorOpen,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import {shadow, text} from '../styles/inputs';
import HomeScreen from './partner_store/home';
import PartnerScreen from './partner_store/partner';
import BundleScreen from './partner_store/bundle';
import ProductScreen from './partner_store/product';
import CategoryScreen from './partner_store/category';
import {
  StyleSheet,
  Pressable,
  Text,
  View,
  Image,
  Appearance,
  Alert
} from 'react-native';
import colors from '../styles/colors';
import WishlistScreen from './billing/wishlist';
import CartScreen from './billing/cart';
import ProfileScreen from './profile';
import CoursesHomeScreen from './edutec/home';
import LoginScreen from './login';
import CourseCategoryScreen from './edutec/courses';
import MarketplaceHome from './marketplace/home';
import CourseScreen from './edutec/course';
import VideoPlayer from './edutec/video';
import ArticleViewer from './edutec/article';
import ProduceScreen from './marketplace/produce';
import StorefrontScreen from './marketplace/storefront';
import MarketplaceCategoryScreen from './marketplace/category';
import {useNavigation} from '@react-navigation/native';
import Subscriptions from './edutec/my_courses';
import InAppWebViewScreen from './web';
import BooksHomeScreen from './books/home';
import Centered from '../components/layout';
import SearchScreen from './search';
import SubscriptionScreen from './billing/subscription';
import SubscriptionListScreen from './billing/subscriptions';
import AddInventoryScreen from './marketplace/merchant/add_inventory';
import ManageStorefrontScreen from './marketplace/merchant/manage_storefront';
import SaleDetailScreen from './marketplace/merchant/sale_detail';
import ConfirmSaleScreen from './marketplace/merchant/confirm_sale';
import ManageInventoryScreen from './marketplace/merchant/manage_inventory';
import ManageSalesScreen from './marketplace/merchant/manage_sales';
import AddProduceScreen from './marketplace/merchant/add_produce';
import MyOrdersScreen from './billing/orders';
import OrderDetailScreen from './billing/order_detail';
import SignUpScreen from './sign_up';
import KYCForm from './kyc';
import {getAbsoluteURL} from '../utils';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Badge from '../components/badge';
import {useCartCount, useWishlistCount} from '../hooks/counters';
import {Label, Pill} from '../components/text';
import {Row} from '../components/layout';
import useUserProfile from '../hooks/user';
import ImageIcon from '../components/image';
import DashboardScreen from './dashboard';
import { FormattedMessage } from 'react-intl';

const Drawer = createDrawerNavigator();

const DrawerItem = props => {
  let source = props.source;
  const dark_mode = Appearance.getColorScheme() === 'dark';
  if (dark_mode && props.dark_source) {
    source = props.dark_source;
  }
  return (
    <Pressable onPress={props.handler}>
      <View style={styles.statusContainer}>
        {props.icon && (
          <FontAwesomeIcon icon={props.icon} color={props.color} size={24} />
        )}
        {source && (
          <Centered styles={styles.drawerItemIcon}>
            <Image source={source} style={{width: 80, height: 80}} />
          </Centered>
        )}
        <Text style={[styles.status, {color: props.color}]}>{props.label}</Text>
      </View>
    </Pressable>
  );
};

function DrawerContent(props): JSX.Element {
  const userDetails = useUserProfile();

  const logOut = () => {
    axios
      .post(getAbsoluteURL('/api/method/logout'))
      .then(res => {
        AsyncStorage.setItem('expiry', '');
        AsyncStorage.setItem('user', '');
        Alert.alert('Success', 'Signed out of your account successfully.');
        props.navigation.navigate('Login');
      })
      .catch(err => {
        Alert.alert('Error', 'Failed to sign out of your account.');
        props.navigation.navigate('Login');
      });
  };

  const logIn = () => {
    props.navigation.navigate('Login');
  };

  return (
    <DrawerContentScrollView {...props}>
      {userDetails && userDetails.full_name && (
        <View style={styles.profile}>
          <Row>
            {userDetails.subscription && (
              <View style={styles.subscriptionBanner}>
                <Text style={styles.subscriptionBannerText}>
                  {userDetails.subscription.subscription_type}
                </Text>
              </View>
            )}
          </Row>
          <Row styles={{justifyContent: 'center'}}>
            <View style={{...styles.circle, backgroundColor: colors.primary}}>
              <ImageIcon
                iconColor={'white'}
                width={120}
                height={120}
                icon={faUser}
                url={userDetails.photo}
              />
            </View>
          </Row>
          <Row styles={{justifyContent: 'center'}}>
            <Text style={styles.label}>{userDetails.full_name}</Text>
          </Row>
          <Row styles={{justifyContent: 'center'}}>
            <Pressable onPress={() => props.navigation.navigate('Profile')}>
              <Pill>
                <FontAwesomeIcon icon={faEdit} color="white" size={14} />
                <Text> {<FormattedMessage id="edit_proile" />}</Text>
              </Pill>
            </Pressable>
          </Row>
        </View>
      )}
      <DrawerItem
        color={props.iconColor}
        source={require('../assets/images/marketplace.png')}
        dark_source={require('../assets/images/marketplace_dark.png')}
        label={<FormattedMessage id="market" />}
        handler={() => props.navigation.navigate('Marketplace Home')}
      />
      <DrawerItem
        color={props.iconColor}
        source={require('../assets/images/partner_store.png')}
        dark_source={require('../assets/images/partner_store_dark.png')}
        label={<FormattedMessage id="partner_store" />}
        handler={() => props.navigation.navigate('Home')}
      />
      <DrawerItem
        color={props.iconColor}
        source={require('../assets/images/edutec.png')}
        dark_source={require('../assets/images/edutec_dark.png')}
        label={<FormattedMessage id="edutec" />}
        handler={() => props.navigation.navigate('Courses Home')}
      />
      <DrawerItem
        color={props.iconColor}
        source={require('../assets/images/books.png')}
        dark_source={require('../assets/images/books_dark.png')}
        label={<FormattedMessage id="business_books" />}
        handler={() => props.navigation.navigate('Books')}
      />
      <DrawerItem
        icon={faHeart}
        color={props.iconColor}
        label={<FormattedMessage id="wish_list" />}
        badgeText={`${props.wishlistedItems}`}
        handler={() => props.navigation.navigate('Wishlist')}
      />
      <DrawerItem
        icon={faShoppingCart}
        badgeText={`${props.itemsInCart}`}
        color={props.iconColor}
        label={<FormattedMessage id="shopping_cart" />}
        handler={() => props.navigation.navigate('Cart')}
      />
      <DrawerItem
        icon={
          userDetails && userDetails.full_name ? faDoorOpen : faRightToBracket
        }
        color={props.iconColor}
        label={
          <FormattedMessage 
              id={userDetails && userDetails.full_name ? "log_out" : "log_in_signup"} 
          />
        }
        handler={userDetails && userDetails.full_name ? logOut : logIn}
      />
    </DrawerContentScrollView>
  );
}

const NavOptions = props => {
  const navigation = useNavigation();

  return (
    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
      <Pressable onPress={() => navigation.navigate('Search')}>
        <FontAwesomeIcon
          icon={faSearch}
          size={28}
          color={props.color}
          style={{marginRight: 16}}
        />
      </Pressable>
      <Badge text={`${props.wishlistedItems}`} textSize={12}>
        <Pressable onPress={() => navigation.navigate('Wishlist')}>
          <FontAwesomeIcon
            icon={faHeart}
            size={28}
            color={props.color}
            style={{marginRight: 16}}
          />
        </Pressable>
      </Badge>
      <Badge text={`${props.itemsInCart}`} textSize={12}>
        <Pressable onPress={() => navigation.navigate('Cart')}>
          <FontAwesomeIcon
            icon={faShoppingCart}
            size={28}
            color={props.color}
            style={{marginRight: 16}}
          />
        </Pressable>
      </Badge>
    </View>
  );
};

export default function HomeScreenNavigator(props): JSX.Element {
  const { navigation, setLocale } = props;
  const wishlistedItems = useWishlistCount();
  const itemsInCart = useCartCount();
  const NavOptionsComponent = React.useCallback(() => {
    return (
      <NavOptions
        itemsInCart={itemsInCart}
        wishlistedItems={wishlistedItems}
        color={props.textColor}
      />
    );
  }, [itemsInCart, wishlistedItems])

  const DrawerContentComponent = React.useCallback(r => {
    return (
      <DrawerContent
        wishlistedItems={wishlistedItems}
        itemsInCart={itemsInCart}
        iconColor={props.iconColor}
        {...r}
      />
    );
  }, [itemsInCart, wishlistedItems])

  const defaultScreenOptions = {
    headerRight: NavOptionsComponent,
    headerStyle: {
      backgroundColor: 'transparent',
    },
    headerTintColor: props.textColor,
    headerShadowVisible: false,
    drawerStyle: {
      backgroundColor:
        Appearance.getColorScheme() == 'dark' ? '#333333' : '#ffffff',
    },
  };
  return (
    <Drawer.Navigator
      backBehavior="history"
      screenOptions={defaultScreenOptions}
      drawerContent={DrawerContentComponent}>
      {/* Basic Screens */}
      <Drawer.Screen
        component={LoginScreen}
        name="Login"
        options={{headerShown: false}}
      />
      <Drawer.Screen
        component={DashboardScreen}
        name="Dashboard"
        options={{headerShown: false}}
      />
      <Drawer.Screen
        component={SignUpScreen}
        name="Sign Up"
        options={{headerShown: false}}
      />
      <Drawer.Screen 
          component={WishlistScreen} 
          name="Wishlist" 
          options={{ title: <FormattedMessage id="wish_list" /> }} 
      />

      <Drawer.Screen 
          component={MarketplaceHome} 
          name="Cart" 
          options={{ title: <FormattedMessage id="cart_page" /> }} 
      />
      <Drawer.Screen name="Profile">
        {props => <ProfileScreen {...props} setLocale={setLocale} />}
      </Drawer.Screen>
      <Drawer.Screen component={SearchScreen} name="Search" />
      <Drawer.Screen 
          component={SubscriptionListScreen} 
          name="Subscriptions" 
          options={{ title: <FormattedMessage id="subscriptions" /> }} 
      />
      <Drawer.Screen component={SubscriptionScreen} name="Subscription" />
      <Drawer.Screen component={KYCForm} name="KYC Information" />
      <Drawer.Screen
        options={{headerShown: false}}
        component={InAppWebViewScreen}
        name="WebView"
      />

      {/* Partner Screens */}
      <Drawer.Screen 
          component={MarketplaceCategoryScreen} 
          name="Produce Category" 
          options={{ title: <FormattedMessage id="produce_category" /> }} 
      />
      <Drawer.Screen component={HomeScreen} name="Home" />
      <Drawer.Screen component={PartnerScreen} name="Partner" />
      <Drawer.Screen component={BundleScreen} name="Bundle" />
      <Drawer.Screen component={ProductScreen} name="Product" />
      <Drawer.Screen component={CategoryScreen} name="Category" />

      {/* Edutec Screens */}
      {/* <Drawer.Screen component={CoursesHomeScreen} name="Courses Home" /> */}
      <Drawer.Screen 
          component={CoursesHomeScreen} 
          name="Courses Home" 
          options={{ title: <FormattedMessage id="courses_home" /> }} 
      />
      <Drawer.Screen component={CourseCategoryScreen} name="Course Category" />
      <Drawer.Screen component={CourseScreen} name="Course" />
      <Drawer.Screen component={VideoPlayer} name="Video" />
      <Drawer.Screen component={ArticleViewer} name="Article" />
      <Drawer.Screen component={Subscriptions} name="My Course Subscriptions" />

      {/* Marketplace Screens */}
      <Drawer.Screen 
          component={MarketplaceHome} 
          name="Marketplace Home" 
          options={{ title: <FormattedMessage id="cart_page" /> }} 
      />

      <Drawer.Screen 
          component={ProduceScreen} 
          name="Produce" 
          options={{ title: <FormattedMessage id="produce" /> }} 
      />
      <Drawer.Screen component={StorefrontScreen} name="Storefront" />
      <Drawer.Screen
        component={ManageStorefrontScreen}
        name="Manage Storefront"
      />
      <Drawer.Screen component={SaleDetailScreen} name="Sale Detail" />
      <Drawer.Screen component={ConfirmSaleScreen} name="Confirm Sale" />
      <Drawer.Screen
        component={ManageInventoryScreen}
        name="Manage Inventory"
      />
      <Drawer.Screen component={ManageSalesScreen} name="Manage Sales" />
      <Drawer.Screen component={AddInventoryScreen} name="Add Inventory" />
      <Drawer.Screen component={AddProduceScreen} name="Add Produce" />
      <Drawer.Screen 
          component={MyOrdersScreen} 
          name="My Orders" 
          options={{ title: <FormattedMessage id="my_orders" /> }} 
      />
      <Drawer.Screen component={OrderDetailScreen} name="Order Detail" />
      {/* Books */}
      <Drawer.Screen 
          component={BooksHomeScreen} 
          name="Books" 
          options={{ title: <FormattedMessage id="books_home" /> }} 
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomColor: '#efefef',
    borderBottomWidth: 1,
  },
  status: {
    ...text,
    fontWeight: 'bold',
    paddingLeft: 18,
    fontSize: 18,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.secondary,
    marginBottom: 6,
    marginTop: 6,
  },
  subscriptionBanner: {
    backgroundColor: colors.primary,
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    width: 150,
    marginBottom: 12,
    borderBottomRightRadius: 24,
  },
  subscriptionBannerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profile: {
    backgroundColor: colors.quarternary,
    marginTop: -5,
    paddingBottom: 12,
  },
  drawerItemIcon: {
    width: 30,
    height: 30,
    overflow: 'hidden',
    borderRadius: 15,
    backgroundColor: 'white',
  },
});
