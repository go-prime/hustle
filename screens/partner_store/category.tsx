import React from 'react';

import {View, FlatList, Dimensions, StyleSheet} from 'react-native';
import {card, shadow, text} from '../../styles/inputs';
import axios from 'axios';
import constants from '../../constants';
import ImageIcon from '../../components/image';
import Loading from '../../components/loading';
import { ItemButton } from '../../components/button';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Heading, Paragraph, Title } from '../../components/text';
import handleResourceRetrievalError from '../../scripts/permissions';
import { FormattedMessage } from 'react-intl';


export default function CategoryScreen(props) {
  const [data, setData] = React.useState(null);
  const navigation = useNavigation()
  const {width, height} = Dimensions.get('screen')
  const isFocused = useIsFocused()

  React.useEffect(() => {
    axios
      .get(
        `${constants.server_url}/api/method/partner_hub.partner_hub.api.get_category`,
        {params: {category_id: props.route.params.category}},
      )
      .then(res => {
        setData(res.data.message);
      })
      .catch(err => {
        handleResourceRetrievalError(err, navigation)
      });
  }, [props.route.params.category, isFocused]);

  if(!data) {
    return <Loading />
  }

  const renderProduct = (item) => {
    return (
      <ItemButton
      key={item.name}
      title={item.product_name}
      subtitle={item.formatted}
      image_url={item.cover_image}
      onPress={() => navigation.navigate("Product", {product: item.name})}
    />
    )
  }

  return (
    <View style={styles.root}>
      <ImageIcon width={width}
        height={height / 3} url={data.image} />
      <View style={styles.content}>
        <Title title={props.route.params.category}/>
        <Paragraph text={data.description}/>
        <Heading>{<FormattedMessage id="produce" />}</Heading>
        <FlatList 
          data={data.products}
          renderItem={({item}) => (renderProduct(item))}
          numColumns={3}
          keyExtractor={item => item.name}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position:'relative',
    flex: 1
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
    elevation: 5
  },
  title: {
    fontSize: 24,
    padding: 12,
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
});
