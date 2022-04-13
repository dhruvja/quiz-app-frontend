import React from 'react'
import DashboardMenu from './components/dashboardmenu'
import {Grid, Segment,Header,Table,Icon,Dimmer,Loader} from 'semantic-ui-react';
import SideMenu from './components/sidemenu'
import {Link} from 'react-router-dom'
import endpoint from './endpoint'


class Leaderboard extends React.Component {

    constructor(){
        super()
        this.state = {
            data: [],
            present: false,
            loading: false,
        }
    }

    componentDidMount(){
        this.setState({loading:true})
        var quiz_id = this.props.location.state.quiz_id
        fetch(`${endpoint}/api/leaderboard/${quiz_id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            this.setState(
                {
                    data: data,
                    present: true,
                    loading:false,
                    type: data[0].open[0][0]
                }
            )
        })
    }

    render(){

        var circular = {
            width: "150",
            height: "150"
        }

        if(this.state.present){
            var data = this.state.data;
            data.map((answer,index) => {
                try{
                    console.log(answer.score)
                }
                catch{
                    console.log("null")
                }
            })
        }
        
        data = this.state.data
        return (
            <div>
            <div className="dashboardcontent">
                    <DashboardMenu type="Results" /><br /><br />
            </div>
            <div className="Content">
                <div class="maincontent">
                <Grid columns={2} divided doubling>
                    <Grid.Row stretched>
                        <Grid.Column width={4} className="sidemenu">
                            <SideMenu  page="Results"/>
                        </Grid.Column>
                        <Grid.Column width={12} className="segmentcolumn" >
                            <Segment padded className="dashboardsegment" >
                                <Header as="h2" >
                                    Quiz Leaderboard
                                </Header>
                                <div class="datacontent" style={{textAlign:"left"}}>
                                    <p>Welcome, Dhruv</p>
                                    <p>Quiz Name: Pointless </p>
                                    { this.state.loading &&
                                            <Dimmer active>
                                                <Loader inverted active inline="center" size='mini'>Loading</Loader>
                                            </Dimmer> }
                                    <Table celled striped selectable unstackable color="blue" key="blue">
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>Rank</Table.HeaderCell>
                                                <Table.HeaderCell>Candidate Name</Table.HeaderCell>
                                                { this.state.type &&
                                                   <Table.HeaderCell>Score</Table.HeaderCell>
                                                }
                                                <Table.HeaderCell>Time Taken</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>

                                        <Table.Body>
                                        { this.state.present && data.map((answer,index) => {
                                            console.log(this.state.type)
                                            var state= "";
                                                return (
                                                <Table.Row>
                                                    <Table.Cell>{index+1}</Table.Cell>
                                                    <Link to={{
                                                        pathname: "/results",
                                                        state: {joinquiz_id: answer.id, show: true, type: this.state.type},
                                                        }}><Table.Cell>{answer.candidate_id}</Table.Cell></Link>
                                                    { this.state.type &&
                                                        <Table.Cell>{answer.score < 0 ? "Didnt Complete": answer.score} </Table.Cell>
                                                    }
                                                    <Table.Cell>{answer.time_taken.toFixed(2)} Seconds</Table.Cell>
                                                </Table.Row>
                                                )    
                                        })}
                                        </Table.Body>
                                    </Table>
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

export default Leaderboard