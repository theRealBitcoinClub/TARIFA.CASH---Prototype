# tarifa.cash

This project is written in JavaScript using Vue.js and Firebase.

It is meant to provide a way for clubs/cities/countries to provide their own currency which is being backed by BCH.

In the back everything is BCH, but the end-user would not realize it, we prefer to use BCH instead of tokens to give value to the BCH community and security to the end-users. It means you need to have BCH to start the cash and you can not just create tokens out of thin air which would be like acting like a bank, which is not what bitcoin was invented for!

It is a Single Page App, including a Service Worker for caching and it is installable as PWA (Progressive Web App)

It uses the BITBOX SDK to grab the current BCH Price and it uses the datacash lib by unwriter to send the transaction.

All transactions are also being sent to MEMO.CASH, so when people consume everyone can see it!

The project is hosted on https://tarifa.cash

You can login and then you can charge with the provided QR-Code

After charging the QR-Code you can spend the funds on the registered shops

At the moment this is just a dummy prototype app.

It can be modified easily to work within less than one day.

All you need is a working receiving address and make the layout more pretty.
