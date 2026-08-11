import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: 'postgresql://yamgurumi:yamiadmin3123@localhost:5432/yamgurumi?schema=public',
  },
})