"""Refresh the static Medium feed during GitHub Pages publication."""
import json
import hashlib
import sys
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


class PlainText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
        self.image = ''

    def handle_starttag(self, tag, attrs):
        if tag != 'img' or self.image:
            return
        src = dict(attrs).get('src', '')
        parsed = urlparse(src)
        if parsed.scheme == 'https' and parsed.hostname in ('cdn-images-1.medium.com', 'cdn-images-2.medium.com', 'miro.medium.com'):
            self.image = src

    def handle_data(self, data):
        self.parts.append(data)


def parse_feed(xml):
    posts = []
    for item in ET.fromstring(xml).findall('./channel/item'):
        link = (item.findtext('link') or '').split('?')[0]
        if not link.startswith('https://medium.com/'):
            continue
        parser = PlainText()
        parser.feed(item.findtext('{http://purl.org/rss/1.0/modules/content/}encoded') or item.findtext('description') or '')
        excerpt = ' '.join(' '.join(parser.parts).split())
        posts.append({
            'title': item.findtext('title') or '',
            'date': parsedate_to_datetime(item.findtext('pubDate')).date().isoformat(),
            'link': link,
            'imageSource': parser.image,
            'tags': [tag.text for tag in item.findall('category') if tag.text][:2],
            'excerpt': excerpt[:160].rsplit(' ', 1)[0] + '…' if len(excerpt) > 160 else excerpt,
        })
    if not posts:
        raise ValueError('Medium returned no articles')
    return sorted(posts, key=lambda post: post['date'], reverse=True)


def refresh(destination):
    target = Path(destination)
    try:
        request = urllib.request.Request('https://medium.com/feed/@viviannemelo', headers={'User-Agent': 'PortfolioFeed/1.0'})
        with urllib.request.urlopen(request, timeout=30) as response:
            posts = parse_feed(response.read())
        target.parent.mkdir(parents=True, exist_ok=True)
        saved = json.loads(target.read_text(encoding='utf-8')).get('posts', []) if target.exists() else []
        previous = {post['link']: post for post in saved}
        for post in posts:
            source = post['imageSource']
            old = previous.get(post['link'], {})
            if not source:
                continue
            filename = 'medium-' + hashlib.sha256(source.encode()).hexdigest()[:16] + '.jpg'
            image_file = target.parent / 'media' / filename
            try:
                request = urllib.request.Request(source, headers={'User-Agent': 'PortfolioFeed/1.0'})
                with urllib.request.urlopen(request, timeout=30) as response:
                    if not response.headers.get('Content-Type', '').startswith('image/'):
                        raise ValueError('Cover response is not an image')
                    image = response.read(12 * 1024 * 1024 + 1)
                    if len(image) > 12 * 1024 * 1024:
                        raise ValueError('Cover is too large')
                image_file.parent.mkdir(parents=True, exist_ok=True)
                image_file.write_bytes(image)
                post['image'] = 'media/' + filename
            except Exception:
                if old.get('imageSource') == source and old.get('image'):
                    post['image'] = old['image']
        target.write_text(json.dumps({'posts': posts}, ensure_ascii=False), encoding='utf-8')
        print(f'Updated {len(posts)} Medium articles')
    except Exception as error:
        # Do not replace a successful publication with an empty feed.
        print(f'Medium temporarily unavailable; keeping the saved articles ({type(error).__name__})')


if __name__ == '__main__':
    refresh(sys.argv[1])