import React from 'react'
import DashboardMenu from './components/dashboardmenu'
import {Grid, Segment,Header,Form,TextArea,Message,Radio,Button,Modal,Icon} from 'semantic-ui-react';
import SideMenu from './components/sidemenu'
import {Link,Redirect} from 'react-router-dom'
import endpoint from './endpoint'



class EditQuizInfo extends React.Component {

    constructor(){
        super()
        var nowtime = new Date()
        var today = new Date();
        this.state = {
            quizname: '',
            quizdetails: '',
            starttime: '',
            endtime: '',
            dateError: false,
            now: nowtime,
            type: '',
            submitted: false,
            error: false,
            logout: false,
            data: [],
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleRadios = this.handleRadios.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount(){
        var quiz_id = this.props.location.state.quiz_id
        console.log(quiz_id)
        // var quiz_id = 16
        fetch(`${endpoint}/api/editquizinfo/${quiz_id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            this.setState({
                data: data
            })
        })
    }

    handleChange(e){
        // console.log("changed")
        // console.log(e.target.value)
        if(this.state.data.starttime === '' && e.target.name == 'endtime')
        {
            this.setState({dateError:true})
        }
        else{
            var {name,value} = e.target;
            console.log(name)
            var data = this.state.data
            data[name] = value
            if (this.state.hasOwnProperty(name)) {
                this.setState({
                    data: data,dateError: false 
                });
                console.log(this.state[name])
          }
        }
        
    }

    handleSubmit(e){
        e.preventDefault()
        console.log(this.state.data)
        var quiz_id = this.props.location.state.quiz_id
        var name = "access"
        var token = document.cookie.match(`(?:(?:^|.*; *)${name} *= *([^;]*).*$)|^.*$`)[1]
        var data = this.state.data
        fetch(`${endpoint}/api/editquizupdate/${quiz_id}`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
        .then(data => {
            console.log(data)
            if(data.code)
                this.setState({
                    logout: true,
                })
            else if(data.status != "failed")
                this.setState({
                    submitted: true,
                    error: false,
                    id: data.id,
                })
            else
                this.setState({
                    error:true,
                })
        }).catch(error => {
            console.log("error: ",error)
            this.setState({error: true})
        })
    }

    handleRadios(e,{value}){
        this.setState({
            type: value,
        })
    }

    

    render(){
        return (
            <div>
            {this.state.submitted && 
                <Redirect to={{
                    pathname: "/addquestions",
                    state: {quiz_id: this.state.id },
                }}/>
            }
            <Modal
                basic
                open={this.state.logout}
                size='small'
            >
                <Header icon>
                    <Icon name='archive' />
                    Session Expired
                </Header>
                    <Modal.Content>
                        <p>
                        Your Session has been expired, Please login again to continue from where you left.
                        </p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Link to='/'><Button color='green' inverted >
                        <Icon name='checkmark' /> Yes
                        </Button></Link>
                    </Modal.Actions>
            </Modal>
            <div className="dashboardcontent">
                    <DashboardMenu type="Host" /><br /><br />
            </div>
            <div className="Content">
                <div class="maincontent">
                <Grid columns={2} divided doubling>
                    <Grid.Row stretched>
                        <Grid.Column width={4} className="sidemenu">
                            <SideMenu  page="Host"/>
                        </Grid.Column>
                        <Grid.Column width={12} className="segmentcolumn" >
                            <Segment padded className="dashboardsegment" >
                                <Header as="h2" >
                                    Host A New Quiz
                                </Header>
                                <div class="datacontent" style={{textAlign:"left"}}>
                                    <Header as="h3" dividing>
                                        Enter Quiz Details
                                    </Header>
                                    <Form onSubmit={this.handleSubmit} >
                                        <Form.Field>
                                            <label>Quiz Name</label>
                                            <input placeholder='Enter quiz name...' name="quizname" value={this.state.data.quizname} onChange={this.handleChange} />
                                        </Form.Field>
                                        <Form.Field
                                            control={TextArea}
                                            label='Quiz Details'
                                            placeholder='Tell us more about the quiz...'
                                            name="quizdetails"
                                            value={this.state.data.quizdetails}
                                            onChange = {this.handleChange}
                                        />
                                        <Form.Group widths="equal">
                                            <Form.Field>
                                                <label>Start Time</label>
                                                <div class="ui calendar" id="example2">
                                                    <div class="ui input left icon">
                                                        <i class="calendar icon"></i>
                                                        <input placeholder="Date" min={this.state.data.starttime} type="datetime-local" name="starttime" onChange={this.handleChange} value={this.state.data.starttime} />
                                                    </div>
                                                </div>
                                            </Form.Field>
                                            <Form.Field>
                                                <label>End Time</label>
                                                <div class="ui calendar" id="example2">

                                                    <div class="ui input left icon">
                                                    
                                                        <i class="calendar icon"></i>
                                                        <input placeholder="Date" type="datetime-local" name="endtime" onChange={this.handleChange} value={this.state.data.endtime} />
                                                    </div>
                                                </div>
                                            </Form.Field>
                                        </Form.Group>
                                        {this.state.dateError &&
                                            <Message negative>
                                                <Message.Header>Choose the start time before choosing the end time</Message.Header>
                                            </Message>
                                        }
                                        <Form.Group inline>
                                            <label>Quiz Type</label>
                                            <Form.Field
                                                control={Radio}
                                                label='Open'
                                                value='1'
                                                checked={this.state.type == '1'}
                                                onChange={this.handleRadios}
                                                name="type"
                                            />
                                            <Form.Field
                                                control={Radio}
                                                label='Invite-Only'
                                                value='0'
                                                checked={this.state.type == '0'}
                                                onChange={this.handleRadios}
                                                name="type"
                                            />
                                        </Form.Group>
                                        
                                        <Button>Proceed to Questions</Button>
                                        {this.state.submitted &&
                                            <Message positive>
                                                <Message.Header>Quiz has been created successfully</Message.Header>
                                            </Message>
                                        }
                                        {this.state.error &&
                                            <Message negative>
                                                <Message.Header>Unexpected Error occured, Couldnt add quiz</Message.Header>
                                            </Message>
                                        }
                                    </Form>
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

export default EditQuizInfo