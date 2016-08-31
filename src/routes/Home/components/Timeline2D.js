import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

let clusters = require('../clusters.json')

const eventWidth = 200
const approximateEventHeight = 300
const dayHeight = 50
let globalDayHeight = 0

const minDate = clusters.reduce((acc, curr) => {
	if(!acc || moment(curr.start_time).isBefore(acc)) {
		return moment(curr.start_time, 'YYYY-MM-DD')
	}
	return acc
}, null)

const maxDate = clusters.reduce((acc, curr) => {
	if(!acc || moment(curr.end_time).isAfter(acc)) {
		return moment(curr.end_time, 'YYYY-MM-DD')
	}
	return acc
}, null)

const clusterOffsets = clusters.map(d =>
	moment(d.start_time, 'YYYY-MM-DD').diff(minDate, 'days') * dayHeight)

export const Timeline = React.createClass({
	getInitialState() {
		return {
			left: 0,
			eventIndex: -1
		}
	},

	componentDidMount() {
		setTimeout(() => {
			this.node = ReactDOM.findDOMNode(this)
			this.eventsWrapper = this.node.querySelector(".events")
			this.windowWidth = window.innerWidth
			this.nodeWidth = eventWidth * clusters.length
			this.nodeHeight = this.node.offsetHeight
			this.datePickerHeight = this.node.querySelector(".date-picker").offsetHeight
			globalDayHeight = this.datePickerHeight / Math.abs(minDate.diff(maxDate, 'days'))

			this.forceUpdate()
		}, 0)
	},

	onWheel(e) {
		e.preventDefault()
		const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY

		const newLeft = Math.max(0, Math.min(this.nodeWidth, this.state.left + delta))

		this.setState({
			left: newLeft,
			eventIndex: Math.floor(((newLeft + this.windowWidth / 2) / this.nodeWidth) * clusters.length)
		}, () => {
			const offset = (this.state.left + (this.windowWidth / 2)) - (this.state.eventIndex * eventWidth)

			const yPos = clusterOffsets[this.state.eventIndex] + (offset / eventWidth) * (clusterOffsets[this.state.eventIndex + 1] - (clusterOffsets[this.state.eventIndex])) - 0.5 * (this.nodeHeight - approximateEventHeight)

			this.eventsWrapper.scrollLeft = this.state.left
			this.eventsWrapper.scrollTop = yPos
		})

	},

	shouldComponentUpdate() {
		return false
	},

	render() {
		const localDates = []
		for(let i=0; i<=Math.abs(minDate.diff(maxDate, 'days')); i++) {
			localDates.push(<div 
				key={i} 
				style={{height: dayHeight + 'px'}}
				className="local-date">
				{minDate.clone().add(i, 'days').format('M DD')}</div>)
		}

		const globalDates = []
		for(let i=0; i<=Math.abs(minDate.diff(maxDate, 'months')); i++) {
			let currentDate = minDate.clone().add(i, 'months')
			let days = currentDate.daysInMonth()

			// so it's the number of days in that month, minus the number of days offset, if it's the same month as the minDate

			if(currentDate.isSame(minDate, 'month')) {
				days -= minDate.format('D')
			}

			globalDates.push(<div 
				style={{height: (globalDayHeight * days) + 'px'}}
				key={i}>
				{currentDate.format('MMM')}</div>)
		}

		return (
			<div className="timeline">
				<div className="date-picker">
					<div className="global">{globalDates}</div>
					<div className="local">{localDates}</div>
					<div className="brush"></div>
				</div>
				<div onWheel={this.onWheel} className="events">
					{clusters.map((c, i) => {
						const words = c.top_scoring_terms.map(w =>
							<div key={w[0]} className="word">{w[0]}</div>)

						return <div key={i} className="event"
							style={{
								width: eventWidth + 'px',
								top: clusterOffsets[i] + 'px',
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