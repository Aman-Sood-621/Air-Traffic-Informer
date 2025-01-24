// test/seed.test.mjs
/* eslint-disable camelcase */

import { describe, beforeEach, afterEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { db } from '../db/db.mjs'; 
import seed from './modules/mockSeed.mjs'; 

describe(`Seed script testing.`, () => {
  let dbConnectStub;
  let dbCreateManyStub;
  let dbCloseStub;

  beforeEach(() => {
    // Stub db methods
    dbConnectStub = sinon.stub(db, 'connect').resolves();
    dbCreateManyStub = sinon.stub(db, 'createMany').resolves(5); 
    dbCloseStub = sinon.stub(db, 'close').resolves();
    
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should seed the database with flights, aircrafts, and airports', async () => {
    const readFlightsStub = sinon.stub().
      resolves([{ id: 1, carrier_code: 'F9' }, { id: 2, carrier_code: 'AA' }]);
    const readAircraftsStub = sinon.stub().resolves([{ id: 1, model: 'Boeing 737' }]);
    const readAirportsStub = sinon.stub().resolves([{ id: 1, name: 'JFK' }]);


    await seed(readFlightsStub, readAircraftsStub, readAirportsStub);

    // Assert: Verify that the database operations were called
    expect(dbConnectStub.calledThrice).to.be.true; 
    expect(dbCreateManyStub.calledThrice).to.be.true; 
    expect(dbCloseStub.calledOnce).to.be.true; 
  });
  it('should handle errors during seeding', async () => {
    const readFlightsStub = sinon.stub().rejects(new Error('Error reading flights'));
    const readAircraftsStub = sinon.stub().resolves([{ id: 1, model: 'Boeing 737' }]);
    const readAirportsStub = sinon.stub().resolves([{ id: 1, name: 'JFK' }]);
    const thrownFunction = sinon.spy();
  
    await seed(readFlightsStub, readAircraftsStub, readAirportsStub, thrownFunction);
  
    expect(thrownFunction.calledOnce).to.be.true; 
    expect(dbCloseStub.calledOnce).to.be.true; 
    expect(dbConnectStub.called).to.be.false; 
    expect(dbCreateManyStub.called).to.be.false; 
  });
});
