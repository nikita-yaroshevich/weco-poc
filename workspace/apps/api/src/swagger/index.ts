import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
// import * as fsExtra from 'fs-extra';

export default function applySwagger(app: any) {
    const options = new DocumentBuilder()
        .setTitle('WeCo API')
        .setDescription(`The World's greatest API ever!`)
        .setVersion('0.1')
        // .addBearerAuth()
        // .setSchemes('http', 'https')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    const jsonDir = `${__dirname}`;
    // fsExtra.ensureDir(jsonDir);
    fs.writeFileSync(`${jsonDir}/swagger-spec.json`, JSON.stringify(document));
    SwaggerModule.setup('api-docs', app, document);
}
