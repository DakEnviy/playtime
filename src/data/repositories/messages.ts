import BaseRepository from './base';
import { Message } from '../models/Message';

class MessagesRepository extends BaseRepository {
    async getMessages(): Promise<Message[]> {
        return this.db.Message.findAll({
            order: [['createdAt', 'DESC']],
            limit: 30,
        });
    }

    async addMessage(senderId: string, message: string): Promise<Message> {
        return this.db.Message.create({
            senderId,
            message,
        });
    }

    async deleteMessage(messageId: string): Promise<void> {
        const message: Message | null = await this.db.Message.findByPk(messageId);

        if (!message) {
            throw new Error('NO_MESSAGE');
        }

        return message.destroy();
    }

    async deleteMessagesBySender(senderId: string): Promise<void> {
        await this.db.Message.destroy({ where: { senderId } });
    }

    async restoreMessagesBySender(senderId: string): Promise<void> {
        await this.db.Message.restore({ where: { senderId } });
    }
}

export default MessagesRepository;
