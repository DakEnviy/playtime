import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './Balance.scss';
import { cn } from '../../../../utils/bem-css-module';
import Text from '../../../Text/Text';
import TextIcon from '../../../TextIcon/TextIcon';
import Button from '../../../Button/Button';

export interface BalanceProps {}

const cnBalance = cn(s, 'Balance');

const Balance: React.FC<BalanceProps> = () => {
    useStyles(s);

    return (
        <div className={cnBalance()}>
            <div className={cnBalance('Main')}>
                <Text className={cnBalance('Label')} upper>
                    Баланс
                </Text>
                <TextIcon className={cnBalance('Value')} text="750" icon="diamond" font="Rubik" color="white" upper />
            </div>
            <Button className={cnBalance('Button')} icon="plusWhite" />
        </div>
    );
};

export default Balance;
