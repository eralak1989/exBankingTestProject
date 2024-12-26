# Javascript + Protobuf API Application and Test Automation framework
This repository includes modules for gRPC and test automation.

<h3> Getting Started </h3>
Here are the prerequisites you need to setup. 

<b>Used for all the modules:</b>
	- NodeJS
	- Google Protobuf
	- Mocha
	- Chai
	- ghz


<h3> Dependencies </h3>
Dependencies used for the project with the versions

	- Google-protobuf: 3.21.4
	- NodeJS: v22.12.0
	- grpc-js: 1.12.5
	- proto-loader: 0.7.13
	- chai: 5.1.2
	- mocha: 11.0.1

<h3> Environment Configurations </h3>
Environment variables to be setup:

	- NVM_HOME
	- NVM_SYMLINK
	- Add bin paths to 'Path' of .protoc

Run following commands to see if the configurations are set.

```Windows Powershell

# Check version of all node modules
	-npm list google-protobuf grpc-js @grpc/proto-loader chai mocha --depth=0

# Check version of ghz performance test tool
	-ghz --version

# Check version of protobuf
	protoc --version

# Check mocha and chai versions
	-npm list mocha --depth=0
	-npm list chai --depth=0

```

<h3> Reporting </h3>

	ghz performance reports integrated with json. Report can be seen in \BankingSystem1\Tests\Performance_Test\result.json file.

```Powershell

# Install Node package manager
	-nvm install lts
	-nvm use lts

#Install the required libraries for gRPC and Protobuf
	-npm install @grpc/proto-loader grpc
	-npm install express grpc @grpc/proto-loader
	-npm install grpc @grpc/proto-loader express body-parser

#Initialize the project
	-yarn init -y

# Install mocha
	-npm install --save-dev mocha

# Install ghz
	-npm install -g ghz

```

<h3> Setting up the project </h3>

1.Install NVM and NodeJS.
2.Download protobuf compiler and extract the .exe file to Windows/systen32 folder.
3.Setup environment variables for proto file.
4.Setup server, client and protobuf files.
5.initialize the project using yarn init -y
6.Install ghz for performance testing.
7.Install Visual Studio code and install extensions below.
	-ext install grpc/grpc-tools
	-ext install alefragnani.protobuf-language-support
	-ext install esbenp.prettier-vscode
	-ext install dbaeumer.vscode-eslint
8.Install mocha and chai for testing.

If the initial configurations and prerequisites are done, you can execute  the API tests. </br>

How to run the files

1 Run Server and client to verify protobuf api is working.

	i)Open a terminal and run Server. [Powershell command: node server.js]
	ii)Open another terminal and run Client. [Powershell command: node client.js]
	iii)Results can be seen in client terminal.

2. Run Performance Test

	i)Open a terminal and run Server. [Powershell command: node server.js]
	ii)Go to the ghz installed location and execute the command.

		ghz.exe --insecure --proto <path to .proto file> --call banking.BankingService.Deposit --data "{\"user_id\": \"user1\", \"amount\": 10}" --duration 30s --concurrency 100 --output <path to json output file> 0.0.0.0:50051

		Example: ghz.exe --insecure --proto C:\Users\Eranga\Desktop\BankingSystem1\proto\banking.proto --call banking.BankingService.Deposit --data "{\"user_id\": \"user1\", \"amount\": 10}" --duration 30s --concurrency 100 --output C:\Users\Eranga\Desktop\BankingSystem1\Tests\Performance_Test\result.json 0.0.0.0:50051

	iii)Observe the results.json file.
	
3. Run the mock services.
	i)Stop all running servers.
	ii)Open a terminal and run mock Server. [Powershell command: node mockServer.js]
	iii)Open another terminal and run mock tests. [Powershell command:  npx mocha mocktest.js]
	
4. Run Functional Automation tests

	i)Open a terminal and run Server. [Powershell command: node server.js]
	ii)Open another terminal and run Client. [Powershell command: npm test]
	iii)Results can be seen in server and client terminals


## Related Links

	[NodeJS](https://nodejs.org/en)
	[NVM for Windows] (https://github.com/coreybutler/nvm-windows/releases)
	[Protobuf] (https://github.com/protocolbuffers/protobuf/releases)
	[ghz] https://github.com/bojand/ghz

Reefrences:

	https://www.youtube.com/watch?v=0cxEVcALoxc