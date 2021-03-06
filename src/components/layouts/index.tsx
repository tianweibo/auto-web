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
    '/user': 'home',
    '/productLine':'home'
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
        pathname: '/user',
      });
    } else if (e.key === 'actreport') {
      history.push({
        pathname: '/user',
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
      message.error('???????????????????????????');
      return;
    }
    var obj = {
      id: info.id,
      password: form.getFieldValue('password'),
    };
    var res = await resetPassword(obj);
    if (res?.status == 0) {
      message.success(res.msg || '??????????????????');
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
        title="????????????"
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
            label="??????"
            name="password"
            rules={[
              { required: true },
              {
                pattern: /^(\w){6,20}$/,
                message: '??????6-20??????????????????????????????',
              },
            ]}
          >
            <Input.Password placeholder="??????6-20??????????????????????????????" />
          </Form.Item>
          <Form.Item
            label="????????????"
            name="password1"
            rules={[
              { required: true },
              {
                pattern: /^(\w){6,20}$/,
                message: '??????6-20??????????????????????????????',
              },
            ]}
          >
            <Input.Password placeholder="??????6-20??????????????????????????????" />
          </Form.Item>
        </Form>
      </Modal>
      <ConfigProvider locale={zh_CN}>
        <Layout style={layoutStyle}>
          <Header style={headerStyle}>
            <div className={styles.width150}>
              <img className={styles.logo} src={logo} alt="logo" />
              <span className={styles.title}>????????????</span>
            </div>
            <Menu
              onClick={selectedKeysFun}
              defaultSelectedKeys={[selectedKeys]}
              selectedKeys={[selectedKeys]}
              mode="horizontal"
            >
              {/* <Menu.Item key="analysis" disabled>
              ????????????
            </Menu.Item> */}
              <Menu.Item key="actreport">??????????????????</Menu.Item>
              <Menu.Item key="home">????????????</Menu.Item>
            </Menu>
            <div className={styles.rowPos}>
              <span
                onClick={setPassword}
                style={{ cursor: 'pointer', marginRight: '5px' }}
              >
                {info.realname}
              </span>
              <span onClick={loginout1} className={styles.tuichu}>
                ??????
              </span>
              <a
                href="http://fed.enbrands.com/buried-docs/sdkDocs/"
                target="_blank"
              >
                ????????????
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
                    <SubMenu key="/user" icon={<UserOutlined />} title="??????">
                      <Menu.Item key="user">
                        <Link to="/user">????????????</Link>
                      </Menu.Item>
                      <Menu.Item key="productLine">
                        <Link to="/productLine">?????????</Link>
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
                    title="??????"
                  >
                    <Menu.Item key="report">
                      <Link to="/report">????????????</Link>
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
