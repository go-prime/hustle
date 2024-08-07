import React from 'react';
import {View, Text, StyleSheet, Appearance} from 'react-native';
import {inputContainer, text} from '../../styles/inputs';
import colors from '../../styles/colors';


// Important! Make sure all fields are children of a scrollview otherwise they will not take their full height!

export default function FieldContainer(props) {
  const styleArr = [styles.fullWidth];

  if (props.read_only) {
    styleArr.push(styles.readOnlyInputFrame);
  } else {
    styleArr.push(styles.inputFrame);
  }

  if (props.input) {
    styleArr.push(styles.container);
  } else {
    styleArr.push(styles.tableContainer);
  }

  if (props.mandatory) {
    styleArr.push(styles.mandatory);
  }

  if (props.disabled) {
    styleArr.push(styles.disabled);
  }
  if(props.picker) {
    styleArr.push({flexDirection: 'column'})
  } else {
    styleArr.push({alignItems: 'center'})
  }
  console.log(props.label)
  console.log(styleArr)
  return props.hidden ? null : (
    <View style={props.input ? styles.container : styles.tableContainer}>
      {props.input && <Text style={styles.label}>{props.label}</Text>}
      <View style={styleArr}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
    marginBottom: 6
  },
  tableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 0
  },
  label: {
    fontSize: 18,
    ...text,
    marginBottom: 6,
    marginLeft: 4
  },
  inputFrame: inputContainer,
  readOnlyInputFrame: {
    ...inputContainer,
    backgroundColor : Appearance.getColorScheme() == "dark" ? "#000" : '#f5f5f5',
  },
  fullWidth: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#eee"
  },
  disabled: {
    backgroundColor: '#f5f5f5',
  },
  mandatory: {
    borderColor: colors.tertiary,
    borderWidth: 1.5,
  },
});
