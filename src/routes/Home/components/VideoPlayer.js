import React from 'react'

export const VideoPlayer = React.createClass({
	getInitialState() {
		return {
			videoShowing: false
		}
	},

	render() {
		return (
			<div data-video-showing={this.state.videoShowing} className="video-player">
				<div className="iframe-wrapper">
					<div className="close" onClick={() => {
						this.setState({ videoShowing: false })
					}}>
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