import BaseRepository from './base';
import { Setting, SettingName, SettingValue } from '../models/Setting';

const defaultSettings: Record<SettingName, [string | null, string | null]> = {
    'classic::countdownTimer': ['10', 'Время обратного отсчета таймера для классика в секундах'],
    'classic::culminationTimer': ['10', 'Длительность кульминации для классика в секундах'],
    'classic::endedTimer': ['5', 'Длительность окончания игры для классика в секундах'],
    'classic::minBetAmount': ['1', 'Минимальная сумма ставки для классика'],
    'classic::minPlayersToStartCountdown': [
        '1',
        'Минимальная количество игроков для стратра обратного отсчета для классика',
    ],
    'classic::commissionPercent': ['5', 'Процент комиссии для классика'],
};

class SettingsRepository extends BaseRepository {
    async getSetting(name: SettingName): Promise<SettingValue> {
        const setting: Setting | null = await this.db.Setting.findByPk(name);
        if (!setting) {
            if (defaultSettings[name]) {
                const [value, description] = defaultSettings[name];
                await this.db.Setting.create({ name, value, description });
                return new SettingValue(value);
            }
            throw new Error(`Setting '${name}' not found`);
        }
        return setting.value;
    }

    async getSettingAsNumber(name: SettingName) {
        return (await this.getSetting(name)).asNumber();
    }

    async getSettingAsString(name: SettingName) {
        return (await this.getSetting(name)).asString();
    }
}

export default SettingsRepository;
