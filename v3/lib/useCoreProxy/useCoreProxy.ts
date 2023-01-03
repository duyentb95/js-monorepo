import { ethers } from 'ethers';
import { useQuery } from '@tanstack/react-query';
import type { CoreProxy as CoreProxyGoerli } from '@synthetixio/v3-contracts/build/goerli/CoreProxy';
import type { CoreProxy as CoreProxyOptimismGoerli } from '@synthetixio/v3-contracts/build/optimism-goerli/CoreProxy';
import { useProvider, useSigner } from 'wagmi';

export async function importCoreProxy(chainName: string) {
  switch (chainName) {
    case 'goerli':
      return import('@synthetixio/v3-contracts/build/goerli/CoreProxy');
    case 'optimism-goerli':
      return import('@synthetixio/v3-contracts/build/optimism-goerli/CoreProxy');
    default:
      throw new Error(`Unsupported chain ${chainName}`);
  }
}
export const useCoreProxy = () => {
  const provider = useProvider();
  const { data: signer } = useSigner();

  return useQuery({
    queryKey: [provider.network.name, { withSigner: Boolean(signer) }, 'CoreProxy'],
    queryFn: async () => {
      const CoreProxy = await importCoreProxy(provider.network.name);
      return new ethers.Contract(CoreProxy.address, CoreProxy.abi, signer || provider) as
        | CoreProxyGoerli
        | CoreProxyOptimismGoerli;
    },
    enabled: Boolean(provider.network.name && (signer || provider)),
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};
export type CoreProxyContractType = CoreProxyGoerli | CoreProxyOptimismGoerli;
