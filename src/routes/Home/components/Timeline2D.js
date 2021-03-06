import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import { findIndex, debounce } from 'underscore'

const docBrowserWidth = 300
const eventWidth = 250
const approximateEventHeight = 340
const dayHeight = 50
const eventsHPadding = 200
const eventsVPadding = 10
let globalDayHeight = 0
let datePickerHeight = 0
let nodeHeight = 0
let brushOffsetTop = 0
let pageY = 0
let visibleDateRange = 0
let datePickerScrollHeight = 0
let minDate = null
let maxDate = null
let dateRange = 0
let clusterOffsets = null
let wordCounts = []

export const Timeline = React.createClass({
	getInitialState() {
		return {
			activeEventIndex: -1,
			left: 0,
			eventIndex: -1,
			brushMouseDown: false,
			localDatesTop: 0
		}
	},

	componentWillMount() {
		const { clusters } = this.props

		wordCounts = clusters.filter(d => d.type !== 'nugget').reduce((acc, curr) => {
			acc.push(...curr.top_scoring_terms.map(d => d[0]))
			return acc
		}, []).reduce((acc, curr) => {
			const match = acc[curr]

			if(match) {
				acc[curr] = acc[curr] + 1
			} else {
				acc[curr] = 1
			}
			return acc
		}, {})

		minDate = clusters.reduce((acc, curr) => {
			if(!acc || moment(curr.start_time).isBefore(acc)) {
				return moment(curr.start_time, 'YYYY-MM-DD')
			}
			return acc
		}, null).subtract(1, 'days')

		maxDate = clusters.reduce((acc, curr) => {
			if(!acc || moment(curr.end_time).isAfter(acc)) {
				return moment(curr.end_time, 'YYYY-MM-DD')
			}
			return acc
		}, null)

		dateRange = Math.abs(minDate.diff(maxDate, 'days')) + 1

		clusterOffsets = clusters.map(d =>
			moment(d.start_time, 'YYYY-MM-DD').diff(minDate, 'days') * dayHeight)
	},

	datePickerWheelEnd() {
		this.components.datePicker.node.classList.remove("scrolling")
	},

	eventsWheelEnd() {
		this.components.eventsWrapper.node.classList.remove("scrolling")
	},

	componentDidMount() {
		const { clusters } = this.props

		setTimeout(() => {
			this.node = ReactDOM.findDOMNode(this)
			this.components = {
				eventsWrapper: {
					node: this.node.querySelector(".events"),
					update: function(amount) {
						const date = minDate.clone().add(Math.floor(amount * dateRange), 'days')
						let eventIndex = findIndex(clusters, d => moment(d.start_time).isSameOrAfter(date))

						if(eventIndex === -1) {
							eventIndex = clusters.length - 1
						}

						this.setState({
							eventIndex,
							left: this.getCappedEventsLeft(eventIndex * eventWidth)
						}, () => { this.setEventsScroll(true) })
					}
				},
				datePicker: {
					node: this.node.querySelector(".date-picker .local"),
					update: function(amount) {
						this.setState({
							localDatesTop: amount * (datePickerScrollHeight + datePickerHeight)
						}, this.setDatePickerTransform)
					}
				},
				brush: {
					node: this.node.querySelector(".date-picker .brush"),
					update: function(amount) {
						this.components.brush.node.style.top = (amount * (datePickerHeight - (visibleDateRange * globalDayHeight))) + 'px'
					}
				}
			}

			pageY = this.node.getBoundingClientRect().top + document.body.scrollTop
			this.windowWidth = window.innerWidth
			this.nodeWidth = eventWidth * clusters.length + 2 * eventsHPadding
			nodeHeight = this.node.offsetHeight
			datePickerHeight = this.node.querySelector(".date-picker").offsetHeight
			globalDayHeight = datePickerHeight / dateRange
			brushOffsetTop = this.components.datePicker.node.getBoundingClientRect().top - this.components.eventsWrapper.node.getBoundingClientRect().top
			visibleDateRange = Math.round(nodeHeight / dayHeight)
			datePickerScrollHeight = dayHeight * dateRange - datePickerHeight

			this.components.datePicker.node.addEventListener("wheel", debounce(this.datePickerWheelEnd, 150))
			this.components.eventsWrapper.node.addEventListener("wheel", debounce(this.eventsWheelEnd, 150))

			this.forceUpdate()
		}, 100) // for styles to show
	},

	getCappedEventsLeft(left) {
		return Math.max(0, Math.min(this.nodeWidth - this.windowWidth, left))
	},

	onDatePickerWheel(e) {
		e.preventDefault()
		if(this.state.activeEventIndex > -1) { return }

		this.components.datePicker.node.classList.add("scrolling")

		this.setState({
			localDatesTop: Math.max(0, Math.min(datePickerScrollHeight, this.state.localDatesTop + e.deltaY))
		}, () => {
			this.setDatePickerTransform()
			this.updateWindow('datePicker', this.state.localDatesTop / datePickerScrollHeight)
		})
	},

	setDatePickerTransform() {
		this.components.datePicker.node.style.transform = "translateY(-" + this.state.localDatesTop + "px)"
	},

	onEventsWrapperWheel(e) {
		if(this.state.activeEventIndex > -1) { return }

		const { clusters } = this.props

		e.preventDefault()

		this.components.eventsWrapper.node.classList.add("scrolling")

		const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY

		const newLeft = this.getCappedEventsLeft(this.state.left + delta)

		this.setState({
			left: newLeft,
			eventIndex: Math.min(clusters.length - 1, Math.floor(((newLeft + this.windowWidth / 2) / this.nodeWidth) * clusters.length))
		}, () => {
			this.setEventsScroll()

			this.updateWindow('eventsWrapper', moment(clusters[Math.min(clusters.length - 1, Math.floor((newLeft / this.nodeWidth) * clusters.length))].start_time).diff(minDate, 'days') / dateRange)
		})
	},

	setEventsScroll(alignTop) {
		if(this.state.eventIndex > (this.props.clusters.length - 2)) { return }

		let topBuffer = 0.5 * (nodeHeight - approximateEventHeight)
		if(alignTop) { topBuffer = eventsVPadding }

		const offset = (this.state.left + (this.windowWidth / 2)) - (this.state.eventIndex * eventWidth)

		const yPos = Math.max(0, 
			clusterOffsets[this.state.eventIndex] + 
			Math.max(0, Math.min(1, offset / eventWidth)) * 
			(clusterOffsets[this.state.eventIndex + 1] - (clusterOffsets[this.state.eventIndex])) -
			topBuffer)

		this.components.eventsWrapper.node.style.transform = `translate3d(${-this.state.left}px, ${-yPos}px, 0)`
	},

	updateWindow(exclude, amount) {
		Object.keys(this.components)
			.filter(d => d !== exclude)
			.forEach(d => this.components[d].update.call(this, amount))
	},

	shouldComponentUpdate() {
		return false
	},

	onBrushMouseDown(e) {
		if(this.state.activeEventIndex > -1) { return }

		this.setState({ 
			brushMouseDown: true,
			lastBrushTop: this.getBrushTopForMousePosition(e) - (parseInt(this.components.brush.node.style.top) || 0)
		})

		this.components.brush.node.classList.add("scrolling")
	},

	onTimelineMouseUp() {
		this.setState({ brushMouseDown: false })

		this.components.brush.node.classList.remove("scrolling")
	},

	getBrushTopForMousePosition(e) {
		return e.pageY - pageY - brushOffsetTop
	},

	onTimelineMouseMove(e) {
		if(!this.state.brushMouseDown) { return }
		const brushHeight = globalDayHeight * visibleDateRange
		const top = Math.max(0, Math.min(datePickerHeight - brushHeight, this.getBrushTopForMousePosition(e) - this.state.lastBrushTop))

		this.components.brush.node.style.top = top + 'px'

		this.updateWindow('brush', (top / (datePickerHeight)))
	},

	openEvent(i) {
		const docBrowserNode = this.node.querySelector(".document-browser")
		const tweetIDs = this.props.clusters[i].sample_tweet_ids

		docBrowserNode.setAttribute("data-loading", true)
		docBrowserNode.querySelector(".tweets").innerHTML = ""

		this.setState({
			activeEventIndex: i,
			eventIndex: i,
			left: this.getCappedEventsLeft((i + 1.5) * eventWidth - this.windowWidth / 2)
		}, () => {
			this.setEventsScroll()
			this.node.setAttribute("data-event-activated", true)
			Array.prototype.forEach.call(this.node.querySelectorAll(".event"), (n, ni) => {
				if(ni < i) {
					n.setAttribute("data-active", false)
					n.style.transform = "none"
				} else if(ni === i) {
					n.setAttribute("data-active", true)
				} else {
					n.setAttribute("data-active", false)
					n.style.transform = "translateX(" + docBrowserWidth + "px)"
				}
			})

			setTimeout(() => {
				docBrowserNode.style.left = this.node.querySelector("[data-active='true'").getBoundingClientRect().right + 'px'
				docBrowserNode.classList.add("in-place")
		
				Promise.all(tweetIDs.map(id =>
					twttr.widgets.createTweet(id.toString(),
				  docBrowserNode.querySelector(".tweets"),
				  {
				    align: 'left',
				    conversation: 'none',
				    cards: 'hidden'
				  }))).then((data) => {
					docBrowserNode.setAttribute("data-loading", false)
				})
			}, 250)
		})
	},

	onEventClick(i) {
		if(this.state.activeEventIndex > -1) {
			this.closeActiveEvent(() => {
				setTimeout(() => {
					this.openEvent(i)
				}, 300) // to wait for transform transition to complete
			})
		} else {
			this.openEvent(i)
		}
	},

	closeActiveEvent(cb) {
		this.setState({
			activeEventIndex: -1
		}, () => {
			this.node.setAttribute("data-event-activated", false)
			this.node.querySelector(".document-browser").classList.remove("in-place")
			Array.prototype.forEach.call(this.node.querySelectorAll(".event"), n => {
				n.setAttribute("data-active", false)
				n.style.transform = "none"
			})

			if(cb && typeof cb === 'function') { cb() }
		})
	},

	render() {
		const localDates = []
		for(let i=0; i<dateRange; i++) {
			localDates.push(<div 
				key={i} 
				style={{height: dayHeight + 'px'}}
				className="local-date">
				{minDate.clone().add(i, 'days').format('M/D')}</div>)
		}

		const globalDates = []
		for(let i=0; i<=Math.abs(minDate.diff(maxDate, 'months')) + 1; i++) {
			let currentDate = minDate.clone().add(i, 'months')
			let days = currentDate.daysInMonth()

			if(currentDate.isSame(minDate, 'month')) {
				days -= minDate.format('D')
			}

			days = Math.max(1, days)

			globalDates.push(<div 
				style={{height: (globalDayHeight * days) + 'px'}}
				className="global-date"
				key={i}>
				<div className="text">{currentDate.format('MMM')}</div></div>)
		}

		const getEventDOM = (c, i) => {
			const words = c.top_scoring_terms.map(w => {
				const count = wordCounts[w[0]]
				return <div data-count={count} key={w[0]} className="word">
					<div className="text">{w[0]}</div>
					<div className="count">{"(" + count + ")"}</div>
				</div>
			})

			const headlineTweetText = c.headline_tweet.tweet.split(" ").map(word => {
				if(word.indexOf("http") === -1) {
					return word + ' '
				}
				return <a target='_blank' href={word}>{word}</a>
			})

			return <div key={i} className="event"
				data-active={i === this.state.activeEventIndex}
				style={{
					width: eventWidth + 'px',
					top: (clusterOffsets[i] + eventsVPadding) + 'px',
					left: ((eventWidth * i) + eventsHPadding) + 'px'
				}}>
				<svg 
					height={(c.sparkline.length + 1) * dayHeight}
					width={eventWidth}>
					<polyline points={c.sparkline.reduce((acc, curr, index) => {
						acc += `${curr},${(index + 1) * dayHeight} `
						return acc
					}, '0,0 ') + '0,' + ((c.sparkline.length + 1) * dayHeight)} />
				</svg>
				<div className="content">
					<div className="date">{moment(c.start_time).format('MMM D')}</div>
					<div className="words">{words}</div>
					<div className="sample_tweet">
						<div className="attribution">
							<div className="timestamp">{moment(c.headline_tweet.time).format('MMM D')}</div>
							<div className="author">{c.headline_tweet.author_name}</div>
						</div>
						<div className="text">{headlineTweetText}</div>
					</div>
					<div 
						onClick={() => { this.onEventClick(i) }} 
						className="see-more"><i className="material-icons">more_horiz</i></div>
					<div 
						onClick={this.closeActiveEvent}
						className="close"><i className="material-icons">close</i></div>
					<div className="explore"><i className="material-icons">launch</i></div>
				</div>
			</div>
		}

		const getNuggetDOM = (c, i) => {
			return <div style={{
				width: eventWidth + 'px',
				top: (clusterOffsets[i] + eventsVPadding) + 'px',
				left: ((eventWidth * i) + eventsHPadding) + 'px'
			}} key={i} className="event nugget">
				<div className="date">{moment(c.start_time).format('MMM D')}</div>
				<div className="name">{c.name}</div>
				<div className="description">{c.description}</div>
				<a href={c.url} target="_blank" className="explore"><i className="material-icons">launch</i></a>
			</div>
		}

		return (
			<div 
				data-event-activated={this.state.activeEventIndex > -1}
				className="timeline">
				<div 
					onMouseMove={this.onTimelineMouseMove}
					onMouseUp={this.onTimelineMouseUp} 
					className="date-picker">
					<div className="global">{globalDates}</div>
					<div onWheel={this.onDatePickerWheel} className="local">{localDates}</div>
					<div
						onMouseDown={this.onBrushMouseDown} 
						className="brush" 
						style={{
							height: (globalDayHeight * visibleDateRange) + 'px'
						}}></div>
				</div>
				<div 
					style={{
						padding: `${eventsVPadding}px ${eventsHPadding}px`,
						width: eventWidth * this.props.clusters.length + 'px',
						height: dayHeight * dateRange + 'px'
					}}
					onWheel={this.onEventsWrapperWheel} className="events">
					{this.props.clusters.map((c, i) => {
						if(c.type === 'nugget') { return getNuggetDOM(c, i) }
						return getEventDOM(c, i)
					})}
				</div>
				<div 
					onWheel={e => {
						e.stopPropagation()
					}}
					style={{ width: docBrowserWidth + 'px' }}
					className="document-browser">
					<div 
						onClick={this.closeActiveEvent}
						className="close"><i className="material-icons">close</i></div>
					<div className="document-browser-header">Representative Tweets</div>
					<div className="loader">Loading</div>
					<div className="tweets"></div>
				</div>
			</div>
		)
	}
})

export default Timeline