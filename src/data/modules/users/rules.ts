import { inputRule } from 'graphql-shield';
import { isNaN } from 'lodash';

export const checkUserArgs = inputRule()(yup =>
    yup.object({
        userId: yup
            .mixed<string>()
            .test({
                test: value => !isNaN(+value),
                message: 'INVALID_USER_ID',
            })
            .required(),
    }),
);

export default { checkUserArgs };
