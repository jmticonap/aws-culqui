import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import CardController from './src/controllers/card.controller';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const saveCardHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return CardController.saveCard(event);
};

export const getCardHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return CardController.getCard(event);
};
