import { CardType, CredentialType } from '../types';
import redisCli from '../database/redis';
import { SetOptions } from 'redis';
import { APIGatewayProxyEventHeaders, APIGatewayProxyResult } from 'aws-lambda';
import Validator from '../utils/validator';

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

    validatePk(headers: APIGatewayProxyEventHeaders): APIGatewayProxyResult | null {
        let result: APIGatewayProxyResult;
        const bearerToken = headers ? headers['Authorization'] : undefined;
        if (!bearerToken) {
            result = {
                statusCode: 500,
                body: JSON.stringify({
                    error: "Pk it's not present",
                }),
            };
        }
        const clientToken = bearerToken ? bearerToken.substring(7) : undefined;
        if (!clientToken) {
            result = {
                statusCode: 500,
                body: JSON.stringify({
                    error: 'Pk invalid',
                }),
            };
        } else {
            console.log("Pk it's there.");
            return null;
        }
        return result;
    }

    validateBody(body: string | null) {
        const requiredFieldError = (field: string) => `El campo "${field}" es requerido.`;
        if (!body) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: "The body it's empty",
                }),
            };
        }
        const cardData: CardType = JSON.parse(body);

        const validator = new Validator();
        validator.requireds(cardData, [
            { field: 'email', errorMessage: requiredFieldError('email') },
            { field: 'card_number', errorMessage: requiredFieldError('card_number') },
            { field: 'cvv', errorMessage: requiredFieldError('cvv') },
            { field: 'expiration_year', errorMessage: requiredFieldError('expiration_year') },
            { field: 'expiration_month', errorMessage: requiredFieldError('expiration_month') },
        ]);
        if (validator.getError()) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: validator.getErrorMessage(),
                }),
            };
        }

        validator
            .setValue(cardData.email)
            .email('El email no se ajusta al requerimiento')
            .minLength(5, 'El email debe tener minimo 5 digitos')
            .maxLength(100, 'El email debe tener un máximo 100 digitos');
        validator
            .setValue(String(cardData.card_number))
            .minLength(13, 'EL numeor de tarjeta no puede tener nemos de 13 cifras')
            .maxLength(16, 'El numero de tarjeta no puede tener más de 16 digitos')
            .cardValid('El numero de tarjeta no es valido');
        validator
            .setValue(String(cardData.cvv))
            .minLength(3, 'EL cvv no puede tener nemos de 3 cifras')
            .maxLength(4, 'El cvv no puede tener más de 4 digitos');
        validator.setValue(cardData.expiration_year).isLength(4, 'EL año debe tener 4 cifras');
        validator
            .setValue(String(cardData.expiration_month))
            .gte(1, 'El mes no puede ser menor de 1')
            .lte(12, 'El mes no puede ser mayor a 12');

        if (validator.getError()) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: validator.getErrorMessage(),
                }),
            };
        }
    }
}
