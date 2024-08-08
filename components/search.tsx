import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import {card, shadow} from '../styles/inputs';
import {useNavigation} from '@react-navigation/native';
import colors from '../styles/colors';
import getColors from '../hooks/colors';


export default function SearchBar(props) {
  const inputRef = React.useRef();
  const navigation = useNavigation()
  const colorScheme = getColors(navigation)

  return (
    <View style={[styles.searchInput, {borderColor: colorScheme.primary}]}>
      <FontAwesomeIcon style={{width: 50}} size={28} color={colorScheme.primary} icon={faSearch} />
      <TextInput
        style={styles.input}
        placeholder="Search"
        onFocus={() => navigation.navigate("Search")}
        ref={inputRef}
      />
    </View>
  );
}

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
  modalContent: {
    marginHorizontal: 12,
    ...card,
    height: 300,
    marginTop: 65,
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
});
