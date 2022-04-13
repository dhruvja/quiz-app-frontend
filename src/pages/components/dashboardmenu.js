import React from 'react';
import {Menu,Segment,Sidebar,Icon} from 'semantic-ui-react';
import {Link,Redirect} from 'react-router-dom';
import endpoint from './endpoint'




class DashboardMenu extends React.Component{

    constructor(){
        super()
        this.state={
            redirect: false,
        }
        this.handleLogout = this.handleLogout.bind(this)
    }

    handleLogout(){
        var c = document.cookie.split("; ");
        var i=0;
        try{
            for (i in c) 
                document.cookie =/^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT";  
            this.setState({redirect:true})
        }
        catch{
            this.setState({redirect:true})        
        }
        
          
        
    }

    handleItemClick(){
        var v=9;
    }

    render(){
        var activeItem = this.props.type;
        return (
            <div className="dashboardmenu">
            {this.state.redirect && <Redirect to="/" /> }
                <Segment className="segments">
                    <Menu  secondary stackable className="menu">
                    <Menu.Item
                        name='Quiz-O-Mania'
                    />
                    {/* <Link to="/dashboard">
                        <Menu.Item
                            name='dashboard'
                            active={activeItem === 'Dashboard'}
                            onClick = {this.handleItemClick}
                            position='right'
                            // style={{color:'white'}}
                        />
                    </Link> */}
                    <Link to="/host">
                        <Menu.Item
                            name='Host'
                            active={activeItem === 'Host'}
                            onClick = {this.handleItemClick}
                            position='right'
                        />
                    </Link>
                    <Link to="/search">
                        <Menu.Item
                        name='Join'
                        active={activeItem === 'Join'}
                        onClick = {this.handleItemClick}
                        />
                    </Link>
                    <div style={{textAlign: 'right'}}>
                        <Menu.Item
                            name='logout'
                            active={activeItem === 'Logout'}
                            onClick = {this.handleLogout}
                            position="right"
                            />
                    </div>
                        
                    
                    </Menu>
                </Segment>
                <h1>{activeItem} Page</h1>
            </div>
        )
    }
    
}

export default DashboardMenu