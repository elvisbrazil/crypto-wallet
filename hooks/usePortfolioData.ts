import { useWallet } from '@/hooks/useWallet';

interface TokenBalance {
  name: string;
  value: number;
  color: string;
}

const generateColor = (index: number) => {
  const colors = [
    '#4318FF', // Principal - Azul
    '#63B344', // Verde
    '#FF6B6B', // Vermelho
    '#FFC107', // Amarelo
    '#9C27B0', // Roxo
    '#00BCD4', // Laranja
  ];
  return colors[index % colors.length];
};

export const usePortfolioData = () => {
  const { tokenBalances, balance, ethPrice } = useWallet();

  const getPortfolioData = () => {
    const ethValue = balance ? parseFloat(balance) * ethPrice : 0;
    const initialData = [{
      name: 'ETH',
      value: ethValue || 1,
      color: '#4318FF'
    }];

    if (!balance || !tokenBalances.length) {
      return initialData;
    }

    const otherTokens = tokenBalances
      .filter(token => token.symbol !== 'ETH' && parseFloat(token.balance) > 0)
      .map((token, index) => ({
        name: token.symbol || 'Token',
        value: token.value || 0.1,
        color: generateColor(index + 1)
      }));

    return otherTokens.length ? [...initialData, ...otherTokens] : initialData;
  };

  const portfolioData = getPortfolioData();
  const total = Math.max(0.1, portfolioData.reduce((acc, curr) => acc + curr.value, 0));
  const dataWithPercentages = portfolioData.map(item => ({
    ...item,
    value: Math.max(1, (item.value / total) * 100)
  }));

  return dataWithPercentages;
};
