const { dataSource, User } = require('../../../core/infrastructure/typeorm');
const { signToken } = require('../../../config/jwt');

const LoginUser = async ({ username, password }) => {
  if (!username || !password) {
    const error = new Error('Username and password are required');
    error.status = 400;
    throw error;
  }

  const userRepository = dataSource.getRepository(User);

  const user = await userRepository.findOne({ where: { username } });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  // verifyPassword is a method defined on the User class mapped by EntitySchema
  const isPasswordValid = await user.verifyPassword(password);
  if (!isPasswordValid) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const token = signToken({
    id: user.id,
    username: user.username,
    role: user.role
  });

  return {
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    },
    token
  };
};

module.exports = LoginUser;
