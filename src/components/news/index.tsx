import React from 'react';
import Parser from 'rss-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow } from 'date-fns';
import UserLayout from '../UserLayout';
import DashboardComponent from '../DashboardComponent';

type NewsDashboardProps = {}

type NewsDashboardState = {
  newsItems: NewsItem[],
  loading: boolean,
  lastRefresh: string,
}
type NewsItem = {
  title: string,
  url: string,
  preview: string,
  guid: string,
}

class NewsDashboard extends DashboardComponent<
  NewsDashboardProps, NewsDashboardState> {
  private parser: Parser<{lastBuildDate: string}, NewsItem> = new Parser({});

  private lastRefresh?: Date;

  private refreshTimeInterval?: number;

  constructor(props: NewsDashboardProps) {
    super(props);

    this.state = {
      newsItems: [],
      loading: true,
      lastRefresh: '',
    };
  }

  async componentDidMount() {
    await this.getNews();

    this.refreshTimeInterval = window.setInterval(() => {
      this.updateRefreshDisplay();
    }, 10 * 1000);
  }

  updateRefreshDisplay() {
    if (this.lastRefresh === undefined) return;

    this.setState({
      lastRefresh: formatDistanceToNow(this.lastRefresh),
    });
  }

  componentWillUnmount() {
    clearInterval(this.refreshTimeInterval);
  }

  async getNews() {
    this.setState({
      loading: true,
    });

    function truncate(str: string, len: number): string {
      if (str.length <= len) {
        return str;
      }

      return `${str.substr(0, len).trim()}...`;
    }

    try {
      const feed = await this.parser.parseURL('/api/news');
      // console.log(feed.title);

      this.lastRefresh = new Date(feed.lastBuildDate);
      this.updateRefreshDisplay();
      this.setState({
        newsItems: feed.items.map<NewsItem>(item => ({
          title: item.title,
          url: item.link!,
          preview: truncate(item.contentSnippet!, 300),
          guid: item.guid,
        })),
        loading: false,
      });
    } catch (error) {
      const { addError } = this.context;
      addError(error.toString());
    }
  }

  render() {
    // const { rows, timesheetEditModalOpen, selectedRow } = this.state;
    const { newsItems, lastRefresh } = this.state;

    return (
      <UserLayout icon={faNewspaper} name="News">
        {this.state.loading === false || this.state.newsItems.length !== 0 ? (
          <>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              role="button"
              tabIndex={0}
              onClick={() => this.getNews()}
              onKeyPress={(e) => { if (e.key === 'Enter') this.getNews(); }}
              className="m-5 has-text-white"
              style={{ position: 'absolute', top: '0', right: '0' }}
            >
              Current as of:
              {' '}
              {lastRefresh !== null ? `${lastRefresh} ago` : 'n/a'}
              {this.state.loading ? <span className="ml-2"><FontAwesomeIcon icon={faCircleNotch} className="fa-spin" /></span> : <></>}
            </a>
            <div className="columns is-multiline">
              {newsItems.map(newsItem => (
                <div className="column is-half" key={newsItem.guid}>
                  <a href={newsItem.url} target="_blank" rel="noreferrer noopener">
                    <div className="card">
                      <div className="card-content">
                        <h3 className="is-size-4">{newsItem.title}</h3>
                        <p>{newsItem.preview}</p>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </>
        ) : <></>}
      </UserLayout>
    );
  }
}

export default NewsDashboard;
