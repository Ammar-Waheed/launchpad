const HDWalletProvider = require("@truffle/hdwallet-provider")
require("dotenv").config()

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    // contracts_build_directory: path.join(__dirname, "ABI"),
    networks: {
        sepolia: {
            provider: () =>
                new HDWalletProvider(process.env.MNEMONIC, process.env.SEPOLIA), // @param wallet priavte key, infura api key
            from: "0x79f553dcE43134F45ce87977f1a09Ad9B9A4D3Ea",
            network_id: 11155111, // sepolia's id
            gas: 8000000,
            gasPrice: 10000000000,
            timeoutBlocks: 3000
        },
        develop: {
            host: "127.0.0.1", // Localhost (default: none)
            port: 7545, // Standard Ethereum port (default: none)
            network_id: "5777"
        }
    },
    compilers: {
        solc: {
            version: "0.8.13" // Fetch exact version from solc-bin (default: truffle's version)
        }
    }
}
