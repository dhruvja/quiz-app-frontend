import React from 'react'
import DashboardMenu from './components/dashboardmenu'
import {Grid, Segment,Header,Table,Icon,Dimmer,Loader,Button} from 'semantic-ui-react';
import SideMenu from './components/sidemenu'
import {Link} from 'react-router-dom'
import endpoint from './endpoint'


class Results extends React.Component {

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
        var joinquiz_id = this.props.location.state.joinquiz_id
        // var joinquiz_id = 14
        fetch(`${endpoint}/api/showresults/${joinquiz_id}`)
        .then(response => response.json())
        .then(data => {
            var time = data[0].time_taken;
            var type = "Seconds"
            if(time > 60)
            {
                time = time / 60;
                type = "Minutes"
            }
            if(time> 60)
            {
                time = time / 60;
                type = "Hours"
            }
            data[0].time_taken = time.toFixed(2);
            this.setState(
                {
                    data: data,
                    present: true,
                    loading:false,
                    timeType: type,
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
            var data = this.state.data[0];
            data.entered_answers.map((answer,index) => {
                try{
                    console.log(answer.question_id.question)
                }
                catch{
                    console.log("null")
                }
            })
        }
        

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
                                    Quiz Finished
                                </Header>
                                <div class="datacontent" style={{textAlign:"left"}}>
                                { this.props.location.state.show &&
                                    <div><Segment circular style={circular} floated="right" >
                                        <Header as='h2'>
                                        {this.state.present && data.score }
                                            <Header.Subheader>Final Score</Header.Subheader>
                                        </Header>
                                    </Segment>
                                    <p>Thank you for completing the quiz successfully</p><br /></div>}
                                    <p>Quiz Name: { this.state.present && data.quiz_id.quizname} </p>
                                    <p>Time Taken: {this.state.present && data.time_taken} {this.state.present && this.state.timeType}</p>
                                    { !this.props.location.state.show && 
                                    <div><Header as="h2">
                                        You have Successfully Finshed the quiz
                                    </Header>
                                    <Header as="h3">
                                        You can rejoin the quiz and change your answers before the quiz gets over.
                                    </Header>
                                                        <Link to={{
                                                                    pathname: "/joined",
                                                                    }}  ><Button fluid inverted color='blue'
                                                        >
                                                            Join Again </Button></Link>
                                    { this.state.loading &&
                                            <Dimmer active>
                                                <Loader inverted active inline="center" size='mini'>Loading</Loader>
                                            </Dimmer> }</div>}
                                    {this.props.location.state.show && 
                                    <div>
                                    <Table celled striped selectable unstackable color="blue" key="blue">
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>Id</Table.HeaderCell>
                                                <Table.HeaderCell>Question</Table.HeaderCell>
                                                <Table.HeaderCell>Chosen Option</Table.HeaderCell>
                                                { this.props.location.state.type && <Table.HeaderCell>Result</Table.HeaderCell> }
                                                <Table.HeaderCell>Time Elapsed</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>

                                        <Table.Body>
                                        { this.state.present && data.entered_answers.map((answer,index) => {
                                            var state= "";
                                            try{
                                                if(this.props.location.state.type){
                                                    return (
                                                        <Table.Row positive={answer.result} negative={!answer.result} > 
                                                            <Table.Cell>{index+1}</Table.Cell>
                                                                <Table.Cell>{answer.question_id.question}</Table.Cell>
                                                                <Table.Cell>{answer.chosen_option.option}</Table.Cell>
                                                                <Table.Cell>{ answer.result ? <Icon color='green' name='checkmark' size='large' /> : <Icon color='red' name='close' size='large' /> }</Table.Cell>
                                                                <Table.Cell>{answer.time_elapsed.toFixed(2)} Seconds</Table.Cell>
                                                        </Table.Row>
                                                    )
                                                }
                                                else{
                                                    return (
                                                        <Table.Row> 
                                                            <Table.Cell>{index+1}</Table.Cell>
                                                            <Table.Cell>{answer.question_id.question}</Table.Cell>
                                                            <Table.Cell>{answer.chosen_option.option}</Table.Cell>
                                                            <Table.Cell>{answer.time_elapsed.toFixed(2)} Seconds</Table.Cell>
                                                        </Table.Row>
                                                    )
                                                }
                                            }
                                            catch{  
                                                return (
                                                <Table.Row warning>
                                                    <Table.Cell>{index+1}</Table.Cell>
                                                    <Table.Cell>{answer.question_id.question}</Table.Cell>
                                                    <Table.Cell>Didnt Attempt</Table.Cell>
                                                    <Table.Cell>{ answer.result ? <Icon color='green' name='checkmark' size='large' /> : <Icon color='yellow' name='close' size='large' /> }</Table.Cell>
                                                    <Table.Cell>{answer.time_elapsed.toFixed(2)} Seconds</Table.Cell>
                                                </Table.Row>
                                                )
                                            }
                                    
                                            
                                            
                                        })}
                                        </Table.Body>
                                    </Table>
                                    </div>}
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

export default Results