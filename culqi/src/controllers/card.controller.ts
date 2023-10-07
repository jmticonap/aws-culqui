import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import TokenService from '../services/token.service';
import { CardResType, CardType, CredentialType } from '../types';
import Validator from '../utils/validator';
import redisCli from '../database/redis';

export default class CardController {
    static async saveCard(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        const requiredFieldError = (field: string) => `El campo "${field}" es requerido.`;
        try {
            const headers = event.headers;
            const bearerToken = headers ? headers['Authorization'] : undefined;
            if (!bearerToken) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        error: "Pk it's not present",
                    }),
                };
            }
            const clientToken = bearerToken ? bearerToken.substring(7) : undefined;
            if (!clientToken) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        error: 'Pk invalid',
                    }),
                };
            } else {
                console.log("Pk it's there.");
            }

            const body = event.body;
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

            const service = new TokenService();
            const card = {
                tokenKey: service.tokenising(),
                cardBody: JSON.parse(body),
            } as CredentialType;
            const token = await service.signing(card);

            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            };
        } catch (err) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: 'Some error',
                }),
            };
        }
    }

    static async getCard(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        try {
            if (!event.queryStringParameters || !event.queryStringParameters.token) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        error: "It's no token in the request",
                    }),
                };
            }
            const token: string = event.queryStringParameters.token;
            const service = new TokenService();
            const card = await service.getCardByToken(token);
            const cardRes = {
                email: card.cardBody.email,
                card_number: card.cardBody.card_number,
                expiration_year: card.cardBody.expiration_year,
                expiration_month: card.cardBody.expiration_month,
            } as CardResType;

            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cardRes),
            };
        } catch (err) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'some error happened',
                }),
            };
        }
    }
}
