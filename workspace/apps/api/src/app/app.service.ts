import { Injectable } from '@nestjs/common';
import { callTest } from '@weco/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: callTest() };
  }
}
