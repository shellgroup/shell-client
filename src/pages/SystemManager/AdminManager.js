import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  Switch,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  TreeSelect,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import TreeSeltctInput from '@/components/TreeSeltctInput'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { tips } from '../../utils/utils'
import styles from './AdminManager.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
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
    handleChange,
    deptData,
    roleData,
    statusValue,
    that
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  //处理角色数据
  const roleValues = [];
  if(roleData){
    for (let i = 0; i < roleData.length; i++) {
      roleValues.push(<Option key={roleData[i].roleId}>{roleData[i].roleName}</Option>);
    }
  }

  //处理部门数据
  function child(data){
      for(let i =0; i < data.length; i++){
        data[i].value = data[i].deptId;
        data[i].key = data[i].deptId;
        data[i].title = data[i].name;
        if(data[i].children){
          data[i].children = child(data[i].children);
        }
      }
      return data;
  }


  function handleConfirmBlur(e){
    const value = e.target.value;
    that.setState({ confirmDirty: that.state.confirmDirty || !!value });
  };

  function compareToFirstPassword(rule, value, callback){
    console.log(form)
    console.log(value,form.getFieldValue('password'));
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  }

  function validateToNextPassword(rule, value, callback){
    console.log(value);
    if (value && that.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
        {form.getFieldDecorator('username', {
          rules: [{ required: true, message: '请输入至少2个字符的用户名！', min: 2 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密&emsp;码">
        {form.getFieldDecorator('password', {
          rules: [{
            required: true, message: '请输入至少6个字符的密码!', min:6
          }, {
            validator: validateToNextPassword,
          }],
        })(
          <Input type="password" placeholder="请输入"/>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="确认密码">
        {form.getFieldDecorator('confirm', {
          rules: [{
            required: true, message: '请在次输入您的密码!',
          }, {
            validator: compareToFirstPassword,
          }],
        })(
          <Input type="password" placeholder="请输入" onBlur={handleConfirmBlur} />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮&emsp;箱">
        {form.getFieldDecorator('email', {
          rules: [
            {type: 'email', message: '您输入的邮箱格式不正确！',},
            {required: true, message: '请输入您的邮箱！',}
          ],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手&emsp;机">
        {form.getFieldDecorator('mobile', {
          rules: [{ required: true, message: '请输入11位手机号码！', min: 11}],
        })(<Input placeholder="请输入" maxLength={11}/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属部门">
        {form.getFieldDecorator('deptId', {
          rules: [{ required: true, message: '请选择所属部门！' }],
        })(
          <TreeSelect
            className={styles.width}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={child(deptData)}
            dropdownMatchSelectWidth={false}
            treeDefaultExpandAll={false}
            placeholder="请选择部门"
            onChange={onChangeTreeSelect}
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角&emsp;色">
        {form.getFieldDecorator('roleIdList', {
          rules: [{ required: false}],
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
          rules: [{ required: false}],
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
    console.log(props,"((((((((((((((");

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
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
      confirmDirty:false
    };

    this.formLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }


  render() {
    const { updateModalVisible, handleUpdateModalVisible, values, roleData, deptData, handleUpdate, that} = this.props;
    const { formVals } = this.state;
    const { form } = this.props;
    //处理角色数据
    const roleValues = [];
    for (let i = 0; i < roleData.length; i++) {
      roleValues.push(<Option key={roleData[i].roleId} value={roleData[i].roleId}>{roleData[i].roleName}</Option>);
    }
    //处理部门数据
    function child(data){
      for(let i =0; i < data.length; i++){
        data[i].value = data[i].deptId;
        data[i].key = data[i].deptId;
        data[i].title = data[i].name;
        if(data[i].children){
          data[i].children = child(data[i].children);
        }
      }
      return data;
    }


    function handleConfirmBlur(e){
      const value = e.target.value;
      that.setState({ confirmDirtyUp: that.state.confirmDirtyUp || !!value });
    };

    function compareToFirstPassword(rule, value, callback){
      console.log(form)
      console.log(value,form.getFieldValue('password'));
      if (value && value !== form.getFieldValue('password')) {
        callback('两次输入的密码不一致!');
      } else {
        callback();
      }
    }

    function validateToNextPassword(rule, value, callback){
      console.log(value);
      if (value && that.state.confirmDirtyUp) {
        form.validateFields(['confirm'], { force: true });
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
          rules: [{ required: false}],
          initialValue: formVals.userId,
        })(<Input type={"hidden"}/>)}
        <FormItem {...this.formLayout} label="用户名">
          {form.getFieldDecorator('username', {
            rules: [{ required: false, message: '请输入至少2个字符的用户名 ！', min: 2 }],
            initialValue: formVals.name,
          })(<Input placeholder="请输入" disabled={true}/>)}
        </FormItem>


        <FormItem {...this.formLayout} label="密&emsp;码">
          {form.getFieldDecorator('password', {
            rules: [{
              required: false, message: '请输入至少6个字符的密码!', min:6
            }, {
              validator: validateToNextPassword,
            }],
          })(
            <Input type="password" placeholder="请输入"/>
          )}
        </FormItem>
        <FormItem {...this.formLayout} label="确认密码">
          {form.getFieldDecorator('confirm', {
            rules: [{
              required: false, message: '请在次输入您的密码!',
            }, {
              validator: compareToFirstPassword,
            }],
          })(
            <Input type="password" placeholder="请输入" onBlur={handleConfirmBlur} />
          )}
        </FormItem>


        <FormItem {...this.formLayout} label="邮&emsp;箱">
          {form.getFieldDecorator('email', {
            rules: [
              {type: 'email', message: '您输入的邮箱格式不正确！',},
              {required: false, message: '请输入您的邮箱！',}
            ],
            initialValue: formVals.email,
          })(<Input placeholder="请输入"/>)}

        </FormItem>
        <FormItem {...this.formLayout} label="手&emsp;机">
          {form.getFieldDecorator('mobile', {
            rules: [
              { required: false, message: '请输入11位手机号码！', min: 11 }
              ],
            initialValue: formVals.mobile,
          })(<Input placeholder="请输入" maxLength={11}/>)}
        </FormItem>
        <FormItem {...this.formLayout} label="所属部门">
          {form.getFieldDecorator('deptId', {
            rules: [{ required: false, message: '请选择所属部门！' }],
            initialValue: formVals.deptId,
          })(
            <TreeSelect
              className={styles.width}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={deptData}
              dropdownMatchSelectWidth={false}
              treeDefaultExpandAll={false}
              placeholder="请选择部门"
              // onChange={onChangeTreeSelect}
            />
          )}
        </FormItem>
        <FormItem {...this.formLayout} label="角&emsp;色">
          {form.getFieldDecorator('roleIdList', {
            rules: [{ required: false}],
            initialValue:formVals.roleIdList
          })(
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请选择角色"
            >
              {roleValues}
            </Select>
          )}
        </FormItem>
        <FormItem {...this.formLayout} label="状&emsp;态">
          {form.getFieldDecorator('status', {
            rules: [{ required: false}],
            initialValue: formVals.status,
          })(
            <RadioGroup>
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
@connect(({ usr,dept, role, loading}) => ({
  usr,
  dept,
  role,
  loading: loading.effects["usr/fetch","dept/fetch","role/fetch"],
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
    key: "userId",  //列表的唯一键
    statusValue: 1, //状态默认选中正常 0正常 1停用
    roleData:[], //角色下拉菜单数据
    deptData:[],  //部门树菜单数据
    confirmDirty: false, //确认密码
    confirmDirtyUp: false, //确认密码
    Delete:false,
    Save:false,
    Update:false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const that = this;
    dispatch({
      type: 'usr/fetch',
    });
    dispatch({
      type: 'dept/fetch',
      callback:(res)=>{
        if(res.code == 0){
          that.setState({
            deptData:res.list,
          });
        }
      }
    });
    dispatch({
      type: 'role/fetch',
      callback:(res)=>{
        if(res.code == 0){
          that.setState({
            roleData:res.list,
          });
        }
      }
    });

    const ruleList = this.props.location.state;
    for(let i =0; i<ruleList.length;i++){
      // "sys:user:info", "sys:user:list", "sys:user:delete", "sys:user:update", "sys:user:save", "sys:role:select"
      if(ruleList[i].indexOf("sys:user:save")!=-1){
        that.setState({
          Save:true,
        });
      }
      if(ruleList[i].indexOf("sys:user:delete")!=-1){

        that.setState({
          Delete:true,
        });
      }
      if(ruleList[i].indexOf("sys:user:update")!=-1){
        that.setState({
          Update:true,
        });
      }
    }
  }

  columns = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        }
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      // sorter: true,
      // render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          {this.state.Update && (
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
          )}
          {this.state.Update && this.state.Delete && (
            <Divider type="vertical" />
          )}
          {this.state.Delete && (
            <a onClick={() => this.showDeleteConfirm(record)}>删除</a>
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
console.log(6666);
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
      callback:(res)=>{
        tips(res);
      }
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };


  onChangeTreeSelect = (value) => {
    console.log(value);
  }
  handleChange = (value) =>{
    console.log(value);
  }
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

      // const values = {
      //   ...fieldsValue,
      //   updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      //   username:fieldsValue.name,
      //   deptId:fieldsValue.deptNo,
      //   mobile:fieldsValue.phone
      // };
      const payload = {
        username:fieldsValue.name,
        deptId:fieldsValue.deptNo,
        mobile:fieldsValue.phone
      }
      this.setState({
        formValues: payload,
      });

      dispatch({
        type: 'usr/fetch',
        payload: payload,
      });
    });
  };
  //新建用户
  handleModalVisible = (flag) => {
    const {
      dept,
      role
    } = this.props

    this.setState({
      modalVisible: !!flag,
      roleData:role.data.list,
      deptData:dept.data.list,
    });
  };
  handleAdd = fields => {
    console.log(fields,"__________添加用户的参数");
    const { dispatch, usr} = this.props;
    dispatch({
      type: 'usr/add',
      payload: fields,
      callback:(res)=>{
        tips(res,this,"usr/fetch");
      }
    });

    //message.success('添加成功');
    this.handleModalVisible();
  };
  //修改用户信息
  handleUpdateModalVisible = (flag, record) => {
    const {
      dept,
      role
    } = this.props
    console.log(record,flag,"修改用户信息——————————————————————")
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
      roleData:role.data.list,
      deptData:dept.data.list,
    });
  };
  //删除用户信息
  showDeleteConfirm= (record) =>{
    let that = this;
    confirm({
      title: '删除确认',
      content: '你确定进行【删除】操作吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.deleted(record);
      },
      onCancel() {
        console.log('取消删除');
      },
    });
  }
  deleted = (record) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'usr/remove',
      payload:[record.userId],
      callback:(res)=>{
        tips(res,this,"usr/fetch");
      }
    });
  };
  //批量删除
  showDeletesConfirm= () =>{
    let that = this;
    confirm({
      title: '删除确认',
      content: '你确定进行【删除】操作吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.handleMenuClick();
      },
      onCancel() {
        console.log('取消删除');
        that.setState({
          selectedRows: [],
        });
      },
    });
  }
  handleMenuClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    console.log(selectedRows.map(row => row.key));
    dispatch({
      type: 'usr/remove',
      payload: selectedRows.map(row => row.userId),
      callback: (res) => {
        tips(res,this,"usr/fetch");
        this.setState({
          selectedRows: [],
        });
      },
    });
  };


  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'usr/update',
      payload:fields,
      callback: (res) => {
        tips(res,this,"usr/fetch");
        this.setState({
          selectedRows: [],
        });
      },
    });
    //message.success('配置成功');
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
            <FormItem label="所属部门">
              {getFieldDecorator('deptNo', {
                rules: [{ required: false, message: '请选择所属部门！' }],
              })(
                <TreeSelect
                  className={styles.width}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={this.state.deptData}
                  dropdownMatchSelectWidth={false}
                  treeDefaultExpandAll={false}
                  placeholder="请选择部门"
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
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      onChangeTreeSelect:this.onChangeTreeSelect,
      handleChange:this.handleChange,
      roleData:this.state.roleData,
      deptData:this.state.deptData,
      statusValue:this.state.statusValue,
      that:this,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      roleData:this.state.roleData,
      deptData:this.state.deptData,
      that:this,
    };
    console.log(data,"表格数据");

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {this.state.Save && (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                </Button>
              )}
              {selectedRows.length > 0 && this.state.Delete && (
                <span>
                  <Button onClick={this.showDeletesConfirm}>批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              rowKey = {this.state.key}
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
