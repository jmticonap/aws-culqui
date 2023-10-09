import { describe, expect, test, afterAll } from '@jest/globals';
import TokenService from '../../../src/services/token.service';
import redisClient from '../../../src/database/redis';

describe('Token', () => {
    afterAll(async () => {
        await redisClient.quit();
    });

    test('Generate token', () => {
        const tokenService = new TokenService();

        expect(tokenService.tokenising().length).toEqual(16);
    });
});
