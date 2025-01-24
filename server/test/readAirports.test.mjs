/* eslint-disable camelcase */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { promises as fs } from 'fs';
import readAirports from './modules/readAirports.mjs';

describe('readAirports', () => {
  it('should correctly parse the CSV file and return airport data', async () => {
    const data = await readAirports();
    const expectedData = [
      {
        id: 3632,
        ident: 'KLAX',
        type: 'large_airport',
        name: 'Los Angeles International Airport',
        latitude_deg: 33.942501,
        longitude_deg: -118.407997,
        elevation_ft: 125,
        continent: null,
        country_name: 'United States',
        iso_country: 'US',
        region_name: 'California',
        iso_region: 'US-CA',
        local_region: 'CA',
        municipality: 'Los Angeles',
        gps_code: 'KLAX',
        iata_code: 'LAX',
        local_code: 'LAX',
        home_link: 'https://www.flylax.com/',
        last_updated: new Date('2024-04-02T16:36:13.000Z'),
      },
      {
        id: 3754,
        ident: 'KORD',
        type: 'large_airport',
        name: 'Chicago O\'Hare International Airport',
        latitude_deg: 41.9786,
        longitude_deg: -87.9048,
        elevation_ft: 680,
        continent: null,
        country_name: 'United States',
        iso_country: 'US',
        region_name: 'Illinois',
        iso_region: 'US-IL',
        local_region: 'IL',
        municipality: 'Chicago',
        gps_code: 'KORD',
        iata_code: 'ORD',
        local_code: 'ORD',
        home_link: 'https://www.flychicago.com/ohare/home/pages/default.aspx',
        last_updated: new Date('2024-03-09T23:28:49.000Z')
      }
    ];

    expect(data).to.deep.equal(expectedData);
  });

  it('should throw an error if the file cannot be read', async () => {
    sinon.stub(fs, 'readFile').rejects(new Error('File read error'));
    try {
      await readAirports();
      throw new Error('Expected readAirports to throw an error');
    } catch (error) {
      expect(error.message).to.equal('File read error');
    } finally {
      fs.readFile.restore();
    }
  });
});
