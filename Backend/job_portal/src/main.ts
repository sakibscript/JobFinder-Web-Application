// import { RolesGuard } from './Auth/roles.guard';
// import { NestFactory, Reflector } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
//   app.enableCors({
//     origin: true,
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   });
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './Auth/jwt-auth.guard';
import { RolesGuard } from './Auth/roles.guard';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);

  app.useGlobalGuards(
    app.get(JwtAuthGuard), // ✅ Now available
    new RolesGuard(reflector),
  );

  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Serve /uploads statically
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { NestExpressApplication } from '@nestjs/platform-express'; // Needed for static files
// import { join } from 'path';
// import { Reflector } from '@nestjs/core';
// import { JwtAuthGuard } from './Auth/jwt-auth.guard';
// import { RolesGuard } from './Auth/roles.guard';

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule); // 👈 Update here
//   const reflector = app.get(Reflector);

//   app.useGlobalGuards(
//     app.get(JwtAuthGuard),
//     new RolesGuard(reflector),
//   );

//   app.enableCors({
//     origin: true,
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   });

//   // ✅ Serve static profile images
//   app.useStaticAssets(join(__dirname, '..', 'uploads/profile-images'), {
//     prefix: '/uploads/profile-images',
//   });

//   // ✅ Serve static resumes
//   app.useStaticAssets(join(__dirname, '..', 'uploads/resumes'), {
//     prefix: '/uploads/resumes',
//   });

//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();
