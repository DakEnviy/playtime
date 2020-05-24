import crypto from 'crypto';

export const sha256Hash = (data: string): string => {
    return crypto
        .createHash('sha256')
        .update(data)
        .digest('hex');
};

export default { sha256Hash };
