import { Link, IRouteComponentProps } from 'umi';
import {
  Layout,
  message,
  Menu,
  ConfigProvider,
  Modal,
  Form,
  Input,
  Button,
} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { loginOut, resetPassword } from '../../pages/login/service';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  AppstoreOutlined,
  TagOutlined,
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import styles from './style.less';
import logo from '@/assets/logo1.png';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
export default function IndexLayout({
  children,
  location,
  route,
  match,
}: IRouteComponentProps) {
  const [selectedKeys, setselectedKeys] = useState('home');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [info, setInfo] = useState({});
  const [tempEnum, setTempEnum] = useState({
    '/app': 'home',
    '/event': 'home',
    '/attribute': 'home',
    '/indicator': 'home',
    '/user': 'home',
    '/label': 'home',
    '/report/create': 'actreport',
    '/report': 'actreport',
  });
  const [form] = Form.useForm();
  const layoutStyle = {
    height: '100vh',
  };
  const headerStyle = {
    padding: '0 20px',
    backgroundColor: '#fff',
    display: 'flex',
    borderBottom: '1px solid #efefef',
    boxShadow: '0 8px 24px -2px rgb(0 0 0 / 5%)',
    height: '64px',
  };
  const selectedKeysFun = (e: any) => {
    setselectedKeys(e.key);
    if (e.key === 'home') {
      history.push({
        pathname: '/event',
      });
    } else if (e.key === 'actreport') {
      history.push({
        pathname: '/report',
      });
    }
  };
  const loginout1 = async () => {
    var res = await loginOut();
    if (res.status == 0) {
      localStorage.removeItem('info');
      localStorage.removeItem('token');
      history.push({
        pathname: '/login',
      });
    }
  };
  const setPassword = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    if (!form) return;
    form.submit();
    //setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onFinish = async (values: any) => {
    if (form.getFieldValue('password') !== form.getFieldValue('password1')) {
      message.error('密码前后输入不一致');
      return;
    }
    var obj = {
      id: info.id,
      password: form.getFieldValue('password'),
    };
    var res = await resetPassword(obj);
    if (res?.status == 0) {
      message.success(res.msg || '密码修改成功');
    }
    setIsModalVisible(false);
  };
  useEffect(() => {
    var sj = JSON.parse(localStorage.getItem('info'));
    setInfo(sj);
    setselectedKeys(tempEnum[history.location.pathname]);
    history.listen((event) => {
      if (event.pathname.indexOf('/report') > -1) {
        setselectedKeys('actreport');
      } else {
        setselectedKeys('home');
      }
    });
  }, []);
  return (
    <>
      <Modal
        title="密码设置"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true },
              {
                pattern: /^(\w){6,20}$/,
                message: '输入6-20个字母、数字、下划线',
              },
            ]}
          >
            <Input.Password placeholder="输入6-20个字母、数字、下划线" />
          </Form.Item>
          <Form.Item
            label="密码确认"
            name="password1"
            rules={[
              { required: true },
              {
                pattern: /^(\w){6,20}$/,
                message: '输入6-20个字母、数字、下划线',
              },
            ]}
          >
            <Input.Password placeholder="输入6-20个字母、数字、下划线" />
          </Form.Item>
        </Form>
      </Modal>
      <ConfigProvider locale={zh_CN}>
        <Layout style={layoutStyle}>
          <Header style={headerStyle}>
            <div className={styles.width150}>
              <img className={styles.logo} src={logo} alt="logo" />
              <span className={styles.title}>埋点平台</span>
            </div>
            <Menu
              onClick={selectedKeysFun}
              defaultSelectedKeys={[selectedKeys]}
              selectedKeys={[selectedKeys]}
              mode="horizontal"
            >
              {/* <Menu.Item key="analysis" disabled>
              埋点分析
            </Menu.Item> */}
              <Menu.Item key="actreport">互动自助报表</Menu.Item>
              <Menu.Item key="home">接入管理</Menu.Item>
            </Menu>
            <div className={styles.rowPos}>
              <span
                onClick={setPassword}
                style={{ cursor: 'pointer', marginRight: '5px' }}
              >
                {info.realname}
              </span>
              <span onClick={loginout1} className={styles.tuichu}>
                退出
              </span>
              <a
                href="http://fed.enbrands.com/buried-docs/sdkDocs/"
                target="_blank"
              >
                操作手册
              </a>
            </div>
          </Header>
          <Layout>
            <Sider width={200} className="site-layout-background">
              {selectedKeys === 'home' ? (
                <Menu
                  mode="inline"
                  defaultSelectedKeys={[
                    history.location.pathname.replace('/', ''),
                  ]}
                  defaultOpenKeys={[history.location.pathname]}
                  style={{ height: '100%', borderRight: 0 }}
                >
                  <SubMenu key="/event" icon={<LaptopOutlined />} title="事件">
                    <Menu.Item key="event">
                      <Link to="/event">事件管理</Link>
                    </Menu.Item>
                  </SubMenu>
                  {/* <SubMenu key="/attribute" icon={<LaptopOutlined />} title="属性">
                  <Menu.Item key="attribute">
                    <Link to="/attribute">属性管理</Link>
                  </Menu.Item>
                </SubMenu> */}
                  <SubMenu
                    key="/indicator"
                    icon={<LaptopOutlined />}
                    title="指标"
                  >
                    <Menu.Item key="indicator">
                      <Link to="/indicator">指标列表</Link>
                    </Menu.Item>
                  </SubMenu>
                  <SubMenu key="/app" icon={<AppstoreOutlined />} title="应用">
                    <Menu.Item key="app">
                      <Link to="/app">应用管理</Link>
                    </Menu.Item>
                  </SubMenu>
                  {info.role == 10 && (
                    <SubMenu key="/user" icon={<UserOutlined />} title="用户">
                      <Menu.Item key="user">
                        <Link to="/user">用户管理</Link>
                      </Menu.Item>
                      <Menu.Item key="productLine">
                        <Link to="/productLine">产品线</Link>
                      </Menu.Item>
                    </SubMenu>
                  )}
                  {info.role == 10 && (
                    <SubMenu key="/label" icon={<TagOutlined />} title="标签">
                      <Menu.Item key="label">
                        <Link to="/label">标签管理</Link>
                      </Menu.Item>
                    </SubMenu>
                  )}
                </Menu>
              ) : null}
              {selectedKeys === 'analysis' ? (
                <Menu
                  mode="inline"
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  style={{ height: '100%', borderRight: 0 }}
                >
                  <SubMenu key="sub1" icon={<LaptopOutlined />} title="指标">
                    <Menu.Item key="1">
                      <Link to="/tag">指标列表</Link>
                    </Menu.Item>
                  </SubMenu>
                </Menu>
              ) : null}
              {selectedKeys === 'actreport' ? (
                <Menu
                  mode="inline"
                  defaultSelectedKeys={[
                    history.location.pathname.replace('/', ''),
                  ]}
                  defaultOpenKeys={[history.location.pathname]}
                  style={{ height: '100%', borderRight: 0 }}
                >
                  <SubMenu
                    key="/report"
                    icon={<NotificationOutlined />}
                    title="报表"
                  >
                    <Menu.Item key="report">
                      <Link to="/report">报表管理</Link>
                    </Menu.Item>
                  </SubMenu>
                </Menu>
              ) : null}
            </Sider>
            <Layout style={{ padding: '15px', overflowY: 'auto' }}>
              <Content
                className="site-layout-background"
                style={{
                  minHeight: 280,
                }}
              >
                {children}
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </ConfigProvider>
    </>
  );
}
