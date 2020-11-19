import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { uploadFile } from '../../../redux/actions'

import { Upload, Icon, Spin, message } from 'antd'
const { Dragger } = Upload

class FileUpload extends Component {
  static propTypes = {
    uploadFile: PropTypes.func.isRequired
  }
  state = {
    isUploading: false
  }

  uploadFile = ({ file }) => {
    this.props.uploadFile(file)
      .then(() => {
        message.success('File upload succeed', 2)
      })
      .catch(err => {
        message.error('File upload failed', 2)
        console.log(err)
      })
  }

  render = () => {
    return (
      <Spin spinning={this.state.isUploading}>
        <Dragger
          showUploadList={false}
          name="pdfFile"
          accept=".pdf"
          multiple={false}
          customRequest={this.uploadFile}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="file-add" />
          </p>
        </Dragger>
      </Spin>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  uploadFile: file => dispatch(uploadFile(file))
})

export default connect(null, mapDispatchToProps)(FileUpload)