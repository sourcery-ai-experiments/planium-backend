"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.setGlobalPrefix('api', {
        exclude: [{ path: 'health-status', method: common_1.RequestMethod.GET }],
    });
    const configService = app.get(config_1.ConfigService);
    const port = process.env.PORT || configService.get('PORT');
    await app.listen(port);
    console.log(`Applications is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map