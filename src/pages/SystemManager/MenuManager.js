import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  InputNumber,
  Modal,
  Divider,
  Steps,
  Radio, TreeSelect,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { tips, disablesBtns, showDeleteConfirmParames, menuChild } from '../../utils/utils';
import styles from './MenuManager.less';
/**
 * 菜单管理
 * */

const showDeleteTipsParames = showDeleteConfirmParames();
const confirm = Modal.confirm;

const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const status = ['目录', '菜单', '按钮'];
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, statusMenuText, statusRouterText, menuType, menuNameText, iconData, disables, menuData, onChangeMenuType } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const renderOptGroup = data => {
    let arr =[];
    Object.keys(data)
      .map((key) => {
        const OGP = (<OptGroup key={key} label={key}>
            {
              data[key].map((it)=>{
                return(
                  <Option key={it.id} value={it.icon}>
                    <Icon type={it.icon}/> {it.icon}
                  </Option>
                );
              })
            }
          </OptGroup>)

        arr.push(OGP);
      });
    return arr;

  }
  return (
    <Modal
      destroyOnClose
      title="新增菜单&按钮"
      width={940}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类&emsp;&emsp;型">
        {form.getFieldDecorator('type', {
          rules: [{ required: false }],
          initialValue: menuType,
        })(
          <RadioGroup onChange={onChangeMenuType} >
            <Radio value={1}>菜单</Radio>
            <Radio value={2}>按钮</Radio>
            <Radio value={0}>目录</Radio>
          </RadioGroup>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={ menuNameText }>
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入菜单名称！'}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父级菜单">
        {form.getFieldDecorator('parentId', {
          rules: [{ required: statusMenuText, message: '请选择父级菜单！' }],
          initialValue:!statusMenuText?0:null,
        })(
          <TreeSelect
            className={styles.width}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={menuData}
            disabled={disables}
            dropdownMatchSelectWidth={false}
            treeDefaultExpandAll={false}
            placeholder="请选择父级菜单"
            //onChange={onChangeTreeSelect}
          />
        )}
      </FormItem>
      {statusRouterText?(
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="路&emsp;&emsp;由">
          {form.getFieldDecorator('path', {
            rules: [{ required: true, message: '请输入路由！'}],
          })(<Input placeholder={statusMenuText?'如： /system-manager/admin-manager':'如： /system-manager'} />)}
        </FormItem>
      ):null}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排&emsp;&emsp;序">
        {form.getFieldDecorator('orderNum', {
          rules: [{ required: false }],
        })(<InputNumber min={0} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="授权标识">
        {form.getFieldDecorator('perms', {
          rules: [{ required: false, message: '请输入授权标识！'}],
        })(<Input placeholder="多个用逗号分隔，如：sys:menu:save,sys:menu:update" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图&emsp;&emsp;标">
        {form.getFieldDecorator('icon',)(
          <Select
            style={{ width: 200 }}
          >
            {iconData?renderOptGroup(iconData):null}
          </Select>
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
    this.props.that.setState({
      menuCheckedKeys: props.values.menuIdList,
      deptCheckedKeys: props.values.deptIdList,
    });
    let value = props.values.type;
    if(value == 0){
      this.props.that.setState({
        menuNameText:"目录名称",
        statusMenuText: false,
        statusRouterText:true,
        disables:true,
      })
    }else if(value == 1){
      this.props.that.setState({
        menuNameText:"菜单名称",
        statusMenuText: true,
        statusRouterText:true,
        disables:false,
      })
    }else if(value == 2){
      this.props.that.setState({
        menuNameText:"按钮名称",
        statusMenuText: true,
        statusRouterText:false,
        disables:false,
      })
    }

    this.state = {
      formVals: {
        children: props.values.children,
        exact: props.values.exact,
        icon: props.values.icon,
        locale: props.values.locale,
        menuId: props.values.menuId,
        name: props.values.name,
        open: props.values.open,
        orderNum: props.values.orderNum,
        parentId: props.values.parentId,
        parentName: props.values.parentName,
        parmsList: props.values.parmsList,
        path: props.values.path,
        perms: props.values.perms,
        type: props.values.type,
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
    const { that } = this.props;
    const {statusMenuText, statusRouterText, menuNameText, disables} = that.state;
    const {
      updateModalVisible,
      handleUpdateModalVisible,
      handleUpdate,
      onChangeMenuType,
      iconData,
      menuData,
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
    const renderOptGroup = data => {
      let arr =[];
      Object.keys(data)
        .map((key) => {
          const OGP = (<OptGroup key={key} label={key}>
            {
              data[key].map((it)=>{
                return(
                  <Option key={it.id} value={it.icon}>
                    <Icon type={it.icon}/> {it.icon}
                  </Option>
                );
              })
            }
          </OptGroup>)

          arr.push(OGP);
        });
      return arr;

    }
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
    return (
      <Modal
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="更新菜单&按钮"
        width={940}
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible(false)}
      >
        {form.getFieldDecorator('menuId', {
          rules: [{ required: false }],
          initialValue: formVals.menuId,
        })(<Input type={'hidden'} />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="型&emsp;&emsp;类">
          {form.getFieldDecorator('type', {
            rules: [{ required: false }],
            initialValue: formVals.type,
          })(
            <RadioGroup onChange={onChangeMenuType} >
              <Radio value={1}>菜单</Radio>
              <Radio value={2}>按钮</Radio>
              <Radio value={0}>目录</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={ menuNameText }>
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入菜单名称！'}],
            initialValue: formVals.name,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父级菜单">
          {form.getFieldDecorator('parentId', {
            rules: [{ required: statusMenuText, message: '请选择父级菜单！' }],
            initialValue:statusMenuText?formVals.parentId:0,
          })(
            <TreeSelect
              className={styles.width}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={menuData}
              disabled={disables}
              dropdownMatchSelectWidth={false}
              treeDefaultExpandAll={false}
              placeholder="请选择父级菜单"
              //onChange={onChangeTreeSelect}
            />
          )}
        </FormItem>
        {statusRouterText?(
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="路&emsp;&emsp;由">
            {form.getFieldDecorator('path', {
              rules: [{ required: true, message: '请输入路由！'}],
              initialValue: formVals.path,
            })(<Input placeholder={statusMenuText?'如： /system-manager/admin-manager':'如： /system-manager'} />)}
          </FormItem>
        ):null}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排&emsp;&emsp;序">
          {form.getFieldDecorator('orderNum', {
            rules: [{ required: false }],
            initialValue: formVals.orderNum,
          })(<InputNumber min={0} placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="授权标识">
          {form.getFieldDecorator('perms', {
            rules: [{ required: false, message: '请输入授权标识！'}],
            initialValue: formVals.perms,
          })(<Input placeholder="多个用逗号分隔，如：sys:menu:save,sys:menu:update" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图&emsp;&emsp;标">
          {form.getFieldDecorator('icon',{
            initialValue: formVals.icon,
          })(
            <Select
              style={{ width: 200 }}
            >
              {iconData?renderOptGroup(iconData):null}
            </Select>
          )}
        </FormItem>

      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ menulist, loading }) => ({
  menulist,
  loading: loading.effects[('menulist/fetch', 'menuicon/fetch', 'menunav/fetch')],
}))
@Form.create()
class MenuManager extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    key: 'menuId',
    DeleteBtn: false,
    SaveBtn: false,
    UpdateBtn: false,
    ShowList: false,
    statusMenuText:true,
    statusRouterText:true,
    menuNameText:"菜单名称",
    disables:false,
    menuType:1,
    menuData:[],
    iconData:[]
  };

  columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
    },
    {
      title: '图标',
      align:'center',
      render: record => (record.icon !=null && (<Icon type={record.icon} />)),
    },
    {
      title: '类型',
      align:'center',
      render: (record) => (
        <Fragment>
            <span>
              {status[record.type]}
            </span>
        </Fragment>
      ),
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      align:'center',
    },
    {
      title: '路由',
      dataIndex: 'path',
      align:'center',
    },
    {
      title: '授权标识',
      dataIndex: 'perms',
      align:'center',
    },
    {
      title: '操作',
      align:'center',
      //fixed: 'right',
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

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menulist/fetch',
    });
    dispatch({
      type: 'menuicon/fetch',
      callback: res => {
        if (res.code == 0) {
          this.setState({
            iconData: res.list,
          });
        }
      },
    });
    dispatch({
      type: 'menunav/fetch',
      callback: res => {
        if (res.code == 0) {
          this.setState({
            menuData: menuChild(res.menuList),
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
      type: 'menulist/fetch',
      payload: params,
    });
  };


  onChangeMenuType = (e) => {
    let value = e.target.value;
    if(value == 0){
      this.setState({
        menuNameText:"目录名称",
        statusMenuText: false,
        statusRouterText:true,
        disables:true,
      })
    }else if(value == 1){
      this.setState({
        menuNameText:"菜单名称",
        statusMenuText: true,
        statusRouterText:true,
        disables:false,
      })
    }else if(value == 2){
      this.setState({
        menuNameText:"按钮名称",
        statusMenuText: true,
        statusRouterText:false,
        disables:false,
      })
    }

  }
  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'menulist/remove',
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


  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      statusRouterText:true,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;

    dispatch({
      type: 'menulist/add',
      payload: fields,
      callback:(res)=>{
        tips(res, this, 'menulist/fetch',"menu/getMenuData");
      }
    });


    this.handleModalVisible();
  };
//删除菜单信息
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
      type: 'menulist/remove',
      payload: record.menuId,
      callback: res => {
        tips(res, this, 'menulist/fetch',"menu/getMenuData");
      },
    });
  };
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menulist/update',
      payload: fields,
      callback: res => {
        tips(res, this, 'menulist/fetch',"menu/getMenuData");
      },
    });


    this.handleUpdateModalVisible();
  };

  render() {
    const {
      menulist: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues, statusMenuText, statusRouterText, menuType, iconData, menuData, key, disables, menuNameText, ShowList} = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      statusMenuText: statusMenuText,
      statusRouterText:statusRouterText,
      menuType: menuType,
      menuData: menuData,
      iconData: iconData,
      that:this,
      onChangeMenuType:this.onChangeMenuType,
      menuNameText:menuNameText,
      disables:disables

    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      statusMenuText: statusMenuText,
      statusRouterText:statusRouterText,
      menuType: menuType,
      menuData: menuData,
      iconData: iconData,
      that:this,
      onChangeMenuType:this.onChangeMenuType,
      menuNameText:menuNameText,
      disables:disables
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm} />
            <div className={styles.tableListOperator}>
              {this.state.SaveBtn && (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                </Button>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              bordered={true}
              //scroll={{x:'140%'}}
              rowSelection={null}
              tableAlert={false}
              data={ShowList?data:{}}
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

export default MenuManager;
