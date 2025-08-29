'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_rto_requests_ecom', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false
        // references: { model: 'tbl_ecom_orders', key: 'id' }, // 👈 add if you want FK relation
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      product: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_mode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pending_since: {
        type: Sequelize.STRING,
        allowNull: true
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_rto_requests_ecom');
  }
};
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_rto_requests_ecom', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false
        // references: { model: 'tbl_ecom_orders', key: 'id' }, // 👈 add if you want FK relation
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      product: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_mode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pending_since: {
        type: Sequelize.STRING,
        allowNull: true
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_rto_requests_ecom');
  }
};
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_rto_requests_ecom', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false
        // references: { model: 'tbl_ecom_orders', key: 'id' }, // 👈 add if you want FK relation
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      product: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_mode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pending_since: {
        type: Sequelize.STRING,
        allowNull: true
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_rto_requests_ecom');
  }
};
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_rto_requests_ecom', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false
        // references: { model: 'tbl_ecom_orders', key: 'id' }, // 👈 add if you want FK relation
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      product: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_mode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pending_since: {
        type: Sequelize.STRING,
        allowNull: true
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_rto_requests_ecom');
  }
};
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_rto_requests_ecom', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false
        // references: { model: 'tbl_ecom_orders', key: 'id' }, // 👈 add if you want FK relation
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      product: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_mode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pending_since: {
        type: Sequelize.STRING,
        allowNull: true
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_rto_requests_ecom');
  }
};
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_rto_requests_ecom', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false
        // references: { model: 'tbl_ecom_orders', key: 'id' }, // 👈 add if you want FK relation
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      product: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_mode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pending_since: {
        type: Sequelize.STRING,
        allowNull: true
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_rto_requests_ecom');
  }
};
