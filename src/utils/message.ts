import blankImg from '../assets/emojis/blank.gif';
import emojiStyles from '../assets/emojis/emoji.scss';
import { EmojiAlt, emojiAlts, EmojiSize } from '../assets/emojis';

export const emojiAltRegexp = new RegExp(emojiAlts.map(emojiAlt => `:${emojiAlt}:`).join('|'), 'g');
export const emojiImgRegexp = new RegExp(`<img.+?alt="(${emojiAltRegexp.source})".*?/?>`, 'g');
export const tagRegexp = /<\\?.+?>/g;

export const isEmojiAlt = (text: string): boolean => {
    return new RegExp(`^(${emojiAltRegexp.source})$`).test(text);
};

export const emojiAltToImg = (alt: EmojiAlt, size: EmojiSize): string => {
    return `<img class="${emojiStyles.Emoji} ${emojiStyles[`Emoji_alt_${alt}`]} ${
        emojiStyles[`Emoji_size_${size}`]
    }" src="${blankImg}" alt=":${alt}:">`;
};

export const textToHtml = (text: string, emojiSize: EmojiSize): string => {
    return text
        .replace(new RegExp(emojiAltRegexp), emojiAlt => emojiAltToImg(emojiAlt.slice(1, -1) as EmojiAlt, emojiSize))
        .replace(/&/g, '&amp;')
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;')
        .replace(/\n/g, '<br>');
};

export const htmlToText = (html: string): string => {
    return html
        .replace(/<br>/g, '\n')
        .replace(new RegExp(emojiImgRegexp), (_0, emojiAlt) => emojiAlt)
        .replace(new RegExp(tagRegexp), '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<');
};

export const matchEmojiAlt = (text: string): [string, number, number] | null => {
    const match = new RegExp(emojiAltRegexp).exec(text);
    return match && [match[0] as EmojiAlt, match.index, match.index + match[0].length];
};

export const trimTags = (html: string): string => {
    const emojiImgRegexpClone = new RegExp(emojiImgRegexp);

    return html.replace(new RegExp(tagRegexp), match => {
        if (match === '<br>' || emojiImgRegexpClone.test(match)) {
            return match;
        }

        return '';
    });
};
