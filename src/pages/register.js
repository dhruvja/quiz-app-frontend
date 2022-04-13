import React from 'react'
import {Segment,Header,Icon,Button,Form,Checkbox,Divider,Grid} from 'semantic-ui-react';
import Menubar from './components/menubar'
import {Redirect} from "react-router-dom"
import endpoint from './endpoint'


class Register extends React.Component{

    constructor(){
        super()
        this.state = {
            user: {
                username: '',
                email: '',
                password: '',
            },
            redirect: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
        var{name,value} = event.target;
        this.setState({
            user: {
                ...this.state.user,
                [name] : value,
            }
        })
    }

    handleSubmit(e){
        e.preventDefault();

        fetch(`${endpoint}/api/register`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.user)
        }).then( response => response.json())
        .then(data => {
            console.log(data)
            if(data['token'])
                this.setState({
                    redirect: true
                })
        }).catch( (error) =>{
            console.log("Error:", error)
        } )
        
    }

    render(){
        return (
            <div className="registerpage" >
                {this.state.redirect && <Redirect to="/" />}
                <Menubar type="Register" /><br /><br />
                <div className="Content">
                    <div class="registercontent">
                        <Segment padded>
                        <Grid columns={2} relaxed='very'>
                            <Grid.Column>
                                <Header as='h3' dividing>
                                    Enter your credentials
                                </Header>
                                <Form onSubmit={this.handleSubmit} >
                                    <Form.Field>
                                        <label>Username</label>
                                        <input placeholder='username...' name="username" onChange = {this.handleChange} value={this.state.user.username} />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Email</label>
                                        <input placeholder='email...' name="email" onChange = {this.handleChange} value={this.state.user.email} />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Password</label>
                                        <input placeholder='Password...' type="password" name="password" onChange = {this.handleChange} value={this.state.user.password} />
                                    </Form.Field>
                                    <Form.Field>
                                        <Checkbox label='Accept terms and conditions' />
                                    </Form.Field>
                                    <Button>Submit</Button>
                                </Form>
                            </Grid.Column>
                            <Grid.Column>
                                <Header as='h3' dividing>
                                    Register using
                                </Header>
                                <div className="iconmiddle">
                                <Button color='google plus'>
                                    <Icon name='google plus' /> Google Plus
                                </Button><br /><br />
                                <Button color='facebook'>
                                    <Icon name='facebook' /> Facebook
                                </Button>
                                </div>
                                
                            </Grid.Column>
                        </Grid>
                        <Divider vertical>Or</Divider>
                        </Segment>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register