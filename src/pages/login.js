import React from 'react'
import {Segment,Header,Icon,Button,Form,Checkbox,Divider,Grid,Message} from 'semantic-ui-react';
import Menubar from './components/menubar'
import {Redirect} from 'react-router-dom'
import endpoint from './endpoint'


class Login extends React.Component{

    constructor(){
        super()
        this.state = {
            user: {
                username: '',
                password: ''
            },
            redirect: false,
            error: false
            
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
        var{name,value} = event.target;
        this.setState({
            user:{
                ...this.state.user,
                [name] : value,
            },
            error: false,
        })
    }

    handleSubmit(e){
        e.preventDefault();
        console.log(this.state.user)
        fetch(`${endpoint}/api/token/`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.user)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if(!data.detail)
            {
                document.cookie = "access=" + data.access
                this.setState({
                    redirect: true,
                    error: false,
                    token: data.refresh,
                    access: data.access
                })
            }
            else{
                this.setState({
                    message: data.detail,
                    error: true
                })
            }
        }).catch(error => {
            console.log("Error:",error)
        })
    }

    render(){
        return (
            <div className="loginpage" >
            { this.state.redirect && <Redirect to={{
                pathname: "/search",
                state: {refreshtoken: this.state.token,accesstoken: this.state.access},
                }} /> }
                <Menubar type="Login" /><br /><br />
                <div className="Content">
                    <div class="logincontent">
                        <Segment padded>
                        <Grid columns={2} relaxed='very'>
                            <Grid.Column width={16}>
                                <Header as='h3' dividing>
                                    Enter your credentials
                                </Header>
                                <Form onSubmit={this.handleSubmit} >
                                    <Form.Field>
                                        <label>Username</label>
                                        <input placeholder='Username' name="username" onChange = {this.handleChange} value={this.state.username} />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Password</label>
                                        <input placeholder='Password...' type="password" name="password" onChange = {this.handleChange} value={this.state.password} />
                                    </Form.Field>
                                    { this.state.error &&                                    
                                        <Message negative>
                                            <Message.Header>Error Occured</Message.Header>
                                            <p>{this.state.message}</p>
                                        </Message>
                                    }
                                    
                                    <Form.Field>
                                        <Checkbox label='Keep me logged in' />
                                    </Form.Field>
                                    <Button type='submit'>Submit</Button>
                                </Form>
                            </Grid.Column>
                            {/* <Grid.Column>
                                <Header as='h3' dividing>
                                    Login using
                                </Header>
                                <div className="iconmiddle">
                                <Button color='google plus'>
                                    <Icon name='google plus' /> Google Plus
                                </Button><br /><br />
                                <Button color='facebook'>
                                    <Icon name='facebook' /> Facebook
                                </Button>
                                </div>
                                
                            {/* </Grid.Column> */}
                        </Grid>
                        {/* <Divider vertical>Or</Divider>  */}
                        </Segment>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login