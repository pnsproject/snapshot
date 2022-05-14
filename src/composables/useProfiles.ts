import { getEnsAddress } from '@/helpers/profile';
import { ref } from 'vue';
import { useApolloQuery } from '@/composables/useApolloQuery';
import { PROFILES_QUERY } from '@/helpers/queries';

// Holds profile data (ENS name, username, about) for all addresses appearing in the frontend
const profiles = ref<{
  [address: string]: {
    ens: string;
    name?: string;
    about?: string;
    avatar?: string;
  };
}>({});

export function useProfiles() {
  /**
   * Populates global ref with profile data for batches of addresses.
   */
  const loadProfiles = async (addresses: string[]) => {
    const addressesToAdd = addresses.filter(
      address =>
        !Object.keys(profiles.value).includes(address) && address !== ''
    );

    const { apolloQuery } = useApolloQuery();
    let profilesRes: any = {};
    if (addressesToAdd.length > 0) {
      profilesRes = await Promise.all([
        await getEnsAddress(addressesToAdd),
        await apolloQuery(
          {
            query: PROFILES_QUERY,
            variables: {
              addresses: addresses[0]
            }
          },
          'users'
        )
      ]);
      // add ens from profilesRes to corresponding address in profilesObj
      Object.keys(profilesRes[0]).forEach(address => {
        profilesRes[0][address] = {
          ...{ ens: profilesRes[0][address] },
          ...profilesRes[1]?.find(p => p.id === address)
        };
      });
    }

    profiles.value = { ...profilesRes[0], ...profiles.value };
  };

  // Reload a profile in profiles object
  const reloadProfile = (address: string) => {
    // find profile in profiles object and delete it (to force reload)
    const profile = profiles.value[address];
    if (profile) {
      delete profiles.value[address];
    }
    loadProfiles([address]);
  };

  return {
    profiles,
    loadProfiles,
    reloadProfile
  };
}
