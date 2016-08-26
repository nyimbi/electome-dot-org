import React from 'react'

export const HomeView = () => (
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
  			<div className="viewdemo">View demo</div>
  			<div className="enter">Enter</div>
  		</div>
  	</div>
  	<div className="info">
  		<div className="info-label">Who we are</div>
  		<div className="description">Here at the <a target="_blank" href="http://socialmachines.media.mit.edu/">Laboratory for Social Machines</a>, part of the MIT Media Lab, we believe technology can help offer an alternative to the horse-race journalism that has dominated election news for the last half-century. The Electome surfaces and tracks U.S. election issues the public cares about, or what we call “The Horse Race of Ideas.” Drawing from areas of computer science including machine learning, natural language processing, and network analysis, we explore how three separate forces – the campaign journalism, the messaging of the candidates, and the public’s response in the digital sphere – converge to shape the presidential election’s most important narratives as well as its outcome. Revealing the dynamic interaction of these forces, heretofore largely invisible, is one goal of the Electome. Another aim is to use the resulting analytics to drive election coverage produced in collaboration with leading media outlets. A key source for detecting the public’s voice will be social media. Thanks to a gift from Twitter, our lab has access to the entire database of tweets, with 500 million new ones added each day, and the social graph of Twitter.</div>
  	</div>
  	<div className="timeline"></div>
  	<div className="media">
  		<div className="media-label">Deployments</div>
  		<a></a>
  	</div>
  	<div className="partnerships">
  		<div className="partnerships-label">In partnership with</div>
  		<div className="logos">
	  		<div id="media-lab-logo"></div>
	  		<div id="twitter-logo"></div>
	  		<div id="commission-on-presidential-debates-logo"></div>
	  		<div id="washington-post-logo"></div>
	  		<div id="wsj-logo"></div>
	  		<div id="fusion-logo"></div>
	  		<div id="roper-center-logo"></div>
	  		<div id="newseum-logo"></div>
  		</div>
  	</div>
  	<div className="trademark"></div>
  </div>
)

export default HomeView
