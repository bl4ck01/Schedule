[![Code Climate](https://codeclimate.com/github/arikalfus/Schedule/badges/gpa.svg)](https://codeclimate.com/github/arikalfus/Schedule)

# Schedule

A multi-threaded Node scheduling application for employees with variable shift lengths.

## Set Up

There are only a couple of initial set up steps required to start this server.

1. Create a private key and certificate for the HTTPS server. The certificate is expected to be "localhost.crt" and 
the key is expected to be "localhost.key." These names can be modified in _config/config.js_. If you are unsure how 
to do this, I find [this description](https://www.digitalocean.com/community/tutorials/openssl-essentials-working-with-ssl-certificates-private-keys-and-csrs)
on creating self-signed certificates by Digital Ocean to be quite good.

2. If necessary, the default ports can also be modified at _config/config.js_. Three ports are necessary for the 
automatic conversion of HTTP requests into HTTPS requests. They do not need to be sequential.

3. Change favicon.ico in _public/images_ to your application-specific favicon. It is currently a white square.

## Testing

Tests are written using the Mocha framework. To run, start the server with _npm start_. Open another terminal and run _npm test_.
