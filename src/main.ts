import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as firebaseAdmin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
    .setTitle('User Authentication')
    .setDescription(
      'The API details for the User Authentication Demo application using Firebase in the NestJS backend.',
    )
    .setVersion('1.0')
    .addTag('Authentication')
    .addBearerAuth()
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

//firebase ;
const firebaseKeyFilePath = path.join(__dirname, '..', '/src/firebaseCredential.json'); // Adjust this based on your structure
const firebaseServiceAccount /*: ServiceAccount*/ = JSON.parse(
fs.readFileSync(firebaseKeyFilePath).toString(),
);
if (firebaseAdmin.apps.length === 0) {
console.log('Initialize Firebase Application.');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
});
}

  await app.listen(3000);
}
bootstrap();
