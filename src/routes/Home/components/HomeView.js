import React from 'react'
import Timeline from './Timeline2D'
import VideoPlayer from './VideoPlayer'
const media = require('../media.json')

export const HomeView = React.createClass({
	getInitialState() {
		return {
			expanded: false
		}
	},

	render() {
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
		  		<h1>Enter the Electome</h1>
		  		<div className="description">Sub-orbital BASE jump 8-bit denim digital nodality San Francisco stimulate 3D-printed semiotics office urban.</div>
		  		<div className="ctas">
		  			<VideoPlayer />
		  			<div className="enter">Enter</div>
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
		  	<div className="info">
		  		<div className="info-label">Who we are</div>
		  		<div className="description">Here at the <a target="_blank" href="http://socialmachines.media.mit.edu/">Laboratory for Social Machines</a>, part of the MIT Media Lab, we believe technology can help offer an alternative to the horse-race journalism that has dominated election news for the last half-century. The Electome surfaces and tracks U.S. election issues the public cares about, or what we call “The Horse Race of Ideas.” Drawing from areas of computer science including machine learning, natural language processing, and network analysis, we explore how three separate forces – the campaign journalism, the messaging of the candidates, and the public’s response in the digital sphere – converge to shape the presidential election’s most important narratives as well as its outcome. Revealing the dynamic interaction of these forces, heretofore largely invisible, is one goal of the Electome. Another aim is to use the resulting analytics to drive election coverage produced in collaboration with leading media outlets. A key source for detecting the public’s voice will be social media. Thanks to a gift from Twitter, our lab has access to the entire database of tweets, with 500 million new ones added each day, and the social graph of Twitter.</div>
		  	</div>
	  		<Timeline />
		  	<div className="partnerships">
		  		<div className="partnerships-label">In partnership with</div>
		  		<div className="logos">
		  			<a target="_blank" className="logo-wrapper">
				  		<div className="logo" id="media-lab-logo"></div>
		  			</a>
		  			<a target="_blank" className="logo-wrapper">
				  		<div className="logo" id="twitter-logo"></div>
		  			</a>
		  			<a target="_blank" className="logo-wrapper">
				  		<div className="logo" id="commission-on-presidential-debates-logo"></div>
		  			</a>
		  			<a target="_blank" className="logo-wrapper">
				  		<div className="logo" id="washington-post-logo"></div>
		  			</a>
		  			<a target="_blank" className="logo-wrapper">
				  		<div className="logo" id="wsj-logo"></div>
		  			</a>
		  			<a target="_blank" className="logo-wrapper">
				  		<div className="logo" id="fusion-logo"></div>
		  			</a>
		  			<a target="_blank" className="logo-wrapper">
				  		<div className="logo" id="roper-center-logo"></div>
		  			</a>
		  			<a target="_blank" className="logo-wrapper">
				  		<div className="logo" id="newseum-logo"></div>
				  	</a>
		  		</div>
		  	</div>
		  	<div className="media">
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
		  	<div className="footer"></div>
		  </div>
		)
	}
})

export default HomeView
