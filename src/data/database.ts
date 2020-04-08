import { Sequelize } from 'sequelize';

import { initDatabase } from './models';
import config from '../config';

const sequelize = new Sequelize(config.databaseUrl, {
    define: {
        freezeTableName: true,
    },
    logging: false,
});

const database = initDatabase(sequelize);

export default database;
