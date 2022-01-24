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

## Deploy on Github Pages

### Custom domain name

You must have your own domain name, because the project uses relative paths.
If you use Github's domain name, it's will be deploy on `<user>.github.io/mornin.fm/`, but it will try to find js and css in `<user>.github.io/` and failed.

After you configure a CNAME record with your DNS provider, modify `src/CNAME` to your custom domain name.

By the way, Github does not recommend using the root domain name, but using the subdomain name. 
If the root domain name is used as the CNAME, see [configuring-an-apex-domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain).

### Custom RPC URI

If you use self-hosted [kraken](https://github.com/MixinNetwork/kraken) as backend service, modify `env.API_BASE` in `.github/workflows/master.yml`

### Deploy

Finally, go to your forked repository, click Settings -> Pages, select `gh-pages` branch to save.