import React from 'react';

import {
  View,
  ScrollView,
  Text,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';
import colors from '../../styles/colors';
import {shadow, text} from '../../styles/inputs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import axios from 'axios';
import constants from '../../constants';
import {faVideo, faFilm} from '@fortawesome/free-solid-svg-icons';
import Centered, {Row} from '../../components/layout';
import ImageIcon from '../../components/image';
import Loading from '../../components/loading';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import ProgressBar from '../../components/edutec/progress';
import { Title, SubTitle } from '../../components/text';
import handleResourceRetrievalError from '../../scripts/permissions';


const SubscriptionCard = props => {
  const navigation = useNavigation()
  return (
    <Pressable 
      style={styles.card}
      onPress={() => {
        navigation.navigate("Course", {course_id: props.course_id})
      }}
    >
      <ImageIcon width={100} height={100} url={props.url} />
      <View style={styles.cardBody}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.heading}>{props.publisher}</Text>
        <ProgressBar progress={props.progress} />
      </View>
    </Pressable>
  );
};

export default function Subscriptions(props) {
  const [data, setData] = React.useState(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation()
  React.useEffect(() => {
    axios
      .get(
        `${constants.server_url}/api/method/edutec_courses.edutec_courses.api.subscribed_courses`,
      )
      .then(res => {
        setData(res.data.message);
      })
      .catch(err => {
        console.log(err.response.data);
        handleResourceRetrievalError(err, navigation)
      });
  }, [isFocused]);

  if (!data) {
    return <Loading />;
  }

  if(data.length == 0) {
    return <View style={{flex: 1}}>
      <Centered  styles={{flex: 1}}>
        <Title title="You don't have any courses." />
        <SubTitle subtitle="Subscribe to start learning!" />
        <FontAwesomeIcon icon={faFilm} size={72} color={colors.primary} />
      </Centered>
    </View>
  }

  return (
    <ScrollView>

      {data.map(course => (
        <SubscriptionCard
          progress={
            course.duration ? (course.progress / course.duration) * 100 : 0
          }
          title={course.title}
          course_id={course.name}
          publisher={course.publisher}
          url={`${constants.server_url}${course.cover_image}`}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    ...text,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 18,
    paddingTop: 8,
    paddingBottom: 8,
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
    flexDirection: 'row',
    overflow: 'hidden'
  },
  cardBody: {
    padding: 8,
  }
});
