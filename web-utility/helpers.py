#!/usr/bin/env python
#
# Copyright 2016 Lab11, University of Michigan.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License. Derived from content by Google, Inc.

try:
    from google.appengine.api import taskqueue, urlfetch, app_identity
    import models
except Exception as e:
    if __name__ != '__main__':
        raise e
    else:
        print "Warning: import exception '{0}'".format(e)

from urllib import quote_plus
from urlparse import urljoin, urlparse
import cgi
import datetime
import json
import logging
import lxml.etree

################################################################################

USER_AGENT = 'Mozilla/5.0'
BASE_URL = 'https://' + app_identity.get_application_id() + '.appspot.com'
# PERMISSIONS = {"bluetooth":"bluetooth","battery":"battery","device":"device","globalization":"globalization","connection":"connection","accelerometer":"accelerometer","camera":"camera","compass":"compass","geolocation":"geolocation","capture":"capture","vibrate":"vibrate","contacts":"contacts","file":"file","media":"media","notification":"notification","zeroconf":"zeroconf","zip":"zip","cordova-plugin-ble-central":"bluetooth","com.megster.cordova.ble":"bluetooth","cordova-plugin-device":"device","cordova-plugin-file":"file","cordova-plugin-network-information":"connection","cordova-plugin-zeroconf":"zeroconf","cordova-plugin-zip":"zip"}

################################################################################

def BuildResponse(objects):
    metadata_output = []
    unresolved_output = []

    # Resolve the devices
    for obj in objects:
        url = obj.get('url', None)
        force_update = obj.get('force', False)
        rssi = obj.get('rssi', None)
        txpower = obj.get('txpower', None)
        distance = ComputeDistance(rssi, txpower)

        def append_invalid():
            unresolved_output.append({
                'id': url
            })

        if url is None:
            continue

        parsed_url = urlparse(url)
        if parsed_url.scheme != 'http' and parsed_url.scheme != 'https':
            append_invalid()
            continue

        try:
            siteInfo = GetSiteInfoForUrl(url, distance, force_update)
        except FailedFetchException:
            append_invalid()
            continue

        if siteInfo is None:
            # It's a valid url, which we didn't fail to fetch, so it must be `No Content`
            continue

        device_data = {}
        device_data['id'] = url
        device_data['url'] = siteInfo.url
        device_data['displayUrl'] = siteInfo.url
        if siteInfo.title is not None:
            device_data['title'] = siteInfo.title
        if siteInfo.description is not None:
            device_data['description'] = siteInfo.description
        if siteInfo.favicon_url is not None:
            device_data['icon'] = urljoin(BASE_URL, '/favicon?url=' + quote_plus(siteInfo.favicon_url))
        if siteInfo.jsonlds is not None:
            device_data['json-ld'] = json.loads(siteInfo.jsonlds)
        if siteInfo.cordova is not None:
            device_data['cordova'] = siteInfo.cordova
        if siteInfo.count is not None:
            device_data['count'] = siteInfo.count;
        device_data['distance'] = distance
        metadata_output.append(device_data)

    metadata_output = map(ReplaceDistanceWithRank, RankedResponse(metadata_output))

    ret = {
        "metadata": metadata_output,
        "unresolved": unresolved_output,
    }

    return ret

################################################################################

def ComputeDistance(rssi, txpower):
    try:
        rssi = float(rssi)
        txpower = float(txpower)
        if rssi in [127, 128]: # Known invalid rssi values
            return None
        path_loss = txpower - rssi
        distance = pow(10.0, (path_loss - 41) / 20)
        return distance
    except:
        return None

def RankedResponse(metadata_output):
    def SortByDistanceCmp(a, b):
        return cmp(a['distance'], b['distance'])

    metadata_output.sort(SortByDistanceCmp)
    return metadata_output

def ReplaceDistanceWithRank(device_data):
    distance = device_data['distance']
    distance = distance if distance is not None else 1000
    device_data['rank'] = distance
    device_data.pop('distance', None)
    return device_data

################################################################################

# This is used to recursively look up in cache after each redirection.
# We don't cache the redirection itself, but we always want to cache the final destination.
def GetSiteInfoForUrl(url, distance=None, force_update=False):
    logging.info('GetSiteInfoForUrl url:{0}, distance:{1}'.format(url, distance))

    siteInfo = models.SiteInformation.get_by_id(url)

    if force_update:
        siteInfo = FetchAndStoreUrl(siteInfo, url, distance, force_update)
    else:
        if siteInfo is None:
            siteInfo = FetchAndStoreUrl(siteInfo, url, distance, force_update)
        else:
            # If the cache is older than 5 minutes, queue a refresh
            siteInfo.count = (getattr(siteInfo,'count',0) or 0) + 1
            siteInfo.put()
            updated_ago = datetime.datetime.now() - siteInfo.updated_on
            if updated_ago > datetime.timedelta(minutes=5):
                logging.info('Queue RefreshUrl for url: {0}, which was updated {1} ago'.format(url, updated_ago))
                # Add request to queue.
                taskqueue.add(url='/refresh-url', params={'url': url})

    return siteInfo

################################################################################

class FailedFetchException(Exception):
    pass

def FetchAndStoreUrl(siteInfo, url, distance=None, force_update=False):
    # Index the page
    try:
        headers = {'User-Agent': USER_AGENT}
        result = urlfetch.fetch(url,
                                follow_redirects=False,
                                validate_certificate=True,
                                headers=headers)
    except:
        logging.info('FetchAndStoreUrl FailedFetch url:{0}'.format(url))
        raise FailedFetchException()

    logging.info('FetchAndStoreUrl url:{0}, status_code:{1}'.format(url, result.status_code))
    if result.status_code == 200 and result.content: # OK
        encoding = GetContentEncoding(result.content)
        assert result.final_url is None
        return StoreUrl(siteInfo, url, result.content, encoding)
    elif result.status_code == 204: # No Content
        return None
    elif result.status_code in [301, 302, 303, 307, 308]: # Moved Permanently, Found, See Other, Temporary Redirect, Permanent Redirect
        final_url = urljoin(url, result.headers['location'])
        logging.info('FetchAndStoreUrl url:{0}, redirects_to:{1}'.format(url, final_url))
        if siteInfo is not None:
            logging.info('Removing Stale Cache for url:{0}'.format(url))
            siteInfo.key.delete()
        return GetSiteInfoForUrl(final_url, distance, force_update)
    elif 500 <= result.status_code <= 599:
        return None
    else:
        raise FailedFetchException()

################################################################################

def GetContentEncoding(content):
    try:
        # Don't assume server return proper charset and always try UTF-8 first.
        u_value = unicode(content, 'utf-8')
        return 'utf-8'
    except UnicodeDecodeError:
        pass

    encoding = None
    parser = lxml.etree.HTMLParser(encoding='iso-8859-1')
    htmltree = lxml.etree.fromstring(content, parser)
    value = htmltree.xpath("//head//meta[@http-equiv='Content-Type']/attribute::content")
    if encoding is None:
        if (len(value) > 0):
            content_type = value[0]
            _, params = cgi.parse_header(content_type)
            if 'charset' in params:
                encoding = params['charset']

    if encoding is None:
        value = htmltree.xpath('//head//meta/attribute::charset')
        if (len(value) > 0):
            encoding = value[0]

    if encoding is None:
        encoding = 'iso-8859-1'
        u_value = unicode(content, 'iso-8859-1')

    return encoding

################################################################################

def FlattenString(input):
    input = input.strip()
    input = input.replace('\r', ' ');
    input = input.replace('\n', ' ');
    input = input.replace('\t', ' ');
    input = input.replace('\v', ' ');
    input = input.replace('\f', ' ');
    while '  ' in input:
        input = input.replace('  ', ' ');
    return input

################################################################################

def StoreUrl(siteInfo, url, content, encoding):
    title = None
    description = None
    icon = None
    cordova = None
    result = None
    count = None

    # parse the content
    parser = lxml.etree.HTMLParser(encoding=encoding)
    htmltree = lxml.etree.fromstring(content, parser)

    # Try to find web manifest <link rel="manifest" href="...">.
    value = htmltree.xpath("//link[@rel='manifest']/attribute::href")
    if (len(value) > 0):
        # Fetch web manifest.
        manifestUrl = value[0]
        if "://" not in manifestUrl:
            manifestUrl = urljoin(url, manifestUrl)
        try:
            result = urlfetch.fetch(manifestUrl)
            if result.status_code == 200:
                manifestData = json.loads(result.content)
                if 'short_name' in manifestData:
                    title = manifestData['short_name']
                else:
                    title = manifestData['name']
        except:
            pass

    # Try to use <title>...</title>.
    if title is None:
        value = htmltree.xpath('//head//title/text()');
        if (len(value) > 0):
            title = value[0]
    if title is None:
        value = htmltree.xpath("//head//meta[@property='og:title']/attribute::content");
        if (len(value) > 0):
            title = value[0]
    if title is not None:
        title = FlattenString(title)

    # Try to use <meta name="description" content="...">.
    value = htmltree.xpath("//head//meta[@name='description']/attribute::content")
    if (len(value) > 0):
        description = value[0]
    if description is not None and len(description) == 0:
        description = None
    if description == title:
        description = None

    # Try to use <meta property="og:description" content="...">.
    if description is None:
        value = htmltree.xpath("//head//meta[@property='og:description']/attribute::content")
        description = ' '.join(value)
        if len(description) == 0:
            description = None

    # Try to use <div class="content">...</div>.
    if description is None:
        value = htmltree.xpath("//body//*[@class='content']//*[not(*|self::script|self::style)]/text()")
        description = ' '.join(value)
        if len(description) == 0:
            description = None

    # Try to use <div id="content">...</div>.
    if description is None:
        value = htmltree.xpath("//body//*[@id='content']//*[not(*|self::script|self::style)]/text()")
        description = ' '.join(value)
        if len(description) == 0:
            description = None

    # Fallback on <body>...</body>.
    if description is None:
        value = htmltree.xpath("//body//*[not(*|self::script|self::style)]/text()")
        description = ' '.join(value)
        if len(description) == 0:
            description = None

    # Cleanup.
    if description is not None:
        description = FlattenString(description)
        if len(description) > 500:
            description = description[:500]

    # Icon
    if icon is None:
        value = htmltree.xpath("//head//link[@rel='shortcut icon']/attribute::href");
        if (len(value) > 0):
            icon = value[0]
    if icon is None:
        value = htmltree.xpath("//head//link[@rel='icon']/attribute::href");
        if (len(value) > 0):
            icon = value[0]
    if icon is None:
        value = htmltree.xpath("//head//link[@rel='apple-touch-icon-precomposed']/attribute::href");
        if (len(value) > 0):
            icon = value[0]
    if icon is None:
        value = htmltree.xpath("//head//link[@rel='apple-touch-icon']/attribute::href");
        if (len(value) > 0):
            icon = value[0]
    if icon is None:
        value = htmltree.xpath("//head//meta[@property='og:image']/attribute::content");
        if (len(value) > 0):
            icon = value[0]

    if icon is not None:
        if icon.startswith('./'):
            icon = icon[2:len(icon)]
        icon = urljoin(url, icon)
    if icon is None:
        icon = urljoin(url, '/favicon.ico')

    # json-lds
    jsonlds = []
    value = htmltree.xpath("//head//script[@type='application/ld+json']/text()");
    for jsonldtext in value:
        jsonldobject = None
        try:
            jsonldobject = json.loads(jsonldtext) # Data is not sanitised.
        except (ValueError, UnicodeDecodeError):
            jsonldobject = None
        if jsonldobject is not None:
            jsonlds.append(jsonldobject)

    if (len(jsonlds) > 0):
        jsonlds_data = json.dumps(jsonlds);
    else:
        jsonlds_data = None

    # Cordova
    if cordova is None:
        value = htmltree.xpath("//body//script[@src='cordova.js']");
        if (len(value) > 0):
            cordova = {}
    if cordova is None:
        value = htmltree.xpath("//head//script[@src='cordova.js']");
        if (len(value) > 0):
            cordova = {}
    if cordova is not None:
        try:
            result = urlfetch.fetch(url+'/cordova_plugins.js')
            if not result.content or result.content.find("module.exports.metadata") is -1:
                result = urlfetch.fetch(url+'/../cordova_plugins.js')
            if result and result.content and result.content.find("module.exports.metadata") is not -1:
                m = Substr(str(result.content),'// TOP OF METADATA','// BOTTOM OF METADATA')
                cordova = json.loads(m)
        except Exception,e:
            cordova = {"error" : str(e)}
    if cordova is None:
        try:
            value = htmltree.xpath("//head//summon/attribute::request");
            cordova = dict.fromkeys(value[0].split(' '),0)
        except Exception,e:
            cordova = {"error" : str(e)}

    # Count
    if count is None:
        count = (getattr(siteInfo,'count',0) or 0) + 1

    # Add to cache
    if siteInfo is None:
        # Add a new value
        siteInfo = models.SiteInformation.get_or_insert(url,
            url = url,
            title = title,
            favicon_url = icon,
            description = description,
            jsonlds = jsonlds_data,
            cordova = cordova,
            count = count)
    else:
        # update the data because it already exists
        siteInfo.url = url
        siteInfo.title = title
        siteInfo.favicon_url = icon
        siteInfo.description = description
        siteInfo.jsonlds = jsonlds_data
        siteInfo.cordova = cordova
        siteInfo.count = count
        siteInfo.put()

    return siteInfo

################################################################################

def Substr(s, leader, trailer):
  end_of_leader = s.index(leader) + len(leader)
  start_of_trailer = s.index(trailer, end_of_leader)
  return s[end_of_leader:start_of_trailer]

################################################################################

def FaviconUrl(url):
    # Fetch only favicons for sites we've already added to our database.
    if models.SiteInformation.query(models.SiteInformation.favicon_url==url).count(limit=1):
        try:
            headers = {'User-Agent': USER_AGENT}
            return urlfetch.fetch(url, headers=headers)
        except:
            return None
    return None

################################################################################

def RefreshUrl(url):
    siteInfo = models.SiteInformation.get_by_id(url)

    if siteInfo is not None:
        # If we've done an update within the last 5 seconds, don't do another one.
        # This is just to prevent abuse, accidental or otherwise
        updated_ago = datetime.datetime.now() - siteInfo.updated_on
        if updated_ago < datetime.timedelta(seconds=5):
            logging.info('Skipping RefreshUrl for url: {0}, which was updated {1} ago'.format(url, updated_ago))
            return

        # Update the timestamp before starting the request, to make sure we do not request twice.
        siteInfo.put()

    try:
        FetchAndStoreUrl(siteInfo, url, force_update=True)
    except FailedFetchException:
        pass


################################################################################

def GetConfig():
    import os.path
    if os.path.isfile('config.SECRET.json'):
        fname = 'config.SECRET.json'
    else:
        fname = 'config.SAMPLE.json'
    with open(fname) as configfile:
        return json.load(configfile)

################################################################################

if __name__ == '__main__':
    for i in range(-22,-100,-1):
        print i, ComputeDistance(i, -22)
