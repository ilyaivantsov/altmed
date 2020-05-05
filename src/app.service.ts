import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) { }

  async makeReqToPython(data: any): Promise<any> {
    let ans = await this.httpService.axiosRef.post('http://localhost:8888/recognize', data);
    return ans;
  }
}
