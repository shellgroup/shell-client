import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Upload, Select, Button, message } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import {tips} from "../../../utils/utils";
import { avatarUrl } from '../../../services/baseurl';

// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
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
    imageUrl:''
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
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    return url;
  }

  getViewDom = ref => {
    this.view = ref;
  };


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
            console.log(res,88888888888888);
            tips(res,this,'user/fetchCurrent');
          },
        });
      }
    })
  }
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label={formatMessage({ id: 'app.settings.basic.email' })}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.email-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.nickname' })}>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.profile' })}>
              {getFieldDecorator('profile', {
                rules: [
                  {
                    required: true,
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
            {/*<FormItem label={formatMessage({ id: 'app.settings.basic.country' })}>*/}
              {/*{getFieldDecorator('country', {*/}
                {/*rules: [*/}
                  {/*{*/}
                    {/*required: true,*/}
                    {/*message: formatMessage({ id: 'app.settings.basic.country-message' }, {}),*/}
                  {/*},*/}
                {/*],*/}
              {/*})(*/}
                {/*<Select style={{ maxWidth: 220 }}>*/}
                  {/*<Option value="China">中国</Option>*/}
                {/*</Select>*/}
              {/*)}*/}
            {/*</FormItem>*/}
            {/*<FormItem label={formatMessage({ id: 'app.settings.basic.geographic' })}>*/}
              {/*{getFieldDecorator('geographic', {*/}
                {/*rules: [*/}
                  {/*{*/}
                    {/*required: true,*/}
                    {/*message: formatMessage({ id: 'app.settings.basic.geographic-message' }, {}),*/}
                  {/*},*/}
                  {/*{*/}
                    {/*validator: validatorGeographic,*/}
                  {/*},*/}
                {/*],*/}
              {/*})(<GeographicView />)}*/}
            {/*</FormItem>*/}
            {/*<FormItem label={formatMessage({ id: 'app.settings.basic.address' })}>*/}
              {/*{getFieldDecorator('address', {*/}
                {/*rules: [*/}
                  {/*{*/}
                    {/*required: true,*/}
                    {/*message: formatMessage({ id: 'app.settings.basic.address-message' }, {}),*/}
                  {/*},*/}
                {/*],*/}
              {/*})(<Input />)}*/}
            {/*</FormItem>*/}
            <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}>
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
                  },
                  { validator: validatorPhone },
                ],
              })(<PhoneView />)}
            </FormItem>
            <Button type="primary">
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView
            avatar={this.getAvatarURL().indexOf("http") == -1?`${avatarUrl}/images/${this.getAvatarURL()}`:this.getAvatarURL()}
            that={this}
          />
        </div>
      </div>
    );
  }
}

export default BaseView;
