import { inputRule } from 'graphql-shield';
import { isNaN } from 'lodash';

export const checkUserArgs = inputRule()(yup =>
    yup.object({
        userId: yup
            .string()
            .required('INVALID_USER_ID_REQUIRED')
            .test({
                test: value => !isNaN(+value),
                message: 'INVALID_USER_ID_TEST',
            }),
    }),
);

export default { checkUserArgs };
