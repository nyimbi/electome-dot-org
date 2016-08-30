import React from 'react'

export const VideoPlayer = React.createClass({
	getInitialState() {
		return {}
	},

	render() {
		return (
			<div className="video-player">
				<div className="iframe-wrapper">
					<iframe width="420" height="315" src="https://www.youtube.com/embed/g8gJOCwBuFc" frameborder="0" allowfullscreen></iframe>
				</div>
				<div className="viewdemo">View demo</div>
			</div>
		)
	}
})

export default VideoPlayer