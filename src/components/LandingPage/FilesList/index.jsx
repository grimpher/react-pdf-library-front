import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'

import { fetchFiles } from '../../../redux/actions'

import { Row, message, Spin, Typography } from 'antd'

import File from './File'

const { Title } = Typography

class FilesList extends Component {
  static propTypes = {
    fetchFiles: PropTypes.func.isRequired,
    files: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired
  }

  componentDidMount = () => {
    this.props.fetchFiles()
      .catch(err => {
        message.error('Files fetch failed')
        console.log(err)
      })
  }

  render () {
    return (
      <div>
        {this.props.user.token ? null : <Redirect to="/login" />}
        <Title style={{ color: '#3498db', margin: '1em 0 0 0', fontWeight: 200 }} level={4}>
          Your books:
        </Title>
        <Spin spinning={this.props.isFetching}>
          <Row gutter={16}>
            {
              this.props.files.map((file) => (
                <File 
                  key={file.niceId}
                  linkAddress={'/file/' + file.niceId}
                  fileInfo={file}
                />
              )) 
            }
          </Row>
        </Spin>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  files: state.files.allFiles,
  isFetching: state.files.isFetching,
  user: state.user
})
const mapDispatchToProps = dispatch => ({
  fetchFiles: () => dispatch(fetchFiles()),
})

export default connect(mapStateToProps, mapDispatchToProps)(FilesList)