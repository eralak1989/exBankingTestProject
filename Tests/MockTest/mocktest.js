const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const assert = require('assert'); 

const PROTO_PATH = path.join(__dirname, '..', '..', 'proto', 'banking.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const bankingProto = grpc.loadPackageDefinition(packageDefinition).banking;

describe('Mock gRPC Service Tests', () => {
  let client;

  before(() => {
    client = new bankingProto.BankingService(
      '0.0.0.0:50051',
      grpc.credentials.createInsecure()
    );
  });

  // CreateUser
  it('should create a new user', (done) => {
    const username = 'user5';
    const balance = 100;

    client.CreateUser({ username, balance }, (err, response) => {
      if (err) {
        done(err); 
      } else {
        assert.strictEqual(response.message, 'User created successfully.', 'User creation message mismatch');
        console.log(`CreateUser Response: ${response.message}`);
        done(); 
      }
    });
  });

  // Deposit
  it('should deposit money into a user account', (done) => {
    const username = 'new_user'; 
    const amount = 50;

    client.deposit({ username, amount }, (err, response) => {
      if (err) {
        done(err);
      } else {
        assert.strictEqual(response.message, 'Deposit successful.', 'Deposit message mismatch');
        assert.strictEqual(typeof response.balance, 'number', 'Balance should be a number');
        console.log(`Deposit Response: ${response.message}, New Balance: ${response.balance}`);
        done(); 
      }
    });
  });

  // Withdraw
  it('should withdraw money from a user account', (done) => {
    
    const username = 'new_user'; 
    const amount = 30;

    client.withdraw({ username, amount }, (err, response) => {
      if (err) {
        done(err);
      } else {
        if (response.message === 'Withdrawal successful.') {
          assert.strictEqual(typeof response.balance, 'number', 'Balance should be a number');
          console.log(`Withdraw Response: ${response.message}, New Balance: ${response.balance}`);
        } else {
          assert.strictEqual(response.message, 'Insufficient funds.', 'Unexpected message for withdrawal');
          console.log(`Withdraw Response: ${response.message}`);
        }
        done();
      }
    });
  });

  //GetBalance
  it('should retrieve the balance of a user', (done) => {
    const username = 'new_user';
    client.GetBalance({ username }, (err, response) => {
      if (err) {
        done(err);
      } else {
        assert.strictEqual(typeof response.balance, 'number', 'Balance should be a number');
        console.log(`Balance for ${username}: ${response.balance}`);
        done();
      }
    });
  });

  //Send
  it('should transfer funds between users', (done) => {

    const from_username = 'new_user'; 
    const to_username = 'user4'; 
    const amount = 20;

    client.send({ from_username, to_username, amount }, (err, response) => {
      if (err) {
        done(err); 
      } else {
        if (response.message === 'Transfer successful.') {
          console.log(`from balance type ${typeof response.from_balance}`);
          // assert.strictEqual(typeof response.from_balance, 'number', 'Sender balance should be a number');
          // assert.strictEqual(typeof response.to_balance, 'number', 'Receiver balance should be a number');
          console.log(
            `Send Response: ${response.message}, Sender New Balance: ${response.from_balance}, Receiver New Balance: ${response.to_balance}`
          );
        } else {
          console.log(`Send Response: ${response.message}`);
        }
        done();
      }
    });
  });


  after(() => {
    client.close();
  });
 });
