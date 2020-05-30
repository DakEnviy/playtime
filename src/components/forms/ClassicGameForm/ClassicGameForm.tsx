import React, { useCallback, useRef } from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';
import { Form } from 'react-final-form';

import s from './ClassicGameForm.scss';
import { cn } from '../../../utils/bem-css-module';
import BetField from '../../fields/BetField/BetField';
import Button from '../../Button/Button';
import { BetInputRef } from '../../inputs/BetInput/BetInput';

export interface ClassicGameFormValues {
    amount: number;
}

export interface ClassicGameFormProps {}

const cnClassicGameForm = cn(s, 'ClassicGameForm');

const ClassicGameForm: React.FC<ClassicGameFormProps> = () => {
    useStyles(s);

    const fieldRef = useRef<BetInputRef | null>(null);

    const onFocus = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        const { current: input } = fieldRef;
        if (!input || event.target === input.elem()) return;

        event.preventDefault();
        input.focus(true);
    }, []);

    return (
        <Form<ClassicGameFormValues> onSubmit={() => {}} initialValues={{ amount: 0 }}>
            {({ handleSubmit, form, values }) => {
                const buildOnControlClick = (inc: number) => () => {
                    form.change('amount', values.amount + inc);
                };

                return (
                    <form className={cnClassicGameForm()} onSubmit={handleSubmit}>
                        <div className={cnClassicGameForm('Main')}>
                            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
                            <div className={cnClassicGameForm('BetFieldContainer')} onClick={onFocus}>
                                <BetField name="amount" ref={fieldRef} />
                            </div>
                            <Button className={cnClassicGameForm('SubmitButton')} upper submit>
                                Играть
                            </Button>
                        </div>
                        <div className={cnClassicGameForm('Controls')}>
                            <Button color="gray" onClick={buildOnControlClick(1)}>
                                +1
                            </Button>
                            <Button color="gray" onClick={buildOnControlClick(5)}>
                                +5
                            </Button>
                            <Button color="gray" onClick={buildOnControlClick(10)}>
                                +10
                            </Button>
                            <Button color="gray" onClick={buildOnControlClick(100)}>
                                +100
                            </Button>
                            <Button color="gray" onClick={buildOnControlClick(500)}>
                                +500
                            </Button>
                            <Button color="gray" onClick={buildOnControlClick(1000)}>
                                +1000
                            </Button>
                            <Button color="gray" onClick={buildOnControlClick(0)}>
                                All
                            </Button>
                        </div>
                    </form>
                );
            }}
        </Form>
    );
};

export default ClassicGameForm;
