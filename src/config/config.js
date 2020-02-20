import {AsyncStorage} from 'react-native'

const common = {
  GOOGLE_PLACES_API_KEY: 'AIzaSyBopRDu051G9W6fqJCwGgzxGICzhzuUxIg',

  REDUCER_VERSION: '123',
  REDUCER_PERSIST: false,
  REDUCER_CONFIG: {
    storage: AsyncStorage,
    blacklist: [
      'app',
      'navigation',
      'search',
      'user',
    ],
  },

  LOGGER_ACTIVE: false,
  LOGGER_CONFIG: {
      duration: true,
      collapsed: true,
  },

  // Disable Yellow Box and show in the console instead
  // Its better for performance in dev mode
  DISABLE_YELLOW_BOX:  true,
}

const dev = Object.assign({}, common, {
  PAYMENTS_SERVER: 'https://us-central1-hoops-21a72.cloudfunctions.net/',
  STRIPE_PUBLIC_KEY: 'pk_test_QkhKNXx4BFg7TmyOl7fEyR0E',

  FIREBASE_API_KEY: 'AIzaSyA-4UQyJ2wfj9OfgX4zkTQeFscFxGQ_agE',
  FIREBASE_DATABASE_URL: 'https://hoops-21a72.firebaseio.com',
  FIREBASE_STORAGE_BUCKET: 'hoops-21a72.appspot.com',

  LOGGER_ACTIVE: true,
})

const prod = Object.assign({}, common, {
  PAYMENTS_SERVER: 'https://us-central1-hoops-us-149010.cloudfunctions.net/',
  STRIPE_PUBLIC_KEY: 'pk_live_rziAIKqdQQCkGG7NW5HGGSoL',

  FIREBASE_API_KEY: 'AIzaSyBLk4Cz8aQU3XaQWJJtvMtqkVcMm2UUBc8',
  FIREBASE_DATABASE_URL: 'https://hoops-us-149010.firebaseio.com',
  FIREBASE_STORAGE_BUCKET: 'hoops-us-149010.appspot.com',

  //Bugsnag is only enabled when the API key is given
  BUGSNAG_API_KEY: '25983a784e900e85ae661a2e5685d61a',
})

export default __DEV__ ? dev : prod
