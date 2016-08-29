import React from 'react'
import ReactDOM from 'react-dom'
const clusters = require('../clusters.json')
let scene = null

export const Timeline = React.createClass({
	getInitialState() {
		return {}
	},

	drawCurve() {
		const subdivisions = 20

		const points = [
			new THREE.Vector3(10, 10, 10),
			new THREE.Vector3(100, 100, 100),
			new THREE.Vector3(50, 50, 50)
		]

		const spline = new THREE.Spline(points)
		const geometrySpline = new THREE.Geometry()

		for(let i=0; i<points.length * subdivisions; i++) {
			let index = i / (points.length * subdivisions)
			let position = spline.getPoint(index)

			geometrySpline.vertices[ i ] = new THREE.Vector3( position.x, position.y, position.z )
		}

		geometrySpline.computeLineDistances()

		const object = new THREE.Line( geometrySpline, new THREE.LineBasicMaterial({ color: 0xffffff }))

		scene.add(object)
	},

	renderViz() {
		const node = ReactDOM.findDOMNode(this)
		const WIDTH = window.innerWidth
		const HEIGHT = node.offsetHeight

		const VIEW_ANGLE = 60
		const ASPECT = WIDTH / HEIGHT
		const NEAR = 1
		const FAR = 200

		const renderer = new THREE.WebGLRenderer()
		const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)

		scene = new THREE.Scene()

		scene.add(camera)

		camera.position.z = 150

		renderer.setSize(WIDTH, HEIGHT)

		node.appendChild(renderer.domElement)

		this.drawCurve()

		renderer.render(scene, camera)
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