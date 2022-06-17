import { Avatar, Card, Col, Divider, Row, Statistic } from 'antd';
import {
  GithubOutlined,
  ForkOutlined,
  StarOutlined,
  EyeOutlined,
  HomeOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';
import Meta from "antd/lib/card/Meta";

export default function Repository ({
  name, description, language, license='None', url,
  homepageUrl, stargazerCount, watchers, forks, avatarUrl,
}) {
  return (
    <Card
      key={name}
      className="repository"
      actions={[
        <Statistic title="Webpage" value=" " prefix={<a href={homepageUrl} target="_blank" rel="noreferrer"><HomeOutlined /></a>} />,
        <Statistic title="Repository" value=" " prefix={<a href={url} target="_blank" rel="noreferrer"><GithubOutlined /></a>} />,
        <Statistic title="Forks" value={forks} prefix={<ForkOutlined />} />,
        <Statistic title="Stargazers" value={stargazerCount} prefix={<StarOutlined />} />,
        <Statistic title="Watchers" value={watchers} prefix={<EyeOutlined />} />
      ]}
    >
      <Meta
        avatar={<Avatar shape="square" size="large" src={avatarUrl} />}
        title={name}
        description={
          <>
            {description}
            <Divider orientation="right" plain>Details</Divider>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic title="License" value={license || ' '} prefix={<FileProtectOutlined />} />
              </Col>
              <Col span={12}>
                <Statistic title="Language" value={language} />
              </Col>
            </Row>
          </>
        }
      />
    </Card>
  );
};