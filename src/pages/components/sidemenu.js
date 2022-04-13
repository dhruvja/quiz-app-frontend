import React from 'react';
import {Menu,Segment,Header,List} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import endpoint from '../endpoint'


function SideMenu(props){
    var page = props.page
    return (
        <Segment padded>
            <Header>
                Menu
            </Header>
            <List link size="huge">
                {/* <Link to="/dashboard"><List.Item as='a' active={page === 'Dashboard'}>Dashboard</List.Item></Link><br /><br/> */}
                <Link to="/hosted"><List.Item as='a' active={page === 'host'}>Hosted Quizzes</List.Item></Link><br /><br />
                <Link to="/search"><List.Item as='a' active={page === 'search'}>Search Quizzes</List.Item></Link><br /><br />
                <Link to="/joined"><List.Item as='a' active={page === 'join'}>Joined Quizzes</List.Item></Link><br /><br />
                {/* <Link to="/personal"><List.Item as='a' active={page === 'personal'}>Personal Info</List.Item></Link><br /><br /> */}
            </List>
        </Segment>
    )
}

export default SideMenu