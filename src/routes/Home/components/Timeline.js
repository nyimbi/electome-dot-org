import React from 'react'
import ReactDOM from 'react-dom'
const clusters = require('../clusters.json')

export const Timeline = React.createClass({
	getInitialState() {
		return {}
	},

	renderViz() {
		const node = ReactDOM.findDOMNode(this)
		const WIDTH = window.innerWidth
		const HEIGHT = node.offsetHeight

		const VIEW_ANGLE = 45
		const ASPECT = WIDTH / HEIGHT
		const NEAR = 0.1
		const FAR = 1000

		const renderer = new THREE.WebGLRenderer()
		const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)

		const scene = new THREE.Scene()

		scene.add(camera)

		camera.position.z = 300

		renderer.setSize(WIDTH, HEIGHT)

		node.appendChild(renderer.domElement)
	},

	componentDidMount() {
		setTimeout(this.renderViz, 100)
	},

	render() {
		return (
			<div className="timeline"></div>
		)
	}
})

export default Timeline