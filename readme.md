
# cs141-ups-management-card

This Node.JS API can receive data from a [cs141](https://www.generex.de/support/downloads/ups/cs141) UPS management card via its API.

Written in Typescript with typings available built-in

From now on supports ESM and CJS and is available on [GitHub Packages](https://github.com/Trickfilm400/cs141-ups-mangement-card) as well as [NPM](https://www.npmjs.com/package/@trickfilm400/cs141-ups-mangement-card)


## Example-Usage
```typescript
//import Class
import {CS141} from "@trickfilm400/cs141-ups-management-card";
// create Class instance (host, username, password)
const z = new CS141('https://192.168.10.133', 'admin', 'cs141-snmp');
//receive data and print to console
z.handleRequest().then(console.log, console.log);
```


&copy; 2022-2024 Trickfilm400
