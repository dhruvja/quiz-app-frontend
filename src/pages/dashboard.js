import React from 'react'
import DashboardMenu from './components/dashboardmenu'
import {Grid, Segment,Header} from 'semantic-ui-react';
import SideMenu from './components/sidemenu'
import endpoint from './endpoint'


class Dashboard extends React.Component {
    render(){
        var styles = {
            marginLeft: "2.5%",
            marginRight: "5%"
        }
        var circular = {
            width: "150",
            height: "150"
        }
        return (
            <div>
            <div className="dashboardcontent">
                    <DashboardMenu type="Dashboard" /><br /><br />
            </div>
            <div className="Content">
                <div class="maincontent">
                <Grid columns={2} divided doubling>
                    <Grid.Row stretched>
                        <Grid.Column width={4} className="sidemenu">
                            <SideMenu  page="Dashboard"/>
                        </Grid.Column>
                        <Grid.Column width={12} className="segmentcolumn" >
                            <Segment padded className="dashboardsegment" >
                                <Header as="h2" >
                                    Welcome to your Dashboard
                                </Header>
                                <div class="datacontent" style={{textAlign:"left"}}>
                                    <p>Welcome, Dhruv</p>
                                    <Segment circular style={circular} size="massive" floated="left">
                                        <Header as='h2'>
                                            Quizzes Joined
                                            <Header.Subheader>Value</Header.Subheader>
                                        </Header>
                                    </Segment>
                                    <Segment circular style={circular} size="massive" floated="right">
                                        <Header as='h2'>
                                            Quizzes hosted
                                            <Header.Subheader>Value</Header.Subheader>
                                        </Header>
                                    </Segment>
                                    <Segment circular style={circular} size="massive" floated="center">
                                        <Header as='h2'>
                                            Upcoming Quizzes
                                            <Header.Subheader>Value</Header.Subheader>
                                        </Header>
                                    </Segment>
                                    <Segment circular style={circular} size="massive" floated="right">
                                        <Header as='h2'>
                                            Pending Quiz Results
                                            <Header.Subheader>Value</Header.Subheader>
                                        </Header>
                                    </Segment>
                                </div>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                </div>
            </div>
            </div>
            
        )
    }
}

export default Dashboard