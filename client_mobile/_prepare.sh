#!/usr/bin/env bash


# #############################################################################
#
# setup the enviroment

NPM_PACKAGES="${HOME}/.npm-packages"
prefix=${HOME}/.npm-packages
NODE_PATH="$NPM_PACKAGES/lib/node_modules:$NODE_PATH"
PATH="$NPM_PACKAGES/bin:$PATH"
unset MANPATH
MANPATH="$NPM_PACKAGES/share/man:$(manpath)"

# #############################################################################
#
# prepare module

echo preparing client_mobile,

cd source

npm install

bower install

# ionic serve

# ionic serve --lab

# ionic build ios
# ionic emulate ios

# ionic build android
# ionic emulate android

# ionic run android