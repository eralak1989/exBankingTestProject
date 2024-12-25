const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'proto', 'banking.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const bankingProto = grpc.loadPackageDefinition(packageDefinition).banking;

const client = new bankingProto.BankingService(
  '0.0.0.0:50051',
  grpc.credentials.createInsecure()
);


client.CreateUser({ username: 'user5', balance: 500 }, (err, response) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('CreateUser Response:', response);
  }
});


client.deposit({ username: 'user1', amount: 50}, (error, response) => {
  if (!error) {
    console.log('Deposit Response:', response.message, 'New Balance:', response.balance);
  } else {
    console.error('Error:', error);
  }
});


client.withdraw({ username: 'user2', amount: 80 }, (error, response) => {
  if (!error) {
    console.log('Withdraw Response:', response.message, 'New Balance:', response.balance);
  } else {
    console.error('Error:', error);
  }
});


client.GetBalance({ username: 'user2' }, (err, response) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('GetBalance Response:', response);
  }
});


client.Send({ from_username: 'user3', to_username: 'user4', amount: 50 }, (error, response) => {
  if (!error) {
    console.log(
      'Send Response:',
      response.message,
      'Sender New Balance:',
      response.from_balance,
      'Receiver New Balance:',
      response.to_balance
    );
  } else {
    console.error('Error:', error);
  }
});


//=====================================================

// Test API
// client.CreateUser({ user_id: 'user1' }, (err, response) => {
//   if (err) {
//     console.error('Error:', err);
//   } else {
//     console.log('CreateUser Response:', response);

//     // Test the Deposit API after the user is created
//     client.deposit({ user_id: 'user1', amount: 100 }, (error, response) => {// change username
//       if (!error) {
//         console.log('Deposit Response:', response.message, 'New Balance:', response.balance);

//         // Test the Withdraw API after deposit
//         client.withdraw({ user_id: 'user1', amount: 50 }, (error, response) => {// change username
//           if (!error) {
//             console.log('Withdraw Response:', response.message, 'New Balance:', response.balance);

//             // Test GetBalance after withdrawal
//             client.GetBalance({ user_id: 'user1' }, (err, response) => {
//               if (err) {
//                 console.error('Error:', err);
//               } else {
//                 console.log('GetBalance Response:', response);

//                 // Test the Send API after balance check
//                 client.createUser({ user_id: 'user2' }, (err, response) => {
//                   if (!err) {
//                     console.log('CreateUser Response (Receiver):', response);

//                     client.send(
//                       { from_user_id: 'user1', to_user_id: 'user2', amount: 25 },// change from_username
//                       (error, response) => {
//                         if (!error) {
//                           console.log(
//                             'Send Response:',
//                             response.message,
//                             'Sender New Balance:',
//                             response.from_balance,
//                             'Receiver New Balance:',
//                             response.to_balance
//                           );
//                         } else {
//                           console.error('Error:', error);
//                         }
//                       }
//                     );
//                   } else {
//                     console.error('Error creating receiver:', err);
//                   }
//                 });
//               }
//             });
//           } else {
//             console.error('Error:', error);
//           }
//         });
//       } else {
//         console.error('Error:', error);
//       }
//     });
//   }
// });
//===============================================================================================================================



