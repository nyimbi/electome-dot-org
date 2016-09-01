import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import { findIndex } from 'underscore'

let clusters = require('../clusters.json')

const eventWidth = 200
const approximateEventHeight = 300
const dayHeight = 50
let globalDayHeight = 0
let datePickerHeight = 0
let nodeHeight = 0
let brushOffsetTop = 0
let pageY = 0

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
			eventIndex: -1,
			brushMouseDown: false
		}
	},

	componentDidMount() {
		setTimeout(() => {
			this.node = ReactDOM.findDOMNode(this)
			this.components = {
				eventsWrapper: {
					node: this.node.querySelector(".events"),
					update: function(amount) {
						const date = minDate.clone().add(Math.floor(amount * dateRange), 'days')
						const eventIndex = findIndex(clusters, d => moment(d.start_time).isSameOrAfter(date))

						this.setState({
							eventIndex,
							left: eventIndex * eventWidth
						}, this.setEventsScroll)
					}
				},
				datePicker: {
					node: this.node.querySelector(".date-picker .local"),
					update: function(amount) {
						this.components.datePicker.node.scrollTop = amount * dateRange * dayHeight
					}
				},
				brush: {
					node: this.node.querySelector(".date-picker .brush"),
					update: function(amount) {
						this.components.brush.node.style.top = (amount * (datePickerHeight - ((nodeHeight / dayHeight) * globalDayHeight))) + 'px'
					}
				}
			}

			pageY = this.node.getBoundingClientRect().top + document.body.scrollTop
			this.windowWidth = window.innerWidth
			this.nodeWidth = eventWidth * clusters.length
			nodeHeight = this.node.offsetHeight
			datePickerHeight = this.node.querySelector(".date-picker").offsetHeight
			globalDayHeight = datePickerHeight / dateRange
			brushOffsetTop = this.components.datePicker.node.getBoundingClientRect().top - this.components.eventsWrapper.node.getBoundingClientRect().top

			this.forceUpdate()
		}, 0)
	},

	onDatePickerWheel(e) {
		this.updateWindow('datePicker', this.components.datePicker.node.scrollTop / (dayHeight * dateRange))
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
				this.setEventsScroll()

				this.updateWindow('eventsWrapper', moment(clusters[this.state.eventIndex].start_time).diff(minDate, 'days') / dateRange)
			}
		})
	},

	setEventsScroll() {
		const offset = (this.state.left + (this.windowWidth / 2)) - (this.state.eventIndex * eventWidth)

		const yPos = clusterOffsets[this.state.eventIndex] + (offset / eventWidth) * (clusterOffsets[this.state.eventIndex + 1] - (clusterOffsets[this.state.eventIndex])) - 0.5 * (nodeHeight - approximateEventHeight)

		this.components.eventsWrapper.node.scrollLeft = this.state.left
		this.components.eventsWrapper.node.scrollTop = yPos
	},

	updateWindow(exclude, amount) {
		Object.keys(this.components)
			.filter(d => d !== exclude)
			.forEach(d => this.components[d].update.call(this, amount))
	},

	shouldComponentUpdate() {
		return false
	},

	onBrushMouseDown() {
		this.setState({ brushMouseDown: true })
	},

	onBrushMouseUp() {
		this.setState({ brushMouseDown: false })
	},

	onTimelineMouseMove(e) {
		if(!this.state.brushMouseDown) { return }
		const top = e.pageY - pageY - brushOffsetTop
		this.components.brush.node.style.top = top + 'px'

		this.updateWindow('brush', top / datePickerHeight)
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
				<div 
					onMouseMove={this.onTimelineMouseMove}
					className="date-picker">
					<div className="global">{globalDates}</div>
					<div onWheel={this.onDatePickerWheel} className="local">{localDates}</div>
					<div
						onMouseDown={this.onBrushMouseDown} 
						onMouseUp={this.onBrushMouseUp} 
						className="brush" 
						style={{
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
							<div>{moment(c.start_time).format('M DD') + ' ' + moment(c.end_time).format('M DD')}</div>
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