import React from 'react';

import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import {card, shadow, text} from '../../styles/inputs';
import axios from 'axios';
import constants from '../../constants';
import ImageIcon from '../../components/image';
import Loading from '../../components/loading';
import {CourseButton} from '../../components/button';
import {Heading, Paragraph, Title} from '../../components/text';
import SubscriptionCard from '../../components/billing_engine/subscription_card';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import SubscriptionHistory from '../../components/billing_engine/subscription_history';
import handleErr from '../../scripts/axios';
import { FormattedMessage } from 'react-intl';

export default function SubscriptionListScreen(props) {
  const [data, setData] = React.useState(null);
  const {width, height} = Dimensions.get('screen');
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  React.useEffect(() => {
    axios
      .get(
        `${constants.server_url}/api/method/billing_engine.billing_engine.api.subscriptions`,
      )
      .then(res => {
        setData(res.data.message);
      })
      .catch(err => {
        handleErr(err, navigation)
      });
  }, [isFocused]);

  if (!data) {
    return <Loading />;
  }

  const purchaseSubsHeading = () => (
    <View>
      <Text style={styles.boldText}>
        <FormattedMessage id="buy" /> <FormattedMessage id="subscriptions" />
      </Text>
  </View>
  );

  return (
    <ScrollView>
      <View style={styles.content}>
        <Heading heading={purchaseSubsHeading()} />
        <View style={styles.grid}>
          {data.subscriptions.map(item => <SubscriptionCard {...item} />)}
        </View>
        <Heading heading={<FormattedMessage id="subscription_history" />} />
        {data.subscription_history.map(item => (
          <SubscriptionHistory key={item.subscription_id} {...item} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black'
  }
});
