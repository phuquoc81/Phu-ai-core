import api from './api';

export async function processWeb3Payment (txHash, amount, walletAddress) {
  const { data } = await api.post('/web3/pay', { txHash, amount, walletAddress });
  return data;
}

export async function getTokenInfo () {
  const { data } = await api.get('/web3/token-info');
  return data;
}
