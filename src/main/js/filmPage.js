'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

const root = '/ncProject/api';

export class FilmPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {films: [], attributes: [], pageSize: 5, links: {}};
		this.updatePageSize = this.updatePageSize.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
	}

	loadFromServer(pageSize) {
		follow(client, root, [
			{rel: 'films', params: {size: pageSize}}]
		).then(filmCollection => {
			return client({
				method: 'GET',
				path: filmCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity;
				return filmCollection;
			});
		}).done(filmCollection => {
			this.setState({
				films: filmCollection.entity._embedded.films,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: filmCollection.entity._links});
		});
	}
	// end::follow-2[]

	// tag::create[]
	onCreate(newFilm) {
		follow(client, root, ['films']).then(filmCollection => {
			return client({
				method: 'POST',
				path: filmCollection.entity._links.self.href,
				entity: newFilm,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return follow(client, root, [
				{rel: 'films', params: {'size': this.state.pageSize}}]);
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
	onDelete(film) {
		client({method: 'DELETE', path: film._links.self.href}).done(response => {
			this.loadFromServer(this.state.pageSize);
		});
	}
	// end::delete[]

	// tag::navigate[]
	onNavigate(navUri) {
		client({method: 'GET', path: navUri}).done(filmCollection => {
			this.setState({
				films: filmCollection.entity._embedded.films,
				attributes: this.state.attributes,
				pageSize: this.state.pageSize,
				links: filmCollection.entity._links
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
				<FilmList films={this.state.films}
							links={this.state.links}
							pageSize={this.state.pageSize}
							onNavigate={this.onNavigate}
							onDelete={this.onDelete}
							updatePageSize={this.updatePageSize}/>
			</div>
		)
	}
}

class CreateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		const newFilm = {};
		this.props.attributes.forEach(attribute => {
			newFilm[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.props.onCreate(newFilm);

		// clear out the dialog's inputs
		this.props.attributes.forEach(attribute => {
			ReactDOM.findDOMNode(this.refs[attribute]).value = '';
		});

		// Navigate away from the dialog to hide it.
		window.location = "#";
	}

	render() {
		return (
			<div>
				<a href="#createFilm">Добавить фильм</a>

				<div id="createFilm" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Добавить фильм</h2>

						<form>
							<p>
								<input type="text" placeholder="Название" ref="name" className="field"/>
							</p>
							<p>
								<textarea placeholder="Описание" ref="description" rows="3" className="field"/>
							</p>
							<p>
								<input type="text" placeholder="Режиссёры" ref="authors" className="field"/>
							</p>
							<p>
								<input type="text" placeholder="В главных ролях" ref="mainActors" className="field"/>
							</p>
							<p>
								<input type="text" placeholder="Продолжительность" ref="duration" className="field"/>
							</p>
							<p>
								<input type="text" placeholder="Жанр" ref="category" className="field"/>
							</p>
							<p>
								<select ref="ageRating" className="fieald">
									<option value="0">0</option>
									<option value="6">6</option>
									<option value="12">12</option>
									<option value="16">16</option>
									<option value="18">18</option>
								</select>
							</p>
							<button onClick={this.handleSubmit}>Добавить</button>
						</form>
					</div>
				</div>
			</div>
		)
	}

}

class FilmList extends React.Component{
	constructor(props) {
		super(props);
		this.handleNavFirst = this.handleNavFirst.bind(this);
		this.handleNavPrev = this.handleNavPrev.bind(this);
		this.handleNavNext = this.handleNavNext.bind(this);
		this.handleNavLast = this.handleNavLast.bind(this);
	}

	// tag::handle-nav[]
	handleNavFirst(e){
		e.preventDefault();
		this.props.onNavigate(this.props.links.first.href);
	}

	handleNavPrev(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.prev.href);
	}

	handleNavNext(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.next.href);
	}

	handleNavLast(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.last.href);
	}
	// end::handle-nav[]

	render() {
		const films = this.props.films.map(film =>
			<Film key={film._links.self.href} film={film} onDelete={this.props.onDelete}/>
		);
		const navLinks = [];
		if ("first" in this.props.links) {
			navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
		}
		if ("prev" in this.props.links) {
			navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
		}
		if ("next" in this.props.links) {
			navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
		}
		if ("last" in this.props.links) {
			navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
		}
		return (
			<div>
				<table className="pageTable">
					<thead>
						<tr>
							<th>Название фильма</th>
							<th>Описание</th>
							<th>Режиссёр</th>
							<th>Главные актёры</th>
							<th>Продолжительность</th>
							<th>Жанр</th>
							<th>Возрастное ограничение</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{films}
					</tbody>
				</table>
				<div>
					{navLinks}
				</div>
			</div>
		)
	}
}

class Film extends React.Component{
	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleDelete() {
		this.props.onDelete(this.props.film);
	}

	render() {
		return (
			<tr>
				<td>{this.props.film.name}</td>
				<td>{this.props.film.description}</td>
				<td>{this.props.film.authors}</td>
                <td>{this.props.film.mainActors}</td>
                <td>{this.props.film.duration}</td>
                <td>{this.props.film.category}</td>
                <td>{this.props.film.ageRating}</td>
				<td>
					<button onClick={this.handleDelete}>Удалить</button>
				</td>
			</tr>
		)
	}
}
