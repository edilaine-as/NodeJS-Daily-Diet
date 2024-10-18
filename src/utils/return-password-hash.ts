import bcrypt from 'bcrypt'

export const returnPasswordHash = async (password: string): Promise<string> => {
  const saltRounds = 10
  try {
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Error generating hash: ${err.message}`)
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      throw new Error('Error generating hash')
    }
  }
}
