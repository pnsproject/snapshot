import { ref } from 'vue';
import { useApolloQuery } from '@/composables/useApolloQuery';
import {
  ENS_DOMAINS_BY_ACCOUNT_QUERY,
  ENS_DOMAIN_BY_HASH_QUERY
} from '@/helpers/queries';
import { useWeb3 } from '@/composables/useWeb3';

export function useEns() {
  const validEnsTlds = ['dot'];

  const { ensApolloQuery } = useApolloQuery();
  const { web3Account } = useWeb3();

  const ownedEnsDomains = ref<Record<string, any>[]>([]);

  const loadOwnedEnsDomains = async () => {
    if (!web3Account.value) return (ownedEnsDomains.value = []);

    const res = await ensApolloQuery({
      query: ENS_DOMAINS_BY_ACCOUNT_QUERY,
      variables: {
        parent: BigInt("0x3fce7d1364a893e213bc4212792b517ffc88f5b13b86c8ef9c8d390c3a1370ce"),
        id: web3Account.value.toLowerCase()
      }
    });

    // The ens subgraph returns only the hash for domain TLDs other than .eth, so we
    // have to make a second request to fetch the actual domain.
    console.log('res.subdomains', res)
    ownedEnsDomains.value = res.subdomains;
  };

  function isValidEnsDomain(domain) {
    if (!domain.includes('.')) return false;
    return validEnsTlds.includes(domain.split('.').pop());
  }

  return {
    loadOwnedEnsDomains,
    ownedEnsDomains,
    validEnsTlds,
    isValidEnsDomain
  };
}
