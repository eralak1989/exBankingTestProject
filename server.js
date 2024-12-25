const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'proto', 'banking.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const bankingProto = grpc.loadPackageDefinition(packageDefinition).banking;

const users = {
  user1: { balance: 100 },
  user2: { balance: 200 },
  user3: { balance: 300 },
  user4: { balance: 400 },
};

//Function to handle user creation
const createUser = (call, callback) => {
  const { username, amount } = call.request;
  if (users[username]) {
    callback(null, { message: 'User already exists.' });
  } else {
    users[username] = { balance: amount };
    callback(null, { message: 'User created successfully.' });
  }
};

// Function to handle deposit
const deposit = (call, callback) => {
  const { username, amount } = call.request;
  if (users[username]) {
    users[username].balance += amount;
    callback(null, {  message: 'Deposit successful.', balance: users[username].balance});
  } else {
    callback(null, { message: 'User not found.' });
  }
};

// Function to handle withdrawal
const withdraw = (call, callback) => {
  const { username, amount } = call.request;
  if (users[username]) {
    if (users[username].balance >= amount) {
      users[username].balance -= amount;
      callback(null, { message: 'Withdraw successful.', balance: users[username].balance});
    } else {
      callback(null, { message: 'Insufficient funds.' });
    }
  } else {
    callback(null, { message: 'User not found.' });
  }
};

// Function to handle Get Balance
const getBalance = (call, callback) => {
  const { username } = call.request;
  if (users[username]) {
    callback(null, { message: `Account Balance for ${username} : `, balance: users[username].balance });
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      message: 'User not found.',
    });
  }
};

// Function to transfer funds between users
const send = (call, callback) => {
  const { from_username, to_username, amount } = call.request;
  console.log(`Request Received: from=${from_username}, to=${to_username}, amount=${amount}`);
  if (users[from_username] && users[to_username]) {
    if (users[from_username].balance >= amount) {
      users[from_username].balance -= amount;
      users[to_username].balance += amount;
      console.log(
        `Transfer Successful: from_balance=${users[from_username].balance}, to_balance=${users[to_username].balance}`
      );
      callback(null, {
        message: `Transfer successful. Transfered ${amount} : from  ${from_username} to ${to_username}`,
        from_balance: users[from_username].balance,
        to_balance: users[to_username].balance,
      });
    } else {
      console.log('Insufficient funds.');
      callback(null, { message: 'Insufficient funds.' });
    }
  } else {
    console.log('User not found.');
    callback(null, { message: 'User not found.' });
  }
};


const server = new grpc.Server();
server.addService(bankingProto.BankingService.service, {
  createUser,
  deposit,
  withdraw,
  getBalance,
  send,
});

const grpcPort = '50051';
server.bindAsync(`0.0.0.0:${grpcPort}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`gRPC server running on port ${grpcPort}`);
  server.start();
});

