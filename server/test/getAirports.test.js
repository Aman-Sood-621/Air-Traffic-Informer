/* eslint-disable no-undef */
/* eslint-disable camelcase */
import { expect } from 'chai';
import 'dotenv/config';
import sinon from 'sinon';
import request from 'supertest';
import app from '../app.mjs';
import { db } from '../db/db.mjs';



const stub = sinon.stub(db, 'QueryAllAirports');
const dummyData = [
  { local_code: 'ABC', name: 'Airport A', latitude_deg: 12.34, longitude_deg: 56.78 },
  { local_code: 'XYZ', name: 'Airport B', latitude_deg: 23.45, longitude_deg: 67.89 }
];

const formatedData = {
  data: [
    {
      local_code: 'ABC',
      name: 'Airport A',
      latitude_deg: 12.34,
      longitude_deg: 56.78,
      url: '/airport/ABC'
    },
    {
      local_code: 'XYZ',
      name: 'Airport B',
      latitude_deg: 23.45,
      longitude_deg: 67.89,
      url: '/airport/XYZ'
    },
  ]
};

describe('GET /api/airports', () => {

  it('should return a list of airports with URLs in the correct format', async () => {
    stub.resolves(dummyData);
    const res = await request(app).get('/api/airports');

    expect(res.statusCode).to.equal(200);
    expect(res.body.data[0].name).to.equal(formatedData.data[0].name);
    expect(res.type).to.equal('application/json');
  });

  it('should return 404 if no airports are found', async () => {
    stub.resolves([]);
    const res = await request(app).get('/api/airports');

    expect(res.statusCode).to.equal(404);
    expect(res.body).to.deep.equal({ error: 'No airports found' });
  });

});
