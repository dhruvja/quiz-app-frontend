import React from 'react';
import {Menu,Segment,Header,List, Grid,Card,Button,Dimmer,Loader,Icon} from 'semantic-ui-react';
import DashboardMenu from './components/dashboardmenu'
import SideMenu from './components/sidemenu'
import {Link,Redirect} from 'react-router-dom';
import moment from 'moment';
import endpoint from './endpoint'


class Hosted extends React.Component {

    constructor(){
        super()
        this.state = {
            data : [],
            redirect: false,
            loading: false,
            error: false,
            present: false,
            noquiz: false,
        }
    }

    componentDidMount(){
        this.setState({
            loading:true,
        })

        var name = "access"
        let token = document.cookie.match(`(?:(?:^|.*; *)${name} *= *([^;]*).*$)|^.*$`)[1]
        console.log(token)

        fetch(`${endpoint}/api/hostedquiz`,{
            headers:{
                'Authorization': `Bearer ${token} `,
            }
        })
        .then(response => response.json())
        .then(data => {
            // const moment = require('moment');
            // var start_time = data[0].starttime
            // var end_time = data[0].endtime
            // start_time = moment(start_time,"DD-MM-YYYY hh:mm").format("X")
            // end_time = moment(end_time,"DD-MM-YYYY hh:mm").format("X")
            // console.log(start_time)
            // console.log(end_time)
            // var current_time = Math.round(new Date().getTime() /1000)
            // console.log(current_time)

            if(data.length == 0)
                this.setState({noquiz: true,loading:false})
            else
            {
                if(!data.detail)
                    this.setState({
                        data: data,
                        loading: false,
                        present: true,
                        noquiz: false
                    })
                else
                    this.setState({
                        error: true,
                        present: false,
                        noquiz: false
                    })
                }
            console.log(this.state.data)
        }).catch(error => {
            console.log("error:",error)
            this.setState({
                error: true,
                present: false,
            })
            {this.state.error ? console.log("error") : console.log("no error")}
            {this.state.present ? console.log("present") : console.log("not")}
        })
    }

    render(){
        if(this.state.data)
            var quizzes = this.state.data
        return (
            <div>
            {this.state.error && <Redirect to="/login" /> }
                <DashboardMenu type="Hosted"/><br /><br />
                <div className="Content">
                    <Grid columns={2} dividing doubling>
                        <Grid.Row stretched>
                            <Grid.Column width={4}>
                                <SideMenu page="host" />
                            </Grid.Column>
                            <Grid.Column width={12}>
                                <Segment>
                                    <Header as="h2">
                                        Hosted Quizzes
                                    </Header>
                                    <div style={{textAlign:"left"}}>
                                        <Header as="h3" dividing>
                                            Quizzes hosted are
                                        </Header>
                                        <div className="cardcontent">
                                        {this.state.noquiz && !this.state.loading &&
                                            <Segment placeholder>
                                                <Header icon>
                                                <Icon name='pdf file outline' />
                                                You havent Hosted any quizzes Here
                                                </Header>
                                                <Link to="/host"><Button primary>Host Quiz</Button></Link>
                                            </Segment>
                                        }  
                                        <Card.Group itemsPerRow={2}>
                                        { this.state.loading &&
                                            <Dimmer active>
                                                <Loader active inline="center" size='mini'>Loading</Loader>
                                            </Dimmer> }                                                                            
                                        { this.state.present && !this.state.noquiz && quizzes.map((quiz,index) => {
                                            return(
                                                <Card fluid>
                                                    <Card.Content>
                                                        <Card.Header>{quiz.quizname}</Card.Header>
                                                        <Card.Description>
                                                        {quiz.quizdetails}
                                                        </Card.Description>
                                                        <Card.Meta textAlign="right">
                                                            {quiz.starttime} - {quiz.endtime}
                                                        </Card.Meta>
                                                    </Card.Content>
                                                    <Card.Content extra>
                                                        <div className='ui two buttons'>
                                                        <Link to={{
                                                            pathname: "/addquestions",
                                                            state: {quiz_id: quiz.id},
                                                            }} ><Button fluid inverted color='green'>
                                                            Edit
                                                        </Button></Link>
                                                        <Link to={{
                                                            pathname: '/leaderboard',
                                                            state: {quiz_id: quiz.id}
                                                        }} ><Button fluid inverted color='blue'>
                                                            Leaderboard
                                                        </Button></Link>
                                                        </div>
                                                    </Card.Content>
                                                </Card>
                                            )
                                        })}
                                            
                                            
                                        </Card.Group>
                                        </div>
                                    </div>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    
                </div>
            </div>
        )
    }
}

export default Hosted