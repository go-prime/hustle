import React from 'react';

import {
  Alert,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  View,
} from 'react-native';

import {Heading, Label, Paragraph, Pill, SmallLabel} from '../components/text';
import Field from '../components/form';
import ImagePicker from '../components/image_picker';
import colors from '../styles/colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import constants from '../constants';
import { FormattedMessage } from 'react-intl';

const KYCForm = () => {
  const [fullname, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [iDImgData, setIDImgData] = React.useState(null);
  const [kycID, setkycID] = React.useState(null);
  const [iDImgName, setIDImgName] = React.useState('');
  const [iDImgInitial, setIDImgInitial] = React.useState('');
  const [faceImgData, setFaceImgData] = React.useState(null);
  const [faceImgName, setFaceImgName] = React.useState('');
  const [faceImgInitial, setFaceImgInitial] = React.useState('');
  const [proofImgData, setProofImgData] = React.useState(null);
  const [proofImgName, setProofImgName] = React.useState('');
  const [proofImgInitial, setProofImgInitial] = React.useState('');
  const statusColorMap = {
    'Processing': '#007bff',
    'Pending': '#FFC300',
    'Denied': 'crimson',
    'Verified': '#28B463',
    'Incomplete': '#A6ACAF',
  };

  React.useEffect(() => {
    axios
      .get(
        `${constants.server_url}api/method/billing_engine.billing_engine.api.kyc_detail`,
      )
      .then(res => {
        setStatus(res.data.message.status);
        setIDImgInitial(res.data.message.id_image);
        setFaceImgInitial(res.data.message.portrait);
        setProofImgInitial(res.data.message.proof_of_residence_image);
        setFullName(res.data.message.full_name);
        setPhone(res.data.message.phone);
        setEmail(res.data.message.email);
        setAddress(res.data.message.address);
        setkycID(res.data.message.name);
      });
  }, []);

  const submitKYC = () => {
    console.log({
      full_name: fullname,
      phone: phone,
      address: address,
      email: email,
      id_img_name: iDImgName,
      proof_img_name: proofImgName,
      portrait_img_name: faceImgName,
    });
    axios
      .post(
        `${constants.server_url}api/method/billing_engine.billing_engine.api.update_kyc_details`,
        {
          data: {
            full_name: fullname,
            phone: phone,
            address: address,
            email: email,
            id_img: iDImgData,
            id_img_name: iDImgName,
            proof_img: proofImgData,
            proof_img_name: proofImgName,
            portrait_img: faceImgData,
            portrait_img_name: faceImgName,
            id: kycID,
          }
        },
      )
      .then(res => {
        Alert.alert(
          'Success',
          `Thank you for submitting your information, 
        this page will update when your captured information is verfied by our processing pipeline`,
        );
      })
      .catch(err => {
        console.log({err});
        console.log(err.response.data);
        Alert.alert('Failure', 'Error on submitting updated KYC information');
      });
  };

  return (
    <ScrollView>
      <Heading>{<FormattedMessage id="kyc_status_label" />}</Heading>
      <View style={{width: 150}}>
        <Pill color={statusColorMap[status]}>{status}</Pill>
      </View>
      {status == 'Approved' ? (
        <Paragraph>{<FormattedMessage id="kyc_success" />}</Paragraph>
      ) : (
        <>
          <Paragraph>
            {<FormattedMessage id="kyc_fill_info_instrustion" />}
          </Paragraph>
          <Paragraph>
            {<FormattedMessage id="kyc_fill_info_instrustion_2" />}
          </Paragraph>
          <Heading>Personal Details</Heading>
          <Paragraph>
            {<FormattedMessage id="kyc_personal_details" />}
          </Paragraph>
          <Field
            value={fullname}
            onTextChange={setFullName}
            label={'Full Name (as appearing on ID)'}
          />
          <Field value={phone} onTextChange={setPhone} label={'Phone'} />
          <Field value={email} onTextChange={setEmail} label={'Email'} />
          <Field
            value={address}
            multiline
            onTextChange={setAddress}
            label={'Address'}
          />

          <Heading>{<FormattedMessage id="kyc_national_id" />}</Heading>
          <Paragraph>
            {<FormattedMessage id="kyc_national_id_details" />}
          </Paragraph>
          <ImagePicker
            label={<FormattedMessage id="kyc_upload_id_instruction" />}
            onImageChange={setIDImgData}
            onNameChange={setIDImgName}
            initial={iDImgInitial}
          />

          <ImagePicker
            cameraOnly
            label={<FormattedMessage id="kyc_image_clarity_instruction" />}
            onImageChange={setFaceImgData}
            onNameChange={setFaceImgName}
            initial={faceImgInitial}
          />
          <Heading>{<FormattedMessage id="kyc_proof_of_reference_heading" />}</Heading>
          <Paragraph>
            {<FormattedMessage id="kyc_upload_proof_of_reference_instruction" />}
          </Paragraph>
          <ImagePicker
            label={<FormattedMessage id="kyc_proof_residence" />}
            onImageChange={setProofImgData}
            onNameChange={setProofImgName}
            initial={proofImgInitial}
          />
          <Pressable style={styles.save} onPress={submitKYC}>
            <FontAwesomeIcon color={'white'} size={24} icon={faCheck} />
            <Text style={styles.tierText}>Submit</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  save: {
    padding: 12,
    backgroundColor: colors.tertiary,
    margin: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 24,
  },
  tierText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
});

export default KYCForm;
