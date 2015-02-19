## URL meta parser

> A simple, small lightweight web API using [Cheerio](https://www.npmjs.com/package/cheerio) and [Request](https://www.npmjs.com/package/request) to parse meta-data from URLs. Combines Facebook OpenGraph meta tags, standards HTML meta and DOM parsing to find results.

### Setup

```bash
git clone git@github.com:KanoComputing/kw-meta-parse-api-server.git
cd kw-meta-parse-api-server
npm install
```

### Running

Run `npm start` to start the server.

The server will be started `http://localhost:2000` or listen to a custom set by the `PORT` environment variable.

### API

#### `GET /meta?q=URL`

**Params**

* `q` (Query) - *URL to parse*

**Example URL**

`GET http://localhost:2000/meta?q=http://www.youtube.com`

**Example positive response**

```json
{
    "success" : true,
    "data"    : {
        "title"       : "YouTube",
        "description" : "Sign in now to see your channels and recommendations!",
        "image"       : {
            "url" : "http://s.ytimg.com/yts/img/youtube_logo_stacked-vfl225ZTx.png"
        },
        "type"        : "website",
        "url"         : "http://www.youtube.com/"
    }
}
```

**Example negative response**
{
    "success" : false,
    "error"   : "Not found"
}

### Licence

Copyright (c) 2015 Kano Computing Ltd. - Released under the MIT license
