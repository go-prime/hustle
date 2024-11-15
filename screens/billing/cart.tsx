import React from 'react';

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import colors from '../../styles/colors';
import {card, shadow, text} from '../../styles/inputs';
import axios from 'axios';

import constants from '../../constants';
import ImageIcon from '../../components/image';

import Centered, {Row} from '../../components/layout';
import {parse} from 'react-native-svg';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faBasketShopping,
  faTimes,
  faPlus,
  faMinus,
  faShoppingBasket,
} from '@fortawesome/free-solid-svg-icons';
import Loading from '../../components/loading';
import {removeBtn} from '../../styles/buttons';
import {ProfileButton} from '../../components/button';
import {
  Heading,
  Money,
  SubTitle,
  Title,
  textStyles,
} from '../../components/text';
import {getAbsoluteURL} from '../../utils';
import CartCounter from '../../components/cart'
import { FormattedMessage } from 'react-intl';

const removeFromCart = (product_id, product_name, qty, onChange) => {
  axios
    .post(
      `${constants.server_url}/api/method/billing_engine.billing_engine.api.remove_from_cart`,
      {
        product_id: product_id,
        qty: qty,
      },
    )
    .then(res => {
      if (onChange) {
        onChange('remove');
      }
    })
    .catch(err => {
      Alert.alert('Error', err.message);
    });
};

const addToCart = (product_id, product_name, qty, onChange) => {
  axios
    .post(
      `${constants.server_url}/api/method/billing_engine.billing_engine.api.add_to_cart`,
      {
        product_id: product_id,
        qty: qty,
      },
    )
    .then(res => {
      if (onChange) {
        onChange('add');
      }
    })
    .catch(err => {
      console.log(err.response.data);
      Alert.alert('Error', err.response.data);
    });
};

const CartItem = props => {
  const navigator = useNavigation();
  const setQty = newQty => {
    if (newQty < 1) {
      return;
    }
    props.beforeChange();
    if (newQty > props.qty) {
      addToCart(props.id, props.name, 1, props.onChange);
    } else {
      removeFromCart(props.id, props.name, 1, props.onChange);
    }
  };
  return (
    <View
      style={[
        styles.card,
        {flexDirection: 'row', padding: 8, position: 'relative'},
      ]}>
      <Pressable
        style={removeBtn}
        onPress={() =>
          removeFromCart(props.id, props.name, props.qty, props.onChange)
        }>
        <FontAwesomeIcon icon={faTimes} size={24} color={'white'} />
      </Pressable>
      <Centered styles={{flex: 1}}>
        <ImageIcon width={110} height={110} url={props.image} />
      </Centered>
      <View style={{flex: 2, marginLeft: 12}}>
        <Pressable
          onPress={() => {
            //  TODO implement routing to cart item
          }}>
          <SubTitle style={styles.heading}>{props.label}</SubTitle>
          <SubTitle style={styles.heading}>{props.formatted}</SubTitle>
        </Pressable>
        <Row styles={{marginTop: 8, alignItems: 'center'}}>
          <CartCounter qty={props.qty} setQty={setQty} />
        </Row>
      </View>
    </View>
  );
};

export default function CartScreen({navigation}) {
  const [data, setData] = React.useState(null);
  const width = Dimensions.get('screen').width;
  const isFocused = useIsFocused();
  const [actions, setActions] = React.useState([]);
  const [processing, setProcessing] = React.useState(false);

  const onChange = (action: string) => {
    setProcessing(false);
    setActions(actions.concat([action]));
  };

  const beforeChange = () => {
    setProcessing(true);
  };

  const checkout = () => {
    axios
      .post(
        getAbsoluteURL('api/method/billing_engine.billing_engine.api.checkout'),
      )
      .then(res => {
        Alert.alert(
          'Success',
          'Successfully completed checkout of your cart.',
        );
        navigation.navigate('My Orders');
      })
      .catch(err => {
        Alert.alert('Error', 'Error checking out your cart.');
      });
  };

  React.useEffect(() => {
    axios
      .get(
        `${constants.server_url}api/method/billing_engine.billing_engine.api.get_cart`,
      )
      .then(res => {
        setData(res.data.message);
      })
      .catch(err => {
        console.log(err.response.data);
      });
  }, [isFocused, actions]);

  if (!data) {
    return <Loading />;
  }

  if (data.items.length == 0) {
    return (
      <View style={{flex: 1}}>
        <ProfileButton
          label={<FormattedMessage id="my_orders" />}
          action={() => {
            navigation.navigate('My Orders');
          }}
        />
        <Centered styles={{flex: 1}}>
          <Text style={styles.title}>
            Your shopping cart is empty, start shopping!
          </Text>
          <FontAwesomeIcon
            style={{marginTop: 24}}
            icon={faShoppingBasket}
            size={72}
            color={colors.primary}
          />
        </Centered>
      </View>
    );
  }

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <ProfileButton
        label={<FormattedMessage id="my_orders" />}
        action={() => {
          navigation.navigate('My Orders');
        }}
      />

      <ScrollView>
        {data.items.map(item => (
          <CartItem
            key={item.billable_id}
            {...item}
            onChange={onChange}
            beforeChange={beforeChange}
          />
        ))}
        <View style={[styles.card, {padding: 16}]}>
          <View style={styles.rowBetween}>
            <SubTitle>Subtotal</SubTitle>
            <Money
              currency_symbol={data.currency_symbol}
              style={textStyles.subtitle}>
              {data.subtotal}
            </Money>
          </View>
          <View style={styles.rowBetween}>
            <SubTitle style={styles.title}>Tax</SubTitle>
            <Money
              currency_symbol={data.currency_symbol}
              style={textStyles.subtitle}>
              {data.tax}
            </Money>
          </View>
          <View style={styles.rowBetween}>
            <Title>Total</Title>
            <Money
              currency_symbol={data.currency_symbol}
              style={textStyles.title}>
              {data.total}
            </Money>
          </View>
        </View>

        <Pressable onPress={checkout}>
          <View style={styles.checkoutButton}>
            <FontAwesomeIcon icon={faBasketShopping} size={24} color="white" />
            <Text style={styles.checkoutText}>{<FormattedMessage id="checkout_button_text" />}</Text>
          </View>
        </Pressable>
      </ScrollView>
      {processing ? (
        <Loading msg={'Processing Request'} styles={styles.overlay} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    ...card,
    zIndex: 100,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    flex: 1,
    flexWrap: 'nowrap',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    flex: 1,
  },
  title: {
    fontSize: 24,
    ...text,
    fontWeight: 'bold',
    paddingBottom: 0,
    textAlign: 'center',
  },
  heading: {
    fontSize: 18,
    paddingBottom: 4,
    color: '#666',
    fontWeight: 'bold',
  },
  description: {
    ...text,
    padding: 12,
  },
  card: {
    ...shadow,
    margin: 12,
    elevation: 5,
    borderRadius: 12,
  },
  button: {
    padding: 6,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
  },
  qty: {
    fontSize: 24,
    padding: 12,
    paddingTop: 2,
    ...text,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 8,
    borderRadius: 6,
  },
  checkoutText: {
    fontSize: 18,
    marginLeft: 12,
    color: 'white',
    fontWeight: 'bold',
  },
});
