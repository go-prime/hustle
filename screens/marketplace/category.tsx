import React from 'react';

import {
  View,
  ScrollView,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  FlatList,
} from 'react-native';
import colors from '../../styles/colors';
import {card, shadow, text} from '../../styles/inputs';
import axios from 'axios';
import constants from '../../constants';

import Centered, {Row} from '../../components/layout';
import ImageIcon from '../../components/image';
import Loading from '../../components/loading';
import {Appearance} from 'react-native';
import {Heading, Paragraph, SubTitle, Title} from '../../components/text';
import {useIsFocused} from '@react-navigation/native';
import {ItemButton} from '../../components/button';
import { FormattedMessage } from 'react-intl';

export default function MarketplaceCategoryScreen(props) {
  const [data, setData] = React.useState(null);
  const isFocused = useIsFocused();
  const navigation = props.navigation;

  React.useEffect(() => {
    axios
      .get(
        `${constants.server_url}/api/method/open_marketplace.open_marketplace.api.get_category`,
        {params: {category_id: props.route.params.category}},
      )
      .then(res => {
        setData(res.data.message);
      })
      .catch(err => {
        console.log(err.response.data);
      });
  }, [isFocused]);

  if (!data) {
    return <Loading />;
  }

  const {width, height} = Dimensions.get('window');

  const renderProduce = p => (
    <ItemButton
      title={p.name}
      subtitle={p.formatted}
      image_url={p.cover_image}
      key={p.index}
      onPress={() => {
        navigation.navigate('Produce', {produce: p.name});
      }}
    />
  )

  return (
    <View style={styles.root}>
      <ImageIcon
        width={width}
        height={height / 3}
        url={`${constants.server_url}/${data.image}`}
      />
      <View style={styles.content}>
          <Title title={data.name} />
          <Paragraph text={data.description} />
          <Heading>{<FormattedMessage id="produce" />}</Heading>
          <FlatList 
            data={data.produce}
            renderItem={({item}) => (renderProduce(item))}
            numColumns={3}
            keyExtractor={item => item.name}
            columnWrapperStyle={{gap: 12, paddingLeft: 12}}
          />  
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    flex: 1,
  },
  content: {
    ...card,
    borderRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginTop: -48,
    paddingTop: 36,
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
    elevation: 5,
  },
  column: {
    flex: 1,
    padding: 16,
  },
  row: {
    paddingLeft: 4,
    paddingRight: 4,
  },
  half_card: {
    marginTop: 24,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    ...shadow,
    backgroundColor:
      Appearance.getColorScheme() === 'dark' ? '#111' : '#f5f5f5',
    elevation: 5,
    flex: 1,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    paddingBottom: 4,
    margin: 12,
    ...text,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 18,
    padding: 8,
    ...text,
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
  number: {
    color: '#ccc',
    fontSize: 36,
    textAlign: 'center',
    paddingLeft: 18,
    paddingRight: 18,
    fontWeight: 'bold',
  },
  subscribeBtn: {
    backgroundColor: colors.primary,
    padding: 12,
    width: 200,
    position: 'absolute',
    borderRadius: 24,
    top: -24,
  },
  subscribedBtn: {
    borderColor: colors.primary,
    ...card,
    borderWidth: 3,
    padding: 12,
    width: 200,
    position: 'absolute',
    borderRadius: 24,
    top: -24,
  },
  subscribeBtnText: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    color: '#fff',
  },
  subscribedBtnText: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    color: colors.primary,
  },
  studentCount: {
    fontSize: 36,
    ...text,
    fontWeight: 'bold',
  },
  studentLabel: {
    fontSize: 16,
    ...text,
    fontWeight: 'bold',
  },
});
