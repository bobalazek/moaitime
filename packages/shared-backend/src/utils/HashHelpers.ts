import bcrypt from 'bcryptjs';

export const generateHash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
};

export const compareHash = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
