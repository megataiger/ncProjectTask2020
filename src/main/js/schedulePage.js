'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

const root = '/ncProject/api';

export class SchedulePage extends React.Component {

	render() {
		return (
			<div>
			    <CalendarDayList/>
			</div>
		)
	}
}

class CalendarDayList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {calendarDays: [], pageSize: 5, links: {}}
        this.updatePageSize = this.updatePageSize.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onDelete = this.onDelete.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
        this.handleNavFirst = this.handleNavFirst.bind(this);
		this.handleNavPrev = this.handleNavPrev.bind(this);
		this.handleNavNext = this.handleNavNext.bind(this);
		this.handleNavLast = this.handleNavLast.bind(this);
	}

	loadFromServer(pageSize) {
		follow(client, root, [
			{rel: 'calendarDays', params: {size: pageSize}}]
		).then(calendarDayCollection => {
			return client({
				method: 'GET',
				path: calendarDayCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity;
				return calendarDayCollection;
			});
		}).done(calendarDayCollection => {
			this.setState({
				calendarDays: calendarDayCollection.entity._embedded.calendarDays,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: calendarDayCollection.entity._links});
		});
	}
	// end::follow-2[]

	// tag::create[]
	onCreate(newCalendarDay) {
		follow(client, root, ['calendarDays']).then(calendarDayCollection => {
			return client({
				method: 'POST',
				path: calendarDayCollection.entity._links.self.href,
				entity: newCalendarDay,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return follow(client, root, [
				{rel: 'calendarDays', params: {'size': this.state.pageSize}}]);
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
	onDelete(calendarDay) {
		client({method: 'DELETE', path: calendarDay._links.self.href}).done(response => {
			this.loadFromServer(this.state.pageSize);
		});
	}
	// end::delete[]

	// tag::navigate[]
	onNavigate(navUri) {
		client({method: 'GET', path: navUri}).done(calendarDayCollection => {
			this.setState({
				calendarDays: calendarDayCollection.entity._embedded.calendarDays,
				attributes: this.state.attributes,
				pageSize: this.state.pageSize,
				links: calendarDayCollection.entity._links
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
    
    // tag::handle-nav[]
	handleNavFirst(e){
		e.preventDefault();
		this.onNavigate(this.state.links.first.href);
	}

	handleNavPrev(e) {
		e.preventDefault();
		this.onNavigate(this.state.links.prev.href);
	}

	handleNavNext(e) {
		e.preventDefault();
		this.onNavigate(this.state.links.next.href);
	}

	handleNavLast(e) {
		e.preventDefault();
		this.onNavigate(this.state.links.last.href);
	}
	// end::handle-nav[]

    render() {
        const calendarDays = this.state.calendarDays.map(calendarDay =>
            <CalendarDay key={calendarDay._links.self.href} calendarDay={calendarDay}
                        onDelete={this.onDelete} onNavigate={this.onNavigate}/>
        );
        const navLinks = [];
		if ("first" in this.state.links) {
			navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
		}
		if ("prev" in this.state.links) {
			navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
		}
		if ("next" in this.state.links) {
			navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
		}
		if ("last" in this.state.links) {
			navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
		}
        return (
            <div>
                <CreateDialogCalendarDay onCreate={this.onCreate}/>
                <table className="pageTable">
                    <thead>
                        <tr>
                            <th>Название фильма</th>
                            <th>Время начала</th>
                            <th>Цена на билет</th>
                            <th>Зал</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {calendarDays}
                    </tbody>
                </table>
                <div>
                    {navLinks}
                </div>
            </div>
        );
    }
}

class CalendarDay extends React.Component{
    constructor(props) {
        super(props);
        this.state = {filmSessions: []};
        this.reloadFilmSessions = this.reloadFilmSessions.bind(this);
        this.deleteDay = this.deleteDay.bind(this);
        this.addFilmSession = this.addFilmSession.bind(this);
    }

    componentDidMount() {
        client({method: 'GET', path: this.props.calendarDay._links.filmSessionList.href}).done(response => {
			this.setState({filmSessions: response.entity._embedded.filmSessions});
        });
    }

    addFilmSession(newFilmSession) {
        client({
				method: 'PATCH',
                path: this.props.calendarDay._links.filmSessionList.href,
                entity: newFilmSession,
                headers: {'Accept': 'text/uri-list',
                'Content-Type': 'text/uri-list'}
        }).done(response => {
            this.reloadFilmSessions();
        });
    }

    reloadFilmSessions(){
        client({method: 'GET', path: this.props.calendarDay._links.filmSessionList.href}).done(response => {
			this.setState({filmSessions: response.entity._embedded.filmSessions});
        });
    }

    deleteDay() {
        this.props.onDelete(this.props.calendarDay);
    }

	render() {
        const calendarDayValue = this.props.calendarDay.calendarDay;
        const date = new Date(calendarDayValue);
        const formatDate = date.toLocaleString('ru-RU', {year: 'numeric', month: '2-digit', day: '2-digit'});
		return (
            <React.Fragment>
                <tr>
                    <td colSpan="4" className="date">
                        <b>{formatDate}</b>
                    </td>
                    <td>
                        <button onClick={this.deleteDay}>Удалить</button>
                    </td>
                </tr>
                <FilmSessionList calendarDay={this.props.calendarDay}
                                onNavigate={this.props.onNavigate} 
                                filmSessionList={this.state.filmSessions}
                                reloadFilmSessions={this.reloadFilmSessions}/>
                <tr>
                    <td colSpan="5">
                        <CreateDialogFilmSession addFilmSession={this.addFilmSession}/>
                    </td>
                </tr>
            </React.Fragment>
		);
	}
}

class FilmSessionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {reload: {}};
    }

    render() {
        const filmSessions = this.props.filmSessionList.map(filmSession => 
            <FilmSession key={filmSession._links.self.href} filmSession={filmSession}/>
        );
        if (filmSessions.length == 0) {
            return (
                <React.Fragment>
                <tr>
                    <td colSpan="5" align="center">На данную дату не назначено сеансов</td>
                </tr>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    {filmSessions}
                </React.Fragment>
            );
        }
    }
}

class FilmSession extends React.Component {
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
                <td>
                    {this.state.film.name}
                </td>
                <td>
                    {this.props.filmSession.timeBegin}
                </td>
                <td>
                    {this.props.filmSession.price}&#8381;
                </td>
                <td>
                    {this.props.filmSession.room}
                </td>
                <td>
                    <button>Удалить</button>
                </td>
            </tr>
        );
    }
}

class CreateDialogCalendarDay extends React.Component {

	constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

	handleSubmit(e) {
        e.preventDefault();
        const newCalendarDay = {};
        newCalendarDay['calendarDay'] = ReactDOM.findDOMNode(this.refs['calendarDay']).value.trim();
		this.props.onCreate(newCalendarDay);

		// clear out the dialog's inputs
		ReactDOM.findDOMNode(this.refs['calendarDay']).value = '';

		// Navigate away from the dialog to hide it.
		window.location = "#";
	}

	render() {
        return (
            <div>
                <a href="#createCalendarDay">Добавить дату в расписание</a>

                <div id="createCalendarDay" className="modalDialog">
				<div>
					<a href="#" title="Close" className="close">X</a>

					<h2>Добавить дату в расписание</h2>

					<form>
						<p>
							<input type="date" placeholder="Дата" ref="calendarDay" className="field"/>
						</p>
						<button onClick={this.handleSubmit}>Добавить</button>
					</form>
				</div>
			    </div>
            </div>
         );
	}
}

class CreateDialogFilmSession extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const newFilmSession = ReactDOM.findDOMNode(this.refs['filmSession']).value.trim();
        this.props.addFilmSession(newFilmSession);

		// clear out the dialog's inputs
	//	ReactDOM.findDOMNode(this.refs['filmSession']).value = '';

		// Navigate away from the dialog to hide it.
        window.location = "#";
        
    }
    
    render() {
        return (
            <div>
                <a href="#createFilmSession">Добавить сеанс в расписание</a>

                <div id="createFilmSession" className="modalDialog">
				<div>
					<a href="#" title="Close" className="close">X</a>

					<h2>Добавить сеанс в расписание</h2>
                    <OptionFilmSession />
				</div>
			    </div>
            </div>
         );
	}
}

class OptionFilmSession extends React.Component {
    constructor(props) {
        super(props);
        this.state = {filmSessions: []};
        this.
    }

    createArrayFilmSessions() {
        var filmSessions;
        client({method: 'GET', path: './api/filmSessions'}).done(response => { 
            filmSessions = response.entity._embedded.filmSessions;
            filmSessions.forEach(filmSession => {
                client({method: 'GET', path: filmSession._links.film.href}).done(response =>
                filmSession['filmName'] = response.entity.name
            );
        })
        });
        return filmSessions;
    }

    componentDidMount() {
        const values = client({method: 'GET', path: './api/filmSessions'}).done(response => {
            return function () {
                response.entity._embedded.filmSessions.forEach(filmSession => {
                client({method: 'GET', path: filmSession._links.film.href}).done( response =>
                filmSession['filmName'] = response.entity.name
            );
        })
    }.then(filmSessions => 
                this.setState({filmSessions: filmSessions}))
        });/*.forEach(filmSession => {
            client({method: 'GET', path: filmSession._links.film.href}).done( response =>
                filmSession['filmName'] = response.entity.name
            );
        }); */
        console.log(values);
        //.done(response => this.setState({filmSessions: response}));
          /*  filmSessions.forEach(filmSession => {
                client({method: 'GET', path: filmSession._links.film.href}).done( response =>
                    filmSession['filmName'] = response.entity.name
                );
            })
        }).then(this.setState({filmSessions: filmSessions}));*/
    }

    render() {
        const filmSessionTable = this.state.filmSessions.map(filmSession => 
            <tr key={filmSession}>
                <td>
                    {filmSession.filmName}
                </td>
                <td>
                    {filmSession.timeBegin}
                </td>
                <td>
                    {filmSession.room}
                </td>
                <td>
                    <button>
                        Выбрать
                    </button>
                </td>
            </tr>
        );
        return(
            <table>
                {filmSessionTable}
            </table>
        );
    }
}