/* eslint-disable prettier/prettier */
import { CredentialType } from '../types';
import redisCli from '../database/redis';
import { IncomingMessage } from 'node:http';
import { SetOptions } from 'redis';

const allowedDigits: Array<string> = [
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd',
    'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm',
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D',
    'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
];

export default class TokenService {
    tokenising(): string {
        let token = '';

        for (let i = 0; i < 16; i++) {
            token += allowedDigits[Math.round(Math.random() * (allowedDigits.length - 1))];
        }

        return token;
    }

    async signing(credential: CredentialType): Promise<string> {
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

    validatePk(req: IncomingMessage): string {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            const token = req.headers.authorization.substring(7);
            return token;
        } else {
            throw new Error('The pk is not present');
        }
    }
}
