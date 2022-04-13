import React from 'react'
import DashboardMenu from './components/dashboardmenu'
import {Grid, Segment,Header,Form,TextArea,Message,Radio,Button,Modal,Icon,Input,Popup, Menu,Pagination} from 'semantic-ui-react';
import {Redirect,Link} from 'react-router-dom'
import endpoint from './endpoint'



class AddQuestions extends React.Component {

    constructor(){
        super()
        this.state = {
            questions: '',
            total_options: 2,
            maxoptions:false,
            currentpage: 0,
            data: [{question: '',}],
            option0: '',
            option1: '',
            selected_option: 0,
            boundaryRange: 1,
            siblingRange: 1,
            showEllipsis: true,
            showFirstAndLastNav: true,
            showPreviousAndNextNav: true,
            totalPages: 1,
            edited: false,
            redirect:false,
            blank_question: false,
            minquestion: false,
            deleteConfirm: false,
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.deleteQuestion = this.deleteQuestion.bind(this)
    }

    componentDidMount(){
        var quiz_id = this.props.location.state.quiz_id
        this.setState({quiz_id: quiz_id})
        console.log("quizid",quiz_id)
        fetch(`${endpoint}/api/questions/${quiz_id}`)
        .then(response => response.json())
        .then(data => {
            var questions = data[0].questions;
            console.log(questions)
            questions[0].options.map((row,index) => {
                var opt = "option" + index;
                this.setState({
                    [opt]: row.option,
                })
            })
            this.setState({
                questions: questions[0].question,
                data: questions,
                total_options: questions[0].options.length,
                selected_option: questions[0].option_index,
            })

        }).catch(error => {
            console.log("No questions found",error)
        })
    }

    handleChange(index,event){
        
        var{name,value,type} = event.target;

        if(type == "radio"){
            this.setState({[name]:index,edited:true})
        }
        else{
            this.setState({
                [name]: value,
                edited:true
            })
        }
        console.log(this.state[name])
    }



    handleSubmit(pagenumber,e){
        console.log(pagenumber) 
        var blank = false
        if(this.state.questions == '')
        {
            this.setState({blank_question: true})
            blank = true
        }
        else{
            for(let i=0;i<this.state.total_options;i++)
            {
                opt = "option" + i;
                if(this.state[opt] == '')
                {
                    this.setState({blank_question: true})
                    blank = true
                    break
                }
            }
        }
        if(blank == false)
        {
            this.setState({blank_question: false})
            if(this.state.edited)
            console.log("edited")
            else
                console.log("unedited")
            var opt;
            let i=0;
            if(pagenumber == this.state.currentpage)
                this.setState({redirect: true})
            var length = this.state.total_options;
            var options = []
            try{
                options = this.state.data[this.state.currentpage].options;
                for(i=0;i<length;i++){
                    opt = "option" + i;
                    options[i].option = this.state[opt];
                }
                if(options.length > length)
                {
                    console.log(options)
                    options = options.slice(0,length)
                    console.log(options)
                }
            }
            catch{
                var x = i;
                for(x;x<length;x++){
                    opt = "option" + x;
                    if(x == 0)
                        options = [{option: this.state[opt]}]
                    else
                        options.push({option: this.state[opt]})
                }
            }
            
            var data = this.state.data;
            // console.log(data)
            data[this.state.currentpage].quiz_id = this.props.location.state.quiz_id;
            console.log(data[this.state.currentpage].quiz_id)
            console.log(this.state.data)
            console.log(this.state)
            if(pagenumber >= (this.state.data.length)){
                console.log("new page",this.state.currentpage)
                //clearing old options
                for(let i=2;i<100;i++)
                {
                    var opt = "option" + i;
                    if(this.state[opt])
                        this.setState({[opt]:''})
                    else
                        break;
                }
                    data[this.state.currentpage].question= this.state.questions;
                    data[this.state.currentpage].right_option= this.state.selected_option;
                    data[this.state.currentpage].option_index= this.state.selected_option; 
                    data[this.state.currentpage].options= options;
                    data[this.state.currentpage].points= 10;

                
                fetch(`${endpoint}/api/createquestion`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data[this.state.currentpage])
                }).then(response => response.json())
                .then(value => {
                    //setting states for new item
                    data[this.state.currentpage] = value
                    data.push({question: '',})
                    this.setState({
                        questions: '',
                        total_options: 2,
                        option0: '',
                        option1: '',
                        selected_option: 0,
                        currentpage: pagenumber,
                        data: data,
                        edited: false,
                    })
                })

                
            }
            else{
                console.log(this.state.currentpage)
                console.log(data.length, this.state.data.length)
                data[this.state.currentpage].question= this.state.questions;
                data[this.state.currentpage].right_option= this.state.selected_option;
                data[this.state.currentpage].option_index= this.state.selected_option; 
                data[this.state.currentpage].options= options;
                data[this.state.currentpage].points= 10;
                    
                // if(this.state.edited)
                // {
                    if(data[this.state.currentpage].id)
                    {
                        fetch(`${endpoint}/api/updatequestion`,{
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data[this.state.currentpage])
                        }).then(response => response.json()) 
                        .then(value => {
                            //setting states for existing item
                            data[this.state.currentpage] = value;
                            console.log(this.state.data.length)
                            console.log(this.state.data[pagenumber].options)
                            this.state.data[pagenumber].options.map((row,index) => {
                                var opt = "option" + index;
                                this.setState({
                                    [opt]: row.option,
                                })
                            })
                            for(let i=this.state.data[pagenumber].options.length;i<100;i++)
                            {
                                var opt = "option" + i;
                                if(this.state[opt])
                                    this.setState({[opt]:''})
                                else
                                    break;
                            }
                            this.setState(prevState => {
                                return{
                                    questions: data[pagenumber].question,
                                    total_options: data[pagenumber].options.length,
                                    selected_option: data[pagenumber].option_index,
                                    currentpage: pagenumber,
                                    data: data,
                                    edited: false,
                                }
                            })
                        })
                    }
                    else{
                        fetch(`${endpoint}/api/createquestion`,{
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data[this.state.currentpage])
                        }).then(response => response.json()) 
                        .then(value => {
                            //setting states for existing item
                            data[this.state.currentpage] = value;
                            console.log(this.state.data.length)
                            this.state.data[pagenumber].options.map((row,index) => {
                                var opt = "option" + index;
                                this.setState({
                                    [opt]: row.option,
                                })
                            })
                            for(let i=this.state.data[pagenumber].options.length;i<100;i++)
                            {
                                var opt = "option" + i;
                                if(this.state[opt])
                                    this.setState({[opt]:''})
                                else
                                    break;
                            }
                            this.setState(prevState => {
                                return{
                                    questions: data[pagenumber].question,
                                    total_options: data[pagenumber].options.length,
                                    selected_option: data[pagenumber].option_index,
                                    currentpage: pagenumber,
                                    data: data,
                                    edited: false,
                                }
                            })
                        })
                    }
                }
            // else{
            //     //setting states for existing item
            //     console.log(this.state.data.length)
            //     this.state.data[pagenumber].options.map((row,index) => {
            //         var opt = "option" + index;
            //         this.setState({
            //             [opt]: row.option,
            //         })
            //     })
            //     for(let i=this.state.data[pagenumber].options.length;i<100;i++)
            //     {
            //         var opt = "option" + i;
            //         if(this.state[opt])
            //             this.setState({[opt]:''})
            //         else
            //             break;
            //     }
            //     this.setState(prevState => {
            //         return{
            //             questions: data[pagenumber].question,
            //             total_options: data[pagenumber].options.length,
            //             selected_option: data[pagenumber].option_index,
            //             currentpage: pagenumber,
            //             data: data,
            //             edited: false,
            //         }
            //     })
            // }
        }

            
        }
    
    deleteQuestion(){
        var data = this.state.data;
        var currentpage = this.state.currentpage;
        var id = data[currentpage].id
        if(data.length>1){
            fetch(`${endpoint}/api/deletequestion/${id}`,{
                method: 'DELETE'
            })
            .then(response => response.json)
            .then(dating => {
                console.log(data)
                data.splice(currentpage,1)
                console.log(data)
                if(currentpage == data.length)
                    currentpage -= 1;
                data[currentpage].options.map((row,index) => {
                    var opt = "option" + index;
                    this.setState({
                        [opt]: row.option,
                    })
                })
                for(let i=data[currentpage].options.length;i<100;i++)
                {
                    var opt = "option" + i;
                    if(this.state[opt])
                        this.setState({[opt]:''})
                    else
                        break;
                }
                this.setState({
                        questions: data[currentpage].question,
                        total_options: data[currentpage].options.length,
                        selected_option: data[currentpage].option_index,
                        currentpage: currentpage,
                        data: data,
                        edited: false,
                        deleteConfirm: false,
                })
            })
        }
        else{
            this.setState({minquestion: true,deleteConfirm:false})
        }
        
    }



    render(){

        console.log("total options",this.state.total_options)
        const {
            currentpage,
            boundaryRange,
            siblingRange,
            showEllipsis,
            showFirstAndLastNav,
            showPreviousAndNextNav,
            totalPages,
          } = this.state
        var ques = this.state.currentpage+1 + ". Question";
        return (
            <div>
            {this.state.redirect && <Redirect to="/search" />}
            <div className="dashboardcontent">
                    <DashboardMenu type="Questions" /><br /><br />
            </div>
            <div className="Content">
                <div class="maincontent">
                <Grid columns={2} divided doubling>
                    <Grid.Row stretched>
                        <Grid.Column width={12} className="segmentcolumn" >
                            <Segment padded >
                                <Header as="h2" >
                                    Add Questions
                                </Header>
                                <Modal
                                    basic
                                    open={this.state.deleteConfirm}
                                    size='small'
                                    >
                                    <Header icon>
                                        <Icon name='archive' />
                                        Delete the Current Question
                                    </Header>
                                    <Modal.Content>
                                        <p>
                                        Are you sure you want to delete the question, this action cannot be reverted
                                        </p>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button basic color='red' inverted onClick={this.deleteQuestion}>
                                        <Icon name='remove' /> Delete
                                        </Button>
                                        <Button color='green' inverted onClick={() => {this.setState({deleteConfirm: false})} }>
                                        <Icon name='checkmark' /> Cancel
                                        </Button>
                                    </Modal.Actions>
                                </Modal>
                                <div class="datacontent" style={{textAlign:"left"}}>
                                    <Form>
                                    <Link to={{
                                            pathname: '/editquizinfo',
                                            state: {quiz_id: this.state.quiz_id}
                                        }} >
                                        <Button color='green' floated="left">Edit Quiz Info</Button>
                                    </Link>
                                    <Button secondary floated="right" onClick={() => {this.setState({deleteConfirm:true})} } >Delete Current Question</Button><br /><br />
                                    <br /><Form.Field
                                            control={TextArea}
                                            label={ques}
                                            placeholder='Enter the question...'
                                            name="questions"
                                            value={this.state.questions}
                                            onChange = {this.handleChange.bind(this,0)}
                                        />
                                    <Segment>
                                        <Header as="h4">
                                            Options
                                        </Header>
                                        <Popup content='Add Option' trigger={<Button 
                                        icon='add' 
                                        onClick={() =>{
                                                    this.setState(prevState =>{
                                                        return{
                                                                ...prevState,
                                                                total_options : prevState.total_options +1,
                                                                maxoptions: false,
                                                        }
                                                        })
                                                    } 
                                                }
                                        />} />
                                        <Popup content='Remove Option' trigger={<Button 
                                        icon='minus' 
                                        onClick={() =>{
                                                    if(this.state.total_options > 2)
                                                    {
                                                        this.setState(prevState =>{
                                                        return{
                                                                ...prevState,
                                                                total_options : prevState.total_options -1
                                                        }
                                                        })
                                                    }
                                                    else
                                                    {
                                                        this.setState({maxoptions: true})
                                                    }
                                                    } 
                                                }
                                        />} />
                                        <br /><br />
                                        {Array.apply(null,Array(this.state.total_options)).map((row,index) => {
                                            var option = "option" + index
                                            return (
                                                <Form.Group >    
                                            <Form.Field
                                                // label={option.option}
                                                control='input'
                                                fluid
                                                checked = {index == this.state.selected_option}
                                                type='radio'
                                                name='selected_option'
                                                onChange={this.handleChange.bind(this,index)}
                                                
                                            />                                        
                                            <Form.Field
                                                control={Input}
                                                // label='First name'
                                                placeholder='Option'
                                                width={16}
                                                name={option}
                                                value={this.state[option]}
                                                onChange={this.handleChange.bind(this,index)}
                                            />
                                        </Form.Group>
                                            )
                                        })}
                                        {this.state.maxoptions && 
                                            <Message negative>
                                                <Message.Header>You should add minimum of 2 options</Message.Header>
                                            </Message>
                                        }
                                        {this.state.blank_question && 
                                            <Message negative>
                                                <Message.Header>You cant Leave a questions as blank</Message.Header>
                                            </Message>
                                        }
                                        {this.state.minquestion && 
                                            <Message negative>
                                                <Message.Header>You have to enter atleast one Question</Message.Header>
                                            </Message>
                                        }
                                    </Segment>
                                    <Button primary onClick={this.handleSubmit.bind(this,this.state.currentpage + 1)} >Save and Add another</Button>
                                    <Button onClick={this.handleSubmit.bind(this,this.state.currentpage)}  secondary >Submit</Button>
                                    <div className="ui center aligned segment">
                                    <Menu className="ui pagination menu" style={{textAlign:"center"}}>

                                        {/* {this.state.data.map((row,index) => {
                                            
                                            var currentpage = this.state.currentpage                                          
                                            return (
                                                <Menu.Item
                                                    name={index+1}
                                                    active={currentpage === (index)} 
                                                    onClick={this.handleSubmit.bind(this,index)}
                                                />
                                            )
                                        })} */}
                                        {this.state.currentpage !=0 &&
                                            <Menu.Item 
                                            name = "1"
                                            onClick={this.handleSubmit.bind(this,0)}
                                            />
                                        }
                                        
                                        {this.state.currentpage > 0 && 
                                            <Menu.Item 
                                            name = "Prev"
                                            onClick={this.handleSubmit.bind(this,this.state.currentpage-1)}
                                        />
                                        }
                                        <Menu.Item 
                                            name = {this.state.currentpage+1}
                                            active
                                        />
                                        {this.state.currentpage < (this.state.data.length-1) && 
                                            <Menu.Item 
                                            name = "Next"
                                            onClick={this.handleSubmit.bind(this,this.state.currentpage+1)}
                                        />
                                        }

                                        { this.state.currentpage != this.state.data.length-1 &&
                                            <Menu.Item 
                                            name = {this.state.data.length}
                                            onClick={this.handleSubmit.bind(this,this.state.data.length-1)}
                                            />
                                        }
                                        <Menu.Item 
                                            name = "Add"
                                            onClick={this.handleSubmit.bind(this,this.state.data.length)}
                                        />
                                    </Menu>
                                    </div>
                                    
                                    {/* <br /><br /> */}
                                    {/* <Pagination
                                        activePage={currentpage}
                                        boundaryRange={boundaryRange}
                                        onPageChange={this.handlePageChange}
                                        size='small'
                                        siblingRange={siblingRange}
                                        totalPages={this.state.data.length}
                                        // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
                                        ellipsisItem={showEllipsis ? undefined : null}
                                        firstItem={showFirstAndLastNav ? undefined : null}
                                        lastItem={showFirstAndLastNav ? undefined : null}
                                        prevItem={showPreviousAndNextNav ? undefined : null}
                                        nextItem={showPreviousAndNextNav ? undefined : null}
                                    /> */}
                                </Form>
                                </div>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Segment>
                                <Header as="h3">
                                    Added Questions
                                </Header>
                                {this.state.data.map((row,index) => {
                                        return(
                                            <p> {index+1}.{row.question} </p>
                                        )
                                })}
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

export default AddQuestions