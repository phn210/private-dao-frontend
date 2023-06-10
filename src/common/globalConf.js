import { providers } from "ethers";

export const addresses = {
  goerli: {
    Round2ContributionVerifier: "0x4D5a5d6704992A29FD0483B5267FD1c73132612b",
    FundingVerifierDim3: "0x916B8204dd038d3F6706272CE9e8f6D87c23Cbb6",
    VotingVerifierDim3: "0x1e5191dC71729AB5907B7971EAF062E2d9acdA92",
    TallyContributionVerifierDim3: "0x315FB9191fce81dd81E6602EC9496FCF124E5dBD",
    ResultVerifierDim3: "0xDF9D337B386cD511Ab9729a69b9E3AB23ab4Db54",
    PoseidonUnit2: "0x23364476F949d80210735331A956461211dB5629",
    Poseidon: "0x0911E33D589057fb088CEe21E20866F940f057f7",
    FundManager: "0x75861AB1b6bE866E6Dda0ced5F1B0a8DE0B969F6",
    DAOManager: "0x972Da9deCE723E9E0e716Aad7121c6A59C0FaBba",
    DKG: "0x93Ddcf2C8538827B15045c9e0261f4c040bCb34e",
  },
  sepolia: {
    Round2ContributionVerifier: "0x0204133D60c28d539802b8fa8b0D4b30f6D0Ca4A",
    FundingVerifierDim3: "0x109D82Fa17F773155668a5F34e9b40416ef5Cb45",
    VotingVerifierDim3: "0x8E73fA58138bA142b821A3f4A54c2a70d71445BB",
    TallyContributionVerifierDim3: "0x365b1ec961fd5DC748Bbb36fa5FF74294Ac23712",
    ResultVerifierDim3: "0xFe712985329d5683471F0eAb21D3C0E109bBA6D5",
    PoseidonUnit2: "0x802eC44fA784F2bac33725729AF22b07EEAddeF0",
    Poseidon: "0x8864267084CA3B080e9087EB5C8c7F8d552099a5",
    FundManager: "0x10B63428a53F16CB0DD28Cf755101ED18C7bE35B",
    DAOManager: "0xB605d7AD12a21100143077BbF1ACd16EfBA09cED",
    DKG: "0xF3Fb226e145A458b40e1C0e456d8C1F2516f9f24",
    QUEUE: "0x023f9e860789F1d7d5Ece2AF9F11a3834173449A"
  },
};

export const rpcProviders = {
  goerli: new providers.JsonRpcProvider(
    "https://ethereum-goerli.publicnode.com"
  ),
  sepolia: new providers.JsonRpcProvider("https://rpc.sepolia.org"),
};
