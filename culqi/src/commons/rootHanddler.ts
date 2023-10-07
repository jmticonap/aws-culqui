import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const rootHandler =
    (controller: (event: APIGatewayProxyEvent) => void) =>
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try {
            const response: APIGatewayProxyResult = {
                statusCode: 200,
                body: JSON.stringify(event.body),
            };

            return response;
        } catch (error) {
            const response: APIGatewayProxyResult = {
                statusCode: 200,
                body: JSON.stringify({}),
            };

            return response;
        }
    };
