import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) { }

  joke(): any {
    return this.httpService.get('https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random').pipe(
      map(({ data }) => data)
    );
  }
}
