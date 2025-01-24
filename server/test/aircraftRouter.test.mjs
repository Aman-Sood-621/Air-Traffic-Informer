import request from 'supertest';
import { describe, beforeEach, it, afterEach } from 'mocha';

import { expect } from 'chai';
import sinon from 'sinon';
import app from '../app.mjs';
import { db } from '../db/db.mjs';
import dotenv from 'dotenv';

dotenv.config(); 

describe('GET /api/aircraft/registration/:registration', function() {
  const mockAircraftData = {
    icao24: '4077ca',
    built: null,
    categoryDescription: null,
    country: 'United States',
    engines: null,
    firstFlight: null,
    icaoAircraft: null,
    manufacturer: null,
    model: 'Max Holst',
    operator: '',
    operatorIcao: '',
    owner: null,
    registration: 'G-TNUP'
  };
  
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(db, 'connect').resolves();
    sandbox.stub(db, 'findQuery').resolves([mockAircraftData]);
    sandbox.stub(db, 'close').resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const registration = 'G-TNUP';

  it('should respond with status code 200', async () => {
    const response = await request(app).get(`/api/aircraft/registration/${registration}`);
    expect(response.status).to.equal(200);
  });

  it('should respond with application/json content type', async () => {
    const response = await request(app).get(`/api/aircraft/registration/${registration}`);
    expect(response.type).to.equal('application/json');
  });

  it('should contain all fields for the aircraft', async () => {
    const response = await request(app).get(`/api/aircraft/registration/${registration}`);
    expect(response.body[0]).to.deep.include(mockAircraftData);
  });

  it('should return the correct registration value', async () => {
    const response = await request(app).get(`/api/aircraft/registration/${registration}`);
    expect(response.body[0]).to.have.property('registration', 'G-TNUP');
  });

  it('should return status code 404 for a non-existent registration', async () => {
    await db.findQuery.resolves([]);
    const response = await request(app).get('/api/aircraft/registration/INVALID');
    expect(response.status).to.equal(404);
  });

  it('should return an error message for a non-existent registration', async () => {
    await db.findQuery.resolves([]);
    const response = await request(app).get('/api/aircraft/registration/INVALID');
    expect(response.body.error).to.contain('No aircraft found for the specified registration');
  });
});