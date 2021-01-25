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
        const calendarDays = this.state.calendarDays.map((calendarDay, index) =>
            <CalendarDay key={index} calendarDay={calendarDay} index={index}
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
        this.deleteFilmSession = this.deleteFilmSession.bind(this);
    }

    componentDidMount() {
        client({method: 'GET', path: this.props.calendarDay._links.filmSessionList.href}).done(response => {
			this.setState({filmSessions: response.entity._embedded.filmSessions});
        });
    }

    addFilmSession(newFilmSession) {
        client({
				method: 'PUT',
                path: this.props.calendarDay._links.filmSessionList.href,
                entity: newFilmSession,
                headers: {'Accept': 'text/uri-list',
                'Content-Type': 'text/uri-list'}
        }).done(response => {
            this.reloadFilmSessions();
        });
    }

    deleteFilmSession(filmSession) {
        const resource = filmSession._links.self.href.split('/');
        const id = resource[resource.length-1];
        client({
            method: 'DELETE',
            path: this.props.calendarDay._links.filmSessionList.href+'/'+id
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
        const createDialog = <CreateDialogFilmSession index={this.props.index} addFilmSession={this.addFilmSession}/>;
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
                                deleteFilmSession={this.deleteFilmSession}/>
                <tr>
                    <td colSpan="5">
                        {createDialog}
                    </td>
                </tr>
            </React.Fragment>
		);
	}
}

class FilmSessionList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const filmSessions = this.props.filmSessionList.map((filmSession, index) => 
            <tr key={index}>
                <td>
                    {filmSession.filmName}
                </td>
                <td>
                    {filmSession.timeBegin}
                </td>
                <td>
                    {filmSession.price}&#8381;
                </td>
                <td>
                    {filmSession.room} Зал
                </td>
                <td>
                    <button onClick={this.props.deleteFilmSession.bind(this, filmSession)}>Удалить</button>
                </td>
            </tr>
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

    handleSubmit(chooseFilmSession) {
        this.props.addFilmSession(chooseFilmSession);
        window.location = "#";
    }
    
    render() {
        return (
            <div>
                <a href={'#' + this.props.index}>Добавить сеанс в расписание</a>

                <div id={this.props.index} className="modalDialog">
				<div>
					<a href="#" title="Close" className="close">X</a>

					<h2>Добавить сеанс в расписание</h2>
                    <OptionFilmSession handleSubmit={this.handleSubmit}/>
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
        this.chooseFilmSession = this.chooseFilmSession.bind(this);
        this.choosenFilmSessions = [];
    }

    chooseFilmSession(filmSession, flag) {
        if (flag) {
            this.choosenFilmSessions.pop(filmSession);
        } else {
            this.choosenFilmSessions.push(filmSession);
        }
    }

    componentDidMount() {
        client({method: 'GET', path: './api/filmSessions'}).done(filmSessions => {
            this.setState({filmSessions: filmSessions.entity._embedded.filmSessions});
        });
    }

    render() {
        const filmSessionTable = this.state.filmSessions.map((filmSession, index) => 
            <FilmSessionRow key={index} 
                            filmSession={filmSession} 
                            chooseFilmSession={this.chooseFilmSession}/>
        );
        return(
            <div>
                <table>
                    <tbody>
                        {filmSessionTable}
                    </tbody>
                </table>
                <p>
                    <button onClick={this.props.handleSubmit.bind(this, this.choosenFilmSessions)}>Подтвердить</button>
                </p>
            </div>
        );
    }
}

class FilmSessionRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {flag: false};
        this.handleFilmSession = this.handleFilmSession.bind(this);
    }

    handleFilmSession(filmSession) {
        this.props.chooseFilmSession(filmSession, this.state.flag);
        if (this.state.flag) {
            this.setState({flag: false});
        } else {
            this.setState({flag: true});
        }
    }

    render() {
        const checked = this.state.flag === true ? <td>&#10004;</td>: <td>&#10010;</td>;
        return(
            <tr onClick={this.handleFilmSession.bind(this, this.props.filmSession)}>
                <td>
                    {this.props.filmSession.filmName}
                </td>
                <td>
                    {this.props.filmSession.timeBegin}
                </td>
                <td>
                    {this.props.filmSession.price}&#8381;
                </td>
                <td>
                    {this.props.filmSession.room} Зал
                </td>
                {checked}
            </tr>
        );
    }
}