import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import {card, shadow, text} from '../styles/inputs';
import axios from 'axios';
import constants from '../constants';
import {Image} from 'react-native-svg';
import colors from '../styles/colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faUser,
  faHouse,
  faSave,
  faArrowUp,
  faAngleRight,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import Centered, {Row} from '../components/layout';
import {useIsFocused} from '@react-navigation/native';
import ImageIcon from '../components/image';
import {Heading, Paragraph} from '../components/text';
import Field from '../components/form'
import { ProfileButton } from '../components/button';
import ImagePicker from '../components/image_picker'
import LanguagePicker from '../components/language_picker';
import CurrencyPicker from '../components/currency_picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormattedMessage } from 'react-intl';


const onSave = (fullname, phone, address, email, imgData, imgName) => {
  axios
    .post(
      `${constants.server_url}/api/method/billing_engine.billing_engine.api.update_client_details`,
      {
        full_name: fullname,
        email: email,
        phone: phone,
        address: address,
        img_data: imgData,
        img_name: imgName
      },
    )
    .then(res => {
      Alert.alert('Success', 'Updated your details successfully');
    })
    .catch(err => {
      console.log(err);
      if (err.response) {
        console.log(err.response.data);
      }
      Alert.alert('Error', 'Something went wrong');
    });
};


export default function ProfileScreen({navigation}) {
  const isFocused = useIsFocused();
  const [data, setData] = React.useState('');
  const [fullname, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [imgData, setImgData] = React.useState(null)
  const [imgName, setImgName] = React.useState('')
  const [lang, setLang] = React.useState('English')
  const [langPickerVisible, setLangPickerVisible] = React.useState(false)
  const [currencyPickerVisible, setCurrencyPickerVisible] = React.useState(false)
  const [currency, setCurrency] = React.useState('USD')

  const saveCurrencyToStorage = async (currency: string) => {
    try {
      await AsyncStorage.setItem('default_currency', currency);
      console.log('Currency set to:', currency);
    } catch (e) {
      console.error('Failed to save the currency.', e);
    }
  };

  const onCurrencySelect = (c: string) => {
    setCurrency(c);
    setCurrencyPickerVisible(false);
    saveCurrencyToStorage(c);
  };

  React.useEffect(() => {
    axios
      .get(
        `${constants.server_url}/api/method/billing_engine.billing_engine.api.client_detail`,
      )
      .then(res => {
        setData(res.data.message);
        setFullName(res.data.message.full_name);
        setPhone(res.data.message.phone);
        setEmail(res.data.message.email);
        setAddress(res.data.message.address);
      })
      .catch(err => {
        console.log(err);
        if (err.response) {
          console.log(err.response.data);
        }
      });
  }, [isFocused]);

  return (
    <ScrollView>
      <Centered>
        <View style={styles.round}>
          {data.photo ? (
            <ImageIcon
              url={`${constants.server_url}${data.photo}`}
              width={175}
              height={175}
            />
          ) : (
            <FontAwesomeIcon icon={faUser} size={72} color={colors.primary} />
          )}
        </View>
      </Centered>
      <View style={styles.tier}>
        <Text style={styles.tierText}>
          {data.subscription
            ? data.subscription.subscription_type
            : 'Hustle Shopper'}
        </Text>
      </View>
      <Heading heading="Settings" />
      <LanguagePicker 
        visible={langPickerVisible}
        currentLanguage={lang}
        onLanguageSelect={(l) => {setLang(l); setLangPickerVisible(false)}} 
      />
      <CurrencyPicker 
        visible={currencyPickerVisible}
        currency={currency}
        // onCurrencySelect={(c) => {setCurrency(c); setCurrencyPickerVisible(false)}} 
        onCurrencySelect={onCurrencySelect} 
      />
      <ProfileButton action={() => {
            setLangPickerVisible(true)
          }} label={`Default Language: ${lang}`} />
      <ProfileButton action={() => {
            setCurrencyPickerVisible(true)
          }} label={`App Currency: ${currency}`} />
      <Heading heading={<FormattedMessage id="actions" />} />
      <ProfileButton action={() => {
            navigation.navigate('Manage Storefront');
          }} label={<FormattedMessage id="manage_store" />} />
      <ProfileButton action={() => {
            navigation.navigate('Subscriptions');
          }} label={<FormattedMessage id="browse_subscriptions" />} />

    <Heading heading={<FormattedMessage id="user_details" />} />
      <ImagePicker 
        initial={data.photo}
        label={<FormattedMessage id="profile_photo" />}
        onImageChange={setImgData}
        onNameChange={setImgName} />
      <Field value={fullname} onTextChange={setFullName} label={"Full Name"} />
      <Field value={phone} onTextChange={setPhone} label={"Phone"} />
      <Field value={email} onTextChange={setEmail} label={"Email"} />
      <Field value={address} multiline onTextChange={setAddress} label={"Address"} />

      <Heading heading="KYC" />
        <Paragraph>{<FormattedMessage id="profile_kyc_description" />}.</Paragraph>
        <Pressable
        onPress={() => navigation.navigate("KYC Information")}
        style={styles.kyc}>
        <FontAwesomeIcon
          icon={faEdit}
          color={'white'}
          size={24}
          style={{marginRight: 12}}
        />
        <Text style={styles.tierText}>Edit KYC</Text>
      </Pressable>

      <Pressable
        onPress={() => onSave(fullname, phone, address, email, imgData, imgName)}
        style={styles.save}>
        <FontAwesomeIcon
          icon={faSave}
          color={'white'}
          size={24}
          style={{marginRight: 12}}
        />
        <Text style={styles.tierText}>Save Changes</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tier: {
    padding: 12,
    backgroundColor: colors.primary,
    margin: 8,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgrade: {
    padding: 8,
    backgroundColor: colors.secondary,
    width: 150,
    margin: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  save: {
    padding: 12,
    backgroundColor: colors.tertiary,
    margin: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 24
  },
  kyc: {
    padding: 12,
    width: 150,
    backgroundColor: colors.primary,
    margin: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 24
  },
  tierText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  round: {
    margin: 24,
    ...card,
    justifyContent: 'center',
    alignItems: 'center',
    height: 175,
    width: 175,
    borderRadius: 87.5,
    overflow: 'hidden',
    padding: 0,
  },
  container: {
    height: 150,
    borderRadius: 12,
    ...shadow,
    elevation: 5,
    margin: 12,
    padding: 12,
  },
  title: {
    fontSize: 24,
    padding: 8,
    ...text,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 18,
    padding: 8,
    ...text,
    fontWeight: 'bold',
  },
  tagLine: {
    fontSize: 18,
    ...text,
  },
});
