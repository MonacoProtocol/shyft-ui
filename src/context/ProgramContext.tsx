import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';

import { DefaultAppSettings } from '@/config/settings';

interface ProgramContextProps {
  program: Program | null;
  loading: boolean;
  error: string | null;
  rpcNodeUrl: string;
  setRpcNodeUrl: React.Dispatch<React.SetStateAction<string>>;
  activeProgramAddress: string;
  setActiveProgramAddress: React.Dispatch<React.SetStateAction<string>>;
}

const ProgramContext = createContext<ProgramContextProps | undefined>(undefined);

type ProgramProviderProps = {
  children: ReactNode;
};

export const ProgramProvider: React.FC<ProgramProviderProps> = ({ children }) => {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rpcNodeUrl, setRpcNodeUrl] = useState(DefaultAppSettings.rpcNode);
  const [activeProgramAddress, setActiveProgramAddress] = useState(
    DefaultAppSettings.programAddress,
  );

  const wallet = useWallet();
  const connection = new Connection(rpcNodeUrl);

  useEffect(() => {
    const initializeProgram = async () => {
      try {
        const options = AnchorProvider.defaultOptions();
        options.preflightCommitment = 'confirmed';
        options.commitment = 'confirmed';
        const provider = new AnchorProvider(connection, wallet as unknown as Wallet, options);

        const protocolAddress = new PublicKey(activeProgramAddress);
        const [loadedProgram] = await Promise.all([Program.at(protocolAddress, provider)]);

        setProgram(loadedProgram);
        setError(null);
      } catch (e) {
        const thrownError = e as Error;
        setError(thrownError.message);
      } finally {
        setLoading(false);
      }
    };

    initializeProgram();
  }, [wallet.publicKey, rpcNodeUrl, activeProgramAddress]);

  return (
    <ProgramContext.Provider
      value={{
        program,
        loading,
        error,
        rpcNodeUrl,
        setRpcNodeUrl,
        activeProgramAddress,
        setActiveProgramAddress,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export const useProgram = (): ProgramContextProps => {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error('useProgram must be used within a ProgramProvider');
  } else {
    return context;
  }
};
