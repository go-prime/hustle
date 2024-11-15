import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

import Carousel from 'react-native-reanimated-carousel';
import {faUserGraduate} from '@fortawesome/free-solid-svg-icons';
import {shadow, text} from '../../styles/inputs';
import axios from 'axios';
import {Alert} from 'react-native';
import constants from '../../constants';
import Loading from '../../components/loading';
import SearchBar from '../../components/search';
import ImageIcon from '../../components/image';

import {Heading} from '../../components/text';
import colors from '../../styles/colors';
import {CategoryButton, CourseButton} from '../../components/button';
import getColors from '../../hooks/colors';
import { FormattedMessage } from 'react-intl';

export default function CoursesHomeScreen({navigation}): JSX.Element {
  const width = Dimensions.get('window').width;
  const [search, setSearch] = React.useState('');
  const [data, setData] = React.useState(null);
  const colorScheme = getColors(navigation)

  React.useEffect(() => {
    axios
      .get(
        `${constants.server_url}/api/method/edutec_courses.edutec_courses.api.edutec_home`,
      )
      .then(res => {
        setData(res.data.message);
      })
      .catch(err => {
        console.log(err);
        Alert.alert('Error', 'Failed to get resources.');
      });
  }, []);

  if (!data) {
    return <Loading />;
  }

  return (
    <ScrollView style={{padding: 12}}>
      <SearchBar />
      <View style={styles.carouselContainer}>
        <Carousel
          loop
          width={width}
          height={200}
          autoPlay={true}
          data={data.carousel}
          scrollAnimationDuration={3000}
          renderItem={({index}) => {
            const item = data.carousel[index];
            return (
              <View style={styles.carouselItemContainer}>
                <ImageIcon
                  url={`${constants.server_url}/${item.image}`}
                  width={100}
                  height={100}
                />
                <Text style={{flex: 1, textAlign: 'center', fontSize: 20}}>
                  {item.title}
                </Text>
              </View>
            );
          }}
        />
      </View>
      <View>
        <Pressable
          style={[styles.myCourseCard, {backgroundColor: colorScheme.primary}]}
          onPress={() => navigation.navigate('My Course Subscriptions')}>
          <FontAwesomeIcon icon={faUserGraduate} size={36} color={'white'} />
          <Text style={styles.myCourseCardText}><FormattedMessage id="my_courses" /></Text>
        </Pressable>
        <Heading heading={<FormattedMessage id="continue_learning" />} />

        <ScrollView horizontal={true}>
          {data.continue_learning.map(b => (
            <CourseButton
              key={b.name}
              name={b.name}
              progress={
                b.duration >= b.progress ? (b.progress / b.duration) * 100 : 0
              }
              image_url={b.cover_image}
              onPress={() => navigation.navigate('Course', {course_id: b.name})}
            />
          ))}
        </ScrollView>
      </View>

      <Heading><FormattedMessage id="subjects" /></Heading>
      <ScrollView horizontal>
        {data.categories.map(cat => (
          <CategoryButton
            key={cat.name}
            name={cat.name}
            image_url={cat.image}
            onPress={() =>
              navigation.navigate('Course Category', {category: cat.name})
            }
          />
        ))}
      </ScrollView>
      <Heading heading={<FormattedMessage id="featured_courses" />} />
      <ScrollView horizontal  >
        {data.courses.map(b => (
          <CourseButton
            key={b.name}
            name={b.name}
            image_url={b.image}
            onPress={() => navigation.navigate('Course', {course_id: b.name})}
          />
        ))}
      </ScrollView>
      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    ...shadow,
    elevation: 5,
    borderRadius: 12,
    height: 200,
    marginVertical: 12,
    overflow: 'hidden'
  },
  carouselItemContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    height: 200,
    padding: 16,
  },
  searchInput: {
    margin: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    ...shadow,
    elevation: 5,
  },
  input: {
    marginLeft: 12,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
    ...text,
    margin: 12,
  },
  myCourseCard: {
    height: 50,
    width: 200,
    paddingLeft: 18,
    paddingRight: 18,
    margin: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 25,
    flexDirection: "row"
  },
  myCourseCardText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
