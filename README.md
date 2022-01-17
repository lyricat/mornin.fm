# Mornin

source code of https://mornin.fm

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

## Docker

```bash
# pull docker image
docker pull viticis/mornin.fm

# launch server
docker run -itd --name mornin.fm viticis/mornin.fm

# or build docker image yourself
docker build -t mornin.fm .
```
