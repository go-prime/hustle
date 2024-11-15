import React from 'react';
import HubPicker from './basePicker';
import { FormattedMessage } from 'react-intl';

const LanguagePicker = ({visible, currentLanguage, onLanguageSelect}) => {
    return <HubPicker 
                options={["en", "sn"]}
                visible={visible}
                value={currentLanguage}
                onValueChange={onLanguageSelect}
                heading={<FormattedMessage id="select_language" />}
                 />
}

export default LanguagePicker