'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

const root = '/ncProject/api';

export class FilmSessionPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {filmSessions: [], attributes: [], pageSize: 5, links: {}};
		this.updatePageSize = this.updatePageSize.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
	}

	// tag::follow-2[]
	loadFromServer(pageSize) {
		follow(client, root, [
			{rel: 'filmSessions', params: {size: pageSize}}]
		).then(filmSessionCollection => {
			return client({
				method: 'GET',
				path: filmSessionCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity;
				return filmSessionCollection;
			});
		}).done(filmSessionCollection => {
			this.setState({
				filmSessions: filmSessionCollection.entity._embedded.filmSessions,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: filmSessionCollection.entity._links});
		});
	}
	// end::follow-2[]

	// tag::create[]
	onCreate(newFilmSession) {
		follow(client, root, ['filmSessions']).then(filmSessionCollection => {
			return client({
				method: 'POST',
				path: filmSessionCollection.entity._links.self.href,
				entity: newFilmSession,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return follow(client, root, [
				{rel: 'filmSessions', params: {'size': this.state.pageSize}}]);
		}).done(response => {
			if (typeof response.entity._links.last !== "undefined") {
				this.onNavigate(response.entity._links.last.href);
			} else {
				this.onNavigate(response.entity._links.self.href);
			}
		});
	}
	// end::create[]

	// tag::delete[]
	onDelete(filmSession) {
		client({method: 'DELETE', path: filmSession._links.self.href}).done(response => {
				this.loadFromServer(this.state.pageSize);
			});
	}
	// end::delete[]

	// tag::navigate[]
	onNavigate(navUri) {
		client({method: 'GET', path: navUri}).done(filmSessionCollection => {
			this.setState({
				filmSessions: filmSessionCollection.entity._embedded.filmSessions,
				attributes: this.state.attributes,
				pageSize: this.state.pageSize,
				links: filmSessionCollection.entity._links
			});
		});
	}
	// end::navigate[]

	// tag::update-page-size[]
	updatePageSize(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize);
		}
	}
	// end::update-page-size[]

	// tag::follow-1[]
	componentDidMount() {
		this.loadFromServer(this.state.pageSize);
	}
	// end::follow-1[]

	render() {
		return (
			<div>
			<CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
			<FilmSessionList filmSessions={this.state.filmSessions}
							  links={this.state.links}
							  pageSize={this.state.pageSize}
							  onNavigate={this.onNavigate}
							  onDelete={this.onDelete}
							  updatePageSize={this.updatePageSize}/>
			</div>
		)
	}
}

class FilmSessionList extends React.Component{
	render() {
		const filmSessions = this.props.filmSessions.map((filmSession, index) =>
			<tr key={index}>
                <td>{filmSession.filmName}</td>
				<td>{filmSession.timeBegin}</td>
				<td>{filmSession.price}&#8381;</td>
				<td>{filmSession.room}</td>
				<td>
					<button onClick={this.props.onDelete.bind(this, filmSession)}>Удалить</button>
				</td>
			</tr>
		);
		return (
			<table className="pageTable">
				<thead>
					<tr>
						<th>Название фильма</th>
						<th>Начало сеанса</th>
						<th>Цена на билет</th>
                        <th>Зал</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{filmSessions}
				</tbody>
			</table>
		)
	}
}

class CreateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.state = {films: []};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		client({method: 'GET', path: './api/films'}).done(response => {
			this.setState({films: response.entity._embedded.films});
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		const newFilmSession = {};
		this.props.attributes.forEach(attribute => {
			if (attribute != "calendarDayList" && attribute != "filmName") {
				newFilmSession[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
			}
		});
		this.props.onCreate(newFilmSession);

		// clear out the dialog's inputs
		this.props.attributes.forEach(attribute => {
			if (attribute != "calendarDayList" && attribute != "filmName") {
				ReactDOM.findDOMNode(this.refs[attribute]).value = '';
			}
		});

		// Navigate away from the dialog to hide it.
		window.location = "#";
	}

	render() {
		const select = this.state.films.map(film =>
			<option key={film._links.self.href} value={film._links.self.href}>{film.name}</option>
		);

		return (
			<div>
				<a href="#createFilmSession">Добавить сеанс</a>

				<div id="createFilmSession" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Добавить сеанс</h2>

						<form>
							<p>
								<select ref="film">
									{select}
								</select>
							</p>
							<p>
								<input type="text" placeholder="Начало сеанса" ref="timeBegin" className="field"/>
							</p>
							<p>
								<input type="text" placeholder="Цена на билет" ref="price" className="field"/>
							</p>
							<p>
								<input type="text" placeholder="Зал" ref="room" className="field"/>
							</p>
							<button onClick={this.handleSubmit}>Добавить</button>
						</form>
					</div>
				</div>
			</div>
		)
	}

}
// end::create-dialog[]
