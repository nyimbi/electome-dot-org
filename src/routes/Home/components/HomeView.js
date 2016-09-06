import React from 'react'
import Timeline from './Timeline2D'
import Timeline3D from './Timeline'
import VideoPlayer from './VideoPlayer'
import contentful from 'contentful'
const media = require('../media.json')
import moment from 'moment'

const sparklineMax = 180

const client = contentful.createClient({
	space: 't0mamnyqwt6r',
	accessToken: '419f1f27efbafdd6f29176fad7a2171c766f435964879d9600a2bf068aa8a7e1'
})

let clusters = require('../clusters.json').map(d => {
	const startMoment = moment(d.start_time)
	const endMoment = moment(d.end_time)
	const range = Math.abs(startMoment.diff(endMoment, 'days'))
	const max = Math.random() * sparklineMax
	let current = Math.random() * max / 2
	const peakIndex = 1 + Math.round(Math.random() * (range - 2))

	d.sparkline = []
	for(let i=0; i<range; i++) {
		d.sparkline.push(current)
		if(i < peakIndex) {
			current = Math.min(max, current + Math.random() * Math.max(0, max - current) / (peakIndex - i))
		} else {
			current = Math.max(0, current - Math.random() * Math.max(0, current) / Math.max(1, i - peakIndex))
		}
	}
	
	return d
})

let nuggetsLoaded = false
const nuggetsLoadedCB = []
let nuggets = []

client.getEntries().then(entry => {
	nuggets = entry.items.map(d => {
		const obj = d.fields
		const lookup = {}
		d.fields.url.split("&").forEach(c => {
			const split = c.split("=")
			lookup[split[0]] = decodeURIComponent(split[1])
		})
		obj.type = "nugget"
		obj.start_time = lookup.start_date
		obj.end_time = lookup.end_date
		return obj
	})

	clusters = clusters.concat(nuggets).sort((a, b) => {
		const aStartMoment = moment(a.start_time)
		const bStartMoment = moment(b.start_time)
		if(moment(aStartMoment.format('YYYY-MM-DD')).isBefore(moment(bStartMoment.format('YYYY-MM-DD')))) {
			return -1
		}
		if(moment(aStartMoment.format('YYYY-MM-DD')).isAfter(bStartMoment.format('YYYY-MM-DD'))) {
			return 1
		}
		if(moment(a.end_time).isBefore(b.end_time)) {
			return -1
		}
		return 1
	})

	nuggetsLoaded = true
	nuggetsLoadedCB.forEach(d => d())
})

export const HomeView = React.createClass({
	getInitialState() {
		return {
			expanded: false
		}
	},

	componentWillMount() {
		nuggetsLoadedCB.push(this.forceUpdate.bind(this))
	},

	render() {
		let timeline = null
		if(nuggetsLoaded) {
			timeline = <Timeline clusters={clusters} />
		}

		return (
			<div className="home">
		  	<div className="header">
		  		<div className="title">Electome</div>
			  	<div className="authentication-ctas">
				  	<div className="signup">Sign up</div>
				  	<div className="login">Log in</div>
			  	</div>
		  	</div>
		  	<div className="hero">
		  		<div className="hero-content">
		  			<div className="text">
				  		<h1>Enter the Electome</h1>
				  		<div className="description">Sub-orbital BASE jump 8-bit denim digital nodality San Francisco stimulate 3D-printed semiotics office urban.</div>
				  		<div className="ctas">
				  			<VideoPlayer />
				  			<div className="enter">Enter</div>
				  		</div>
		  			</div>
			  		<div className="browser">
			  			<div className="controls">
			  				<div className="red"></div>
			  				<div className="yellow"></div>
			  				<div className="green"></div>
			  			</div>
			  			<div className="ui">
			  				<div className="image-container"></div>
			  			</div>
			  		</div>
		  		</div>
		  	</div>
		  	<div className="info">
		  		<div className="info-content">
			  		<div className="info-label">Who we are</div>
			  		<div className="description">Here at the <a target="_blank" href="http://socialmachines.media.mit.edu/">Laboratory for Social Machines</a>, part of the MIT Media Lab, we believe technology can help offer an alternative to the horse-race journalism that has dominated election news for the last half-century. The Electome surfaces and tracks U.S. election issues the public cares about, or what we call “The Horse Race of Ideas.” Drawing from areas of computer science including machine learning, natural language processing, and network analysis, we explore how three separate forces – the campaign journalism, the messaging of the candidates, and the public’s response in the digital sphere – converge to shape the presidential election’s most important narratives as well as its outcome. Revealing the dynamic interaction of these forces, heretofore largely invisible, is one goal of the Electome. Another aim is to use the resulting analytics to drive election coverage produced in collaboration with leading media outlets. A key source for detecting the public’s voice will be social media. Thanks to a gift from Twitter, our lab has access to the entire database of tweets, with 500 million new ones added each day, and the social graph of Twitter.</div>
		  		</div>
		  	</div>
		  	<div className="entry-links">
		  		<div className="entry-links-content">
			  		<div className="entry-links-label">Explore</div>
			  		<div className="description">Check out different events below.</div>
		  		</div>
		  	</div>
	  		{timeline}
		  	<div className="partnerships">
		  		<div className="partnerships-label">In partnership with</div>
		  		<div className="logos">
		  			<a target="_blank" href="http://media.mit.edu/" className="logo-wrapper">
				  		<div className="logo" id="media-lab-logo"></div>
		  			</a>
		  			<a target="_blank" href="https://twitter.com/" className="logo-wrapper">
				  		<div className="logo" id="twitter-logo"></div>
		  			</a>
		  			<a target="_blank" href="http://www.debates.org/" className="logo-wrapper">
				  		<div className="logo" id="commission-on-presidential-debates-logo"></div>
		  			</a>
		  			<a target="_blank" href="https://www.washingtonpost.com/" className="logo-wrapper">
				  		<div className="logo" id="washington-post-logo"></div>
		  			</a>
		  			<a target="_blank" href="http://www.wsj.com/" className="logo-wrapper">
				  		<div className="logo" id="wsj-logo"></div>
		  			</a>
		  			<a target="_blank" href="https://fusion.net/" className="logo-wrapper">
				  		<div className="logo" id="fusion-logo"></div>
		  			</a>
		  			<a target="_blank" href="https://ropercenter.cornell.edu/" className="logo-wrapper">
				  		<div className="logo" id="roper-center-logo"></div>
		  			</a>
		  			<a target="_blank" href="http://www.newseum.org/" className="logo-wrapper">
				  		<div className="logo" id="newseum-logo"></div>
				  	</a>
		  		</div>
		  	</div>
		  	<div className="media">
		  		<div className="media-content">
			  		<div className="media-label">Deployments</div>
			  		<div data-expanded={this.state.expanded} className="card-list">
				  		{media.map((d, i) =>
				  			<a key={i} className="card" href={d.link} target="_blank">
				  				<div className="title">{d.title}</div>
				  				<div className="attribution">
				  					<div className="publication">{d.publication}</div>
				  					<div className="date">{d.date}</div>
				  					<div className="author">{d.author ? d.author : ''}</div>
				  				</div>
				  			</a>
				  		)}
			  		</div>
			  		<div 
			  			onClick={() => {
			  				this.setState({ expanded: !this.state.expanded })
			  			}}
			  			className="toggle">{this.state.expanded ? "Show less" : "Show more"}</div>
		  		</div>
		  	</div>
		  	<div className="footer">
		  		<div className="footer-content">
			  		<div className="terms">Meta-j-pop 8-bit augmented reality market Legba physical cardboard corporation. BASE jump DIY physical hotdog digital boy saturation point jeans computer concrete alcohol courier paranoid Shibuya silent. Tiger-team film A.I. futurity office render-farm sprawl garage cartel computer engine tattoo. Narrative corporation-ware otaku voodoo god papier-mache warehouse camera construct j-pop dissident gang concrete dolphin long-chain hydrocarbons sign. Corrupted motion boat lights market math-narrative construct tanto marketing carbon. Monofilament drone crypto-youtube semiotics bridge euro-pop industrial grade vehicle free-market cartel construct j-pop hacker weathered military-grade soul-delay. DIY camera convenience store knife motion-ware dome computer. </div>
		  		</div>
		  	</div>
		  </div>
		)
	}
})

export default HomeView
