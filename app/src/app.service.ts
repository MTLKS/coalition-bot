import { HttpService } from '@nestjs/axios';
import { Injectable, Request } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { clientId, clientSecret } from '../config.json';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}
  
  private server: any;

  async setServer(server: any) {
    this.server = server;
  }

  async getCode(@Request() request: any): Promise<string> {
    console.log(request.query.code);
    console.log(request.cookies['id']);
    let { data } = await firstValueFrom(this.httpService.post('https://api.intra.42.fr/oauth/token', {
      'grant_type': 'authorization_code',
      'client_id': clientId,
      'client_secret': clientSecret,
      'code': request.query.code,
      'redirect_uri': 'http://mtlks.com'
    }));
    console.log(data.access_token);
    let userResponse = await firstValueFrom(this.httpService.get('https://api.intra.42.fr/v2/me', { headers: { Authorization: `Bearer ${data.access_token}` } }));
    console.log(userResponse.data.id);
    let coalitionResponse = await firstValueFrom(this.httpService.get(`https://api.intra.42.fr/v2/users/${userResponse.data.id}/coalitions`, { headers: { Authorization: `Bearer ${data.access_token}` } }));
    console.log(coalitionResponse.data[0].name);
    this.server.emit('addRole', {
      'id': request.cookies['id'],
      'coalition': coalitionResponse.data[0].name
    });
    return 'All set!';
  }
}
