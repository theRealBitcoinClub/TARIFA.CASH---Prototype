import { initializeApp } from 'firebase'

const app = initializeApp({
  apiKey: 'AIzaSyCpL9e5VOkVsFoyPt_j77uMJhog4uIrjxQ',
  authDomain: 'firetestagain.firebaseapp.com',
  databaseURL: 'https://firetestagain.firebaseio.com',
  projectId: 'firetestagain',
  storageBucket: 'firetestagain.appspot.com',
  messagingSenderId: '202859484328'
})

export const db = app.database()
