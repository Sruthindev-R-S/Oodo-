const { EntitySchema } = require('typeorm');
const argon2 = require('argon2');

class User {
  async verifyPassword(password) {
    return argon2.verify(this.password, password);
  }
}

module.exports = new EntitySchema({
  name: 'User',
  target: User,
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    username: {
      type: 'varchar',
      unique: true,
      nullable: false
    },
    password: {
      type: 'varchar',
      nullable: false
    },
    role: {
      type: 'varchar',
      nullable: false,
      default: 'Dispatcher'
    }
  }
});
