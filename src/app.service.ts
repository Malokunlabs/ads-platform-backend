import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Malokun ads manager backend is running, enjoy and happy christmas!🤶🎄';
  }
}
