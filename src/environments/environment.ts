// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  bpUrl: 'https://5.375.ru/bpo-api/v1',
  bpId: '3275c3846e5d8664755009569d6ff51e',
  dadataUrl: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs',
  baseUrl: 'https://flowervalley.ru/back',
};

// В значении по ключу BaseUrl должен лежать путь до бэка проекта, на том же домене, где размещен сам сайт

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
