/* eslint-disable no-undef */
/* eslint-disable camelcase */
import { expect } from 'chai';
import 'dotenv/config';
import sinon from 'sinon';
import request from 'supertest';
import app from '../app.mjs';
import { db } from '../db/db.mjs';



describe('GET /api/airport/:localCode', () => {
  let stub;

  const dummyData = [
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
      last_updated: '2024-03-09T23:28:49.000+00:00'
    }
  ];
  
  beforeEach(() => {
    stub = sinon.stub(db, 'findQuery');
  });

  afterEach(() => {
    stub.restore();
  });

  it('should return a a single airports data in json', async () => {
    stub.resolves(dummyData);
    const res = await request(app).get('/api/airport/ORD');

    expect(res.statusCode).to.equal(200);
    expect(res.body[0].name).to.equal('Chicago O\'Hare International Airport');
    expect(res.type).to.equal('application/json');
  });

  it('should return 404 if no airport is found', async () => {
    stub.resolves({});
    const res = await request(app).get('/api/airport/123');

    expect(res.statusCode).to.equal(404);
    expect(res.body).to.deep.equal({ error: 'No airport found for the specified local code' });
  });

});