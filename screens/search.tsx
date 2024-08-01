import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faSearch,
  faTimes,
  faRectangleXmark,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import {
  Alert,
  View,
  StyleSheet,
  TextInput,
  Modal,
  FlatList,
  Text,
  Pressable,
  ActivityIndicator,
  Switch,
  Dimensions,
} from 'react-native';
import {card, shadow} from '../styles/inputs';
import axios from 'axios';
import constants from '../constants';
import ImageIcon from '../components/image';
import {Row} from '../components/layout';
import {subTitle, paragraph} from '../styles/text';
import {useNavigation} from '@react-navigation/native';
import colors from '../styles/colors';
import Centered from '../components/layout';
import {SubTitle, Label, Heading} from '../components/text';
import { MapButton } from '../components/maps';
import NumberField from '../components/books/number';
import DateField from '../components/books/date';
import { ScrollView } from 'react-native-gesture-handler';

const SearchItem = props => {
  const navigation = useNavigation();
  const keyMap = {
    Bundle: 'bundle',
    Product: 'product',
    Course: 'course_id',
    Partner: 'partner',
    Produce: 'produce',
  };
  const searchResultNavigate = () => {
    const key = keyMap[props.type];
    navigation.navigate(props.type, {[key]: props.id});
  };

  return (
    <Pressable onPress={searchResultNavigate}>
      <Row styles={styles.result}>
        <ImageIcon url={props.img_url} width={50} height={50} />
        <View style={styles.resultTextContainer}>
          <Text style={subTitle}>{props.title}</Text>
          <Text style={paragraph}>{props.type}</Text>
        </View>
      </Row>
    </Pressable>
  );
};

export default SearchScreen = props => {
  const [search, setSearch] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [searching, setSearching] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({})
  const [priceFilters, setPriceFilters] = React.useState(false)
  const [dateFilters, setDateFilters] = React.useState(false)
  const [locationFilters, setLocationFilters] = React.useState(false)
  const {height} = Dimensions.get('window')


  React.useEffect(() => {
    if (search.length < 3) {
      setResults([]);
      return;
    }
    setSearching(true);
    const stringifiedFilters = JSON.stringify(filters);
    axios
      .get(
        `${constants.server_url}/api/method/billing_engine.billing_engine.api.search`,
        {
          params: {q: search, data: stringifiedFilters},
        },
      )
      .then(res => {
        setSearching(false);
        setResults(res.data.message);
      })
      .catch(err => {
        Alert.alert('Error', 'Failed to get results.');
        console.log(err.response.data);
      });
  }, [search]);
  return (
    <View style={styles.root}>
      {showFilters && (
      <View style={{height: height / 3, ...styles.filterView}}>
        <Heading>Filters</Heading>
        <ScrollView>
        <Row styles={styles.filterStyle}>
          <SubTitle>Price Range</SubTitle>
          <Switch 
            value={priceFilters}
            onValueChange={() => {
              setPriceFilters(!priceFilters)
              if(priceFilters) {
                setFilters({...filters, min_price: null, max_price: null})
              }
            }}
          />
        </Row>
        {priceFilters && (<View>
          <NumberField label="Min" onChange={val => setFilters({...filters, min_price: val})} isInput />
          <NumberField label="Max" onChange={val => setFilters({...filters, max_price: val})} isInput />
        </View>)}
        <Row styles={styles.filterStyle}>
          <SubTitle>Date</SubTitle>
          <Switch 
            value={dateFilters}
            onValueChange={() => {
              setDateFilters(!dateFilters)
              if(dateFilters) {
                setFilters({...filters, from_date: null, to_date: null})
              }
            }}
          />
        </Row>
        {dateFilters &&(<View>
          <DateField label="Oldest Date" isInput onChange={val => setFilters({...filters, from_date: val})} />
          <DateField label="Newest Date" isInput onChange={val => setFilters({...filters, to_date: val})} />
        </View>)}
        <Row styles={styles.filterStyle}>
          <SubTitle>Location</SubTitle>
          <Switch
            value={locationFilters}
            onValueChange={() => {
              setLocationFilters(!locationFilters)
              if(locationFilters) {
                setFilters({...filters, radius: null, to_date: null})
              }
            }}
          />
        </Row>
        {locationFilters && (<View>
          <NumberField label="Radius (km)"  onChange={val => setFilters({...filters, radius: val})} isInput />
          <MapButton initialLocation={filters.location} onSelectLocation={coords => setFilters({...filters, location: coords})} />
        </View>)}
        </ScrollView>
      </View>
    )}
      <View style={styles.modalSearchInput}>
        <FontAwesomeIcon
          color={colors.primary}
          style={{width: 50}}
          size={28}
          icon={faSearch}
        />

        <TextInput
          style={styles.input}
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
          autoFocus={true}
        />
        <Pressable onPress={() => setShowFilters(!showFilters)}>
        <FontAwesomeIcon
            color={colors.primary}
            style={{width: 50, marginRight: 12}}
            size={28}
            icon={faFilter}
          />
        </Pressable>
      </View>
      {searching ? (
        <Centered>
          <ActivityIndicator color={colors.primary} size={48} />
        </Centered>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={item => <SearchItem {...item.item} />}
          keyExtractor={item => item.id}
        />
      ) : (
        <Row styles={{padding: 12, alignItems: 'center'}}>
            <FontAwesomeIcon color={'white'} size={28} icon={faRectangleXmark} />
            <SubTitle>{search.length > 3 ? "No Results Found" : "Start typing to begin searching"}</SubTitle>
          </Row>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    margin: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    flex: 1,
  },
  modalSearchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    height: 50,
  },
  input: {
    marginLeft: 12,
    flex: 1,
  },
  root: {
    margin: 12,
    ...card,
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 5,
  },
  result: {
    padding: 12,
  },
  resultTextContainer: {
    paddingLeft: 12,
  },
  filterView: {
    margin: 8,
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 24
  },
  filterStyle: {
    justifyContent: 'space-between',
    marginBottom: 18
  }
});
