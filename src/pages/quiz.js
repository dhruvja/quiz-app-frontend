import React from 'react'
import DashboardMenu from './components/dashboardmenu'
import {Grid, Segment,Header,List,Form,Button,Menu,Dimmer,Loader} from 'semantic-ui-react';
import {Redirect} from 'react-router-dom';
import SideMenu from './components/sidemenu'
import endpoint from './endpoint'


class Quiz extends React.Component {

    constructor(){
        super()
        this.state = {
            data : [],
            present: false,
            currentpage : 0,
            submitted: false,
            loading: false,
            starttime: 0,
            timeElapsed: 0,
        }
        this.handleChange = this.handleChange.bind(this)
        this.reset = this.reset.bind(this)
        this.handleItemClick = this.handleItemClick.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount(){
        var time = new Date().getTime() / 1000;
        this.setState({loading:true,starttime: time})
        console.log(this.props.location.state.quiz_id)
        var quiz_id = this.props.location.state.quiz_id
        var joinquiz_id = this.props.location.state.joinquiz_id
        var url1 = `${endpoint}/api/questions/${quiz_id}`;
        var url2 = `${endpoint}/api/getanswers/${joinquiz_id}`;
        Promise.all([
            fetch(url1).then(response => response.json()),
            fetch(url2).then(response => response.json())
        ]).then(([data,answers]) => {
            var question = ""
            console.log(answers)
            answers.map((answer,index) => {
                question = "question" + answer.question_id;
                this.setState({
                    [question]:{
                        question_id: answer.question_id ,
                        chosen_option: answer.chosen_option,
                        time_elapsed: answer.time_elapsed ,
                    },
                })
            } )
            console.log(data,answers)
            this.setState({
                data: data,
                present: true,
                loading:false,
            })
        }).catch((error) => {
            console.log("Error: ",error)
        })
    }

    handleSubmit = (chosenoption) => (e) => {
        var answers = this.state[chosenoption]
        var endtime = new Date().getTime() / 1000;
        endtime = endtime - this.state.starttime;
        console.log(endtime + " seconds elapsed")
        if(this.state[chosenoption])
        {
            answers.quiz_id = this.state.data[0].id
            answers.joinquiz_id = this.props.location.state.joinquiz_id
            console.log(answers)
        }
        var joinquiz_id = answers.joinquiz_id
        if(answers.time_elapsed){
            answers.time_elapsed += endtime 
            console.log("old item")
        }
        else{
            console.log("new item")
            answers.time_elapsed = endtime
        }
        console.log(answers)
        fetch(`${endpoint}/api/chosenanswer`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answers)
        }).then(response => response.json())
        .then(data => {
            fetch(`${endpoint}/api/getresults/${joinquiz_id}`)
            .then(response => response.json())
            .then(data => {
                console.log("Total score is ",data)
                this.setState({
                    submitted: true
                })
            })
        })
        .catch(error => {
            console.log("Error",error)
        })
    }

    handleItemClick = (index,chosenoption) => (e) => {
        var endtime = new Date().getTime() / 1000;
        console.log(this.state.starttime,endtime)
        endtime = endtime - this.state.starttime;
        console.log(endtime + " seconds elapsed")
        console.log(typeof(item))
        console.log(index,chosenoption)
        console.log(this.state[chosenoption])
        var answers = this.state[chosenoption]
        if(this.state[chosenoption])
        {
            answers.quiz_id = this.state.data[0].id
            answers.joinquiz_id = this.props.location.state.joinquiz_id
            console.log(answers)
        }
        if(answers.time_elapsed){
            answers.time_elapsed += endtime 
            console.log("old item")
        }
        else{
            console.log("new item")
            answers.time_elapsed = endtime
        }
        console.log(answers)
        fetch(`${endpoint}/api/chosenanswer`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answers)
        }).then(response => response.json)
        .then(data => {
            var now = new Date().getTime() / 1000;
            this.setState({
                currentpage: index,
                starttime: now,
            })
        }).catch(error => {
            console.log("Error",error)
        })

        
    }

    handleChange(event){
        var data = this.state.data[0];
        var currentpage = this.state.currentpage;
        if(this.state.present)
            var questions = data.questions[currentpage];
        var question_id = "question" + questions.id;
        console.log("value returned",event.target.value)
        this.setState(
            {
                option: event.target.value,
                [question_id]:{
                    question_id: questions.id,
                    chosen_option: event.target.value
                }
            })
    }

    reset(){
        var currentpage = this.state.currentpage
        var option_id = "question" + this.state.data[0].questions[currentpage].id;
        this.setState(
            {
                option:'',
                [option_id]:{
                    ...this.state[option_id],
                    chosen_option: '',
                }
            }
        )
    }

    render(){
        const moment = require('moment');
        if(this.state.present && this.state.currentpage >= 0)
        {
            var data = this.state.data[0];
            const date = data.created_date
            console.log(typeof(date))
            let now = moment(date,'dd-mm-YYYY  hh:mm:ss');
            console.log(now.format());
            var currentpage = this.state.currentpage;
            var updateanswer = "question" + data.questions[currentpage].id;
            // var updateanswer = "question1"
            console.log(this.state.currentpage)
            console.log(this.state.data[0].questions)
            console.log(updateanswer)
            console.log(this.state)
            var questions = data.questions[currentpage];
        }     
        return(
            <div>
            { this.state.submitted &&
                <Redirect to={{
                pathname: "/results",
                state: {joinquiz_id: this.props.location.state.joinquiz_id,show: true},
                }} 
            />
            }
                <DashboardMenu type="Quiz" /><br /><br />
                <div className="Content">
                    <Grid columns={2}>
                        <Grid.Row stretched>
                            <Grid.Column width={12}>
                                <Segment padded="very">
                                    <Header as="h2">
                                        Questions
                                    </Header><br />
                                    { this.state.loading &&
                                            <Dimmer active>
                                                <Loader inverted active inline="center" size='mini'>Loading</Loader>
                                            </Dimmer> }
                                    <div className="quizcontent" style={{textAlign:"left"}}>
                                    {this.state.present && this.state.currentpage >= 0 && 
                                        <div>
                                        <Header as="h4">
                                           {currentpage + 1}. {questions.question}
                                        </Header>
                                        <p>Images if any</p>
                                        <Segment>
                                            <Header as="h4">
                                                Options
                                            </Header>
                                            <Form>
                                            <Form.Group grouped onChange={this.handleChange}>
                                            {questions.options.map((option,index) => {
                                                if(this.state[updateanswer]){
                                                    return(
                                                        <Form.Field
                                                            label={option.option}
                                                            control='input'
                                                            checked = {option.id == this.state[updateanswer].chosen_option}
                                                            type='radio'
                                                            name='htmlRadios'
                                                            value={option.id}
                                                        /> 
                                                    )
                                                }
                                                else{
                                                    return(
                                                        <Form.Field
                                                            label={option.option}
                                                            control='input'
                                                            type='radio'
                                                            name='htmlRadios'
                                                            value={option.id}
                                                        /> 
                                                    )
                                                    
                                                }
                                            })}
                                            </Form.Group> 
                                                <Button type="reset" onClick={this.reset} secondary>Reset</Button>
                                                {data.questions.length == currentpage+1 ? 
                                                    <Button type="button" onClick = {this.handleSubmit(updateanswer)} primary>Submit</Button>
                                                    :
                                                    <Button type="button" onClick={this.handleItemClick(currentpage+1,updateanswer)} primary>Next</Button>
                                                }
                                                
                                            </Form><br />
                                            <p>Chosen Option: {this.state.option} </p>
                                            {this.state[updateanswer] &&
                                                <p>Chosen id: {this.state[updateanswer].chosen_option}</p>
                                            }
                                            
                                            {/* <p>Id: {this.state.question_id}</p> */}
                                            {/* {this.state.answers[0] && 
                                                <p>Value:{this.state.answers[0].question_name} </p>
                                            } */}
                                            
                                        </Segment>
                                    <div className="ui center aligned segment">
                                    <Menu className="ui pagination menu" style={{textAlign:"center"}}> 
                                        {this.state.currentpage !=0 &&
                                            <Menu.Item 
                                            name = "1"
                                            onClick={this.handleItemClick(0,updateanswer)}
                                            />
                                        }
                                        
                                        {currentpage > 0 && 
                                            <Menu.Item 
                                            name = "Prev"
                                            onClick={this.handleItemClick(this.state.currentpage-1,updateanswer)}
                                        />
                                        }
                                        <Menu.Item 
                                            name = {this.state.currentpage+1}
                                            active
                                        />
                                        {currentpage < (this.state.data[0].questions.length -1) && 
                                            <Menu.Item 
                                            name = "Next"
                                            onClick={this.handleItemClick(this.state.currentpage+1,updateanswer)}
                                        />
                                        }

                                        { this.state.currentpage != this.state.data[0].questions.length-1 &&
                                            <Menu.Item 
                                            name = {this.state.data[0].questions.length}
                                            onClick={this.handleItemClick(this.state.data[0].questions.length - 1,updateanswer)}
                                            />
                                        }
                                        {/* <Menu borderless style={{textAlign:"center"}}>
                                        {data.questions.map((question,index) => {
                                            return (
                                                <Menu.Item
                                                    name={index+1}
                                                    active={currentpage === (index)}
                                                    onClick={this.handleItemClick(index,updateanswer)}
                                                />
                                            )
                                        })}                                         
                                        </Menu> */}
                                        </Menu>
                                        </div>
                                        </div>

                                    }
                                        
                                        
                                        

                                    </div>
                                    
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Segment>
                                    <Header as="h2">
                                        Questions list
                                    </Header>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        )
    }
}

export default Quiz