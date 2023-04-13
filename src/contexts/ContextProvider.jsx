import { createContext, Dispatch, SetStateAction, useState, useContext } from 'react';

// type Props = {
//     children: React.ReactNode;
// };

// export const injectedConnector = new InjectedConnector({
//     supportedChainIds: [
//         4, // Rinkeby
//     ],
// })

// const { REACT_APP_ALCHEMY_RPC } = process.env;

// export type AssetTvlType = {
//     [key: string]: string
// }

// export type ContextProviderType = {
//     account: string;
//     setAccount: Dispatch<SetStateAction<string>>;
//     activePage: string;
//     setActivePage: Dispatch<SetStateAction<string>>;
//     openClaimModal: boolean;
//     setOpenClaimModal: Dispatch<SetStateAction<boolean>>;
//     openModal: boolean;
//     setOpenModal: Dispatch<SetStateAction<boolean>>;
//     openSupplyModal: null | string;
//     setOpenSupplyModal: Dispatch<SetStateAction<null | string>>;
//     fixedModal: boolean;
//     setFixedModal: Dispatch<SetStateAction<boolean>>;
//     openMenu: null | string;
//     setOpenMenu: Dispatch<SetStateAction<null | string>>;
//     anchorMenuEl: null | HTMLElement;
//     setAnchorMenuEl: Dispatch<SetStateAction<null | HTMLElement>>;
//     assetSelected: null | string;
//     setAssetSelected: Dispatch<SetStateAction<null | string>>;
//     modalTitle: string;
//     setModalTitle: Dispatch<SetStateAction<string>>;
//     modalDescription: string;
//     setModalDescription: Dispatch<SetStateAction<string>>;
//     signer: null | JsonRpcSigner;
//     setSigner: Dispatch<SetStateAction<null | JsonRpcSigner>>;
//     tokenTVLs: null | AssetTvlType;
//     setTokenTVLs: Dispatch<SetStateAction<null | AssetTvlType>>;
//     maxSupply: string;
//     setMaxSupply: Dispatch<SetStateAction<string>>;
//     totalTVL: number;
//     setTotalTVL: Dispatch<SetStateAction<number>>;
//     totalUserBalance: number;
//     setTotalUserBalance: Dispatch<SetStateAction<number>>;
//     userTokenBalance: string;
//     setUserTokenBalance: Dispatch<SetStateAction<string>>;
//     userTokenAllowance: string;
//     setUserTokenAllowance: Dispatch<SetStateAction<string>>;
//     modalType: string;
//     setModalType: Dispatch<SetStateAction<string>>;
//     operationCompleted: boolean;
//     setOperationCompleted: Dispatch<SetStateAction<boolean>>;
//     tokensToClaim: string;
//     setTokensToClaim: Dispatch<SetStateAction<string>>;
// };

const initialContext = {
    account: "",
    setAccount: () => {
        throw new Error('setAccount function must be overridden');
    },
};

const StateContext = createContext(initialContext);

// export const ethersProvider = new ethers.providers.JsonRpcProvider(REACT_APP_ALCHEMY_RPC);

export const ContextProvider = ({ children }) => {
    const [account, setAccount] = useState("");

    return (
        <StateContext.Provider value={{
            account, setAccount,
        }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);