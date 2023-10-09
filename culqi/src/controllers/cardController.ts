import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import CardService from '../services/cardService';
import { CardResType, CredentialType } from '../types';
import { createToken } from '../utils/token';

export default class CardController {
    static async saveCard(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        try {
            const tokenService = new CardService();

            const headers = event.headers;
            const resultPkValidatiom = tokenService.validatePk(headers);
            if (resultPkValidatiom) return resultPkValidatiom;

            const body = event.body;
            const resultBodyValidation = tokenService.validateBody(body);
            if (resultBodyValidation) return resultBodyValidation as APIGatewayProxyResult;

            const card = {
                tokenKey: createToken(),
                cardBody: JSON.parse(String(body)),
            } as CredentialType;
            const token = await tokenService.saveCard(card);

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
            const tokenService = new CardService();

            const headers = event.headers;
            const resultPkValidatiom = tokenService.validatePk(headers);
            if (resultPkValidatiom) return resultPkValidatiom;

            if (!event?.queryStringParameters?.token) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        error: "It's no token in the request",
                    }),
                };
            }
            const token: string = event.queryStringParameters.token;
            const card = await tokenService.getCardByToken(token);
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
