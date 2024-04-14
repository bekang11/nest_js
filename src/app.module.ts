import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '12345',
      database: 'task',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}

// export const appModule = [
//   {
//     provide: 'APP_MODULE',
//     useFactory: async () => {
//       const appModule = new AppModule({
//         type: 'mysql',
//         host: 'localhost',
//         port: 3306,
//         username: 'root',
//         password: 'root',
//         database: 'test',
//         synchronize: true,
//       });

//       return appModule.initialize();
//     },
//   },
// ];
// export class AppModule {}
