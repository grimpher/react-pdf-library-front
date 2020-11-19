import React from 'react'

import FilesList from './FilesList'
import FileUpload from './FileUpload'
import ProfileDashboard from './ProfileDashboard'

import { Row, 
         Col,
         Card } from 'antd'

function LandingPage () {
  return (
    <Row>
      <Col span={20} offset={2}>
        <Card style={{ margin: '50px 0', borderRadius: '25px', boxShadow: '0 0 20px aliceblue' }}>
          <Row>
            <Col span={16}>
              <FileUpload />
              <FilesList />
            </Col>
            <Col span={8} style={{ paddingLeft: '2em' }}>
              <ProfileDashboard />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default LandingPage