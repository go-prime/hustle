import React from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import {Row} from '../../components/layout';
import ImageIcon from '../../components/image';
import {Heading, Pill, SubTitle, Title} from '../../components/text';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import constants from '../../constants';
import {err} from 'react-native-svg/lib/typescript/xml';
import Loading from '../../components/loading';
import ProduceCard from '../../components/marketplace/produce';
import {ItemButton} from '../../components/button';
import { Paragraph } from '../../components/text';
import handleResourceRetrievalError from '../../scripts/permissions';
import { MapButton } from '../../components/maps';
import { FormattedMessage } from 'react-intl';


export default function StorefrontScreen(props) {
  const [data, setData] = React.useState(null);
  const isFocused = useIsFocused();
  const navigation = props.navigation;
  React.useEffect(() => {
    axios
      .get(
        `${constants.server_url}/api/method/open_marketplace.open_marketplace.api.get_storefront`,
        {
          params: {
            storefront_id: props.route.params.storefront,
          },
        },
      )
      .then(res => {
        setData(res.data.message);
      })
      .catch(err => {
        console.log(err);
        handleResourceRetrievalError(err, navigation)
        
      });
  }, [isFocused]);

  if (!data) {
    return <Loading />;
  }

  return (
    <ScrollView>
      <Row>
        <View style={styles.circle}>
          <ImageIcon
            width={75}
            height={75}
            url={`${constants.server_url}${data.image}`}
          />
        </View>
        <View>
          <Title title={data.name} />
          <SubTitle subtitle={data.merchant || 'Merchant'} />
        </View>
      </Row>
      <Paragraph>{data.description}</Paragraph>
      {data.location && <MapButton initialLocation={data.location} readOnly />}
      <Heading heading="Tags" />
      {data.tags.map(t => (
        <Pressable
          onPress={() => {
            navigation.navigate('Produce Category', {category: t.name});
          }}>
          <Pill lg containerStyles={{alignSelf: 'flex-start'}}>
            {t.name}
          </Pill>
        </Pressable>
      ))}
      <Heading heading={<FormattedMessage id="featured_produce" />} />
      <Row styles={{flexWrap: 'wrap', gap: 16, margin: 12}}>
        {data.featured_produce.map(p => (
          <ItemButton
            image_url={p.image}
            key={p.name}
            title={p.name}
            subtitle={p.formatted}
            onPress={() => {
              navigation.navigate('Produce', {produce: p.name});
            }}
          />
        ))}
      </Row>

      <Heading heading="All Produce" />
      <Row styles={{flexWrap: 'wrap', gap: 16, margin: 12}}>
        {data.all_produce.map(p => (
          <ItemButton
            image_url={p.cover_image}
            title={p.name}
            subtitle={p.formatted}
            key={p.name}
            onPress={() => {
              navigation.navigate('Produce', {produce: p.name});
            }}
          />
        ))}
      </Row>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    overflow: 'hidden',
    margin: 12,
  },
});
