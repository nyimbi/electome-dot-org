import React from 'react'
import Timeline from './Timeline2D'
import Timeline3D from './Timeline'
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
	  		<Timeline />
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
