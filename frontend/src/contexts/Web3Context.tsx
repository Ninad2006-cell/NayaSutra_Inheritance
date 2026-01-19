import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Web3ContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  isSigning: boolean; // Added missing state
  connect: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string | null>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  // 1. AUTO-DETECT ON LOAD (The missing piece)
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkConnection();

    // 2. LISTEN FOR ACCOUNT CHANGES (User switches wallet in MetaMask)
    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        } else {
          setAddress(null);
          toast.info("Wallet disconnected");
        }
      });
    }

    return () => {
      // Cleanup listener if needed
      if ((window as any).ethereum && (window as any).ethereum.removeListener) {
        (window as any).ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const connect = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      toast.error('MetaMask is not installed!');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAddress(accounts[0]);
      toast.success('Wallet connected successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    toast.info('Wallet disconnected');
  };

  const signMessage = async (message: string): Promise<string | null> => {
    if (!address) {
      toast.error("Wallet not connected");
      return null;
    }
    
    setIsSigning(true);
    try {
      const signature = await (window as any).ethereum.request({
        method: "personal_sign",
        params: [message, address],
      });
      return signature;
    } catch (error: any) {
      console.error("Signing error:", error);
      toast.error("User denied message signature");
      return null;
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <Web3Context.Provider value={{ 
      address, 
      isConnected: !!address, 
      isConnecting, 
      isSigning, // Make sure to export this
      connect, 
      disconnect,
      signMessage 
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};