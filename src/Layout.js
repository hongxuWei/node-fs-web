import React from "react";
import { Layout } from "antd";
import Sider from './Sider';

const { Content, Footer } = Layout;
export default function MyLayout(props) {
  const { children } = props;
  return (
    <Layout>
      <Sider />
      <Layout>
        <Content>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: "calc(100vh - 70px)" }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Node File System ©2020
        </Footer>
      </Layout>
    </Layout>
  );
}
