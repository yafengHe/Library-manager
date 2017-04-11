import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import * as BookActions from '../../actions/book.action'
import * as UserActions from '../../actions/user.action'

import { Layout, Modal, Table, Button } from 'antd'
const { Header, Content, Sider } = Layout

import './style.scss'
import Head from '../../components/head'
import Sidebar from '../../components/sidebar'

class Root extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    const { fetchUserData, resetUserReq } = this.props.userActions
    const token = localStorage.token
    if (token) {
      fetchUserData('checkLogin', {token: token}).then(() => {
        const { message } = this.props.state.user
        if (message === 'TokenExpiredError') {
          Modal.error({
            title: '错误',
            content: '登录过期 请重新登录',
            onOk: () => {
              browserHistory.push('/login')
              resetUserReq()
            }
          })
        }
      })
    }
    const { fetchBookData } = this.props.bookActions
    fetchBookData('book')
  }
  render(){
    const { message, books } = this.props.state.user
    const { data } = this.props.state.book
    const list = [
      {
        key: 'fe',
        name: '前端',
        submenu: [
          {
            key: 'htmlcss',
            name: 'htmlcss'
          },
          {
            key: 'javascript',
            name: 'javascript'
          },
          {
            key: 'feframe',
            name: '前端框架'
          }
        ]
      },
      {
        key: 'be',
        name: '后端',
        submenu: [
          {
            key: 'php',
            name: 'php'
          },
          {
            key: 'java',
            name: 'java'
          }
        ]
      }
    ]
    const columns = [
      { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
      { title: '书名', dataIndex: 'title', key: 'title' },
      { title: '作者', dataIndex: 'author', key: 'author' },
      { title: '分类', dataIndex: 'type', key: 'type', render: (text) => text.join('/') },
      { title: '操作', dataIndex: '', key: 'admin', render: (text,record) => {
          if (record.state == 0) {
            return <Button type="primary">借出</Button>
          } else if (record.state == 1) {
            return <span>已借</span>
          }
      }}
    ]
    return (
      <Layout>
        <Head user={localStorage.userName}/>
        <Content style={{ padding: '50px' }}>
          <Layout className="main-layout">
            <Sider width={200} style={{ background: '#fff' }}>
              <Sidebar list={list}/>
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <Table
                columns={columns}
                dataSource={data}
                expandedRowRender={record => <p>{record.description}</p>}
              />
            </Content>
          </Layout>
        </Content>
       </Layout>
    )
  }
}
function mapState(state) {
  return {
    state: state
  }
}

function mapDispatch(dispatch) {
  return {
    bookActions: bindActionCreators(BookActions, dispatch),
    userActions: bindActionCreators(UserActions, dispatch)
  }
}

export default connect(mapState, mapDispatch)(Root)
