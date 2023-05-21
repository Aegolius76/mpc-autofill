// TODO: set up the below API calls to use best practices with handling all cases `fetch` can return
// TODO: read this http://florimond.dev/en/posts/2018/08/restful-api-design-13-best-practices-to-make-your-users-happy/
// Need to use the React-specific entry point to allow generating React hooks
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { RootState } from "@/app/store";
import { QueryTags } from "@/common/constants";
import { processQuery } from "@/common/processing";
import {
  BackendInfo,
  CardDocument,
  CardDocuments,
  Contributions,
  DFCPairs,
  ImportSite,
  SearchQuery,
  SearchResults,
  SearchSettings,
  SourceDocuments,
} from "@/common/types";

// dynamic base URL implementation retrieved from https://stackoverflow.com/a/69570628/13021511
const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, WebApi, extraOptions) => {
  const baseUrl = (WebApi.getState() as RootState).backend.url;
  const rawBaseQuery = fetchBaseQuery({ baseUrl });
  return rawBaseQuery(args, WebApi, extraOptions);
};

// TODO: consider splitting the API across multiple files for readability
export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: dynamicBaseQuery,
  tagTypes: [QueryTags.BackendSpecific],
  endpoints: (builder) => ({
    getCards: builder.query<CardDocuments, Set<string>>({
      query: (identifiersToSearch) => ({
        url: `2/cards/`,
        method: "POST",
        body: { card_identifiers: JSON.stringify(identifiersToSearch) },
      }),
      providesTags: [QueryTags.BackendSpecific],
      transformResponse: (response: { results: CardDocuments }, meta, arg) =>
        response.results,
    }),
    getCardbacks: builder.query<Array<string>, void>({
      query: () => ({ url: `2/cardbacks/`, method: "GET" }),
      providesTags: [QueryTags.BackendSpecific],
      transformResponse: (response: { cardbacks: Array<string> }, meta, arg) =>
        response.cardbacks,
    }),
    search: builder.query<
      SearchResults,
      { searchSettings: SearchSettings; queries: Array<SearchQuery> }
    >({
      query: (input) => ({
        url: `2/searchResults/`,
        method: "POST",
        body: JSON.stringify({
          searchSettings: input.searchSettings,
          queries: Array.from(input.queries),
        }),
      }),
      providesTags: [QueryTags.BackendSpecific],
      transformResponse: (response: { results: SearchResults }, meta, arg) =>
        response.results,
    }),
    getSources: builder.query<SourceDocuments, void>({
      query: () => ({ url: `2/sources/`, method: "GET" }),
      providesTags: [QueryTags.BackendSpecific],
      transformResponse: (response: { results: SourceDocuments }, meta, arg) =>
        response.results,
    }),
    getImportSites: builder.query<Array<ImportSite>, void>({
      query: () => ({ url: `2/importSites/`, method: "GET" }),
      providesTags: [QueryTags.BackendSpecific],
      transformResponse: (
        response: { import_sites: Array<ImportSite> },
        meta,
        arg
      ) => response.import_sites,
    }),
    queryImportSite: builder.query<string, string>({
      query: (url) => ({
        url: `2/importSiteDecklist/`,
        method: "POST",
        body: JSON.stringify({ url }),
      }),
      providesTags: [QueryTags.BackendSpecific],
      transformResponse: (response: { cards: string }, meta, arg) =>
        response.cards,
    }),
    getDFCPairs: builder.query<DFCPairs, void>({
      query: () => ({ url: `2/DFCPairs/`, method: "GET" }),
      providesTags: [QueryTags.BackendSpecific],
      transformResponse: (response: { dfc_pairs: DFCPairs }, meta, arg) => {
        // sanitise the front and back names before storing
        return Object.fromEntries(
          Object.keys(response.dfc_pairs).map((front) => [
            processQuery(front),
            processQuery(response.dfc_pairs[front]),
          ])
        );
      },
    }),
    getSampleCards: builder.query<
      { [cardType: string]: Array<CardDocument> },
      void
    >({
      query: () => ({ url: `2/sampleCards/`, method: "GET" }),
      providesTags: [QueryTags.BackendSpecific],
      transformResponse: (
        response: { cards: { [cardType: string]: Array<CardDocument> } },
        meta,
        arg
      ) => response.cards,
    }),
    getContributions: builder.query<Contributions, void>({
      query: () => ({ url: `2/contributions/`, method: "GET" }),
      providesTags: [QueryTags.BackendSpecific],
    }),
    getBackendInfo: builder.query<BackendInfo, void>({
      query: () => ({ url: `2/info/`, method: "GET" }),
      providesTags: [QueryTags.BackendSpecific],
      transformResponse: (response: { info: BackendInfo }, meta, arg) =>
        response.info,
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useGetCardsQuery,
  useGetCardbacksQuery,
  useSearchQuery,
  useGetSourcesQuery,
  useGetImportSitesQuery,
  useQueryImportSiteQuery,
  useGetDFCPairsQuery,
  useGetSampleCardsQuery,
  useGetContributionsQuery,
  useGetBackendInfoQuery,
} = apiSlice;
