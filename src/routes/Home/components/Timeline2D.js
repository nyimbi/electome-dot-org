import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

let clusters = require('../clusters.json')

const eventWidth = 200
const dayHeight = 50

const sample = [
	[0, 10],
	[10, 30],
	[30, 100]
]

const lerp = (start, finish, amount) => {
	return amount * (finish - start)
}

const createScale = (domain, range) => amount => {

}

const minDate = clusters.reduce((acc, curr) => {
	if(!acc || moment(curr.start_time).isBefore(acc)) {
		return moment(curr.start_time, 'YYYY-MM-DD')
	}
	return acc
})

export const Timeline = React.createClass({
	getInitialState() {
		return {
			left: 0,
			eventIndex: -1
		}
	},

	componentDidMount() {
		this.node = ReactDOM.findDOMNode(this)
		this.windowWidth = window.innerWidth
		this.nodeWidth = eventWidth * clusters.length
	},

	onWheel(e) {
		e.preventDefault()
		const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY

		const newLeft = Math.max(0, Math.min(this.nodeWidth, this.state.left + delta))

		this.setState({
			left: newLeft,
			eventIndex: Math.round(((newLeft + this.windowWidth / 2) / this.nodeWidth) * clusters.length)
		}, () => {
			this.node.scrollLeft = this.state.left
		})

	},

	shouldComponentUpdate() {
		return false
	},

	render() {
		return (
			<div onWheel={this.onWheel} className="timeline">
				<div className="events">
					{clusters.map((c, i) => {
						const dayOffset = moment(c.start_time, 'YYYY-MM-DD').diff(minDate, 'days')
						const words = c.top_scoring_terms.map(w =>
							<div key={w[0]} className="word">{w[0]}</div>)

						return <div key={i} className="event"
							style={{
								width: eventWidth + 'px',
								top: (dayOffset * dayHeight) + 'px',
								left: (eventWidth * i) + 'px'
							}}>
							<div>{i}</div>
							{words}
							<div>{c.headline_tweet.tweet}</div>
						</div>
					})}
				</div>
			</div>
		)
	}
})

export default Timeline