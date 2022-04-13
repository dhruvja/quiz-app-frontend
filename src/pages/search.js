import React from 'react';
import {Menu,Segment,Header,List, Grid,Card,Button,Dimmer,Loader,Modal,Icon} from 'semantic-ui-react';
import DashboardMenu from './components/dashboardmenu'
import SideMenu from './components/sidemenu'
import {Link,Redirect} from 'react-router-dom';
import endpoint from './endpoint'

class Search extends React.Component {

    constructor(){
        super()
        this.state = {
            data : [],
            redirect: false,
            loading: false,
            error: false,
            present: false,
            access: true,
            msg: '',
        }
    }

    componentDidMount(){
        this.setState({
            loading:true,
        })

        var name = "access"
        let token = document.cookie.match(`(?:(?:^|.*; *)${name} *= *([^;]*).*$)|^.*$`)[1]
        console.log(token)

        fetch(`${endpoint}/api/listquizzes`,{
            headers:{
                'Authorization': `Bearer ${token} `,
            }
        })
        .then(response => response.json())
        .then(data => {
            if(!data.detail)
            {
                const moment = require('moment');
                var start_time = data[0].starttime
                var end_time = data[0].endtime
                start_time = moment(start_time,"DD-MM-YYYY hh:mm").format("X")
                end_time = moment(end_time,"DD-MM-YYYY hh:mm").format("X")
                console.log(start_time)
                console.log(end_time)
                var current_time = Math.round(new Date().getTime() /1000)
                console.log(current_time)
                this.setState({
                    data: data,
                    loading: false,
                    present: true,
                })
            }
            else
                this.setState({
                    error: true,
                    present: false,
                })
            console.log(this.state.data)
        }).catch(error => {
            console.log("error:",error)
            this.setState({
                error: true,
                present: false,
            })
            this.state.error ? console.log("error") : console.log("no error")
            this.state.present ? console.log("present") : console.log("not")
        })
    }

    handleClick(quiz_id){
        console.log(quiz_id)
        var data = {}
        data.quiz_id = quiz_id
        data.candidate_id = 3
        var access = 0;
        var i = {}
        var date = {}
        for (i in this.state.data){
            date = this.state.data[i]
            console.log(date)
            if(date.id == quiz_id){
                const moment = require('moment');
                var start_time = date.starttime
                var end_time = date.endtime
                start_time = moment(start_time,"DD-MM-YYYY hh:mm").format("X")
                end_time = moment(end_time,"DD-MM-YYYY hh:mm").format("X")
                console.log(start_time)
                console.log(end_time)
                var current_time = Math.round(new Date().getTime() /1000)
                console.log(current_time)
                if(start_time > current_time)
                    this.setState({access: false, msg: "The quiz is yet to start"})
                else if(current_time > end_time )
                    this.setState({access: false, msg: "The quiz has ended"})
                else{
                    this.setState({access: true})
                    access = 1
                }
                break
            }
        }
        console.log(this.state)
        if(access)
        {
            var name = "access"
            let token = document.cookie.match(`(?:(?:^|.*; *)${name} *= *([^;]*).*$)|^.*$`)[1]
            console.log(data)
            fetch(`${endpoint}/api/joinquiz`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token} `,
                },
                body: JSON.stringify(data)
            }).then(response => response.json())
            .then((data)=> {
                console.log(data)
                this.setState({
                    quiz_id: quiz_id,
                    joinquiz_id: data.id,
                    redirect: true,
                })
            } )    
        }    
        else{
            console.log(this.state.msg)
        }
    }

    render(){
        if(this.state.data)
            var quizzes = this.state.data
        return (
            <div>
            {/* {this.state.error && <Redirect to="/login" /> } */}
            { this.state.redirect &&
            this.state.access && <Redirect to={{
                pathname: "/joinquiz",
                state: {quiz_id: this.state.quiz_id,joinquiz_id: this.state.joinquiz_id},
                }} 
                />
            }
            
            
            <Modal
                                    basic
                                    open={!this.state.access}
                                    size='small'
                                    >
                                    <Header icon>
                                        <Icon name='archive' />
                                        {this.state.msg}
                                    </Header>
                                    <Modal.Actions>
                                        <Button basic color='red' inverted onClick={() => {this.setState({access: true})}}>
                                        <Icon name='remove' /> Ok
                                        </Button>
                                    </Modal.Actions>
                                </Modal>
                <DashboardMenu type="Join"/><br /><br />
                <div className="Content">
                    <Grid columns={2} dividing doubling>
                        <Grid.Row stretched>
                            <Grid.Column width={4}>
                                <SideMenu page="search" />
                            </Grid.Column>
                            <Grid.Column width={12}>
                                <Segment>
                                    <Header as="h2">
                                        Search for Quizzes
                                    </Header>
                                    <div style={{textAlign:"left"}}>
                                        <Header as="h3" dividing>
                                            Available Quizzes are
                                        </Header>
                                        <div className="cardcontent">
                                        <Card.Group itemsPerRow={2}>
                                        { this.state.loading &&
                                            <Dimmer active>
                                                <Loader active inline="center" size='mini'>Loading</Loader>
                                            </Dimmer> }
                                        { this.state.present && quizzes.map((quiz,index) => {
                                            return(
                                                <Card fluid>
                                                    <Card.Content>
                                                        <Card.Header>{quiz.quizname}</Card.Header>
                                                        <Card.Meta>{quiz.host_id}</Card.Meta>
                                                        <Card.Description>
                                                        {quiz.quizdetails}
                                                        </Card.Description>
                                                        <Card.Meta textAlign="right">
                                                            {quiz.starttime} - {quiz.endtime}
                                                        </Card.Meta>
                                                    </Card.Content>
                                                    <Card.Content extra>
                                                        <div className='ui two buttons'>
                                                        <Button fluid inverted color='green' onClick={this.handleClick.bind(this,quiz.id)}>
                                                            Join
                                                        </Button>
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

export default Search