/* eslint-disable camelcase */

import { describe, beforeEach, it, afterEach } from 'mocha';
import 'dotenv/config';
import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import { db } from '../db/db.mjs'; 
import app from '../app.mjs';

describe('GET /api/flights/:airport_code/:direction/:min_date/:max_date', () => {
  const mockFlightData = [
    {
      _id: '671f8fc4f33894322c7c01ae',
      carrier_code: 'WN',
      flight_number: 783,
      origin_airport: 'SLC',
      destination_airport: 'LAX',
      tail_number: 'N7889A',
      day: 1,
      weekday: 2,
      actual_departure_dt: '2019-05-01 5:18',
      actual_arrival_dt: '2019-05-01 6:08',
    },
    {
      _id: '671f8fc4f33894322c7c01ef',
      carrier_code: 'UA',
      flight_number: 5119,
      origin_airport: 'SGU',
      destination_airport: 'LAX',
      tail_number: 'N933EV',
      day: 1,
      weekday: 2,
      actual_departure_dt: '2019-05-01 5:50',
      actual_arrival_dt: '2019-05-01 6:15',
    }
  ];

  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(db, 'connect').resolves();
    sandbox.stub(db, 'findQuery').resolves(mockFlightData);
    sandbox.stub(db, 'close').resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should respond with status code 200', async () => {
    const response = await request(app).get('/api/flights/LAX/inbound/1/31');
    expect(response.statusCode).to.equal(200);
  });

  it('should respond with application/json content type', async () => {
    const response = await request(app).get('/api/flights/LAX/inbound/1/31');
    expect(response.type).to.equal('application/json');
  });

  it('should return 400 for invalid direction', async () => {
    const response = await request(app).get('/api/flights/LAX/invalid_direction/1/31');
    expect(response.status).to.equal(400);
    // Check if the error message is as expected
    expect(response.body.message).to.contain(`It must be either 'inbound' or 'outbound'.`);
  });

  it('should return 400 for invalid date range', async () => {
    const response = await request(app).get('/api/flights/LAX/inbound/32/31');
    expect(response.status).to.equal(400);
    // Check if the error message is as expected
    expect(response.body.message).to.contain('Invalid query parameters.');
  });

  it('should return 400 for invalid IATA code', async () => {
    const response = await request(app).get('/api/flights/invalid_code/inbound/10/14');
    expect(response.status).to.equal(400);
    // Check if the error message is as expected
    expect(response.body.message).to.contain('Invalid airport_code format');
  });
});