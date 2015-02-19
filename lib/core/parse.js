var request = require('request'),
    cheerio = require('cheerio'),
    queryString = require('query-string'),
    truncate = require('truncate');

// Regular expression to chek presence of an http protocol
var PROTOCOL_REGEX = /^http:\/\/|https:\/\/.*/i;

/**
 * Parses given URL meta-data
 * 
 * @param {String} url
 * @param {[function]} callback
 */
module.exports = function parse(url, callback) {
    url = resolveProtocol(url);

    // Split url and query string
    var split = url.split('?'),
        query = queryString.parse(split[1] || '');

    url = split[0];

    // Add _escaped_fragment_ to query string for prerender engines
    query._escaped_fragment_ = '';

    request(url + '?' + queryString.stringify(query), function (err, res, body) {
        if (err) {
            // Return with null data if not found
            if (err.code === 'ENOTFOUND') {
                return callback(null, null);
            } else {
                return callback(err);
            }
        }

        var $ = cheerio.load(body),
            canonical = getCanonical($);

        if (canonical && canonical !== url) {
            return parse(canonical, callback);
        }

        callback(null, {
            title       : truncate(getTitle($), 100),
            description : truncate(getDescription($), 140),
            image       : getImage($, url),
            type        : truncate(getType($), 30),
            url         : url
        });
    });
};

/**
 * Add URL protocol if not present
 * 
 * @param {String} url
 * @return {String} resolvedUrl
 */
function resolveProtocol(url) {
    if (url.substr(0, 2) == '//') {
        return 'http://' + url.substr(2);
    } else if (!PROTOCOL_REGEX.test(url)) {
        return 'http://' + url;
    }

    return url;
}

/**
 * Get canonical URL from meta-data or OG data
 * 
 * @param {Object} Cheerio DOM instance
 * @return {String} canonical URL
 */
function getCanonical($) {
    return $('link[rel="canonical"]').attr('href') ||
        getMetaProp($, 'og:url', 'url');
}

/**
 * Get page title - fallback on headings
 * 
 * @param {Object} Cheerio DOM instance
 * @return {String} title
 */
function getTitle($) {
    return getMetaProp($, 'og:title', 'title') ||
        getTagContent($, 'title', 'h1', 'h2', 'h3', 'h5', 'h6');
}

/**
 * Get page description - fallback on paragraph content
 * 
 * @param {Object} Cheerio DOM instance
 * @return {String} description
 */
function getDescription($) {
    return getMetaProp($, 'og:description', 'description') || $('p').first().text();
}

/**
 * Get page / item type
 * 
 * @param {Object} Cheerio DOM instance
 * @return {String} type
 */
function getType($) {
    return getMetaProp($, 'og:type') || 'website';
}

/**
 * Get image - fallback on app icons and content image
 * 
 * @param {Object} Cheerio DOM instance
 * @return {Object} image object
 */
function getImage($, baseUrl) {
    var url = $('meta[itemprop="image"]').first().attr('content') ||
        getMetaProp($, 'og:image', 'image') ||
        $('img').first().attr('src') ||
        getLinkRel($, 'logo', 'apple-touch-icon', 'apple-touch-startup-image') ||
        null;

    // Resolve URL if relative
    url = url ? resolveUrl(baseUrl, url) : null;

    return {
        url : url
    };
}

/**
 * Returns complete url given a base url and a potentially relative one
 * 
 * @param {String} baseUrl
 * @param {String} url
 * @return {String} resolvedUrl
 */
function resolveUrl(baseUrl, url) {
    var addSlash;

    // Add http by default if starts with //
    if (url.substr(0, 2) === '//') {
        url = resolveProtocol(url);
    }

    if (!PROTOCOL_REGEX.test(url)) {
        addSlash = baseUrl.substr(-1) !== '/' && url.substr(0, 1) !== '/';
        return baseUrl + (addSlash ? '/' : '') + url;
    }

    return url;
}

/**
 * Return first meta value given a chain of fallback property names
 * 
 * @param {Object} Cheerio DOM instance
 * @param {String, ...} property names
 * @return {String} meta value
 */
function getMetaProp($) {
    var props = Array.apply(this, arguments).splice(1),
        val, i;

    for (i = 0; i < props.length; i++) {
        val = $('meta[property="' + props[i] + '"]').attr('content');
        if (val) { return val.trim(); }
    }

    return null;
}

/**
 * Return first content text found given a chain of element selectors
 * 
 * @param {Object} Cheerio DOM instance
 * @param {String, ...} selectors
 * @return {String} text
 */
function getTagContent($) {
    var selectors = Array.apply(this, arguments).splice(1),
        val, i;

    for (i = 0; i < selectors.length; i++) {
        val = $(selectors[i]).text();
        if (val) { return val.trim(); }
    }

    return null;
}

/**
 * Return first link href value found given a chain of rel values
 * 
 * @param {Object} Cheerio DOM instance
 * @param {String, ...} 
 * @return {String} link href
 */
function getLinkRel($) {
    var rels = Array.apply(this, arguments).splice(1),
        val, i;

    for (i = 0; i < rels.length; i++) {
        val = $('link[rel="' + rels[i] + '"]').attr('href');
        if (val) { return val.trim(); }
    }

    return null;
}