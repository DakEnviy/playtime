import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './ClassicGame.scss';
import { cn } from '../../../utils/bem-css-module';
import ClassicGameCanvas from './ClassicGameCanvas/ClassicGameCanvas';
import ClassicGameDigits from './ClassicGameDigits/ClassicGameDigits';
import Text from '../../../components/Text/Text';
import ProgressBar from '../../../components/ProgressBar/ProgressBar';
import TextIcon from '../../../components/TextIcon/TextIcon';
import ClassicGameForm from '../../../components/forms/ClassicGameForm/ClassicGameForm';

export interface ClassicGameProps {}

const cnClassicGame = cn(s, 'ClassicGame');

const ClassicGame: React.FC<ClassicGameProps> = () => {
    useStyles(s);

    return (
        <div className={cnClassicGame()}>
            <div className={cnClassicGame('Main')}>
                <ClassicGameCanvas className={cnClassicGame('Canvas')} />
                <div className={cnClassicGame('Info')}>
                    <div className={cnClassicGame('Time')}>
                        <ClassicGameDigits className={cnClassicGame('Digits')} seconds={10} />
                        <Text upper>seconds</Text>
                        <ProgressBar className={cnClassicGame('ProgressBar')} percent={50} />
                    </div>
                    <div className={cnClassicGame('Fund')}>
                        <Text className={cnClassicGame('FundLabel')} upper>
                            Банк игры
                        </Text>
                        <TextIcon
                            className={cnClassicGame('FundIcon')}
                            text="4280"
                            icon="diamond"
                            color="white"
                            size="l"
                        />
                    </div>
                </div>
            </div>
            <ClassicGameForm />
        </div>
    );
};

export default ClassicGame;
