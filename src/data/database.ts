import { Sequelize } from 'sequelize';

import config from '../config';
import { initDatabase } from './models';

const sequelize = new Sequelize(config.databaseUrl, {
    define: {
        freezeTableName: true,
    },
    logging: false,
});

const database = initDatabase(sequelize);

export default database;
