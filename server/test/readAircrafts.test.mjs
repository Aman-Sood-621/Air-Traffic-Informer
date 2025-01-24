import { describe, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { promises as fs } from 'fs';
import readAircraft from './modules/readAircrafts.mjs';

describe('readAircraft', () => {
  it('should correctly parse the CSV file and return aircraft data', async () => {
    const data = await readAircraft();
    const expectedData = [
      {
        icao24: 'aacdfa',
        built: '\'1964-01-01\'',
        categoryDescription: '\'\'',
        country: 'United States',
        engines: 'LYCOMING O&VO-360 SER',
        firstFlightDate: null,
        icaoAircraftClass: 'L1P',
        manufacturerName: 'Piper',
        model: 'PA-28-180',
        operator: '\'\'',
        operatorIcao: '\'\'',
        owner: 'Hagenseker James S',
        registration: 'N7957W'
      },
      {
        icao24: 'aacdfb',
        built: '\'1961-01-01\'',
        categoryDescription: '\'\'',
        country: 'United States',
        engines: 'CONT MOTOR 0-300 SER',
        firstFlightDate: null,
        icaoAircraftClass: 'L1P',
        manufacturerName: 'Cessna',
        model: '\'172B\'',
        operator: '\'\'',
        operatorIcao: '\'\'',
        owner: 'Roderick Ashley T Jr',
        registration: 'N7957X'
      }
    ];

    expect(data).to.deep.equal(expectedData);
  });

  it('should throw an error if the file cannot be read', async () => {
    sinon.stub(fs, 'readFile').rejects(new Error('File read error'));
    try {
      await readAircraft();
      throw new Error('Expected readAircraft to throw an error');
    } catch (error) {
      expect(error.message).to.equal('File read error');
    } finally {
      sinon.restore();
    }
  });
});
