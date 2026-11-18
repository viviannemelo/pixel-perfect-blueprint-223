import importlib.util
import unittest

spec = importlib.util.spec_from_file_location('medium_feed', 'scripts/refresh-medium.py')
feed = importlib.util.module_from_spec(spec)
spec.loader.exec_module(feed)


class MediumFeedTests(unittest.TestCase):
    def test_new_publications_are_sorted_first(self):
        xml = '''<rss><channel>
        <item><title>Older article</title><link>https://medium.com/@viviannemelo/older</link><pubDate>Wed, 28 Oct 2026 11:00:00 GMT</pubDate></item>
        <item><title>New publication</title><link>https://medium.com/@viviannemelo/new?source=rss</link><pubDate>Wed, 18 Nov 2026 11:00:00 GMT</pubDate><description>&lt;p&gt;New article text&lt;/p&gt;</description></item>
        </channel></rss>'''
        posts = feed.parse_feed(xml)
        self.assertEqual(posts[0]['link'], 'https://medium.com/@viviannemelo/new')
        self.assertEqual(posts[0]['date'], '2026-11-18')
        self.assertEqual(posts[0]['excerpt'], 'New article text')
        self.assertEqual(len(posts), 2)

    def test_empty_feed_does_not_replace_saved_articles(self):
        with self.assertRaises(ValueError):
            feed.parse_feed('<rss><channel/></rss>')

    def test_extracts_the_article_cover_not_the_tracking_pixel(self):
        xml = '''<rss><channel><item><title>Cover article</title>
        <link>https://medium.com/@viviannemelo/cover</link><pubDate>Wed, 18 Nov 2026 11:00:00 GMT</pubDate>
        <description>&lt;img src="https://medium.com/_/stat?event=view"&gt;&lt;img src="https://cdn-images-1.medium.com/max/1024/cover.png"&gt;&lt;p&gt;Article text&lt;/p&gt;</description>
        </item></channel></rss>'''
        self.assertEqual(feed.parse_feed(xml)[0]['imageSource'], 'https://cdn-images-1.medium.com/max/1024/cover.png')

    def test_articles_without_cover_do_not_use_tracking_images(self):
        parser = feed.PlainText()
        parser.feed('<img src="https://medium.com/_/stat?event=view">')
        self.assertEqual(parser.image, '')


if __name__ == '__main__':
    unittest.main()