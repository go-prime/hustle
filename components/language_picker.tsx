import React from 'react';
import HubPicker from './basePicker';

const LanguagePicker = ({visible, currentLanguage, onLanguageSelect}) => {
    return <HubPicker 
                options={["English", "Shona"]}
                visible={visible}
                value={currentLanguage}
                onValueChange={onLanguageSelect}
                heading={"Select your Language"}
                 />
}

export default LanguagePicker