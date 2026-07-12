const { dataSource, User } = require('../../../core/infrastructure/typeorm');
const argon2 = require('argon2');

const RegisterUser = async ({ username, password, role }) => {
  if (!username || !password) {
    const error = new Error('Username and password are required');
    error.status = 400;
    throw error;
  }

  const userRepository = dataSource.getRepository(User);

  // Check if user already exists
  const existingUser = await userRepository.findOne({ where: { username } });
  if (existingUser) {
    const error = new Error('Username is already taken');
    error.status = 400;
    throw error;
  }

  // Validate role if provided
  const allowedRoles = ['Admin', 'Dispatcher', 'Driver'];
  const userRole = role || 'Dispatcher';
  if (!allowedRoles.includes(userRole)) {
    const error = new Error(`Invalid role. Allowed roles are: ${allowedRoles.join(', ')}`);
    error.status = 400;
    throw error;
  }

  // Hash password
  const hashedPassword = await argon2.hash(password);

  // Create entity instance
  const user = userRepository.create({
    username,
    password: hashedPassword,
    role: userRole
  });

  // Save to DB (triggers beforeInsert hook)
  await userRepository.save(user);

  // Exclude password from returned JSON
  const userJson = { ...user };
  delete userJson.password;
  return userJson;
};

module.exports = RegisterUser;
