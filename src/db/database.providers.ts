import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> => {
      try {
        const connection = await mongoose.connect(
            'mongodb+srv://user123:uUWFZVkTxU3MaYNX@cluster0.6ggsm1q.mongodb.net/DB6?retryWrites=true&w=majority&authSource=admin&readPreference=primary'
        );
        console.log('Connected to MongoDB successfully');
        return connection;
      } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        throw err; // Важно: выбрасываем ошибку, чтобы система обработала её
      }
    },
  },
];
