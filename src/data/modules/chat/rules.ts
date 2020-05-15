import { inputRule } from 'graphql-shield';

const rMessage = /^[a-zA-Zа-яА-ЯёЁ0-9_./%!?@#$&*()[\]<>+=\-:;^,"'\s]{1,255}$/;

export const checkSendMessageArgs = inputRule()(yup =>
    yup.object({
        input: yup.object({
            message: yup
                .string()
                .min(1, 'INVALID_MESSAGE_MIN')
                .max(255, 'INVALID_MESSAGE_MAX')
                .matches(rMessage, 'INVALID_MESSAGE_MATCHES')
                .required('INVALID_MESSAGE_REQUIRED'),
        }),
    }),
);

export default { checkSendMessageArgs };
