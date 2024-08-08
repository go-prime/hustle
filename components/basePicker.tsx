import React from 'react';
import {Text, View, Modal, StyleSheet, ScrollView, Pressable} from 'react-native';
import { Row } from './layout';
import { Heading } from './text';

const PickerOption = ({onSelect, selected, children}) => {
    return (
        <Pressable onPress={() => onSelect(children)}>
            <Row styles={styles.rowStyle}>
                <View style={styles.circle}>
                    {selected == children && (<View style={styles.dot} ></View>)}
                </View>
                <Text style={styles.optionText}>{children}</Text>
            </Row>
        </Pressable>
    )
}

const HubPicker = ({visible, value, onValueChange, heading, options}) => {
    return (
        <Modal visible={visible} transparent>
            <View style={styles.container}>
                <Heading>{heading}</Heading>
                <ScrollView>
                    {options.map(opt => <PickerOption onSelect={onValueChange} selected={value}>{opt}</PickerOption>)}
                </ScrollView>
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    container: {
        margin: 24,
        borderRadius: 18,
        backgroundColor: 'white',
        padding: 18,
        height: 300,
        elevation: 5
    },
    circle: {
        width: 32,
        height: 32,
        margin: 18,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: "#007bff",
        justifyContent: 'center',
        alignItems: 'center'
    },
    dot: {
        width: 20,
        height: 20,
        borderRadius: 20,
        backgroundColor: "#007bff"
    },
    optionText: {
        color: 'black',
        fontSize: 18
    },
    rowStyle: {
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    }
})


export default HubPicker