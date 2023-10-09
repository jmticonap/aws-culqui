import { APIGatewayProxyEventHeaders, APIGatewayProxyResult } from 'aws-lambda';

export default class PkService {
    validate(headers: APIGatewayProxyEventHeaders): APIGatewayProxyResult | null {
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
}
