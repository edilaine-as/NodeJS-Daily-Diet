import bcrypt from 'bcrypt'

export async function comparePasswordHash(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}
