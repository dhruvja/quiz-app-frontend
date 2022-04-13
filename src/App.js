import logo from './logo.svg';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Search from './pages/search';
import Quiz from './pages/quiz';
import Results from './pages/results';
import Joined from './pages/joined';
import Host from './pages/host';
import AddQuestions from './pages/addquestions'
import Hosted from './pages/hosted'
import Leaderboard from './pages/leaderboard'
import EditQuizInfo from './pages/editquizinfo'
import {Route, BrowserRouter as Router,Switch} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/host" component={Host} />
          <Route path="/editquizinfo" component={EditQuizInfo} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path ="/hosted" component={Hosted}/>
          <Route path="/addquestions" component={AddQuestions}/>
          <Route path="/register" component={Register} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/search" component={Search} />
          <Route path="/joinquiz" component={Quiz} />
          <Route path="/results" component={Results} />
          <Route path="/joined" component={Joined} />
          <Route path="/" component={Login} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
