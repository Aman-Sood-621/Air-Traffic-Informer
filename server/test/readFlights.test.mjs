// test/readFlights.test.mjs
/* eslint-disable camelcase */
import { describe, it } from 'mocha';
import sinon from 'sinon';
import { promises as fs } from 'fs';
import { expect } from 'chai';
import readFlights from './modules/readFlights.mjs'; 

describe('readFlights', () => {
  it('should correctly parse the CSV file and return flight data', async () => {
    const data = await readFlights();
    const expectedData = [
      {
        carrier_code: 'AS',
        flight_number: 121,
        origin_airport: 'SEA',
        destination_airport: 'ANC',
        tail_number: 'N615AS',
        day: 1,
        weekday: 2,
        actual_departure_dt: '2019-05-01 0:32',
        actual_arrival_dt: '2019-05-01 2:59'
      },
      {
        carrier_code: 'F9',
        flight_number: 402,
        origin_airport: 'LAX',
        destination_airport: 'DEN',
        tail_number: 'N701FR',
        day: 1,
        weekday: 2,
        actual_departure_dt: '2019-05-01 1:16',
        actual_arrival_dt: '2019-05-01 4:22'
      },
      {
        carrier_code: 'F9',
        flight_number: 662,
        origin_airport: 'SFO',
        destination_airport: 'DEN',
        tail_number: 'N346FR',
        day: 1,
        weekday: 2,
        actual_departure_dt: '2019-05-01 1:34',
        actual_arrival_dt: '2019-05-01 4:55'
      }
    ];

    expect(data).to.deep.equal(expectedData);
  });
  it('should throw an error if the file cannot be read', async () => {
    // Stub fs.readFile to simulate a failure
    sinon.stub(fs, 'readFile').rejects(new Error('File read error'));
    try {
      await readFlights();
      throw new Error('Expected readFlights to throw an error');
    } catch (error) {
      // Check that the error message matches
      expect(error.message).to.equal('File read error');
    }
  });
});

