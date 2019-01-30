import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import {Checkbox, Alert, Icon, Col, Row} from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    captchaSrc: ''
  };
  componentDidMount() {
    //初始化验证码
    this.onGetCaptcha()
  }

  onTabChange = type => {
    this.setState({ type });
  };
  //获取验证码
  onGetCaptcha = () =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'login/getCaptcha',
      payload: new Date().getTime(),
      callback:(res)=>{
        this.setState({
          captchaSrc:res
        });
      }
    })
  };
  handleSubmit = (err, values) => {
    const { type } = this.state;
    console.log(err,values,7777);
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
        callback:(res)=>{
          if(res.code==500){
            this.onGetCaptcha();
          }
        }
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin, captchaSrc } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {login.code == '500' && !submitting ? this.renderMessage(login.msg) : null}
            <UserName
              name="userName"
              placeholder={`${formatMessage({ id: 'app.login.userName' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'app.login.password' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
              ]}
            />
              <Row gutter={8}>
                <Col span={16}>
                  <Captcha
                    name="captcha"
                    placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
                    rules={[
                      {
                        required: true,
                        message: formatMessage({ id: 'validation.verification-code.required' }),
                      },
                    ]}
                    onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
                  />
                </Col>
                <Col span={8}>
                  <img src={captchaSrc} className={styles.getCaptcha} onClick={() => this.onGetCaptcha()}/>
                </Col>
              </Row>
          </Tab>

          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
