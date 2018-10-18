import { initializeApp } from 'firebase'

const app = initializeApp({
  apiKey: 'AIzaSyCiBdZln9wlNoE0vPathY1uWxDIh9o-lsA',
  authDomain: 'tarifacash.firebaseapp.com',
  databaseURL: 'https://tarifacash.firebaseio.com',
  projectId: 'tarifacash',
  storageBucket: 'tarifacash.appspot.com',
  messagingSenderId: '225078073600'
})

export const db = app.database()
