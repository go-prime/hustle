import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  faBook,
  faBoxes,
  faBuilding,
  faCalendar,
  faCalendarAlt,
  faChartLine,
  faClipboardList,
  faDollar,
  faDollarSign,
  faFile,
  faFileAlt,
  faFileInvoiceDollar,
  faHand,
  faListDots,
  faPenFancy,
  faRuler,
  faScaleBalanced,
  faTruck,
  faUser,
  faUserAlt,
  faWarehouse,
  faSearch,
  faBookOpen,
  faCalculator,
  faBriefcase,
  faFileInvoice,
  faMoneyCheck,
} from '@fortawesome/free-solid-svg-icons';
import {Heading} from '../../components/text';
import {background, text} from '../../styles/text';
import {card, iconColor} from '../../styles/inputs';
import {TextInput} from 'react-native-gesture-handler';
import axios from 'axios';
import constants from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from '../../components/books/onboarding';
import OnboardingCard from '../../components/books/onboarding';
import {Row} from '../../components/layout';
import { FormattedMessage } from 'react-intl';

const ICON_MAP = {
  'fa-book': faBook,
  'fa-book-open': faBookOpen,
  'fa-boxes': faBoxes,
  'fa-calculator': faCalculator,
  'fa-building': faBuilding,
  'fa-calendar-alt': faCalendarAlt,
  'fa-chart-line': faChartLine,
  'fa-clipboard-list': faClipboardList,
  'fa-dollar-sign': faDollarSign,
  'fa-file': faFile,
  'fa-file-alt': faFileAlt,
  'fa-file-invoice-dollar': faFileInvoiceDollar,
  'fa-hand': faHand,
  'fa-list-dots': faListDots,
  'fa-pen-fancy': faPenFancy,
  'fa-ruler': faRuler,
  'fa-scale-balanced': faScaleBalanced,
  'fa-truck': faTruck,
  'fa-user': faUser,
  'fa-user-alt': faUserAlt,
  'fa-warehouse': faWarehouse,
  'fa-money-check': faMoneyCheck,
};

const SHORTCUT_LIST = [
  {
    module: 'Sales',
    text: 'Sales Invoice',
    icon: 'fa-file-alt',
    route: {name: 'List', options: {doctype: 'Sales Invoice'}},
  },
  {
    module: 'Sales',
    text: 'Quotation',
    icon: 'fa-pen-fancy',
    route: {name: 'List', options: {doctype: 'Quotation'}},
  },
  {
    module: 'Sales',
    text: 'Credit Note',
    icon: 'fa-clipboard-list',
    route: {name: 'List', options: {doctype: 'Credit Note'}},
  },
  {
    module: 'Sales',
    text: 'Prices',
    icon: 'fa-dollar-sign',
    route: {name: 'List', options: {doctype: 'Item Price'}},
  },
  {
    module: 'Inventory',
    text: 'Item',
    icon: 'fa-boxes',
    route: {name: 'List', options: {doctype: 'Item'}},
  },
  {
    module: 'Inventory',
    text: 'Units',
    icon: 'fa-ruler',
    route: {name: 'List', options: {doctype: 'UOM'}},
  },
  {
    module: 'Inventory',
    text: 'Warehouses',
    icon: 'fa-warehouse',
    route: {name: 'List', options: {doctype: 'Warehouse'}},
  },
  {
    module: 'Inventory',
    text: 'Purchase Order',
    icon: 'fa-calendar-alt',
    route: {name: 'List', options: {doctype: 'Purchase Order'}},
  },
  {
    module: 'Inventory',
    text: 'Purchase Invoice',
    icon: 'fa-file-invoice-dollar',
    route: {name: 'List', options: {doctype: 'Purchase Invoice'}},
  },
  {
    module: 'Inventory',
    text: 'Purchase Receipt',
    icon: 'fa-truck',
    route: {name: 'List', options: {doctype: 'Purchase Receipt'}},
  },
  {
    module: 'Inventory',
    text: 'Debit Note',
    icon: 'fa-clipboard-list',
    route: {name: 'List', options: {doctype: 'Debit Note'}},
  },
  {
    module: 'Accounts',
    text: 'Customers',
    icon: 'fa-user',
    route: {name: 'List', options: {doctype: 'Customer'}},
  },
  {
    module: 'Accounts',
    text: 'Suppliers',
    icon: 'fa-user-alt',
    route: {name: 'List', options: {doctype: 'Supplier'}},
  },
  {
    module: 'Accounts',
    text: 'Journal Entries',
    icon: 'fa-scale-balanced',
    route: {name: 'List', options: {doctype: 'Journal Entry'}},
  },
  {
    module: 'Accounts',
    text: 'Payment',
    icon: 'fa-money-check',
    route: {name: 'List', options: {doctype: 'Payment'}},
  },
  {
    module: 'Accounts',
    text: 'Currency',
    icon: 'fa-dollar-sign',
    route: {name: 'List', options: {doctype: 'Currency'}},
  },
  {
    module: 'Accounts',
    text: 'Exchange Rate',
    icon: 'fa-chart-line',
    route: {name: 'List', options: {doctype: 'Currency Exchange'}},
  },
  {
    module: 'Accounts',
    text: 'Accounts',
    icon: 'fa-book',
    route: {name: 'List', options: {doctype: 'Account'}},
  },
  {
    module: 'Accounts',
    text: 'Payment Methods',
    icon: 'fa-list-dots',
    route: {name: 'List', options: {doctype: 'Payment Method'}},
  },
  {
    module: 'Accounts',
    text: 'Bank Reconciliation',
    icon: 'fa-book-open',
    route: {name: 'List', options: {doctype: 'Bank Reconciliation'}},
  },
  {
    module: 'Accounts',
    text: 'Payment Reconciliation',
    icon: 'fa-calculator',
    route: {name: 'Form', options: {doctype: 'Payment Reconciliation'}},
  },
];

const QUICK_ACTION_LIST = [
  {
    module: 'Sales',
    text: 'Sales Invoice',
    icon: 'fa-file-alt',
    route: {name: 'List', options: {doctype: 'Sales Invoice'}},
  },
  {
    module: 'Sales',
    text: 'Quotation',
    icon: 'fa-pen-fancy',
    route: {name: 'List', options: {doctype: 'Quotation'}},
  },
  {
    module: 'Inventory',
    text: 'Purchase Receipt',
    icon: 'fa-truck',
    route: {name: 'List', options: {doctype: 'Purchase Receipt'}},
  },
  {
    module: 'Accounts',
    text: 'Payment',
    icon: 'fa-money-check',
    route: {name: 'List', options: {doctype: 'Payment'}},
  },
];

const Shortcut = ({icon, text, route}) => {
  const navigator = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigator.navigate(route.name, route.options);
      }}
      style={styles.shortcut}>
      <View style={styles.shortcutContent}>
        <FontAwesomeIcon icon={icon} size={40} color={iconColor} />
        <Text style={styles.shortcutText}>{text}</Text>
      </View>
    </Pressable>
  );
};

export default function ShortcutScreen(props) {
  const [input, setInput] = React.useState('');
  const [filterdItems, setFilteredItems] = React.useState(SHORTCUT_LIST);
  const [company, setCompany] = React.useState(null);
  const [onboarding, setOnboarding] = React.useState([]);
  const navigator = useNavigation();
  const isFocused = useIsFocused();
  const loadOnboarding = () => {
    axios
      .get(`${constants.server_url}/api/method/erp.public_api.get_onboarding`)
      .then(res => {
        setOnboarding(res.data.message.onboarding_items);
      })
      .catch(err => {
        if (err.response && err.response.status == 403) {
          console.log(err.response);
          Alert.alert('Error', 'Could not load onboarding tasks');
        }
      });
  };

  React.useEffect(() => {
    if (!input || input.length < 3) {
      setFilteredItems(SHORTCUT_LIST);
      return;
    }
    setFilteredItems(
      SHORTCUT_LIST.filter(
        s => s.text.toLowerCase().indexOf(input.toLowerCase()) > -1,
      ),
    );
  }, [input]);

  React.useEffect(() => {
    AsyncStorage.getItem('user').then(user => {
      if (!user) {
        Alert.alert('You need to login first to access this page');
        navigator.navigate('Login');
      }
      axios
        .get(`${constants.server_url}/api/method/erp.public_api.setup`)
        .then(res => {
          if (!res.data.message) {
            navigator.navigate('Form', {doctype: 'Company'});
          } else {
            setCompany(res.data.message);
          }
        })
        .catch(err => {
          if (err.response && err.response.status == 403) {
            console.log(err.response);
            navigator.navigate('Login');
          }
        });
    });

    // Loading onboarding
    loadOnboarding();
  }, [isFocused]);

  return (
    <>
      <View style={styles.search}>
        <FontAwesomeIcon icon={faSearch} size={20} />
        <TextInput
          placeholder="Search"
          value={input}
          onChangeText={setInput}
          style={{flex: 1}}
        />
      </View>
      <ScrollView style={{backgroundColor: background.color}}>
        {company && (
          <Pressable
            style={styles.company}
            onPress={() => {
              navigator.navigate('Form', {doctype: 'Company', id: company});
            }}>
            <FontAwesomeIcon icon={faBriefcase} size={48} color="steelblue" />
            <View>
              <Text style={styles.company_label}>MY COMPANY</Text>
              <Text style={styles.company_name}>{company}</Text>
            </View>
          </Pressable>
        )}
        {!(input && input.length > 3) && (
          <>
            {onboarding.length > 0 && <Heading>{<FormattedMessage id="getting_started" />}</Heading>}
            {onboarding.map(on => (
              <OnboardingCard
                loadOnboarding={loadOnboarding}
                data={on}
                key={on.target}
              />
            ))}
            <Heading>{<FormattedMessage id="quick_actions" />}</Heading>
            <ScrollView horizontal>
              <Row styles={{gap: 12, margin: 12}}>
                {QUICK_ACTION_LIST.map((fi, idx) => (
                  <Shortcut
                    text={fi.text}
                    icon={ICON_MAP[fi.icon]}
                    route={fi.route}
                    key={idx}
                  />
                ))}
              </Row>
            </ScrollView>
          </>
        )}

        {Array.from(new Set(filterdItems.map(f => f.module)))
          .sort()
          .map(m => {
            return (
              <React.Fragment key={m}>
                <Heading>{m}</Heading>
                <View style={styles.content}>
                  {filterdItems
                    .filter(i => i.module == m)
                    .map((fi, idx) => (
                      <Shortcut
                        text={fi.text}
                        icon={ICON_MAP[fi.icon]}
                        route={fi.route}
                        key={idx}
                      />
                    ))}
                </View>
              </React.Fragment>
            );
          })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  shortcut: {
    ...card,
    elevation: 5,
    padding: 16,
    borderRadius: 8,
    width: 150,
    height: 100,
  },
  shortcutContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shortcutText: {
    ...text,
  },
  search: {
    backgroundColor: '#efefef',
    borderRadius: 4,
    height: 48,
    padding: 4,
    paddingLeft: 12,
    margin: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#efefef',
  },
  company: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    elevation: 3,
  },
  company_label: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
  },
  company_name: {
    color: 'black',
    fontSize: 24,
  },
});
