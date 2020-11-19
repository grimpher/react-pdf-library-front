import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { deleteFile, updateFile, fetchFiles } from '../../../../redux/actions'

import { Drawer,
         Row,
         Typography,
         Input,
         Popconfirm,
         Icon,
         Button,
         message,
         Form } from 'antd'
const { Paragraph } = Typography

export class FileDrawer extends Component {
  static propTypes = {
    fileInfo: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    toggleDetailsDrawer: PropTypes.func.isRequired,
    
    fetchFiles: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
    updateFile: PropTypes.func.isRequired
  }

  state = {
    isUploadingChanges: false,
    inputValues: {
      'niceName': this.props.fileInfo.niceName
    },
    valuesHasChanged: false
  }

  toggleUploadingState = () => {
    this.setState(prevState => ({ isUploadingChanges: !prevState.isUploadingChanges }))
  }

  onInputChange = (e) => {
    const { name, value } = e.target || {}
    this.setState(prevState => ({
      inputValues: {
        ...prevState.inputValues,
        [name]: value
      }
    }))

    if(!this.state.valuesHasChanged) this.setState({ valuesHasChanged: true })
  }

  // redux actions
  deleteFile = () => {
    this.props.deleteFile(this.props.fileInfo.niceId)
      .then(() => {
        message.open({content: 'File removing succeed', icon: <Icon style={{ color: 'red' }} type="delete" />})
      })
      .catch(err => {
        message.error('File removing failed', 2)
        console.log(err)
      })
  }
  updateFile = (e) => {
    if (e) e.preventDefault()
    const newData = {
      niceName: this.state.inputValues['niceName']
    }
    this.toggleUploadingState()
    this.props.updateFile(this.props.fileInfo.niceId, newData)
      .then(() => {
        this.props.fetchFiles();
        this.toggleUploadingState()
        message.open({content: 'File update succeed', icon: <Icon style={{ color: 'green' }} type="save" />})
        this.props.toggleDetailsDrawer()
      })
      .catch(err => {
        message.error('File updating failed', 2)
        console.log(err)
      })
      
    if(this.state.valuesHasChanged) this.setState({ valuesHasChanged: false })
  }

  render() {
    const {visible, toggleDetailsDrawer} = this.props
    const drawerProps = {
      title: 'Edit file',
      width: '25vw',
      placement: 'left',
      closable: true,
      onClose: toggleDetailsDrawer,
      visible
    }

    // Icons
    const popconfirmIcon = (
      <Icon type="stop" style={{color: 'red', fontSize: 16}}/>
    )
    const deleteIcon = (
      <Icon 
        className="FileDetailsDrawer-delete-icon" 
        type="delete" 
        style={{ fontSize: 24 }}
      />
    )
    // Buttons
    const deleteButton = (
      <Popconfirm 
        placement="right" 
        title="Are you sure?" 
        onConfirm={this.deleteFile} 
        okType="danger" 
        okText="Delete" 
        cancelText="No"
        icon={popconfirmIcon}  
      >
        {deleteIcon}
      </Popconfirm>
    )
    const saveButton = (
      <Button 
        loading={this.state.isUploadingChanges} 
        onClick={this.updateFile} 
        type="primary"
        disabled={!this.state.valuesHasChanged}
      >
        Save
        <Icon type="save" />
      </Button>
    )

    return (
      <Drawer {...drawerProps}>
        <Form onSubmit={this.updateFile}>
          {/* Settings form */}
          <Paragraph>Display name:</Paragraph>
          <Input 
            name="niceName" 
            size="large" 
            value={this.state.inputValues['niceName']} 
            onChange={this.onInputChange}
          />

          {/* Form controls */}
          <Row className="FileDetailsDrawer-buttons-container" type="flex" justify="space-between">
            {deleteButton}
            {saveButton}
          </Row>
        </Form>
      </Drawer>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  fetchFiles: () => dispatch(fetchFiles()),
  deleteFile: fileId => dispatch(deleteFile(fileId)),
  updateFile: (fileId, newData) => dispatch(updateFile(fileId, newData))
})

export default connect(null, mapDispatchToProps)(FileDrawer)
