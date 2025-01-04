import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Adicionar APIs alternativas
const PRICE_APIS = {
  COINGECKO: 'https://api.coingecko.com/api/v3',
  BINANCE: 'https://api.binance.com/api/v3',
  COINBASE: 'https://api.coinbase.com/v2'
};

const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
const BACKUP_ETH_PRICE = 2000; // Preço de fallback caso a API falhe

interface TokenData {
  name: string;
  symbol: string;
  balance: string;
  value: number;
}

export function useWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [tokenCount, setTokenCount] = useState<number>(0);
  const [balanceHistory, setBalanceHistory] = useState<{ value: number }[]>([
    { value: 0 }, { value: 0 }, { value: 0 }, 
    { value: 0 }, { value: 0 }, { value: 0 }
  ]);
  const [tokenBalances, setTokenBalances] = useState<TokenData[]>([]);

  const fetchTokens = async (address: string) => {
    try {
      // Usando API pública do Etherscan para listar tokens
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === "1" && data.result) {
        // Criar Set para contar tokens únicos
        const uniqueTokens = new Set();
        
        // Filtrar apenas tokens com saldo atual
        data.result.forEach((tx: any) => {
          if (tx.to.toLowerCase() === address.toLowerCase()) {
            uniqueTokens.add(tx.contractAddress);
          }
        });

        // Definir quantidade de tokens únicos
        setTokenCount(uniqueTokens.size);
      } else {
        // Se não encontrar tokens, mostrar apenas ETH
        setTokenCount(1);
      }
    } catch (error) {
      console.error("Erro ao buscar tokens:", error);
      setTokenCount(1); // Fallback para mostrar pelo menos o ETH
    }
  };

  const fetchTokenBalances = async (address: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // ABI mínimo para tokens ERC20
      const minABI = [
        {
          constant: true,
          inputs: [{ name: "_owner", type: "address" }],
          name: "balanceOf",
          outputs: [{ name: "balance", type: "uint256" }],
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "symbol",
          outputs: [{ name: "", type: "string" }],
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "name",
          outputs: [{ name: "", type: "string" }],
          type: "function",
        }
      ];

      // Buscar lista de tokens da carteira via Etherscan
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&apikey=${ETHERSCAN_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "1" && data.result) {
        const uniqueTokens = new Set(data.result.map((tx: any) => tx.contractAddress));
        const balances: TokenData[] = [];

        // Adicionar ETH primeiro
        const ethBalance = await provider.getBalance(address);
        balances.push({
          name: "Ethereum",
          symbol: "ETH",
          balance: ethers.formatEther(ethBalance),
          value: parseFloat(ethers.formatEther(ethBalance)) * ethPrice
        });

        // Buscar balanço de cada token
        for (const tokenAddress of uniqueTokens) {
          const contract = new ethers.Contract(tokenAddress, minABI, provider);
          try {
            const balance = await contract.balanceOf(address);
            if (balance > 0) {
              const symbol = await contract.symbol();
              const name = await contract.name();
              balances.push({
                name,
                symbol,
                balance: balance.toString(),
                value: 0 // TODO: Buscar preço do token
              });
            }
          } catch (error) {
            console.error(`Erro ao buscar token ${tokenAddress}:`, error);
          }
        }

        setTokenBalances(balances);
        setTokenCount(balances.length);
      }
    } catch (error) {
      console.error("Erro ao buscar balanços:", error);
    }
  };

  const updateBalanceHistory = (newBalance: string) => {
    const value = parseFloat(newBalance) * ethPrice;
    if (!isNaN(value)) {
      setBalanceHistory(prev => {
        const newHistory = [...prev.slice(1), { value }];
        return newHistory;
      });
    }
  };

  const fetchEthPrice = async (retryCount = 3) => {
    const apis = [
      // CoinGecko
      async () => {
        const response = await fetch(
          `${PRICE_APIS.COINGECKO}/simple/price?ids=ethereum&vs_currencies=usd`,
          { cache: 'no-store' }
        );
        const data = await response.json();
        return data.ethereum.usd;
      },
      // Binance
      async () => {
        const response = await fetch(
          `${PRICE_APIS.BINANCE}/ticker/price?symbol=ETHUSDT`,
          { cache: 'no-store' }
        );
        const data = await response.json();
        return parseFloat(data.price);
      },
      // Coinbase
      async () => {
        const response = await fetch(
          `${PRICE_APIS.COINBASE}/prices/ETH-USD/spot`,
          { cache: 'no-store' }
        );
        const data = await response.json();
        return parseFloat(data.data.amount);
      }
    ];

    for (const api of apis) {
      try {
        const price = await api();
        if (price) {
          setEthPrice(price);
          if (balance) {
            updateBalanceHistory(balance);
          }
          return;
        }
      } catch (error) {
        console.warn("API falhou, tentando próxima...");
        continue;
      }
    }

    // Se todas as APIs falharem, usar preço de fallback
    console.log('Usando preço de fallback após tentar todas as APIs');
    setEthPrice(BACKUP_ETH_PRICE);
    if (balance) {
      updateBalanceHistory(balance);
    }
  };

  const handleAccountsChanged = async (newAccounts: string[]) => {
    if (!newAccounts || newAccounts.length === 0) {
      setWalletAddress(null);
      setBalance(null);
      setTokenCount(0);
    } else {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setWalletAddress(newAccounts[0]);
      const newBalance = await provider.getBalance(newAccounts[0]);
      const formattedBalance = ethers.formatEther(newBalance);
      setBalance(formattedBalance);
      updateBalanceHistory(formattedBalance);
      await fetchTokens(newAccounts[0]);
      await fetchTokenBalances(newAccounts[0]);
    }
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install MetaMask first!');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        alert('Nenhuma conta selecionada!');
        return;
      }

      const account = accounts[0];
      setWalletAddress(account);
      const balance = await provider.getBalance(account);
      const formattedBalance = ethers.formatEther(balance);
      setBalance(formattedBalance);
      
      // Inicializar histórico com o valor atual
      const value = parseFloat(formattedBalance) * ethPrice;
      setBalanceHistory(prev => prev.map(() => ({ value })));
      
      await fetchTokens(account);
      await fetchEthPrice();
      await fetchTokenBalances(account);
    } catch (error) {
      console.error('Error connecting:', error);
      alert('Error connecting to MetaMask. Check console.');
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setBalance(null);
    setTokenCount(0);
  };

  const toggleWallet = async () => {
    if (walletAddress) {
      disconnectWallet();
    } else {
      await connectWallet();
    }
  };

  const calculateUsdValue = () => {
    if (balance && ethPrice) {
      const usdValue = parseFloat(balance) * ethPrice;
      return usdValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
    return 'Carregando...';
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts.length > 0) {
            const account = accounts[0];
            setWalletAddress(account);
            const balance = await provider.getBalance(account);
            setBalance(ethers.formatEther(balance));
            await fetchTokens(account);
            await fetchEthPrice();
            await fetchTokenBalances(account);
          }
        } catch (error) {
          console.error('Erro ao verificar conexão:', error);
        }
      }
    };

    checkConnection();
    
    // Atualizar preço a cada 30 segundos
    const priceInterval = setInterval(() => {
      if (walletAddress) {
        fetchEthPrice();
      }
    }, 60000); // Aumentado para 1 minuto

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      clearInterval(priceInterval);
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  return {
    walletAddress,
    balance,
    tokenCount,
    toggleWallet,
    calculateUsdValue,
    balanceHistory,
    tokenBalances,
    fetchTokenBalances,
  };
}
