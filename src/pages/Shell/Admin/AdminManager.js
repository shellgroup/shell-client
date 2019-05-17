import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Modal,
  Badge,
  Divider,
  Radio,
  TreeSelect,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { tips, disablesBtns, showDeleteConfirmParames, child, regs } from '../../../utils/utils';
import styles from './AdminManager.less';

/**
 * 管理员管理
 * */
const showDeleteTipsParames = showDeleteConfirmParames();
const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing'];
const status = ['停用', '正常'];

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    onChangeTreeSelect,
    isExistByUserName,
    UserNameOnChange,
    handleChange,
    unamevalue,
    deptData,
    userName,
    roleData,
    statusValue,
    that,
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err || userName) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  //处理角色数据
  const roleValues = [];
  if (roleData) {
    for (let i = 0; i < roleData.length; i++) {
      roleValues.push(<Option key={ roleData[i].roleId } value={roleData[i].roleId} title={roleData[i].roleName} >{roleData[i].roleName}</Option>);
    }
  }



  function handleConfirmBlur(e) {
    const value = e.target.value;
    that.setState({ confirmDirty: that.state.confirmDirty || !!value });
  }

  function compareToFirstPassword(rule, value, callback) {
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  }

  function validateToNextPassword(rule, value, callback) {
    if (value && that.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  let formUserName = {};
  if(userName){
    formUserName = {
      validateStatus:"error",
      help:"用户名已存在"
    }
  }
  return (
    <Modal
      destroyOnClose
      title="新增管理员"
      width={940}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="用户名"
        {...formUserName}
      >
        {form.getFieldDecorator('username', {
          rules: [
            { required: true, message: '请在输入至少2个字符的用户名!', min:2}
          ],
        })(<Input placeholder="请输入用户名" onBlur={isExistByUserName} maxLength={15} autoComplete='off' onChange={that.parseVaule}/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密&emsp;码">
        {form.getFieldDecorator('password', {
          rules: [
            {
              required: true,
              message: '请输入6~18位字符密码!',
              min: 6,
            },
            {
              validator: validateToNextPassword,
            },
          ],
        })(<Input type="password" placeholder="请输入密码" maxLength={18} autoComplete='new-password' />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="确认密码">
        {form.getFieldDecorator('confirm', {
          rules: [
            {
              required: true,
              message: '请重新输入您的密码!',
            },
            {
              validator: compareToFirstPassword,
            },
          ],
        })(<Input type="password" placeholder="请重新输入您的密码" maxLength={18} onBlur={handleConfirmBlur} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮&emsp;箱">
        {form.getFieldDecorator('email', {
          rules: [
            { type: 'email', message: '您输入的邮箱格式不正确！' },
            { required: true, message: '请输入您的邮箱！' },
          ],
        })(<Input placeholder="请输入您的邮箱" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手&emsp;机">
        {form.getFieldDecorator('mobile', {
          rules: [{ required: true, message: '请输入11位手机号码！', min: 11 }],
        })(<Input placeholder="请输入手机号码" maxLength={11} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属渠道商">
        {form.getFieldDecorator('deptId', {
          rules: [{ required: true, message: '请选择所属渠道商！' }],
        })(
          <TreeSelect
            className={styles.width}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={child(deptData)}
            dropdownMatchSelectWidth={false}
            treeDefaultExpandAll={false}
            placeholder="请选择渠道商"
            //onChange={onChangeTreeSelect}
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角&emsp;色">
        {form.getFieldDecorator('roleIdList', {
          rules: [{ required: true , message: '请选择所角色！' }],
        })(
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择角色"
            onChange={handleChange}
          >
            {roleValues}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状&emsp;态">
        {form.getFieldDecorator('status', {
          rules: [{ required: false }],
          initialValue: statusValue,
        })(
          <RadioGroup>
            <Radio value={1}>正常</Radio>
            <Radio value={0}>停用</Radio>
          </RadioGroup>
        )}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      formVals: {
        name: props.values.username,
        key: props.values.userId,
        deptId: props.values.deptId,
        deptName: props.values.deptName,
        email: props.values.email,
        mobile: props.values.mobile,
        roleIdList: props.values.roleIdList,
        status: props.values.status,
        userId: props.values.userId,
        username: props.values.username,
      },
      currentStep: 0,
      confirmDirty: false,
    };

    this.formLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }

  render() {
    const {
      updateModalVisible,
      handleUpdateModalVisible,
      values,
      roleData,
      deptData,
      handleUpdate,
      that,
    } = this.props;
    const { user:{currentUser:{userId}} } = that.props;
    const { formVals } = this.state;
    const { form } = this.props;
    //处理角色数据
    const roleValues = [];
    for (let i = 0; i < roleData.length; i++) {
      roleValues.push(<Option key={roleData[i].roleId} value={roleData[i].roleId} title={roleData[i].roleName} >{roleData[i].roleName}</Option>);
    }


    function handleConfirmBlur(e) {
      const value = e.target.value;
      that.setState({ confirmDirtyUp: that.state.confirmDirtyUp || !!value });
    }

    function compareToFirstPassword(rule, value, callback) {
      if (value && value !== form.getFieldValue('password2')) {
        callback('两次输入的密码不一致!');
      } else {
        callback();
      }
    }

    function validateToNextPassword(rule, value, callback) {
      if (value && that.state.confirmDirtyUp) {
        form.validateFields(['confirm2'], { force: true });
      }
      callback();
    }

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleUpdate(fieldsValue);
      });
    };
    return (
      <Modal
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="更新管理员"
        width={940}
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible(false)}
      >
        {form.getFieldDecorator('userId', {
          rules: [{ required: false }],
          initialValue: formVals.userId,
        })(<Input type={'hidden'} />)}
        <FormItem {...this.formLayout} label="用户名">
          {form.getFieldDecorator('username', {
            rules: [{ required: false, message: '请输入至少2个字符的用户名 ！', min: 2 }],
            initialValue: formVals.name,
          })(<Input placeholder="请输入用户名" maxLength={15} disabled={true} onChange={that.parseVaule}/>)}
        </FormItem>

        <FormItem {...this.formLayout} label="密&emsp;码">
          {form.getFieldDecorator('password2', {
            rules: [
              {
                required: false,
                message: '请输入6~18位字符密码!',
                min: 6,
              },
              {
                validator: validateToNextPassword,
              },
            ],
          })(<Input type="password" placeholder="请输入密码" maxLength={18} autoComplete={"new-password"}/>)}
        </FormItem>
        <FormItem {...this.formLayout} label="确认密码">
          {form.getFieldDecorator('confirm2', {
            rules: [
              {
                required: false,
                message: '请在次输入您的密码!',
              },
              {
                validator: compareToFirstPassword,
              },
            ],
          })(<Input type="password" placeholder="请在次输入您的密码" onBlur={handleConfirmBlur} maxLength={18} autoComplete='new-password'/>)}
        </FormItem>

        <FormItem {...this.formLayout} label="邮&emsp;箱">
          {form.getFieldDecorator('email', {
            rules: [
              { type: 'email', message: '您输入的邮箱格式不正确！' },
              { required: false, message: '请输入您的邮箱！' },
            ],
            initialValue: formVals.email,
          })(<Input placeholder="请输入您的邮箱" />)}
        </FormItem>
        <FormItem {...this.formLayout} label="手&emsp;机">
          {form.getFieldDecorator('mobile', {
            rules: [{ required: false, message: '请输入11位手机号码！', min: 11 }],
            initialValue: formVals.mobile,
          })(<Input placeholder="请输入手机号码" maxLength={11} />)}
        </FormItem>
        <FormItem {...this.formLayout} label="所属渠道商">
          {form.getFieldDecorator('deptId', {
            rules: [{ required: false, message: '请选择所属渠道商！' }],
            initialValue: formVals.deptId,
          })(
            <TreeSelect
              className={styles.width}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={deptData}
              dropdownMatchSelectWidth={false}
              treeDefaultExpandAll={false}
              placeholder="请选择渠道商"
              disabled={(formVals.userId == userId)?true:false}
              // onChange={onChangeTreeSelect}
            />
          )}
        </FormItem>
        <FormItem {...this.formLayout} label="角&emsp;色">
          {form.getFieldDecorator('roleIdList', {
            rules: [{ required: false }],
            initialValue: formVals.roleIdList
          })(
            <Select mode="multiple" disabled={(formVals.userId == userId)?true:false} style={{ width: '100%' }} placeholder="请选择角色" >
              {roleValues}
            </Select>
          )}
        </FormItem>
        <FormItem {...this.formLayout} label="状&emsp;态">
          {form.getFieldDecorator('status', {
            rules: [{ required: false }],
            initialValue: formVals.status
          })(
            <RadioGroup disabled={(formVals.userId == userId)?true:false}>
              <Radio value={1}>正常</Radio>
              <Radio value={0}>停用</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ usr, user, channel, roleAdmin, loading }) => ({
  usr,
  channel,
  user,
  roleAdmin,
  loading: loading.effects[('usr/fetch', 'channel/fetch', 'roleAdmin/fetch', 'user/fetchCurrent')],
}))
@Form.create()
class AdminManager extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    key: 'userId', //列表的唯一键
    statusValue: 1, //状态默认选中正常 0正常 1停用
    roleData: [], //角色下拉菜单数据
    deptData: [], //渠道商树菜单数据
    confirmDirty: false, //确认密码
    confirmDirtyUp: false, //确认密码
    DeleteBtn: false,
    userName: false,
    SaveBtn: false,
    UpdateBtn: false,
    ShowList: false,
    unamevalue:"",
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'usr/fetch',
    });
    dispatch({
      type: 'channel/fetch',
      callback: res => {
        if (res.code == 0) {
          this.setState({
            deptData: res.list,
          });
        }
      },
    });
    dispatch({
      type: 'roleAdmin/fetch',
      callback: res => {
        if (res.code == 0) {
          this.setState({
            roleData: res.list,
          });
        }
      },
    });
    //调用utils里面的disablesBtns方法判断是否有权限
    disablesBtns(this);
  }

  columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      align:'center',
    },
    {
      title: '所属渠道商',
      dataIndex: 'deptName',
      align:'center',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align:'center',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      align:'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      align:'center',
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align:'center',
      // sorter: true,
      // render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      align:'center',
      width: 200,
      render: (text, record) => (
        <Fragment>
          {this.state.UpdateBtn && (
            <Button type={'primary'} onClick={() => this.handleUpdateModalVisible(true, record)}>
              修改
            </Button>
          )}
          {this.state.UpdateBtn && this.state.DeleteBtn && <Divider type="vertical" />}
          {this.state.DeleteBtn && (
            <Button type={'primary'} onClick={() => this.showDeleteConfirm(record)}>
              删除
            </Button>
          )}
        </Fragment>
      ),
    },
  ];

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'usr/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'usr/fetch',
      payload: {},
      callback: res => {
        tips(res);
      },
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  onChangeTreeSelect = value => {
  };
  handleChange = value => {
  };
  isExistByUserName = e =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'usr/isExistByUserName',
      payload: {
        userName: e.target.value.replace(/\s/g,"")
      },
      callback: res => {

        let us = false;
        if(res == "exist"){
          us = true;
        }
        this.setState({
            userName: us,
        });
        dispatch({
          type: 'usr/fetch',
        });
      },
    });
  };
  //用户名过滤特殊字符
  parseVaule = e =>{
    let str = e.target.value;
    // let pattern = new RegExp("[a-zA-Z\\d\u4e00-\u9fa5]");
    // var rs = "";
    // for (let i = 0; i < str.length; i++) {
    //   if(pattern.test(str[i])){
    //     rs+=str[i];
    //   }
    // }
    return e.target.value = regs(str,1);
  };
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        username: fieldsValue.name,
        deptId: fieldsValue.deptNo,
        mobile: fieldsValue.phone,
      };
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'usr/fetch',
        payload: values,
      });
    });
  };
  //新建用户
  handleModalVisible = flag => {
    const { channel, roleAdmin } = this.props;

    this.setState({
      modalVisible: !!flag,
      roleData: roleAdmin.data.list,
      deptData: channel.data.list,
      userName: false
    });
  };
  handleAdd = fields => {
    const { dispatch, usr } = this.props;
    fields.username = fields.username.replace(/\s/g,"");
    dispatch({
      type: 'usr/add',
      payload: fields,
      callback: res => {
        tips(res, this, 'usr/fetch');
        this.setState({
          userName: false
        })
      },
    });


    this.handleModalVisible();
  };
  //修改用户信息
  handleUpdateModalVisible = (flag, record) => {
    const { channel, roleAdmin } = this.props;
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
      roleData: roleAdmin.data.list,
      deptData: channel.data.list,
    });
  };
  //删除用户信息
  showDeleteConfirm = record => {
    let that = this;
    confirm({
      ...showDeleteTipsParames,
      onOk() {
        that.deleted(record);
      },
      onCancel() {
      },
    });
  };
  deleted = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'usr/remove',
      payload: [record.userId],
      callback: res => {
        tips(res, this, 'usr/fetch');
      },
    });
  };
  //批量删除
  showDeletesConfirm = () => {
    let that = this;
    confirm({
      ...showDeleteTipsParames,
      onOk() {
        that.handleMenuClick();
      },
      onCancel() {
        that.setState({
          selectedRows: [],
        });
      },
    });
  };
  handleMenuClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    dispatch({
      type: 'usr/remove',
      payload: selectedRows.map(row => row.userId),
      callback: res => {
        tips(res, this, 'usr/fetch');
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    fields.username = fields.username.replace(/\s/g,"");
    fields.confirm = fields.confirm2;
    fields.password = fields.password2;

    dispatch({
      type: 'usr/update',
      payload: fields,
      callback: res => {
        tips(res, this, 'usr/fetch');
        this.setState({
          selectedRows: [],
        });
      },
    });

    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机">
              {getFieldDecorator('phone')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机">
              {getFieldDecorator('phone')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属渠道商">
              {getFieldDecorator('deptNo', {
                rules: [{ required: false, message: '请选择所属渠道商！' }],
              })(
                <TreeSelect
                  className={styles.width}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={this.state.deptData}
                  dropdownMatchSelectWidth={false}
                  treeDefaultExpandAll={false}
                  placeholder="请选择渠道商"
                  // onChange={onChangeTreeSelect}
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      usr: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues, unamevalue, roleData, deptData, statusValue, ShowList, key, userName } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      onChangeTreeSelect: this.onChangeTreeSelect,
      handleChange: this.handleChange,
      isExistByUserName: this.isExistByUserName,
      UserNameOnChange: this.UserNameOnChange,
      roleData: roleData,
      userName: userName,
      unamevalue:unamevalue,
      deptData: deptData,
      statusValue: statusValue,
      that: this,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      roleData: roleData,
      deptData: deptData,
      that: this,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {this.state.SaveBtn && (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                </Button>
              )}
              {selectedRows.length > 0 && this.state.DeleteBtn && (
                <span>
                  <Button onClick={this.showDeletesConfirm}>批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              bordered={true}
              tableAlert={true}
              data={ShowList ? data : {}}
              rowKey={key}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default AdminManager;
