import {
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client/core';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { request, gql } from 'graphql-request';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// const uri =
//   import.meta.env.VITE_DEFAULT_NETWORK === '4'
//     ? 'https://api.thegraph.com/subgraphs/name/ensdomains/ensrinkeby'
//     : 'https://api.thegraph.com/subgraphs/name/ensdomains/ens';

const uri = 'https://glmr-graph.pns.link/subgraphs/name/name-graph';

// const httpLink = createHttpLink({ uri });

// export const ensApolloClient = new ApolloClient({
//   link: httpLink,
//   cache: new InMemoryCache({
//     addTypename: false
//   }),
//   defaultOptions: {
//     query: {
//       fetchPolicy: 'no-cache'
//     }
//   }
// });

export const ensApolloClient = {
  query: function (options): any {
    return request(uri, options.query, options.variables);
  }
};
