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
  Button,
  Tree,
  Modal,
  Divider,
  Steps,
  Radio, TreeSelect,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { tips, disablesBtns, showDeleteConfirmParames, child, menuChild } from '../../utils/utils';
import styles from './RoleManager.less';
/**
 * 角色管理
 * */
const showDeleteTipsParames = showDeleteConfirmParames();
const confirm = Modal.confirm;
const FormItem = Form.Item;
const { TreeNode } = Tree;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, deptData, menuList, that, roleName, isExistByRoleName } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err || roleName) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  })
  let formRoleName = {};
  if(roleName){
    formRoleName = {
      validateStatus:"error",
      help:"角色名称已存在"
    }
  }
  return (
    <Modal
      destroyOnClose
      title="新增角色"
      width={940}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} {...formRoleName} label="角色名称">
        {form.getFieldDecorator('roleName', {
          rules: [{ required: true, message: '请输入角色名称！'}],
        })(<Input placeholder="请输入" onBlur={isExistByRoleName}/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备&emsp;&emsp;注">
        {form.getFieldDecorator('remark', {
          rules: [{ required: false, message: '请输入备注信息！'}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属渠道">
        {form.getFieldDecorator('deptId', {
          rules: [{ required: true, message: '请选择所属渠道！' }],
        })(
          <TreeSelect
            className={styles.width}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={deptData}
            dropdownMatchSelectWidth={false}
            treeDefaultExpandAll={false}
            placeholder="请选择渠道"
            //onChange={onChangeTreeSelect}
          />
        )}
      </FormItem>

      <div className={styles.treeContext}>
        <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10 }} label="菜单授权">
          {form.getFieldDecorator('menuIdList')(
            <Tree
              checkable
              onExpand={that.onExpandMenu}
              expandedKeys={that.state.menuExpandedKeys}
              autoExpandParent={that.state.autoExpandParent}
              onCheck={that.onCheckMenu}
              checkedKeys={that.state.menuCheckedKeys}
              onSelect={that.onSelectMenu}
              selectedKeys={that.state.menuSelectedKeys}
            >
              {renderTreeNodes(menuList)}
            </Tree>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 10 }} label="数据授权">
          {form.getFieldDecorator('deptIdList')(
            <Tree
              checkable
              onExpand={that.onExpandDept}
              expandedKeys={that.state.deptExpandedKeys}
              autoExpandParent={that.state.autoExpandParent}
              onCheck={that.onCheckDept}
              checkedKeys={that.state.deptCheckedKeys}
              onSelect={that.onSelectDept}
              selectedKeys={that.state.deptSelectedKeys}
            >
              {renderTreeNodes(deptData)}
            </Tree>
          )}
        </FormItem>
      </div>
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
    this.props.that.setState({
      menuCheckedKeys: props.values.menuIdList,
      deptCheckedKeys: props.values.deptIdList,
    });
    this.state = {
      formVals: {
        createTime: props.values.createTime,
        deptId: props.values.deptId,
        deptName: props.values.deptName,
        roleId: props.values.roleId,
        roleName: props.values.roleName,
        remark: props.values.remark,
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
      deptData,
      menuList,
      handleUpdate,
      that,
    } = this.props;

    const { formVals } = this.state;
    const { form } = this.props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleUpdate(fieldsValue);
      });
    };
    const renderTreeNodes = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
    const renderTreeNodess = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} value={item.value}  dataRef={item}>
            {renderTreeNodess(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
    return (
      <Modal
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="更新角色"
        width={940}
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible(false)}
      >
        {form.getFieldDecorator('roleId', {
          rules: [{ required: false }],
          initialValue: formVals.roleId,
        })(<Input type={'hidden'} />)}
        <FormItem {...this.formLayout} label="角色名称">
          {form.getFieldDecorator('roleName', {
            rules: [{ required: true, message: '请输入角色名称！'}],
            initialValue: formVals.roleName,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem {...this.formLayout} label="备&emsp;&emsp;注">
          {form.getFieldDecorator('remark', {
            rules: [{ required: false, message: '请输入备注信息！'}],
            initialValue: formVals.remark,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem {...this.formLayout} label="所属渠道">
          {form.getFieldDecorator('deptId', {
            rules: [{ required: false, message: '请选择所属渠道！' }],
            initialValue: formVals.deptId,
          })(
            <TreeSelect
              className={styles.width}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={deptData}
              dropdownMatchSelectWidth={false}
              treeDefaultExpandAll={false}
              placeholder="请选择渠道"
              //onChange={onChangeTreeSelect}
            />
          )}
        </FormItem>

        <div className={styles.treeContext}>
          <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 10 }} label="菜单授权">
            {form.getFieldDecorator('menuIdList')(
              <Tree
                checkable
                onExpand={that.onExpandMenu}
                expandedKeys={that.state.menuExpandedKeys}
                autoExpandParent={that.state.autoExpandParent}
                onCheck={that.onCheckMenuEdit}
                checkedKeys={that.state.menuCheckedKeys}
                checkStrictly={true}
                onSelect={that.onSelectMenu}
                selectedKeys={that.state.menuSelectedKeys}
              >
                {renderTreeNodess(menuList)}
              </Tree>
            )}
          </FormItem>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 10 }} label="数据授权">
            {form.getFieldDecorator('deptIdList')(
              <Tree
                checkable
                onExpand={that.onExpandDept}
                expandedKeys={that.state.deptExpandedKeys}
                autoExpandParent={that.state.autoExpandParent}
                onCheck={that.onCheckDept}
                checkedKeys={that.state.deptCheckedKeys}
                onSelect={that.onSelectDept}
                selectedKeys={that.state.deptSelectedKeys}
              >
                {renderTreeNodes(deptData)}
              </Tree>
            )}
          </FormItem>
        </div>

      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ role, dept,menulist, loading }) => ({
  role,
  dept,
  menulist,
  loading:loading.effects[('dept/fetch', 'role/fetch','menulist/fetch')],
}))
@Form.create()
class RoleManager extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    key: 'roleId',
    deptData: [], //渠道树菜单数据
    menuList:[],//授权菜单数据
    autoExpandParent: true,
    menuCheckedKeys: [],
    menuSelectedKeys: [],
    menuExpandedKeys: [],
    deptCheckedKeys: [],
    deptSelectedKeys: [],
    deptExpandedKeys: [],
    halfCheckedKeys:[],
    DeleteBtn: false,
    roleName:false,
    SaveBtn: false,
    UpdateBtn: false,
    ShowList: false,
  };

  columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      align:'center',
    },
    {
      title: '所属渠道',
      dataIndex: 'deptName',
      align:'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align:'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align:'center',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      align:'center',
      width:200,
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

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetch',
    });
    dispatch({
      type: 'dept/fetch',
      callback: res => {
        if (res.code == 0) {
          this.setState({
            deptData: child(res.list),
          });
        }
      },
    });
    dispatch({
      type: 'menulist/menuAuthorization',
      callback: res => {
        if (res.code == 0) {
          this.setState({
            menuList: menuChild(res.list),
          });
        }
      },
    });
    //调用utils里面的disablesBtns方法判断是否有权限
    disablesBtns(this);
  }

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
      type: 'role/fetch',
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
      type: 'role/fetch',
      payload: {},
      callback: res => {
        tips(res);
      },
    });
  };



  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'role/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
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
        roleName: fieldsValue.name,
        deptId: fieldsValue.deptNo,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'role/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      roleName: false,
      deptCheckedKeys: [],
      menuCheckedKeys: [],
      halfCheckedKeys:[],
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
      deptCheckedKeys: [],
      menuCheckedKeys: [],
      halfCheckedKeys:[],
      roleName:false
    });
  };
  isExistByRoleName = e =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'role/isExistByRoleName',
      payload: {
        roleName: e.target.value
      },
      callback: res => {

        let rn = false;
        if(res == "exist"){
          rn = true;
        }
        this.setState({
          roleName: rn,
        });
        dispatch({
          type: 'role/fetch',
        });
      },
    });
  };
  handleAdd = fields => {
    const { dispatch } = this.props;
    if (!fields.deptId) {
      fields.deptId = 0;
    }
    fields.deptIdList = this.state.deptCheckedKeys;
    fields.menuIdList = this.state.menuCheckedKeys.concat(this.state.halfCheckedKeys);
    dispatch({
      type: 'role/add',
      payload: fields,
      callback: res => {
        tips(res, this, 'role/fetch');
        this.setState({
          deptCheckedKeys: [],
          menuCheckedKeys: [],
          halfCheckedKeys:[],
          roleName:false
        });
      },
    });


    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    fields.deptIdList = this.state.deptCheckedKeys;
    fields.menuIdList = this.state.menuCheckedKeys;

    dispatch({
      type: 'role/update',
      payload: fields,
      callback: res => {
        tips(res, this, 'role/fetch');
        this.setState({
          deptCheckedKeys: [],
          menuCheckedKeys: [],
          halfCheckedKeys:[],
          roleName:false
        });
      },
    });


    this.handleUpdateModalVisible();
  };
  //删除角色信息
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
      type: 'role/remove',
      payload: [record.roleId],
      callback: res => {
        tips(res, this, 'role/fetch');
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
      type: 'role/remove',
      payload: selectedRows.map(row => row.roleId),
      callback: res => {
        tips(res, this, 'role/fetch');
        this.setState({
          selectedRows: [],
        });
      },
    });
  };


  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="角色名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属渠道">
              {getFieldDecorator('deptNo', {
                rules: [{ required: false, message: '请选择所属渠道！' }],
              })(
                <TreeSelect
                  className={styles.width}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={this.state.deptData}
                  dropdownMatchSelectWidth={false}
                  treeDefaultExpandAll={false}
                  placeholder="请选择渠道"
                  // onChange={onChangeTreeSelect}
                />
              )}
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
            <FormItem label="角色名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属渠道">
              {getFieldDecorator('deptNo', {
                rules: [{ required: false, message: '请选择所属渠道！' }],
              })(
                <TreeSelect
                  className={styles.width}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={this.state.deptData}
                  dropdownMatchSelectWidth={false}
                  treeDefaultExpandAll={false}
                  placeholder="请选择渠道"
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
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  onExpandMenu = (expandedKeys) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      menuExpandedKeys:expandedKeys,
      autoExpandParent: false,
    });
  }

  onCheckMenu = (checkedKeys,event) => {
    this.setState({
      menuCheckedKeys:checkedKeys,
      halfCheckedKeys:event.halfCheckedKeys
    });

  }

  onCheckMenuEdit = (checkedKeys) => {
    this.setState({
      menuCheckedKeys:checkedKeys.checked,
    });

  }

  onSelectMenu = (selectedKeys, info) => {
    this.setState({ menuSelectedKeys:selectedKeys });
  }


  onExpandDept = (expandedKeys) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      deptExpandedKeys:expandedKeys,
      autoExpandParent: false,
    });
  }

  onCheckDept = (checkedKeys) => {
    this.setState({ deptCheckedKeys:checkedKeys });
  }

  onSelectDept = (selectedKeys, info) => {
    this.setState({ deptSelectedKeys:selectedKeys });
  }


  render() {
    const {
      role: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues, deptData, key, menuList, ShowList, roleName } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      isExistByRoleName: this.isExistByRoleName,
      deptData: deptData,
      menuList: menuList,
      roleName: roleName,
      that:this
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      deptData: deptData,
      menuList: menuList,
      that:this
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
              data={ShowList?data:{}}
              tableAlert={true}
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

export default RoleManager;
