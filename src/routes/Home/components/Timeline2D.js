import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

const clusters = require('../clusters.json')

export const Timeline = React.createClass({
	componentDidMount() {

	},

	render() {
		return (
			<div className="timeline">
				<div className="events">
					{clusters.map((c, i) => {
						const words = c.top_scoring_terms.map(w =>
							<div key={w[0]} className="word">{w[0]}</div>)
						return <div key={i} className="event">
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