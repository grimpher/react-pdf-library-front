import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Row,
         Col, 
         Typography, 
         Card, 
         Icon,
         Progress } from 'antd'
import "./File.scss"

import FileDrawer from './FileDrawer'

const { Title, Paragraph, Text } = Typography

export default class File extends Component {
  static propTypes = {
    fileInfo: PropTypes.object.isRequired,
    linkAddress: PropTypes.string.isRequired,
  }

  state = {
    showDetailsDrawer: false,
    niceNameInputValue: this.props.fileInfo.niceName,
    fileInfo: this.props.fileInfo,
    isUploadingChanges: false
  }

  toggleDetailsDrawer = (e) => {
    if (e) e.preventDefault()
    this.setState(prevState => ({
      showDetailsDrawer: !prevState.showDetailsDrawer
    }))
  }

  render() {

    const { fileInfo } = this.props
    const { niceName, pagesRead } = fileInfo
    const pagesCount = this.props.fileInfo.totalPages
    const readPercentage = Math.floor(pagesRead / pagesCount * 100)
    const remainingPages = pagesCount - pagesRead
    const pagesDailyToFinishInWeek = Math.round(remainingPages / 7)

    const fileElement = (
      <Row type="flex" align="middle" justify="space-between">
        <Col>
          <Row type="flex">
            <Col>
              <Progress type="circle" percent={readPercentage} width={100} style={{ marginRight: 24 }} />
            </Col>
            <Col>
              <Title style={{ color: '#3498db' }} level={4}>
                { niceName }
              </Title>
              <Paragraph>
                { pagesCount + ' pages' }
              </Paragraph>
                {
                  remainingPages > 0 && (
                    <Paragraph>
                      Read <Text strong>{ pagesDailyToFinishInWeek }</Text> pages a day to finish this book in one week
                    </Paragraph>
                  )
                }
            </Col>
          </Row>
        </Col>
        <Col>
          <Icon 
            className="FileCard-more-icon" 
            onClick={this.toggleDetailsDrawer} 
            type="more" 
            style={{ fontSize: 32 }} 
          />
        </Col>
      </Row>
    )

    return (
      <div>
        <Col className="FileCard">
          <Link to={this.props.linkAddress}>
            <Card hoverable>
                { fileElement }
            </Card>
          </Link>
        </Col>

        <FileDrawer 
          fileInfo={fileInfo}
          visible={this.state.showDetailsDrawer}
          toggleDetailsDrawer={this.toggleDetailsDrawer}
        />
      </div>
    )
  }
}