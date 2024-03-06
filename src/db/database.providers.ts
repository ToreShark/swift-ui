import * as mongoose from 'mongoose';

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: (): Promise<typeof mongoose> =>
            mongoose.connect('mongodb+srv://new_user_blya:2AKHOE1lpZYSoPru@cluster0.lgtepjy.mongodb.net/?retryWrites=true&w=majority'),
    },
];