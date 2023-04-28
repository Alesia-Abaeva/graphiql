import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button, Space, Typography } from 'antd';

const { Title, Text } = Typography;

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <Space direction="vertical">
        <Title level={1}>Home Page / Welcome Page</Title>
        <Title level={2}>Hello world!</Title>
        <Title level={3}>Title Primary</Title>
        <Space>
          <Text>Text default</Text>
          <Text type="secondary">Text secondary</Text>
          <Button type="primary" size="large">
            Test btn
          </Button>
        </Space>
      </Space>

      <div className="test-block">
        <div className="test-block-second" />
      </div>

      <ul>
        <li>
          <Link to="/login">
            <Typography.Link>Login</Typography.Link>
          </Link>
        </li>
        <li>
          <Link to="/signup">
            <Typography.Link>Signup</Typography.Link>
          </Link>
        </li>
        <li>
          <Link to="/sandbox">
            <Typography.Link>Sandbox</Typography.Link>
          </Link>
        </li>
        <li>
          <Link to="/wiuehrfieohf">
            <Typography.Link>404</Typography.Link>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default Home;
