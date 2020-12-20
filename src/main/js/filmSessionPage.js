'use strict';

// tag::vars[]
const React = require('react'); // <1>
const ReactDOM = require('react-dom'); // <2>
const client = require('./client'); // <3>
// end::vars[]

// tag::filmSession-page[]
export class FilmSessionPage extends React.Component { // <1>

	constructor(props) {
		super(props);
		this.state = {filmSessions: []};
	}

	componentDidMount() { // <2>
		client({method: 'GET', path: './api/filmSessions'}).done(response => {
			this.setState({filmSessions: response.entity._embedded.filmSessions});
		});
	}

	render() { // <3>
		return (
			<div>
			<FilmSessionList filmSessions={this.state.filmSessions}/>
			</div>
		)
	}
}
// end::filmSession-page[]

// tag::filmSession-list[]
class FilmSessionList extends React.Component{
	render() {
		const filmSessions = this.props.filmSessions.map(filmSession =>
			<FilmSession key={filmSession._links.self.href} filmSession={filmSession}/>
		);
		return (
			<table className="pageTable">
				<tbody>
					<tr>
						<th>Название фильма</th>
						<th>Начало сеанса</th>
						<th>Цена на билет</th>
                        <th>Зал</th>
					</tr>
					{filmSessions}
				</tbody>
			</table>
		)
	}
}
// end::filmSession-list[]

// tag::filmSession[]
class FilmSession extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {film: []};
    }

    componentDidMount() {
        client({method: 'GET', path: this.props.filmSession._links.film.href}).done(response => {
			this.setState({film: response.entity});
		});
    }

	render() {
		return (
			<tr>
                <td>{this.state.film.name}</td>
				<td>{this.props.filmSession.timeBegin}</td>
				<td>{this.props.filmSession.price}</td>
				<td>{this.props.filmSession.room}</td>
			</tr>
		)
	}
}
// end::filmSession[]