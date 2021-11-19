import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { login } from './service';
import userIcon from '@/assets/userIcon.png';
import passIcon from '@/assets/passIcon.png';
import styles from './index.less';
import OmegaLogger from 'buried-points-sdk-all';
import { history } from 'umi';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const userInput = (e: any) => {
    setUsername(e.target.value);
  };
  const passInput = (e: any) => {
    setPassword(e.target.value);
  };

  const toLogin = async () => {
    var obj = {
      username: username,
      password: password,
    };
    if (username == '') {
      message.warning('账号不能为空');
      return;
    }
    if (password == '') {
      message.warning('密码不能为空');
      return;
      return;
    }
    const res: any = await login(obj);
    debugger
    if (res.status == 0) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('info', JSON.stringify(res.data.data));
      OmegaLogger.setAsyncConfig({
        merchant_id: res?.data?.data?.id, //shopid
        distinct_id: res?.data?.data?.id, //userid
      });
      history.push({
        pathname: '/user',
      });
      
    }
  };
  return (
    <div className={styles.main}>
      <div className={styles.login}>
        {/* <Form {...layout} name="basic" onFinish={toLogin}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form> */}
        <div className={styles.login_con}>埋点平台</div>
        <div className={styles.login_input}>
          <img className={styles.login_icon} src={userIcon} />
          <input
            type="text"
            className={styles.icon_input}
            onChange={userInput}
          />
        </div>
        <div className={styles.login_input}>
          <img className={styles.login_icon} src={passIcon} />
          <input
            type="password"
            className={styles.icon_input}
            onChange={passInput}
          />
        </div>
        <div className={styles.login_button} onClick={toLogin}>
          登录
        </div>
      </div>
    </div>
  );
};
export default Login;
