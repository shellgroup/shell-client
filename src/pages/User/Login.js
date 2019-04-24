import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';

import { Alert, Col, Row} from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Captcha, Submit } = Login;

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


  renderMessage = content => (
    <Alert className={styles.mes} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, captchaSrc } = this.state;
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
          <div className={styles.formBox}>
            <div className={styles.showerror}>
              <div className={styles.title}>账号密码登录</div>
              {login.code == '500' && !submitting ? this.renderMessage(login.msg) : null}
            </div>
            <div className={styles.itemInput}>
              <div className={styles.tips}>用户名</div>
              <UserName
                name="userName"
                // placeholder={`${formatMessage({ id: 'app.login.userName' })}`}
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.userName.required' }),
                  },
                ]}
              />
            </div>
            <div className={styles.itemInput}>
              <div className={styles.tips}>密码</div>
              <Password
                name="password"
                // placeholder={`${formatMessage({ id: 'app.login.password' })}`}
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.password.required' }),
                  },
                ]}
              />
            </div>
            <div className={styles.itemInput}>
              <div className={styles.tips}>图形验证码</div>
              <div className={styles.captchaBox}>
                <Captcha
                  name="captcha"
                  // placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
                  rules={[
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.verification-code.required' }),
                    },
                  ]}
                  onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
                />
                <img src={captchaSrc} className={styles.getCaptcha} onClick={() => this.onGetCaptcha()}/>
              </div>
            </div>


          </div>

          <Submit loading={submitting} className={styles.submit}>
            <span className={styles.submitText} >
              <FormattedMessage id="app.login.login" />
            </span>
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
