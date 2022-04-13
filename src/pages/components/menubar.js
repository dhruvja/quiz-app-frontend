import React from 'react';
import {Menu,Segment} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import endpoint from '../endpoint'


function handleItemClick(){
    var v = 4;
}

function Menubar(props){
    var activeItem = props.type;
    return (
        <div>
            <Segment inverted>
                <Menu inverted secondary stackable>
                <Menu.Item
                    name='Quiz-O-Mania'
                />
                <Link to="/">
                    <Menu.Item
                        name='Login'
                        active={activeItem === 'Login'}
                        onClick = {handleItemClick}
                        position='right'
                    />
                </Link>
                <Link to="/register">
                    <Menu.Item
                    name='Register'
                    active={activeItem === 'Register'}
                    onClick = {handleItemClick}
                    />
                </Link>
                
                </Menu>
            </Segment>
            <h1>{activeItem} Page</h1>
        </div>
    )
}

export default Menubar