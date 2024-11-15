import React from 'react';
import {Pressable, StyleSheet, View, Text, Alert} from 'react-native';
import Loading from '../loading';
import {Label, Paragraph, SubTitle} from '../text';
import ProgressBar from '../edutec/progress';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCaretDown,
  faCaretRight,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import {Row} from '../layout';
import {shadow} from '../../styles/inputs';
import { useNavigation } from '@react-navigation/native';
import constants from '../../constants';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';


const OnboardingStep = props => {
  console.log(props)
  const navigation = useNavigation()
  const executeAction = () => {
    const args = {}
    if(props.action_type == "Form") {
      args.doctype = props.action
    } else if(props.action == "Report") {
      args.id = props.action
    }
    navigation.navigate(props.action_type, args)
  } 
  return (
    <View>
      <Pressable
        onPress={() => {
          props.setExpanded(props.step, !props.expanded);
        }}>
        <Row styles={{justifyContent: 'space-between', paddingBottom: 12}}>
          <Row>
            <FontAwesomeIcon
              icon={props.expanded ? faCaretDown : faCaretRight}
              size={24}
              color="steelblue"
            />
            <Label>{props.step}</Label>
          </Row>
          <FontAwesomeIcon
            icon={props.complete == 1 ? faCheck : faTimes}
            color={props.complete == 1 ? "#00ff33" : "crimson"}
            size={24}
          />
        </Row>
      </Pressable>
      {props.expanded && (
        <View>
          <Paragraph>{props.description}</Paragraph>
          {props.complete == 0 && (
            <Pressable onPress={executeAction} style={styles.startPressable}>
              <Text style={styles.start}>START</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

const OnboardingCard = (props) => {
  const [data, setData] = React.useState(props.data);
  
  const setExpanded = (step, state) => {
    const newSteps = [...data.steps];
    newSteps.forEach(s => {
      s.expanded = false;
    });
    const newStepIndex = newSteps.map(s => s.step).indexOf(step);
    const newStep = newSteps[newStepIndex];
    newStep.expanded = state;
    newSteps[newStepIndex] = newStep;
    const newData = {...data, steps: newSteps};
    setData(newData);
  };

  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    if (!(data && data.steps)) {
      return;
    }
    const completed = data.steps.filter(s => s.complete == 1).length;
    setProgress((completed / data.steps.length) * 100);
  }, [data]);

  if (!data) {
    return <Loading />;
  }

  if (data.complete == 1) {
    return <View />;
  }

  const skipOnboarding = (onName) => {
    axios.post(`${constants.server_url}/api/method/erp.public_api.skip_onboarding`, {
      onboard_name: props.data.name
    }).then(res => {
        Alert.alert("Success", "Skipped onboarding process")
        props.loadOnboarding()
    }).catch(err => {
      console.log(err)
      Alert.alert("Error", "Failed to skip onboarding card")
    })
  }
  //render data
  return (
    <View style={styles.card}>
      <Row styles={{justifyContent: 'flex-end'}}>
        <Pressable onPress={skipOnboarding} style={styles.skipPressable}>
          <Text style={styles.skip}>{<FormattedMessage id="skip" />}</Text>
        </Pressable>
      </Row>
      <SubTitle>{data.target}</SubTitle>
      <Paragraph>{data.description}</Paragraph>
      {data.steps.map(s => (
        <OnboardingStep key={s.step} {...s} setExpanded={setExpanded} />
      ))}
      <View style={{padding: 6, marginTop: 12}}>
        <ProgressBar progress={progress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...shadow,
    elevation: 5,
    margin: 24,
    padding: 24,
    borderRadius: 12,
  },
  start: {
    textTransform: "uppercase",
    fontSize: 20,
    fontWeight: "700",
    color: "#007bff"
  },
  startPressable: {
    padding: 8
  },
  skip: {
    textTransform: "uppercase",
    fontSize: 16,
    color: "crimson",
    opacity:0.8
  },
  skipPressable: {
    padding: 2
  }
});

export default OnboardingCard;
