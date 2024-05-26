# Ethereum ATM Contract

This Ethereum smart contract simulates an ATM (Automated Teller Machine) functionality, allowing users to deposit, withdraw, and manage their ETH (Ethereum) balance.

## Features

- **Deposit**: Users can deposit ETH into their account.
- **Withdraw**: Users can withdraw ETH from their account.
- **Maintain Minimum Balance**: The contract ensures that users always maintain a minimum balance of 1 ETH in their account.

## Getting Started

After cloning the GitHub repository, follow these steps to get the code running on your computer:

1. **Install Dependencies**: Inside the project directory, open your terminal and run the following command to install dependencies: npm i


2. **Start Local Ethereum Network**: Open two additional terminals in your VS Code. In the second terminal, start a local Ethereum network using Hardhat by running: npx hardhat node
   
3. **Deploy the Contract**: In the third terminal, deploy the smart contract to the local network by running: npx hardhat run --network localhost scripts/deploy.js

4. **Launch the Frontend**: Back in the first terminal, start the front-end by running: npm run dev
   
After completing these steps, the project will be running on your localhost, typically at [http://localhost:3000/](http://localhost:3000/). You can now interact with the Ethereum ATM contract through the provided interface.

## Author

Alexander Yeoj B. Bombais
8202636

## License

This project is licensed under the [MIT License](LICENSE).





