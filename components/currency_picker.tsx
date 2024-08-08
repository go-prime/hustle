import React from 'react';
import HubPicker from './basePicker';

const CurrencyPicker = ({visible, currency, onCurrencySelect}) => {
    return <HubPicker 
                options={["USD", "ZWG"]}
                visible={visible}
                value={currency}
                onValueChange={onCurrencySelect}
                heading={"Select your Currency"}
                 />
}

export default CurrencyPicker