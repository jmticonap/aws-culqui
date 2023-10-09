import { describe, expect, test } from '@jest/globals';
import Validator from '../../../src/utils/validator';
import { CardType } from '../../../src/types';

describe('Validator', () => {
    test('Requieres fields: complete', () => {
        const incomingData = {
            email: '',
            card_number: 1231231231231233,
            cvv: 123,
            expiration_year: '2025',
            expiration_month: '09',
        } as CardType;
        const validator = new Validator();
        validator.requireds(incomingData, [{ field: 'email', errorMessage: '' }]);

        expect(validator.getError()).toBeFalsy();
    });

    test('Requieres fields: incomplete', () => {
        const incomingData = {
            email: '',
            card_number: 1231231231231233,
            cvv: 123,
            expiration_year: '2025',
        } as CardType;
        const validator = new Validator();
        validator.requireds(incomingData, [{ field: 'expiration_month', errorMessage: '' }]);

        expect(validator.getError()).toBeTruthy();
    });

    test('Validate email: valid', () => {
        const validator = new Validator();
        validator.setValue('qwerqwerq@gmail.com');

        validator.email(null);
        expect(validator.getError()).toBeFalsy();
    });

    test('Validate email: invalid', () => {
        const validator = new Validator();
        validator.setValue('qwerqwerqgmail.com');

        validator.email(null);
        expect(validator.getError()).toBeTruthy();
    });

    test('Validate email: minLength', () => {
        const validator = new Validator();
        validator.setValue('a@gmail.com').minLength(5, null);
        expect(validator.getError()).toBeFalsy();
    });

    test('Validate email: maxLength', () => {
        const validator = new Validator();
        validator.setValue('a@gmail.com').maxLength(10, null);
        // Lenghth: 11, por lo tanto si hay error y recivimos un truthy.
        expect(validator.getError()).toBeTruthy();
    });

    test('Validate card number: cardValid', () => {
        const validator = new Validator();
        validator.setValue(4532015112830366).cardValid(null);
        //Numero válido de tarjeta por lo tango se retorna un falsy.
        expect(validator.getError()).toBeFalsy();
    });

    test('Validate greather than; gt', () => {
        const validator = new Validator();
        validator.setValue(11).gt(11, null);
        // (11 > 11) valor de verdad falso, por tanto si tenemos error (truthy)
        expect(validator.getError()).toBeTruthy();
    });

    test('Validate greather than or equal; gte', () => {
        const validator = new Validator();
        validator.setValue(11).gte(11, null);
        // (11 >= 11) valor de verdad verdadero, por tanto no tenemos error (falsy)
        expect(validator.getError()).toBeFalsy();
    });
});
