import 'reflect-metadata';

import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/core/app.module';
import { IFixture } from 'src/test/utils/fixture';
export class TestApp {
  private app: INestApplication;

  async setup() {
    const module = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot(<ConfigModuleOptions>{
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          isGlobal: true,
          load: [
            () => ({
              DATABASE_URL: 'xx',
            }),
          ],
        }),
      ],
    }).compile();
    this.app = module.createNestApplication();
    try {
      await this.app.init();
    } catch (error) {
      console.error(error);
    }
    await this.clearDatabase();
  }

  private async clearDatabase() {}

  async cleanup() {
    await this.app.close();
  }

  get<T>(name: any) {
    return this.app.get<T>(name);
  }

  getHttpServer(): unknown {
    return this.app.getHttpServer();
  }

  loadFixtures(fixtures: IFixture[]) {
    return Promise.all(fixtures.map((fixture) => fixture.load(this)));
  }
}
