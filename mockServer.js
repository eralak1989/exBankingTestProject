const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'proto', 'banking.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const bankingProto = grpc.loadPackageDefinition(packageDefinition).banking;

const mockResponses = require('./Tests/Mocktest/mockData.json');

// Mock implementations
const createUser = (call, callback) => {
  console.log('Mock createUser called with:', call.request);
  callback(null, mockResponses.createUser);
};

const deposit = (call, callback) => {
  console.log('Mock deposit called with:', call.request);
  callback(null, mockResponses.deposit);
};

const withdraw = (call, callback) => {
  console.log('Mock withdraw called with:', call.request);
  callback(null, mockResponses.withdraw);
};

const getBalance = (call, callback) => {
  console.log('Mock getBalance called with:', call.request);
  callback(null, mockResponses.getBalance);
};

const send = (call, callback) => {
  console.log('Mock send called with:', call.request);
  callback(null, mockResponses.send);
};

// Create mock gRPC server
const server = new grpc.Server();
server.addService(bankingProto.BankingService.service, {
  createUser,
  deposit,
  withdraw,
  getBalance,
  send,
});

const grpcPort = '50051';
server.bindAsync('0.0.0.0:' + grpcPort, grpc.ServerCredentials.createInsecure(), () => {
  console.log('Mock gRPC server running on port', grpcPort);
  server.start();
});
