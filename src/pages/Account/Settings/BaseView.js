import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {Form, Input, Upload, Select, Button, message, Modal} from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import {tips} from "../../../utils/utils";
import { baseURL } from '../../../services/baseurl';

// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;
function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJPG) {
    message.error('仅支持jpg和png格式的图片!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不能超过2MB!');
  }
  return isJPG && isLt2M;
}
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.onload = (function () {
    return function () {
      callback(this.result);
    };
  })(img);
  reader.readAsDataURL(img);
}
// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar, that }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      <FormattedMessage id="app.settings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload
      fileList={[]}
      name="avatar"
      className="avatar-uploader"
      showUploadList={false}
      action="//jsonplaceholder.typicode.com/posts/"
      beforeUpload={beforeUpload}
      onChange={that.handleChange}
    >
      <div className={styles.button_view}>
        <Button icon="upload">
          <FormattedMessage id="app.settings.basic.change-avatar" defaultMessage="Change avatar" />
        </Button>
      </div>
    </Upload>
  </Fragment>
);

const validatorGeographic = (rule, value, callback) => {
  const { province, city } = value;
  if (!province.key) {
    callback('Please input your province!');
  }
  if (!city.key) {
    callback('Please input your city!');
  }
  callback();
};

const validatorPhone = (rule, value, callback) => {
  const values = value.split('-');
  if (!values[0]) {
    callback('Please input your area code!');
  }
  if (!values[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class BaseView extends Component {
  state = {
    loading: false,
    imageUrl:'',
    confirmDirty: false, //确认密码
  };
  componentDidMount() {
    this.setBaseInfo();
    this.handleChange = this.handleChange.bind(this);
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser.avatar) {
      return currentUser.avatar;
    }
    const url = `${baseURL}/images/defaultAvatar.png`;
    return url;
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
  getViewDom = ref => {
    this.view = ref;
  };
  //修改基本信息
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'geographic/update',
      payload: fields,
      callback: res => {
        tips(res,this,'user/fetchCurrent');
      },
    });
  };
  //修改头像
  handleChange = (info) => {
    if (!info.fileList.length ||info.file.type == "image/gif") {
      this.setState({ loading: true });
      return;
    }
    getBase64(info.file.originFileObj,(res)=>{
      if (info.fileList.length) {
        const { dispatch, currentUser } = this.props;
        dispatch({
          type: 'geographic/avatarUpload',
          payload: {
            originalAvatar:currentUser.avatar,
            userId:currentUser.userId,
            newAvatar:res
          },
          callback: res => {
            tips(res,this,'user/fetchCurrent');
          },
        });
      }
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      form
    } = this.props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        this.handleUpdate(fieldsValue);
      });
    };

    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={okHandle}>
            {getFieldDecorator('userId', {
              rules: [{ required: false }],
            })(<Input type={'hidden'} />)}
            <FormItem label={formatMessage({ id: 'app.settings.basic.email' })}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: false,
                    message: formatMessage({ id: 'app.settings.basic.email-message' }, {}),
                  },
                ],
              })(<Input type={"text"}/>)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.nickname' })}>
              {getFieldDecorator('nickName', {
                rules: [
                  {
                    required: false,
                    message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
                  },
                ],
              })(<Input type={"text"}/>)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.profile' })}>
              {getFieldDecorator('signature', {
                rules: [
                  {
                    required: false,
                    message: formatMessage({ id: 'app.settings.basic.profile-message' }, {}),
                  },
                ],
              })(
                <Input.TextArea
                  placeholder={formatMessage({ id: 'app.settings.basic.profile-placeholder' })}
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem label="手&emsp;机">
              {getFieldDecorator('mobile', {
                rules: [{ required: false, message: '请输入11位手机号码！', min: 11 }],
              })(<Input placeholder="请输入" maxLength={11} />)}
            </FormItem>
            <FormItem
              label="新密码"
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: false, message: '请输入至少6位数的密码!', min:6
                }, {
                  validator: this.validateToNextPassword,
                }],
              })(
                <Input type="password" autoComplete='new-password' />
              )}
            </FormItem>
            <FormItem
              label="确认新密码"
            >
              {getFieldDecorator('confirm', {
                rules: [{
                  required: false, message: '请重新输入您的密码!'
                }, {
                  validator: this.compareToFirstPassword,
                }],
              })(
                <Input type="password" onBlur={this.handleConfirmBlur} />
              )}
            </FormItem>
            <Button type="primary" htmlType={"submit"}>
              更新基本信息
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView
            avatar={this.getAvatarURL()}
            that={this}
          />
        </div>
      </div>
    );
  }
}

export default BaseView;
