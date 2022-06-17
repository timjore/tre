import { useEffect, useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  // ApolloProvider,
  // useQuery,
  gql
} from "@apollo/client";

import './App.css';
import Repository from "./components/Repository";
import { Collapse, Divider, PageHeader, Space } from "antd";

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  cache: new InMemoryCache(),
  headers: { Authorization: `bearer ${process.env.REACT_APP_GITHUB_TOKEN}` },
});

function objectArrayToCSV(objArray=[{}]) {
  let csv = '';
  const headers = Object.keys(objArray[0]);
  if (headers.length) { // only continue if it found keys/headers
    const rows = objArray.map(object => (
      // get all values in order of headers in case not same order
      headers.map(key => {
        let cell = `${object[key]?.toString() || ''}`; // convert to string in case number or else
        if (cell?.includes('"')) { // if includes a double quote
          cell &&= cell?.replaceAll('"','\\"'); // escape
          cell &&= `"${cell}"`; // wrap in quotes
        };
        return cell;
      }).join(',') // delimit
    ));
    const data = [headers.join(','), ...rows]; // don't forget header row
    csv = data.join('\r\n'); // delimit
  };
  return csv;
};

function App() {
  const [data, setData] = useState();

  useEffect(() => {
    client.query({
      query: gql`{
        topic(name: "scripture-open-components") {
          name
          repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
            nodes {
              name
              description
              url
              homepageUrl
              licenseInfo {
                name
              }
              primaryLanguage {
                name
              }
              watchers {
                totalCount
              }
              stargazerCount
              forks {
                totalCount
              }
              owner {
                ... on Organization {
                  avatarUrl
                }
                ... on User {
                  avatarUrl
                }
              }
            }
            totalCount
          }
          stargazerCount
        }
      }`
    })
    .then(result => setData(result.data));
  }, []);

  const { name: topicName, stargazerCount } = data?.topic || {};
  const { totalCount: repositoryCount, nodes: _repositories } = data?.topic?.repositories || {};
  
  const repositories = _repositories?.map(({
    name, description, url, homepageUrl, stargazerCount, 
    licenseInfo, primaryLanguage, watchers, forks, owner,
  }) => ({
    name,
    description: description || 'Needs description.', 
    url, homepageUrl, stargazerCount, 
    license: licenseInfo?.name,
    language: primaryLanguage?.name,
    watchers: watchers?.totalCount,
    forks: forks?.totalCount,
    avatarUrl: owner?.avatarUrl,
  }));

  const repositoriesComponents = repositories?.map(Repository);

  const csv = objectArrayToCSV(repositories);

  return (
    <div className="App">
      <PageHeader
        className="site-page-header"
        title={topicName}
        subTitle={`Repositories: ${repositoryCount} - Stargazers: ${stargazerCount}`}
      />
      <div className="site-card-border-less-wrapper">
        <Space size={[8, 16]} wrap>
          {repositoriesComponents}
        </Space>
        <Divider dashed />
        <Collapse>
          <Collapse.Panel header="CSV Data" key="1">
            <pre contentEditable suppressContentEditableWarning>
              {csv}
            </pre>
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default App;
