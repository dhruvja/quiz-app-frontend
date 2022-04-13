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
            present: false,
            loading: false,
            error: false,
            access: true
        }
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount(){
        this.setState({loading:true})
        var name = "access"
        let token = document.cookie.match(`(?:(?:^|.*; *)${name} *= *([^;]*).*$)|^.*$`)[1]
        console.log(token)
        fetch(`${endpoint}/api/joinedquizzes`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if(!data.detail)
                this.setState({
                    data: data,
                    present: true,
                    loading:false,
                })
            else
                this.setState({
                    error:true,
                    loading: true,
                    present: false,
                })
            console.log(this.state.data)
        }).catch(error => {
            console.log("error:",error)
        })
    }

    handleClick(quiz){
        var i = {}
        var date = {}
        var access = 0
        for (i in this.state.data){
            date = this.state.data[i].quiz_id
            console.log(date.id, quiz.quiz_id.id)
            if(date.id == quiz.quiz_id.id){
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
        if(access)
            this.setState({
                redirect: true,
                quiz_id: quiz.quiz_id.id,
                joinquiz_id: quiz.id
            })
        else{
            console.log(this.state.access)
        }
    }

    render(){
        if(this.state.present)
        {
            var quizzes = this.state.data
            console.log(quizzes[0])
        }
        
        return (
            <div>
            {this.state.error && <Redirect to="/login" /> }
            {this.state.access && this.state.redirect &&
            <Redirect to={{
                pathname: "/joinquiz",
                state: {quiz_id: this.state.quiz_id,joinquiz_id: this.state.joinquiz_id},
                }} 
            />}
                <DashboardMenu type="Joined"/><br /><br />
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
                <div className="Content">
                    <Grid columns={2} dividing doubling>
                        <Grid.Row stretched>
                            <Grid.Column width={4}>
                                <SideMenu page="join" />
                            </Grid.Column>
                            <Grid.Column width={12}>
                                <Segment>
                                    <Header as="h2">
                                        Quizzes Joined
                                    </Header>
                                    <div style={{textAlign:"left"}}>
                                        <Header as="h3" dividing>
                                            Joined Quizzes are
                                        </Header>
                                        <div className="cardcontent">
                                        <Card.Group itemsPerRow={2}>
                                        { this.state.loading &&
                                            <Dimmer active>
                                                <Loader inverted active inline="center" size='mini'>Loading</Loader>
                                            </Dimmer> }
                                        { this.state.present && quizzes.map((quiz,index) => {
                                            return(
                                                <Card fluid>
                                                    <Card.Content>
                                                        <Card.Header>{quiz.quiz_id.quizname}</Card.Header>
                                                        <Card.Meta>{quiz.quiz_id.host_id}</Card.Meta>
                                                        <Card.Description>
                                                        {quiz.quiz_id.quizdetails}
                                                        </Card.Description>
                                                        <Card.Meta textAlign="right">
                                                            {quiz.quiz_id.starttime} - {quiz.quiz_id.endtime}
                                                        </Card.Meta>
                                                    </Card.Content>
                                                    <Card.Content extra>
                                                        <div className='ui buttons'>
                                                        <Button style={{marginRight: "2%"}} inverted color='green' onClick={this.handleClick.bind(this,quiz)}>
                                                            Join
                                                        </Button>
                                                        <Link to={{
                                                                    pathname: "/results",
                                                                    state: {joinquiz_id: quiz.id, show: true},
                                                                    }}  ><Button fluid inverted color='blue'
                                                        >
                                                            Results
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

export default Search