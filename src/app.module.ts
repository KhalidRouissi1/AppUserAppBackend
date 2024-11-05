import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthGuard } from 'guards/auth.guard';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { join } from 'path';


@Module({
  imports: [ConfigModule.forRoot(), 
    UserModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        // transport: config.get('EMAIL_TRANSPORT'),
        transport: {
          host: config.get('EMAIL_HOST'),
          port: config.get('PORT'),
          secure: false,
          auth: {
            user: config.get('EMAIL_USER'),
            pass: config.get('EMAIL_PASS'),
          },
        },
        defaults: {
          from: `<${config.get('EMAIL_USER')}>`,
        },
        template: {
          dir: join(__dirname, 'src/templates/email'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
})
export class AppModule {}
