import React from 'react'

export const HomeView = () => (
  <div className="home">
  	<div className="header">
  		<div className="title">Electome</div>
  	</div>
  	<div className="main">Here at the <a target="_blank" href="http://socialmachines.media.mit.edu/">Laboratory for Social Machines</a>, part of the MIT Media Lab, we believe technology can help offer an alternative to the horse-race journalism that has dominated election news for the last half-century. The Electome surfaces and tracks U.S. election issues the public cares about, or what we call “The Horse Race of Ideas.” Drawing from areas of computer science including machine learning, natural language processing, and network analysis, we explore how three separate forces – the campaign journalism, the messaging of the candidates, and the public’s response in the digital sphere – converge to shape the presidential election’s most important narratives as well as its outcome. Revealing the dynamic interaction of these forces, heretofore largely invisible, is one goal of the Electome. Another aim is to use the resulting analytics to drive election coverage produced in collaboration with leading media outlets. A key source for detecting the public’s voice will be social media. Thanks to a gift from Twitter, our lab has access to the entire database of tweets, with 500 million new ones added each day, and the social graph of Twitter.</div>
  	<div className="authentication-ctas">
	  	<div className="signup">Sign up</div>
	  	<div className="signup">Log in</div>
  	</div>
  	<div className="ctas">
  		<div className="enter">Enter the Electome</div>
  	</div>
  	<div className="timeline"></div>
  	<div className="media"></div>
  	<div className="demo"></div>
  	<div className="partnerships"></div>
  	<div className="trademark"></div>
  </div>
)

export default HomeView
