import { CredentialType } from '../types';
import redisCli from '../database/redis';
import { SetOptions } from 'redis';

export default class CardService {
    async saveCard(credential: CredentialType): Promise<string> {
        const options: SetOptions = {
            EX: 900,
        } as SetOptions;
        await redisCli.set(credential.tokenKey, JSON.stringify(credential), options);

        return new Promise<string>((resolve) => {
            resolve(credential.tokenKey);
        });
    }

    async getCardByToken(tokenKey: string): Promise<CredentialType> {
        const credentialString = await redisCli.get(tokenKey);

        return new Promise<CredentialType>((resolve, reject) => {
            if (credentialString) {
                const credential = JSON.parse(credentialString) as CredentialType;
                resolve(credential);
            } else {
                reject('No tokenKey found');
            }
        });
    }
}
