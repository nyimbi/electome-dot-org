import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

let clusters = require('../clusters.json')

const eventWidth = 200
const dayHeight = 50

const minDate = clusters.reduce((acc, curr) => {
	if(!acc || moment(curr.start_time).isBefore(acc)) {
		return moment(curr.start_time, 'YYYY-MM-DD')
	}
	return acc
})

export const Timeline = React.createClass({
	componentDidMount() {
		this.node = ReactDOM.findDOMNode(this)
	},

	onWheel(e) {
		e.preventDefault()
		const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY

		this.node.scrollLeft = this.node.scrollLeft + delta
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