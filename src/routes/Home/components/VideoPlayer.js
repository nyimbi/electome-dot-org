import React from 'react'

export const VideoPlayer = React.createClass({
	getInitialState() {
		return {
			videoShowing: false
		}
	},

	closeVideo() {
		this.setState({ videoShowing: false })
	},

	render() {
		return (
			<div data-video-showing={this.state.videoShowing} className="video-player">
				<div className="blackout" onClick={this.closeVideo}></div>
				<div className="iframe-wrapper">
					<div className="close" onClick={this.closeVideo}>
						<i className="material-icons">clear</i>
					</div>
					<div className="fixed-aspect-ratio-wrapper">
						<iframe src="https://www.youtube.com/embed/g8gJOCwBuFc" frameBorder="0" allowFullScreen></iframe>
					</div>
				</div>
				<div onClick={() => {
					this.setState({ videoShowing: true })
				}} className="viewdemo">View demo</div>
			</div>
		)
	}
})

export default VideoPlayer