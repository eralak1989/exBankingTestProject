const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;

const PROTO_PATH = path.join(__dirname, '..', 'proto', 'banking.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const bankingProto = grpc.loadPackageDefinition(packageDefinition).banking;

const client = new bankingProto.BankingService(
  '0.0.0.0:50051',
  grpc.credentials.createInsecure()
);

describe('BankingService Tests', () => {

  it('should create a new user', (done) => {
    const request = { username: 'testuser1', balance: 100 };
    client.createUser(request, (err, response) => {
      expect(err).to.be.null;
      expect(response).to.have.property('message', 'User created successfully.');
      done();
    });
  });


  it('should deposit an amount to a user account', (done) => {
    const request = { username: 'user1', amount: 50 };
    client.deposit(request, (err, response) => {
      expect(err).to.be.null;
      expect(response).to.have.property('message', 'Deposit successful.');
      expect(response).to.have.property('balance').that.equals(150);
      done();
    });
  });


  it('should withdraw an amount from a user account', (done) => {
    const request = { username: 'user2', amount: 30 };
    client.withdraw(request, (err, response) => {
      expect(err).to.be.null;
      expect(response).to.have.property('message', 'Withdraw successful.');
      expect(response).to.have.property('balance').that.equals(170); 
      done();
    });
  });


  it('should retrieve the balance of a user', (done) => {
    const request = { username: 'user2' };
    client.getBalance(request, (err, response) => {
      expect(err).to.be.null;
      expect(response).to.have.property('balance').that.equals(170); 
      done();
    });
  });


  it('should transfer an amount between two users', (done) => {

    client.createUser({ username: 'user6', balance: 600}, (err, response) => {
      expect(err).to.be.null;
      expect(response).to.have.property('message', 'User created successfully.');

      const request = {
        from_username: 'user6',
        to_username: 'user4',
        amount: 50,
      };
      client.send(request, (err, response) => {
        expect(err).to.be.null;
        expect(response).to.have.property('message', 'Transfer successful.');
        expect(response).to.have.property('from_balance').that.equals(550); 
        expect(response).to.have.property('to_balance').that.equals(450); 
        done();
      });
    });
  });

  // Additional assertions
  it('should fail to retrieve balance for a non-existent user', (done) => {
    const request = { username: 'unknownUser' };
    client.getBalance(request, (err, response) => {
      expect(err).to.not.be.null;
      expect(err.code).to.equal(grpc.status.NOT_FOUND);
      expect(err.message).to.equal('User not found.');
      done();
    });
  });

  it('should fail to withdraw if balance is insufficient', (done) => {
    const request = { username: 'user1', amount: 800 };
    client.withdraw(request, (err, response) => {
      expect(err).to.be.null;
      expect(response).to.have.property('message', 'Insufficient funds.');
      done();
    });
  });


  it('should fail to transfer funds if a user does not exist', (done) => {
    const request = {
      from_username: 'user1',
      to_username: 'invalidUser',
      amount: 10,
    };
    client.send(request, (err, response) => {
      expect(err).to.be.null;
      expect(response).to.have.property('message', 'User not found.');
      done();
    });
  });
});
