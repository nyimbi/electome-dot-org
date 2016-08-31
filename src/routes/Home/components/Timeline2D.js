import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

let clusters = require('../clusters.json')

const eventWidth = 200
const approximateEventHeight = 300
const dayHeight = 50
let globalDayHeight = 0
let datePickerHeight = 0
let nodeHeight = 0

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

const dateRange = Math.abs(minDate.diff(maxDate, 'days'))

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
			this.components = {
				eventsWrapper: {
					node: this.node.querySelector(".events"),
					update: function(date) {
					}
				},
				datePicker: {
					node: this.node.querySelector(".date-picker .local"),
					update: function(amount) {
						this.node.scrollTop = amount * dateRange * dayHeight
					}
				},
				brush: {
					node: this.node.querySelector(".date-picker .brush"),
					update: function(amount) {
						this.node.style.top = (amount * (datePickerHeight - ((nodeHeight / dayHeight) * globalDayHeight))) + 'px'
					}
				}
			}

			this.windowWidth = window.innerWidth
			this.nodeWidth = eventWidth * clusters.length
			nodeHeight = this.node.offsetHeight
			datePickerHeight = this.node.querySelector(".date-picker").offsetHeight
			globalDayHeight = datePickerHeight / dateRange

			this.forceUpdate()
		}, 0)
	},

	onEventsWrapperWheel(e) {
		e.preventDefault()
		const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY

		const newLeft = Math.max(0, Math.min(this.nodeWidth, this.state.left + delta))

		this.setState({
			left: newLeft,
			eventIndex: Math.floor(((newLeft + this.windowWidth / 2) / this.nodeWidth) * clusters.length)
		}, () => {
			if(this.state.eventIndex < clusters.length) {
				const offset = (this.state.left + (this.windowWidth / 2)) - (this.state.eventIndex * eventWidth)

				const yPos = clusterOffsets[this.state.eventIndex] + (offset / eventWidth) * (clusterOffsets[this.state.eventIndex + 1] - (clusterOffsets[this.state.eventIndex])) - 0.5 * (nodeHeight - approximateEventHeight)

				this.components.eventsWrapper.node.scrollLeft = this.state.left
				this.components.eventsWrapper.node.scrollTop = yPos

				this.updateWindow('eventsWrapper', clusters[this.state.eventIndex].start_time)				
			}
		})

	},

	updateWindow(exclude, amount) {
		Object.keys(this.components)
			.filter(d => d !== exclude)
			.forEach(d => this.components[d].update((moment(amount).diff(minDate, 'days') / dateRange)))
	},

	shouldComponentUpdate() {
		return false
	},

	render() {
		const localDates = []
		for(let i=0; i<=dateRange; i++) {
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
					<div className="brush" style={{
						height: (globalDayHeight * (nodeHeight / dayHeight)) + 'px'
					}}></div>
				</div>
				<div onWheel={this.onEventsWrapperWheel} className="events">
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