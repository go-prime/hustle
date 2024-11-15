import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {faCamera, faImage, faTimes} from '@fortawesome/free-solid-svg-icons';
import {Label} from './text';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Image} from 'react-native';
import ImageIcon from './image';
import Centered from './layout';
import {
  useCameraPermission,
} from 'react-native-vision-camera';
import { FormattedMessage } from 'react-intl';

export default HHImagePicker = props => {
  const [img, setImg] = React.useState(null);
  const [name, setName] = React.useState(null);
  const {hasPermission, requestPermission} = useCameraPermission();


  const selectGalleryImg = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 1920,
        maxHeight: 1080,
      },
      response => {
        if (response.didCancel) {
          return;
        }
        setImg(response.assets[0].base64);
        setName(response.assets[0].fileName);
        props.onImageChange(response.assets[0].base64);
        props.onNameChange(response.assets[0].fileName);
      },
    );
  };

  const selectDeviceImg = () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 1920,
        maxHeight: 1080,
      },
      response => {
        if (response.didCancel) {
          return;
        }
        console.log(response);
        setImg(response.assets[0].base64);
        setName(response.assets[0].fileName);
        props.onImageChange(response.assets[0].base64);
        props.onNameChange(response.assets[0].fileName);
      },
    );
  };

  if(!hasPermission) {
    requestPermission()
    return (
      <View>
        <Label>Loading...</Label>
      </View>
    )
  }

  return (
    <View>
      <View style={{paddingLeft: 8}}>
        <Label>{props.label}</Label>
      </View>
      {props.initial && !img && (
        <Centered>
          <ImageIcon url={props.initial} width={200} height={100} />
        </Centered>
      )}
      {img ? (
        <View>
          <View style={styles.imgContainer}>
            <Image
              source={{
                uri: `data:image/jpg;base64,${img}`,
                width: 200,
                height: 100,
              }}
            />
          </View>
          <Label>{name}</Label>
          <Pressable onPress={() => setImg(null)} style={styles.clearBtn}>
            <FontAwesomeIcon icon={faTimes} size={24} color={'white'} />
            <Text style={styles.clearBtnText}>Clear</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.container}>
          <Pressable style={styles.selectBtn} onPress={selectDeviceImg}>
            <FontAwesomeIcon size={24} color={'#333'} icon={faImage} />
            <Text style={styles.selectBtnText}>{<FormattedMessage id="from_device" />}</Text>
          </Pressable>
          {!props.cameraOnly && <Pressable style={styles.selectBtn} onPress={selectGalleryImg}>
            <FontAwesomeIcon size={24} color={'#333'} icon={faCamera} />
            <Text style={styles.selectBtnText}>{<FormattedMessage id="from_camera" />}</Text>
          </Pressable>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imgContainer: {
    margin: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 4,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  container: {
    margin: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 12,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  selectBtn: {
    backgroundColor: '#ccc',
    flexDirection: 'row',
    padding: 8,
    borderRadius: 8,
    gap: 12,
    flex: 1,
    justifyContent: 'center',
  },
  selectBtnText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 18,
  },
  clearBtn: {
    backgroundColor: 'crimson',
    alignSelf: 'flex-start',
    padding: 6,
    borderRadius: 8,
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearBtnText: {
    color: 'white',
    fontSize: 20,
  },
});
